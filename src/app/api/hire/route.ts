import { NextRequest, NextResponse } from 'next/server';
import {
  sendAtlasIntake,
  buildEmployerIntakeIdempotencyKey,
  ATLAS_INTAKE_TENANT,
  ATLAS_INTAKE_SOURCE_ID,
} from '@/lib/atlas-intake';

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

  const body = rawBody as Record<string, string>;

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
  // Supabase `employer_leads` is a fire-and-forget mirror; Atlas is the CRM of record.
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

  // Atlas intake via the Fleet Ticketing Bridge (the canonical destination
  // per docs/business/bizdev.md f6840f8 § "Intake destination (canonical)").
  // Runs only after employer_leads succeeded, so an upstream Atlas outage
  // never drops the submission. Failure is surfaced but does not fail the
  // user-visible response — the lead is already persisted.
  if (!employerId) {
    console.error('employer_leads insert returned no id; skipping Atlas intake');
  } else {
    const idempotencyKey = buildEmployerIntakeIdempotencyKey(String(employerId));
    const intakePayload = {
      company_scope: 'assist' as const,
      department: 'Sales / Revenue',
      exact_target: 'VA Placement employer intake',
      concise_subject: `New employer lead from tantaglobal.com/hire — ${body.company_name}`,
      operator_description:
        'Employer submitted the VA Placement intake form at tantaglobal.com/hire.',
      intended_outcome:
        'Holo triages the new employer lead and routes to match + outreach.',
      requester: 'holo',
      source_authority: 'SirTanta/thos-wiki@f6840f8 (docs/business/bizdev.md)',
      request_type: 'intake',
      allowed_action_boundary:
        'Create one unclaimed intake row only. No claim, transition, or release.',
      prohibited_action_boundary:
        'No lifecycle mutation, no public action, no provider change.',
      execution_acceptance:
        'intake row visible to Holo via the dept-lead read; no second row on retry.',
      approval_requirement:
        'Self-approved within dept-lead filing scope per AGENTS.md.',
      idempotency_key: idempotencyKey,
      source_record_id: String(employerId),
    };

    try {
      const result = await sendAtlasIntake(intakePayload);
      if (!result.delivered) {
        console.error(
          `Atlas FTB intake not delivered for ${idempotencyKey}:`,
          result.reason,
          'status' in result ? result.status : ''
        );
      } else if (result.duplicate) {
        console.log(`Atlas FTB intake deduped for ${idempotencyKey}`);
      }
    } catch (err) {
      console.error(`Atlas FTB intake threw for ${idempotencyKey}:`, err);
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
