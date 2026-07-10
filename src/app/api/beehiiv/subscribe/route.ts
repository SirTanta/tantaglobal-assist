// POST /api/beehiiv/subscribe — tantaglobal.com
import { NextRequest, NextResponse } from "next/server";

const BEEHIIV_API_URL = "https://api.beehiiv.com/v2";

const ALLOWED_ORIGINS = [
  "https://tantaglobal.com", "https://www.tantaglobal.com",
  "http://localhost:3000",
];

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";

  // Allow empty origin in production (React Native / Expo apps don't send origin header)
  const originAllowed = !origin
    ? true
    : ALLOWED_ORIGINS.includes(origin) || origin.startsWith("http://localhost");

  if (!originAllowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const listId = process.env.BEEHIIV_LIST_ID;
  if (!apiKey || !listId) {
    return NextResponse.json({ error: "Beehiiv not configured" }, { status: 503 });
  }

  let body: { email?: string; first_name?: string };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, first_name } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BEEHIIV_API_URL}/publications/${listId}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ email: email.toLowerCase().trim(), first_name: first_name?.trim(), reactivate_if_unsubscribed: true }),
    });
    if (!res.ok && res.status !== 422) {
      return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
