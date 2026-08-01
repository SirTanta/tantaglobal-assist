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

export function captureAttribution(): CapturedAttribution {
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
