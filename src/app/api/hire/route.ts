import { NextRequest, NextResponse } from 'next/server';
import { sendEmployerIntake, type AtlasAttribution } from '@/lib/atlas-ingestion';

// Simple in-memory rate limiter — keyed by IP, max 3 submissions per 15 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  // Rate limit
  const key = getRateLimitKey(req);
  if (isRateLimited(key)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  // Parse body
  let rawBody: Record<string, unknown>;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Attribution rides alongside the lead fields but is not a column on
  // employer_leads, so it is split out before the insert.
  const { attribution: rawAttribution, ...leadFields } = rawBody;
  const body = leadFields as Record<string, string>;
  const attribution = (rawAttribution ?? null) as AtlasAttribution | null;

  // Validate required fields
  const { employer_name, company_name, email } = body;
  if (!employer_name?.trim() || !company_name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name, company, and email are required.' }, { status: 400 });
  }
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  // Persist the lead first so an upstream delivery outage does not drop the submission.
  const leadInsert = await fetch(`${supabaseUrl}/rest/v1/employer_leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      // Representation (rather than minimal) so the persisted row's primary key
      // can be used as the stable employer id sent to Atlas.
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(body),
  }).catch(err => {
    console.error('Supabase employer_leads insert failed:', err);
    return null;
  });

  if (!leadInsert || !leadInsert.ok) {
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 502 });
  }

  const insertedRows = await leadInsert.json().catch(() => null);
  const insertedRow = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;
  const employerId = insertedRow?.employer_id ?? insertedRow?.id ?? null;

  // Atlas CRM ingestion — additive alongside the HubSpot delivery below, which
  // stays in place until the human-approved cutover. Fails open like HubSpot.
  if (!employerId) {
    console.error('employer_leads insert returned no id; skipping Atlas intake event');
  } else {
    try {
      const result = await sendEmployerIntake({
        employerId: String(employerId),
        // The row's own created_at, so a replay of this intake reports the
        // original time rather than the time of the replay.
        occurredAt: insertedRow?.created_at ?? new Date().toISOString(),
        attribution: {
          ...attribution,
          source: attribution?.source?.trim() || 'direct',
        },
        data: {
          first_name: employer_name.trim().split(/\s+/)[0] ?? '',
          last_name: employer_name.trim().split(/\s+/).slice(1).join(' '),
          email: email.trim(),
          phone: (body.phone ?? '').trim(),
          lifecycle_stage: 'new',
        },
      });
      if (!result.delivered) {
        console.error('Atlas intake event not delivered:', result.reason);
      }
    } catch (err) {
      console.error('Atlas intake event threw:', err);
    }
  }

  // Best-effort delivery to HubSpot webhook. Fail open so the user still gets a successful submission.
  const webhookUrl = process.env.HUBSPOT_EMPLOYER_WEBHOOK_URL;
  const webhookSecret = process.env.HUBSPOT_WEBHOOK_SECRET;
  if (!webhookUrl) {
    console.warn('HUBSPOT_EMPLOYER_WEBHOOK_URL not set; skipping HubSpot delivery');
  } else {
    const webhookAbort = new AbortController();
    const webhookTimeout = setTimeout(() => webhookAbort.abort(), 5000);
    try {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookSecret ? { 'X-Webhook-Secret': webhookSecret } : {}),
        },
        body: JSON.stringify(body),
        signal: webhookAbort.signal,
      });

      if (!upstream.ok) {
        console.error('Webhook returned non-OK:', upstream.status, upstream.statusText);
      }
    } catch (err) {
      console.error('Webhook POST failed:', err);
    } finally {
      clearTimeout(webhookTimeout);
    }
  }

  // Discord alert — fire and forget
  const discordWebhook = process.env.DISCORD_WEBHOOK_OPS;
  if (discordWebhook) {
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `📋 **New Employer Lead** — ${body.company_name} (${body.employer_name})\nEmail: ${body.email} | Role: ${body.va_role || 'not specified'}`,
      }),
    }).catch(err => console.error('Discord alert failed:', err));
  }

  return NextResponse.json({ ok: true });
}
