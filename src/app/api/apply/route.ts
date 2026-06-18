import { NextRequest, NextResponse } from 'next/server';

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

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { full_name, email } = body;
  if (!full_name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/va_applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('Supabase va_applications insert failed:', res.status, await res.text().catch(() => ''));
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 502 });
  }

  // Discord alert — fire and forget
  const discordWebhook = process.env.DISCORD_WEBHOOK_OPS;
  if (discordWebhook) {
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🙋 **New VA Application** — ${body.full_name}\nEmail: ${body.email} | Skills: ${body.skills || 'not listed'}`,
      }),
    }).catch(err => console.error('Discord alert failed:', err));
  }

  return NextResponse.json({ ok: true });
}
