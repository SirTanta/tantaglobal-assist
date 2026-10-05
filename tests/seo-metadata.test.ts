import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { site, organizationJsonLd, websiteJsonLd } from "../src/lib/seo";

const pages = [
  "src/app/page.tsx",
  "src/app/about/page.tsx",
  "src/app/apply/page.tsx",
  "src/app/hire/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/pricing/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/how-it-works/page.tsx",
  "src/app/sitemap/page.tsx",
];

function descriptionOf(file: string): string {
  const src = readFileSync(join(process.cwd(), file), "utf8");
  const i = src.indexOf("description:");
  assert.ok(i >= 0, `no description in ${file}`);
  const rest = src.slice(i + "description:".length).trimStart();
  const q = rest[0];
  assert.ok(q === "'" || q === '"', `description in ${file} is not a plain string`);
  return rest.slice(1, rest.indexOf(q, 1));
}

test("every page meta description is 140 to 160 characters", () => {
  for (const f of pages) {
    const len = descriptionOf(f).length;
    assert.ok(len >= 140 && len <= 160, `${f} description is ${len} chars`);
  }
});

test("site default description is 140 to 160 characters", () => {
  assert.ok(site.description.length >= 140 && site.description.length <= 160, String(site.description.length));
});

test("layout does not emit a second BreadcrumbList and WebSite has no dead SearchAction", () => {
  const layout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
  assert.doesNotMatch(layout, /breadcrumbSchema/);
  assert.equal("potentialAction" in websiteJsonLd, false);
  assert.ok(organizationJsonLd.logo);
});

test("page titles do not repeat the brand that the layout template appends", () => {
  for (const f of pages.slice(1)) {
    const src = readFileSync(join(process.cwd(), f), "utf8");
    const t = src.match(/title:\s*(['"])(.*?)\1/);
    assert.ok(t, f);
    assert.doesNotMatch(t[2], /TantaGlobal Assist/, `${f} title repeats the brand: ${t[2]}`);
  }
});
