import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { RULES, lintText, scanRepo, scanMatches, applyBaseline, type BaselineEntry } from "../src/lib/policy/claims-lint";
import { scanConfig, FACEBOOK_ALLOWED, REQUIRE_WAITLIST } from "../src/lib/policy/claims-lint.config";

const ROOT = process.cwd();
const BASELINE_PATH = path.join(ROOT, "src/lib/policy/claims-lint.baseline.json");
const POLICY_DOC = path.join(ROOT, "docs/policy/truth-rules.md");

function flagged(rule: string, text: string, file = "src/app/new/page.tsx"): boolean {
  return lintText(text, file).some((h) => h.rule === rule);
}

// ---- rule table sanity -----------------------------------------------------------------------

test("claims-lint: rule table is well formed", () => {
  const ids = new Set<string>();
  for (const r of RULES) {
    assert.ok(!ids.has(r.id), "duplicate rule id " + r.id);
    ids.add(r.id);
    assert.ok(r.rule >= 1 && r.rule <= 6, r.id + " must map to truth rule 1-6");
    assert.ok(r.message.length > 10, r.id + " needs a message");
    assert.ok(r.patterns.length > 0, r.id + " needs at least one pattern");
  }
});

test("claims-lint: docs/policy/truth-rules.md exists and names every rule id", () => {
  assert.ok(fs.existsSync(POLICY_DOC), "docs/policy/truth-rules.md is missing");
  const doc = fs.readFileSync(POLICY_DOC, "utf8");
  for (const r of RULES) assert.ok(doc.includes("`" + r.id + "`"), "truth-rules.md does not mention rule " + r.id);
});

// ---- the engine: what it must catch and what it must leave alone ------------------------------

const MUST_FLAG: [string, string][] = [
  ["placement-claim", "We have placed 40 VAs with US clients."],
  ["placement-claim", "Certified graduates placed with US employers."],
  ["placement-claim", "Check our placement rate."],
  ["vetted-pool", "Hire from our pool of vetted virtual assistants."],
  ["vetted-pool", "You see one or two pre-vetted candidates."],
  ["shortlist-match", "You get a shortlist of candidates."],
  ["shortlist-match", "We match you with a VA within 5 business days."],
  ["trial-guarantee", "Every hire includes a free replacement guarantee."],
  ["trial-guarantee", "Start with a two-week trial period."],
  ["placement-pricing", "See our placement pricing."],
  ["social-proof", "What our clients say about us"],
  ["social-proof", "Read client testimonials"],
  ["social-proof", "Join over 2,000 learners today"],
  ["income-promise", "Certified VAs earn $25/hr."],
  ["income-promise", "You will earn six figures as a VA."],
  ["income-promise", "A guaranteed income from home."],
  ["invented-statistic", "A 2024 study of 500 VAs found clients rehire."],
  ["invented-statistic", "Studies show 80% of clients prefer certified VAs."],
  ["visa-promotion", "Start at https://tantavisapathways.com today"],
  ["hire-a-va-cta", "Hire a VA"],
  ["hire-a-va-cta", "Hire a Virtual Assistant"],
  ["tantapulse-purchase", "Buy TantaPulse today"],
  ["aster-corvane", "Read the Aster Corvane books"],
  ["gumroad-in-copy", "Buy on Gumroad"],
  ["gumroad-in-copy", "https://tantateam.gumroad.com/l/something"],
  ["fact-pro-price", "Academy Pro is $9.99/month"],
  ["fact-exam-price", "Each exam is $10."],
  ["fact-va101-free", "VA101 costs $9."],
  ["fact-navy", "A 15-year Navy veteran"],
  ["fact-navy", "20-year US Army veteran"],
  ["fact-navy", "20+ years in the US military"],
  ["fact-credential-expiry", "Your credential expires after one year."],
  ["fact-facebook", "https://facebook.com/tantaglobalacademy"],
  ["fact-facebook", "https://www.facebook.com/tantaholdingsllc"],
  ["fact-facebook", "https://www.facebook.com/profile.php?id=111111111111111"],
  ["fact-facebook", "https://www.facebook.com/SomeOtherPage"],
  ["no-long-dash", "Fast — and cheap"],
  ["no-long-dash", "Pages 3–5"],
];

for (const [rule, text] of MUST_FLAG) {
  test("claims-lint: flags " + rule + ": " + text.slice(0, 48), () => {
    assert.ok(flagged(rule, text), "expected " + rule + " to flag: " + text);
  });
}

