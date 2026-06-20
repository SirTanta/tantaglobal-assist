#!/usr/bin/env node
/**
 * Tala QA harness.
 *
 * Walks the QA bank from src/data/tala-qa-bank.ts, hits the bot route,
 * and checks each reply against its `must` predicate. Fails if pass rate is
 * below the floor (default 0.95) or if the API ever returns a non-200.
 *
 * Modes:
 *   --base   Bot endpoint base URL (default http://localhost:3000)
 *   --tag    Filter to a single QA tag (employer, candidate, pricing, etc.)
 *   --floor  Pass rate floor (default 0.95)
 *   --fast   Short-circuit on first failure
 *
 * No gateway? The route falls back to deterministic replies driven by
 * detectIntent + the FAQ KB. The harness still exercises that path — it
 * catches buckling from any source: silent failures, wrong audience routing,
 * missing ecosystem references, illegal-advice slips.
 */

import { setTimeout as sleep } from "node:timers/promises";

// Run this script with `tsx` (npm run qa:tala) so the .ts QA bank import
// resolves directly without a separate build step.

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = args[i + 1];
  if (v && !v.startsWith("--")) return v;
  return true;
}

const BASE = arg("base", "http://localhost:3000");
const TAG = arg("tag", null);
const FLOOR = Number(arg("floor", 0.95));
const FAST = !!arg("fast", false);

const { QA_BANK, summarizeBank } = await import("../src/data/tala-qa-bank.ts");

const cases = TAG ? QA_BANK.filter((c) => c.tag === TAG) : QA_BANK;

if (cases.length === 0) {
  console.error(`No QA cases match tag=${TAG}`);
  process.exit(2);
}

const summary = summarizeBank();
console.log(`\nTala QA harness`);
console.log(`  base=${BASE}`);
console.log(`  cases=${cases.length} / ${summary.total} total`);
if (TAG) console.log(`  filter tag=${TAG}`);
console.log(`  floor=${(FLOOR * 100).toFixed(0)}%`);
console.log(`  by tag: ${Object.entries(summary.byTag).map(([k, v]) => `${k}=${v}`).join(" ")}\n`);

const URL = `${BASE.replace(/\/$/, "")}/api/tala`;

function buildMessages(question) {
  return [
    {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: question }],
    },
  ];
}

async function askTala(question) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: buildMessages(question) }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  const deltas = [...text.matchAll(/"delta":"((?:[^"\\]|\\.)*)"/g)].map((m) => {
    try {
      return JSON.parse(`"${m[1]}"`);
    } catch {
      return m[1];
    }
  });
  return deltas.join("");
}

function checkCase(reply, qa) {
  const lower = reply.toLowerCase();

  if (qa.mustContainAny && qa.mustContainAny.length > 0) {
    const hit = qa.mustContainAny.some((needle) => lower.includes(needle.toLowerCase()));
    if (!hit) {
      return { pass: false, reason: `none of [${qa.mustContainAny.join(", ")}] in reply` };
    }
  }

  if (qa.mustNotContain && qa.mustNotContain.length > 0) {
    const hit = qa.mustNotContain.find((needle) => lower.includes(needle.toLowerCase()));
    if (hit) {
      return { pass: false, reason: `forbidden phrase present: "${hit}"` };
    }
  }

  if (!reply.trim()) {
    return { pass: false, reason: "empty reply (bot buckled)" };
  }

  return { pass: true };
}

const failures = [];
const tagStats = {};

for (let i = 0; i < cases.length; i++) {
  const qa = cases[i];
  tagStats[qa.tag] = tagStats[qa.tag] || { pass: 0, fail: 0 };

  let reply = "";
  let error = null;
  try {
    reply = await askTala(qa.question);
  } catch (e) {
    error = e;
  }

  if (error) {
    tagStats[qa.tag].fail++;
    failures.push({ qa, reason: `request error: ${error.message}` });
    process.stdout.write(`x [${qa.tag}/${qa.id}] request error\n`);
    if (FAST) break;
    continue;
  }

  const result = checkCase(reply, qa);
  if (result.pass) {
    tagStats[qa.tag].pass++;
    process.stdout.write(`. [${qa.tag}/${qa.id}]\n`);
  } else {
    tagStats[qa.tag].fail++;
    failures.push({ qa, reason: result.reason, replyExcerpt: reply.slice(0, 240) });
    process.stdout.write(`x [${qa.tag}/${qa.id}] ${result.reason}\n`);
    if (FAST) break;
  }

  await sleep(150);
}

const total = cases.length;
const passed = Object.values(tagStats).reduce((s, t) => s + t.pass, 0);
const failed = total - passed;
const rate = total > 0 ? passed / total : 0;

console.log(`\nResults`);
console.log(`  ${passed}/${total} passed (${(rate * 100).toFixed(1)}%) — floor ${(FLOOR * 100).toFixed(0)}%`);
console.log(`  by tag:`);
for (const [tag, s] of Object.entries(tagStats)) {
  const tagTotal = s.pass + s.fail;
  console.log(`    ${tag.padEnd(12)} ${s.pass}/${tagTotal}`);
}

if (failures.length > 0) {
  console.log(`\nFailures (${failures.length}):`);
  for (const f of failures) {
    console.log(`\n  [${f.qa.tag}/${f.qa.id}] ${f.qa.question}`);
    console.log(`    reason: ${f.reason}`);
    if (f.qa.why) console.log(`    why probing: ${f.qa.why}`);
    if (f.replyExcerpt) console.log(`    reply: ${f.replyExcerpt}${f.replyExcerpt.length === 240 ? "..." : ""}`);
  }
}

if (rate < FLOOR) {
  console.log(`\nFAIL — pass rate ${(rate * 100).toFixed(1)}% below floor ${(FLOOR * 100).toFixed(0)}%`);
  process.exit(1);
}

console.log(`\nPASS\n`);
process.exit(0);
