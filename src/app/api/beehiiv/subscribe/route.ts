// POST /api/beehiiv/subscribe — tantaglobal.com
import { NextRequest, NextResponse } from "next/server";
import { sendAtlasLead } from "@/lib/atlas-crm";

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

  let body: {
    email?: string;
    first_name?: string;
    subscriber_role?: string;
    attribution?: Record<string, unknown>;
  };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, first_name } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // CRM mirror (never throws). Runs before the Beehiiv call so a signup is captured even if
  // Beehiiv is down or not configured on this deployment.
  const role = typeof body.subscriber_role === "string" ? body.subscriber_role.replace(/[^a-z-]/g, "").slice(0, 30) : "";
  await sendAtlasLead({
    kind: `newsletter_${role || "visitor"}`,
    email,
    name: first_name,
    attribution: body.attribution,
  });

  const apiKey = process.env.BEEHIIV_API_KEY;
  const listId = process.env.BEEHIIV_LIST_ID;
  if (!apiKey || !listId) {
    console.error("[beehiiv] BEEHIIV_API_KEY / BEEHIIV_LIST_ID not set on this deployment; subscribe not forwarded");
    return NextResponse.json({ error: "Beehiiv not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${BEEHIIV_API_URL}/publications/${listId}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ email: email.toLowerCase().trim(), first_name: first_name?.trim(), reactivate_if_unsubscribed: true }),
    });
    if (!res.ok && res.status !== 422) {
      console.error(`[beehiiv] subscribe failed status=${res.status}`);
      return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[beehiiv] subscribe threw:", err instanceof Error ? err.message : typeof err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
