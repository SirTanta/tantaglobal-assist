import { NextRequest, NextResponse } from 'next/server';

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
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Validate required fields
  const { employer_name, company_name, email } = body;
  if (!employer_name?.trim() || !company_name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name, company, and email are required.' }, { status: 400 });
  }
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const webhookUrl = process.env.HUBSPOT_EMPLOYER_WEBHOOK_URL;
  const webhookSecret = process.env.HUBSPOT_WEBHOOK_SECRET;
  if (!webhookUrl) {
    console.error('HUBSPOT_EMPLOYER_WEBHOOK_URL not set');
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  // Forward to VM webhook with shared secret
  let upstream: Response;
  try {
    upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhookSecret ? { 'X-Webhook-Secret': webhookSecret } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('Webhook POST failed:', err);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 502 });
  }

  // Supabase insert — fire and forget, never fails the user submission
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (supabaseUrl && supabaseKey) {
    await fetch(`${supabaseUrl}/rest/v1/employer_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(body),
    }).catch(err => console.error('Supabase employer_leads insert failed:', err));
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
