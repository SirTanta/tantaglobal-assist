/**
 * Captures campaign attribution from the current URL and referrer so the
 * employer intake event can carry it to Atlas. Atlas keeps the values recorded
 * on the first event, so this only needs to be right at intake time.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export type CapturedAttribution = { source: string } & Partial<
  Record<(typeof UTM_KEYS)[number], string>
>;

const STORAGE_KEY = "tga_assist_first_touch";

function readFirstTouch(): CapturedAttribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CapturedAttribution) : null;
  } catch {
    return null;
  }
}

function writeFirstTouch(value: CapturedAttribution): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage blocked (private mode, site data off): fall back to current-page attribution only.
  }
}

/**
 * First-touch attribution. A visitor who lands with UTMs and submits a form two pages later would
 * otherwise be recorded as "direct". The first touch that carried a campaign signal is kept in
 * localStorage and reused when the current page has none.
 */
export function captureAttribution(): CapturedAttribution {
  const current = captureCurrentPage();
  const hasCampaign = Object.keys(current).some((k) => k !== "source");
  if (typeof window === "undefined") return current;
  if (hasCampaign) {
    if (!readFirstTouch()) writeFirstTouch(current);
    return current;
  }
  return readFirstTouch() ?? current;
}

function captureCurrentPage(): CapturedAttribution {
  if (typeof window === "undefined") return { source: "direct" };

  const params = new URLSearchParams(window.location.search);
  const captured: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) captured[key] = value;
  }

  let source = captured.utm_source;
  if (!source && document.referrer) {
    try {
      const referrerHost = new URL(document.referrer).hostname;
      if (referrerHost && referrerHost !== window.location.hostname) source = referrerHost;
    } catch {
      // Malformed referrer — fall through to "direct".
    }
  }

  return { source: source || "direct", ...captured };
}
