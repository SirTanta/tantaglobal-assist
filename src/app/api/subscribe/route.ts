import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscribe
 * Wires the footer newsletter form to HubSpot.
 * Env: NEXT_PUBLIC_HUBSPOT_LIST_ID, HUBSPOT_ACCESS_TOKEN
 */
export async function POST(req: NextRequest) {
  const listId = process.env.NEXT_PUBLIC_HUBSPOT_LIST_ID;
  const token  = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!listId || !token) {
    return NextResponse.json({ error: "Newsletter not configured." }, { status: 503 });
  }

  let body: { email: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  // HubSpot v3 Contacts API — add to list
  const hsResp = await fetch(
    `https://api.hubapi.com/contacts/v1/lists/${listId}/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        emails: [email],
        successIds: [],
        failureIds: [],
      }),
    }
  );

  if (!hsResp.ok) {
    const text = await hsResp.text().catch(() => "");
    console.error("HubSpot subscribe error:", hsResp.status, text);
    return NextResponse.json({ error: "Subscription failed. Try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
