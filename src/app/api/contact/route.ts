import { NextRequest, NextResponse } from 'next/server';
import { sendAtlasLead, pickAttribution } from '@/lib/atlas-crm';
import { logDbError } from '@/lib/supabase-admin';

// Simple in-memory rate limiter — keyed by IP, max 3 submissions per 15 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

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

const ALLOWED_ORIGINS = ['https://tantaglobal.com', 'https://www.tantaglobal.com'];

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.includes(origin) && !origin.startsWith('http://localhost')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const key = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(key)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name : '';
  const email = typeof body.email === 'string' ? body.email : '';
  const message = typeof body.message === 'string' ? body.message : '';
  if (!name.trim() || !email.trim() || !message.trim()) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }
  const attribution = pickAttribution(body.attribution);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  // 1. Persist. Only whitelisted columns are sent: a stray client field makes PostgREST reject
  //    the whole insert (this is how /api/hire silently broke), so never forward the raw body.
  let stored = false;
  if (!supabaseUrl || !supabaseKey) {
    console.error('[contact] SUPABASE_URL / SUPABASE_SERVICE_KEY not set; message not stored');
  } else {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          attribution: Object.keys(attribution).length ? attribution : null,
        }),
      });
      if (res.ok) {
        stored = true;
      } else {
        const text = await res.text().catch(() => '');
        const parsed = (() => {
          try {
            return JSON.parse(text) as { code?: string; message?: string };
          } catch {
            return {};
          }
        })();
        logDbError('contact', 'contact_messages', 'insert', {
          code: parsed.code ?? String(res.status),
          message: parsed.message ?? '',
        });
      }
    } catch (err) {
      console.error('[contact] Supabase contact_messages insert threw:', err instanceof Error ? err.message : typeof err);
    }
  }

  // 2. CRM mirror (never throws). This is a second system of record, so the message survives a
  //    Supabase outage.
  const crm = await sendAtlasLead({
    kind: 'contact_message',
    email,
    name,
    details: [`Message: ${message.trim().slice(0, 600)}`],
    attribution,
  });

  if (!stored && !crm.delivered) {
    console.error(`[contact] LEAD_LOST no database row and no CRM delivery (crm=${crm.reason})`);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 502 });
  }

  // 3. Ops alert. Say plainly when the message was not stored, so it is not mistaken for a
  //    normal one.
  const discordWebhook = process.env.DISCORD_WEBHOOK_OPS;
  if (discordWebhook) {
    const preview = message.length > 300 ? `${message.slice(0, 300)}...` : message;
    const flag = stored ? '' : ' [NOT SAVED TO DATABASE, CRM only]';
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `New Contact Message${flag} - ${name}\nEmail: ${email}\n> ${preview.replace(/\n/g, '\n> ')}`,
      }),
    }).catch(err => console.error('Discord alert failed:', err));
  }

  return NextResponse.json({ ok: true });
}
