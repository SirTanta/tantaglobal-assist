import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { RULES, lintText } from "../src/lib/policy/claims-lint";
import { organizationJsonLd, websiteJsonLd, site } from "../src/lib/seo";

const ROOT = process.cwd();
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const PAGES = ["page", "apply", "hire", "how-it-works", "pricing", "contact", "about", "privacy", "sitemap"].map((p) =>
  p === "page" ? "src/app/page.tsx" : `src/app/${p}/page.tsx`,
);
const BANNED = [
  "priority matching", "aggregaterating", "ratingvalue", "reviewcount", "telephone", "postaladdress",
  "placement pipeline", "visa", "immigration", "free call", "free consult",
];

/** Metadata block of a page: everything before the first top-level component or schema definition. */
function metaBlock(rel: string): string {
  const src = read(rel);
  const end = src.search(/\nconst (breadcrumbs|applicationSchema|serviceSchema|groups|steps)\b|\nexport default/);
  return end > 0 ? src.slice(0, end) : src;
}

test("structured data: org and website JSON-LD carry no unsupported claims", () => {
  const text = JSON.stringify([organizationJsonLd, websiteJsonLd]).toLowerCase();
  for (const b of BANNED) assert.ok(!text.includes(b), `banned wording in site JSON-LD: ${b}`);
  assert.deepEqual(lintText(JSON.stringify([organizationJsonLd, websiteJsonLd]), "src/lib/seo.ts", 1, RULES), []);
});

test("structured data: site description is the waitlist/pathway wording", () => {
  assert.match(site.description, /waitlist/i);
  assert.ok(!/placed|placement|guarantee/i.test(site.description));
});

test("structured data: meta text on every page carries no unsupported claims", () => {
  for (const rel of PAGES) {
    const meta = metaBlock(rel).toLowerCase();
    for (const b of BANNED) assert.ok(!meta.includes(b), `${rel}: banned wording in metadata: ${b}`);
    for (const m of meta.matchAll(/[^.]*guarantee[^.]*/g)) assert.ok(/not|no /.test(m[0]), `${rel}: guarantee wording without negation: ${m[0]}`);
    // Any mention of placement in meta must be an honest disclaimer.
    for (const m of meta.matchAll(/'([^']*placement[^']*)'|"([^"]*placement[^"]*)"/g)) {
      const s = m[1] ?? m[2];
      assert.ok(/not|no |yet|until|waitlist|building/.test(s), `${rel}: placement mentioned without disclaimer: ${s}`);
    }
  }
});

test("structured data: apply and hire Service JSON-LD do not advertise placement", () => {
  for (const rel of ["src/app/apply/page.tsx", "src/app/hire/page.tsx"]) {
    const src = read(rel);
    const block = src.match(/'@type': 'Service',[\s\S]*?\n};/)?.[0] ?? "";
    assert.ok(block.length > 0, `${rel}: Service JSON-LD not found`);
    assert.ok(!/placement/i.test(block), `${rel}: Service JSON-LD mentions placement`);
  }
  assert.match(read("src/app/hire/page.tsx"), /serviceType: 'Employer waitlist'/);
});

test("structured data: no invented ratings or phone numbers anywhere in src", () => {
  const walk = (d: string): string[] =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const f of walk(path.join(ROOT, "src")).filter((x) => /\.(tsx?|json)$/.test(x))) {
    const s = fs.readFileSync(f, "utf8");
    if (/['"]@context['"]/.test(s)) assert.ok(!/aggregateRating|reviewCount|ratingValue|telephone/.test(s), `${f}: invented rating or phone in JSON-LD`);
  }
});

test("page bodies: no 'Apply for placement' copy and one public contact address", () => {
  const files = [
    "src/app/page.tsx", "src/app/about/page.tsx", "src/app/apply/page.tsx", "src/app/how-it-works/page.tsx",
    "src/app/sitemap/page.tsx", "src/app/contact/page.tsx", "src/components/Header.tsx", "src/components/Footer.tsx",
  ];
  for (const rel of files) {
    const src = read(rel).replace(/data-ga4-label="Apply for placement"/g, "");
    assert.ok(!/apply for placement/i.test(src), `${rel}: still says Apply for placement`);
    assert.ok(!/(hire|apply|hello|employers|candidates)@tantaglobal\.com/i.test(src), `${rel}: legacy public mailbox in copy`);
  }
  assert.equal(site.email, "info@tanta-holdings.com");
  assert.ok(JSON.stringify(organizationJsonLd).includes("info@tanta-holdings.com"));
  assert.ok(!/tantaglobal\.com/.test(JSON.stringify(organizationJsonLd).replace(/https?:\/\/[^"]*tantaglobal\.com[^"]*/g, "")));
});
