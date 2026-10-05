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

// Columns that exist on va_applications. Anything else in the client body (for example the
// attribution object) must not reach PostgREST or the whole insert is rejected.
const APPLICATION_COLUMNS = [
  'full_name',
  'email',
  'phone',
  'location',
  'years_experience',
  'skills',
  'availability',
  'message',
] as const;

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.includes(origin) && !origin.startsWith('http://localhost')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const key = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(key)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const row: Record<string, string> = {};
  for (const col of APPLICATION_COLUMNS) {
    const v = raw[col];
    if (typeof v === 'string' && v.trim()) row[col] = v.trim();
  }
  const { full_name, email } = row;
  if (!full_name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }
  const attribution = pickAttribution(raw.attribution);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  let stored = false;
  if (!supabaseUrl || !supabaseKey) {
    console.error('[apply] SUPABASE_URL / SUPABASE_SERVICE_KEY not set; application not stored');
  } else {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/va_applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(row),
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
        logDbError('apply', 'va_applications', 'insert', {
          code: parsed.code ?? String(res.status),
          message: parsed.message ?? '',
        });
      }
    } catch (err) {
      console.error('[apply] Supabase va_applications insert threw:', err instanceof Error ? err.message : typeof err);
    }
  }

  const crm = await sendAtlasLead({
    kind: 'va_candidate_application',
    email,
    name: full_name,
    phone: row.phone,
    details: [
      row.location ? `Location: ${row.location}` : '',
      row.years_experience ? `Experience: ${row.years_experience}` : '',
      row.availability ? `Availability: ${row.availability}` : '',
      row.skills ? `Skills: ${row.skills.slice(0, 400)}` : '',
    ].filter(Boolean),
    attribution,
  });

  if (!stored && !crm.delivered) {
    console.error(`[apply] LEAD_LOST no database row and no CRM delivery (crm=${crm.reason})`);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 502 });
  }

  // Discord alert — fire and forget
  const discordWebhook = process.env.DISCORD_WEBHOOK_OPS;
  if (discordWebhook) {
    const flag = stored ? '' : ' [NOT SAVED TO DATABASE, CRM only]';
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `New VA Application${flag} - ${full_name}\nEmail: ${email} | Skills: ${row.skills || 'not listed'}`,
      }),
    }).catch(err => console.error('Discord alert failed:', err));
  }

  return NextResponse.json({ ok: true });
}
