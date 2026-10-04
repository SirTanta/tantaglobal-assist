import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test("og-home.png is a 1200x630 PNG", () => {
  const png = readFileSync(join(process.cwd(), "public", "og-home.png"));
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test("no page metadata references an SVG og:image (Facebook, LinkedIn, X cannot render it)", () => {
  const offenders = walk(join(process.cwd(), "src"))
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .filter((f) => /og-[a-z-]+\.svg/.test(readFileSync(f, "utf8")));
  assert.deepEqual(offenders, []);
});