const MUST_ALLOW: [string, string][] = [
  ["placement-claim", "We have not placed any VAs yet."],
  ["placement-claim", "No graduates have been placed; we are still building our pool."],
  ["vetted-pool", "We are still building our pool of vetted candidates."],
  ["shortlist-match", "There is no shortlist or 5 business days match until matching is available."],
  ["trial-guarantee", "We do not offer a replacement guarantee."],
  ["income-promise", "Treat guaranteed jobs, guaranteed income, or specific hourly earnings as a warning sign."],
  ["income-promise", "How International Virtual Assistants Build Trust, Earn More, and Work the Way US Clients Expect"],
  ["hire-a-va-cta", "How to hire a VA: a guide for owners"],
  ["hire-a-va-cta", "Join the employer waitlist"],
  ["gumroad-in-copy", "Also available on Gumroad"],
  ["fact-pro-price", "Academy Pro is $4.99/month."],
  ["fact-exam-price", "Each exam is $5, or $3 with Pro."],
  ["fact-exam-price", "Get ALL EXAMS for $20 with Pro."],
  ["fact-va101-free", "VA101 is free."],
  ["fact-navy", "A 20-year Navy veteran"],
  ["fact-credential-expiry", "Your credential does not expire."],
  ["fact-facebook", "https://www.facebook.com/profile.php?id=101925525738456"],
  ["fact-facebook", "https://facebook.com/710339802154571"],
  ["fact-facebook", "https://www.facebook.com/profile.php?id=867291873125261"],
  ["fact-facebook", "https://www.facebook.com/tantaholdings"],
  ["no-long-dash", "Fast - and cheap, 3-5 days"],
];

for (const [rule, text] of MUST_ALLOW) {
  test("claims-lint: allows " + rule + ": " + text.slice(0, 48), () => {
    assert.ok(!flagged(rule, text), "expected " + rule + " to allow: " + text);
  });
}

// ---- allowed-context file exceptions ----------------------------------------------------------

test("claims-lint: Visa Pathways links are allowed only from visa pages and redirects", () => {
  const link = "https://tantavisapathways.com/start";
  assert.ok(flagged("visa-promotion", link, "src/app/page.tsx"));
  assert.ok(!flagged("visa-promotion", link, "src/app/visa/page.tsx"));
  assert.ok(!flagged("visa-promotion", link, "next.config.mjs"));
});

// ---- real copy: the ratchet --------------------------------------------------------------------

function loadBaseline(): BaselineEntry[] {
  return JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) as BaselineEntry[];
}

test("claims-lint: baseline entries are reviewable (known rule, existing file, reason, no duplicates)", () => {
  const known = new Set(RULES.map((r) => r.id));
  const seen = new Set<string>();
  for (const b of loadBaseline()) {
    assert.ok(known.has(b.rule), "baseline names unknown rule " + b.rule);
    assert.ok(fs.existsSync(path.join(ROOT, b.file)), "baseline file does not exist: " + b.file);
    assert.ok(Number.isInteger(b.count) && b.count > 0, "baseline count must be a positive integer: " + b.file);
    assert.ok(typeof b.reason === "string" && b.reason.trim().length >= 20, "baseline needs a real reason: " + b.file + " " + b.rule);
    const k = b.file + "::" + b.rule;
    assert.ok(!seen.has(k), "duplicate baseline entry " + k);
    seen.add(k);
  }
});

test("claims-lint: repo copy has no new truth-rule violations and the baseline has not gone stale", () => {
  const hits = scanRepo(scanConfig(ROOT));
  const { newViolations, staleBaseline } = applyBaseline(hits, loadBaseline());
  assert.deepEqual(
    newViolations,
    [],
    "New truth-rule violation(s). Fix the copy (see docs/policy/truth-rules.md). Do not add to the baseline without Jon's approval.\n" +
      newViolations.join("\n"),
  );
  assert.deepEqual(staleBaseline, [], "Baseline is stale: shrink it so the ratchet only tightens.\n" + staleBaseline.join("\n"));
});

// ---- facts and required wording ---------------------------------------------------------------

test("claims-lint: Facebook links point only to this property's page", () => {
  const found = scanMatches(scanConfig(ROOT), /facebook\.com\/(?:profile\.php\?id=)?[A-Za-z0-9._@-]+/i);
  for (const f of found) {
    const id = f.match.replace(/^facebook\.com\/(?:profile\.php\?id=)?/i, "").toLowerCase();
    assert.ok(
      FACEBOOK_ALLOWED.includes(id),
      f.file + ":" + f.line + " links Facebook page " + id + ", allowed: " + FACEBOOK_ALLOWED.join(", "),
    );
  }
});

test("claims-lint: pages that must carry employer-waitlist wording still do", () => {
  for (const { file, re } of REQUIRE_WAITLIST) {
    const abs = path.join(ROOT, file);
    assert.ok(fs.existsSync(abs), file + " is missing");
    assert.ok(re.test(fs.readFileSync(abs, "utf8")), file + " must keep wording matching " + re);
  }
});
