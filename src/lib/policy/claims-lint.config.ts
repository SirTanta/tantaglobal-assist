import type { ScanConfig } from "./claims-lint";

/** Facebook pages that may be linked from this property (truth rule 5). */
export const FACEBOOK_ALLOWED = ["867291873125261"];

/** Files that must keep honest employer-waitlist wording (truth rule 3). */
export const REQUIRE_WAITLIST: { file: string; re: RegExp }[] = [
  { file: "src/app/hire/page.tsx", re: /waitlist|when matching opens|when matching is available/i },
  { file: "src/app/hire/page.tsx", re: /building our certified VA pool/i },
];

export function scanConfig(root: string): ScanConfig {
  return {
    root,
    include: ["src", "public/llms.txt"],
    exclude: [
      // Chatbot QA fixtures list forbidden phrases on purpose (mustNotContain), so they are not copy.
      /-qa-bank\.ts$/,/^src\/app\/api\//, /^src\/lib\/(?!seo\.ts$)/],
    scope: {
      "no-long-dash": /^src\/(?:app\/|components\/)/,
    },
    exempt: {
      "gumroad-in-copy": /^src\/app\/privacy\/page\.tsx$/,
      // The /hire page title is the employer waitlist page; REQUIRE_WAITLIST keeps its wording honest.
      "hire-a-va-cta": /^src\/app\/hire\/page\.tsx$/,
    },
  };
}
