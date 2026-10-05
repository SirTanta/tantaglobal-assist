/**
 * Claims and policy lint. Dependency-free (node:fs, node:path only).
 *
 * Encodes the business truth rules in docs/policy/truth-rules.md as automated
 * checks over the real copy sources. A rule hit is a violation unless:
 *   - the sentence carries an honest-disclaimer exception (rule.allowSentence), or
 *   - the file is in the rule's allowFiles list, or
 *   - the (file, rule) pair is recorded in claims-lint.baseline.json (ratchet:
 *     the baseline may only shrink).
 */
import fs from "node:fs";
import path from "node:path";

export interface Rule {
  id: string;
  /** Truth-rule number from docs/policy/truth-rules.md. */
  rule: number;
  message: string;
  patterns: RegExp[];
  /** Sentence-level exception: a match is ignored when its sentence also matches. */
  allowSentence?: RegExp;
  /** Files (repo-relative, forward slashes) where the pattern is permitted. */
  allowFiles?: RegExp;
}

export interface Hit {
  file: string;
  rule: string;
  line: number;
  match: string;
  sentence: string;
}

export interface BaselineEntry {
  file: string;
  rule: string;
  count: number;
  reason: string;
  /** True for files owned by an open peer PR: a fix landing there must not break CI here. */
  tolerateStale?: boolean;
}

/** Honest disclaimer words. A sentence containing one of these is not a claim. */
const HONEST =
  /\b(no|not|never|without|none|isn['’]?t|aren['’]?t|doesn['’]?t|don['’]?t|won['’]?t|cannot|can['’]?t|yet|until|unless|waitlist|wait list|building|when matching|once matching|before|nothing|warning|scam|red flag|beware|avoid)\b/i;

export const RULES: Rule[] = [
  // ---- (1) no placement / product-operating claims ----
  {
    id: "placement-claim",
    rule: 1,
    message: "Claims or implies Tanta has placed VAs or has placed graduates.",
    patterns: [
      /\b(?:we(?:’ve|'ve| have)?|tanta(?: global)?(?: assist)?(?: has| have)?|our (?:graduates|vas|team))\s+(?:successfully\s+)?placed\b/i,
      /\b(?:graduates?|alumni|vas|virtual assistants|candidates)\s+(?:have been |were |are |get |is |being )?(?:successfully )?placed\b/i,
      /\bplaced\s+(?:\d[\d,]*\+?\s+)?(?:vas?|virtual assistants|graduates|candidates|filipino|professionals)\b/i,
      /\bplacement (?:rate|success|results?|record)\b/i,
      /\b(?:professional|premium|expert|trusted|vetted) (?:va|virtual assistant) (?:placement|staffing|matching)\b/i,
    ],
    allowSentence: HONEST,
  },
  {
    id: "vetted-pool",
    rule: 1,
    message: "Claims a vetted or pre-vetted VA pool is available.",
    patterns: [
      /\b(?:pre-?vetted|vetted)\s+(?:virtual assistants?|vas?|pool|talent|candidates|professionals|filipino)\b/i,
      /\b(?:pool|roster) of (?:pre-?vetted|vetted|certified|trained)\b/i,
    ],
    allowSentence: HONEST,
  },
  {
    id: "shortlist-match",
    rule: 1,
    message: "Offers a shortlist or a '5 business days' match.",
    patterns: [
      /\bshort-?list(?:s|ed|ing)?\b/i,
      /\b(?:match(?:ed|es|ing)?|candidates?|vas?|virtual assistants?|opportunit(?:y|ies)|reach out|placement)\b[^.\n]{0,70}\b(?:within|in|inside|under)\s+(?:\d+\s*(?:-|to)\s*)?(?:five|5)\s+business\s+days\b/i,
      /\b(?:within|in)\s+(?:five|5)\s+business\s+days\b[^.\n]{0,50}\b(?:match|candidates?|shortlist)\b/i,
    ],
    allowSentence: HONEST,
  },
  {
    id: "trial-guarantee",
    rule: 1,
    message: "Promises a trial, guarantee or replacement.",
    patterns: [
      /\b(?:replacement|satisfaction|money-?back|placement|risk-?free)\s+guarantee\b/i,
      /\bfree\s+replacement\b/i,
      /\b(?:risk-?free|paid|free|\d+-day|two-week|one-week)\s+trial\s+(?:period|week|run)\b/i,
      /\btrial\s+(?:period|week)\b/i,
    ],
    allowSentence: HONEST,
  },
  {
    id: "placement-pricing",
    rule: 1,
    message: "States placement pricing or placement fees.",
    patterns: [/\bplacement (?:pricing|fees?|price)\b/i, /\bhiring fees?\b/i, /\bpricing (?:for|of) (?:va )?placements?\b/i],
    allowSentence: HONEST,
  },
  {
    id: "social-proof",
    rule: 1,
    message: "Client results, testimonials or customer counts (none exist yet).",
    patterns: [
      /\b(?:client|customer) (?:results|testimonials|success stories)\b/i,
      /^\s*(?:client|customer) reviews\s*$/i,
      /\bwhat (?:our )?(?:clients|customers|students|learners) (?:say|are saying)\b/i,
      /\b(?:trusted|loved|chosen) by\s+(?:\d|hundreds|thousands|businesses|clients|companies)/i,
      /\bjoin\s+(?:over\s+|more than\s+)?\d[\d,]*\+?\s+(?:learners|students|graduates|clients|customers|members)\b/i,
      /\b\d[\d,]*\+?\s+(?:happy |satisfied )?(?:clients|customers|graduates)\s+(?:served|placed|trained|worldwide)\b/i,
    ],
    allowSentence: HONEST,
  },

  // ---- (2) no income or job promises, no invented statistics ----
  {
    id: "income-promise",
    rule: 2,
    message: "Income or job promise ('earn', six figures, guaranteed, $/hr comparisons).",
    patterns: [
      /\$\s?\d[\d,.]*\s?(?:\/|per\s)\s?(?:hr|hour)\b/i,
      /\bsix[- ]figures?\b/i,
      /\b(?:you(?:’ll|'ll| will| can| could)|learners? (?:can|will)|graduates? (?:can|will)|students? (?:can|will)) earn\b/i,
      /\bearn(?:ing)? (?:up to |more than |over |a living |real |extra )?(?:\$|money|income|a salary|more)/i,
      /\bjob guarantee\b/i,
      /\bguaranteed\b/i,
    ],
    // The Amazon book title is fixed and exempt; honest disclaimers are exempt.
    allowSentence: new RegExp(HONEST.source + "|Build Trust, Earn More, and Work the Way US Clients Expect", "i"),
  },
  {
    id: "invented-statistic",
    rule: 2,
    message: "Unsourced statistic: percent claim attributed to an unnamed study, or 'a 20XX study of N'.",
    patterns: [
      /\ba\s+20\d\d\s+(?:study|survey|report)\s+(?:of|by|found|shows?)\b/i,
      /\b(?:studies|research|surveys?|a study|one study|data)\s+(?:show|shows|found|finds|suggests?|indicates?|says?)\s+(?:that\s+)?(?:\d|up to \d|nearly \d|over \d)/i,
      /\b\d{1,3}(?:\.\d+)?%\s+of\s+(?:\w+\s+){0,3}(?:learners|students|graduates|employers|businesses|hiring managers|candidates|vas|owners|companies)\b[^.]{0,60}\b(?:report|say|find|found|prefer|struggle|fail|succeed|get|land)\b/i,
    ],
    allowSentence: HONEST,
  },

  // ---- (3) paused / held properties ----
  {
    id: "visa-promotion",
    rule: 3,
    message: "Links to tantavisapathways.com outside the existing visa pages and allowlisted data.",
    patterns: [/tantavisapathways\.com/i],
    allowFiles: /(?:^|\/)(?:visa|immigration|visa-pathways)(?:\/|[-.])|redirect|next\.config|sitemap|robots|vercel\.json|llms\.txt$|\/blog-posts-raw\.json$|\/lib\/seo\.ts$|\/lib\/site\.ts$/i,
  },
  {
    id: "hire-a-va-cta",
    rule: 3,
    message: "Hire a VA is on hold: CTAs must use the waitlist wording.",
    patterns: [
      // Whole-text CTA labels only: informational "how to hire" copy is not a CTA.
      /^\s*(?:hire (?:a|your|my) (?:virtual assistant|va|filipino va)|hire (?:a )?va(?: now| today)?|get (?:a|your) va|start hiring|hire now)\s*(?:[>→›]|->)?\s*$/i,
    ],
    // The /hire page keeps this title on purpose; the policy test requires waitlist wording in that file.
  },
  {
    id: "tantapulse-purchase",
    rule: 3,
    message: "TantaPulse purchase CTA or old payment link (TantaPulse is paused).",
    patterns: [
      /\b(?:buy|get|order|purchase|start)\s+tantapulse\b/i,
      /\btantapulse\b[^.\n]{0,60}\b(?:buy now|checkout|subscribe|add to cart)\b/i,
    ],
    allowSentence: HONEST,
  },
  {
    id: "aster-corvane",
    rule: 3,
    message: "Aster Corvane promotion (brand is parked).",
    patterns: [/\baster\s+corvane\b/i, /\bastercorvane\b/i],
  },

  // ---- (4) product model: Gumroad is backup only ----
  {
    id: "gumroad-in-copy",
    rule: 4,
    message:
      "Gumroad is backup only: no Gumroad link or word in marketing copy, CTAs, nav or social. Only the small 'Also available on Gumroad' backup line on a product page.",
    patterns: [/gumroad(?!_)/i, /\bgum\.co\b/i],
    allowSentence: /also available on gumroad/i,
  },

  // ---- (5) facts must match live data ----
  {
    id: "fact-pro-price",
    rule: 5,
    message: "Academy Pro price must be $4.99 (month).",
    patterns: [/\bpro\b[^.\n]{0,30}\$\s?(?!4\.99\b)\d[\d.]*\s?(?:\/|per\s|a\s)\s?(?:mo|month)\b/i],
  },
  {
    id: "fact-exam-price",
    rule: 5,
    message: "Academy exams are $5 ($3 with Pro). Bundle is $25 ($20 with Pro).",
    patterns: [/\bexams?\b[^.\n$]{0,30}\$\s?(?!(?:5|3)(?:\.00)?(?!\d|\.\d))\d[\d.]*/i],
    allowSentence: /\b(?:bundle|all\s+exams|tutor|tutoring|session|ielts|toefl|per hour|hr|hour|retake|proctor)/i,
  },
  {
    id: "fact-va101-free",
    rule: 5,
    message: "VA101 is free.",
    patterns: [/\bVA ?101\b[^.\n$]{0,40}\$\s?[1-9]/i],
    allowSentence: /\bfree\b/i,
  },
  {
    id: "fact-navy",
    rule: 5,
    message: "Jon's service record may be stated only as '20-year Navy veteran'.",
    patterns: [
      /\b(?!20\b)\d{1,2}[- ]years?\b(?:\s+(?:u\.?s\.?|united states))?\s+(?:navy|naval)\b/i,
      /\b(?:navy|naval)\s+(?:veteran |service |career )?(?:of|for|spanning)\s+(?!20\b)\d{1,2}\+?\s+years\b/i,
      /\b(?:\d{2}\+|over \d{2}|more than \d{2}|nearly \d{2}|almost \d{2})[- ]years?\b[^.\n,;]{0,25}\b(?:navy|naval|military)\b/i,
      /\b(?:retired|retiree)\b[^.\n]{0,15}\bnavy\b/i,
      /\b\d{1,2}[- ]years?\b(?:\s+(?:u\.?s\.?|united states))?\s+(?:army|air force|marine corps|marines|coast guard)\b/i,
    ],
  },
  {
    id: "fact-credential-expiry",
    rule: 5,
    message: "The credential must not be described as expiring.",
    patterns: [
      /\b(?:credential|certification|certificate|badge)s?\b[^.\n]{0,40}\b(?:expires?|expiring|expiry|expiration|renew(?:al)? (?:every|annually|each))\b/i,
    ],
    allowSentence: HONEST,
  },
  {
    id: "fact-facebook",
    rule: 5,
    message:
      "Facebook links must point to the correct page (Holdings 101925525738456/@tantaholdings, Academy 710339802154571, Assist 867291873125261); vanity URLs tantaholdingsllc, tantaglobalacademy, TantaGlobalAcademy are forbidden.",
    patterns: [
      /facebook\.com\/(?:tantaholdingsllc|tantaglobalacademy)/i,
      /facebook\.com\/(?:profile\.php\?id=)?(?!(?:101925525738456|710339802154571|867291873125261)(?!\d))\d{6,}/i,
      /facebook\.com\/(?!tantaholdings(?![\w-])|profile\.php|\d|share|sharer|tr\b|plugins|dialog|policies|help|legal)[A-Za-z][A-Za-z0-9._-]*/i,
    ],
  },

  // ---- (6) style: no em or en dashes in public copy ----
  {
    id: "no-long-dash",
    rule: 6,
    message: "Em or en dash in public copy.",
    patterns: [/[–—]/],
  },
];

// ---------------------------------------------------------------------------
// Text extraction
// ---------------------------------------------------------------------------

export interface Extracted {
  text: string;
  line: number;
}

function lineAt(src: string, idx: number): number {
  let n = 1;
  for (let i = 0; i < idx && i < src.length; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

/** Remove // and block comments but keep newlines so line numbers survive. */
function stripComments(src: string): string {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "'" || c === '"' || c === "`") {
      const q = c;
      out += c;
      i++;
      while (i < n && src[i] !== q) {
        if (src[i] === "\\") {
          out += src[i] + (src[i + 1] ?? "");
          i += 2;
          continue;
        }
        if (q !== "`" && src[i] === "\n") break;
        out += src[i++];
      }
      if (i < n) out += src[i++];
      continue;
    }
    if (c === "/" && d === "/") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && d === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) {
        if (src[i] === "\n") out += "\n";
        i++;
      }
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** String literals (single, double, template text) plus JSX text nodes. */
export function extractFromCode(src: string): Extracted[] {
  const code = stripComments(src);
  const found: Extracted[] = [];
  const n = code.length;
  let i = 0;
  while (i < n) {
    const c = code[i];
    if (c === "'" || c === '"' || c === "`") {
      const q = c;
      const start = i;
      const before = code.slice(Math.max(0, start - 40), start);
      const isModulePath = /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*|data-ga4-[\w-]+=\s*)$/.test(before);
      i++;
      let buf = "";
      while (i < n && code[i] !== q) {
        if (code[i] === "\\") {
          const nx = code[i + 1] ?? "";
          buf += nx === "n" ? " " : nx;
          i += 2;
          continue;
        }
        if (q !== "`" && code[i] === "\n") break;
        buf += code[i++];
      }
      i++;
      if (buf.trim() && !isModulePath) found.push({ text: buf.replace(/\$\{[^}]*\}/g, " "), line: lineAt(code, start) });
      continue;
    }
    i++;
  }
  // JSX text nodes: text between a closing > or } and the next <, with no braces.
  const jsx = /(?<=[>}])([^<>{}`]*[A-Za-z][^<>{}`]*)(?=<)/g;
  let m: RegExpExecArray | null;
  while ((m = jsx.exec(code))) {
    const t = m[1].replace(/\s+/g, " ").trim();
    if (t.length > 2 && !/^[=;,)(\]\[&|?:.]/.test(t) && !/[=;]\s*$/.test(t)) found.push({ text: t, line: lineAt(code, m.index) });
  }
  return found;
}

export function extractFromJson(src: string): Extracted[] {
  const found: Extracted[] = [];
  try {
    const walkJson = (v: unknown): void => {
      if (typeof v === "string") found.push({ text: v, line: 1 });
      else if (Array.isArray(v)) v.forEach(walkJson);
      else if (v && typeof v === "object") Object.values(v).forEach(walkJson);
    };
    walkJson(JSON.parse(src));
  } catch {
    found.push({ text: src, line: 1 });
  }
  return found;
}

export function extractTexts(file: string, content: string): Extracted[] {
  if (/\.json$/.test(file)) return extractFromJson(content);
  if (/\.(?:ts|tsx|js|jsx|mjs)$/.test(file)) return extractFromCode(content);
  return content.split("\n").map((text, i) => ({ text, line: i + 1 }));
}

// ---------------------------------------------------------------------------
// Linting
// ---------------------------------------------------------------------------

export function sentenceAround(text: string, start: number, end: number): string {
  let s = start;
  while (s > 0 && !/[.!?\n]/.test(text[s - 1])) s--;
  let e = end;
  while (e < text.length && !/[.!?\n]/.test(text[e])) e++;
  return text.slice(s, Math.min(text.length, e + 1)).trim();
}

export function lintText(text: string, file: string, line = 1, rules: Rule[] = RULES): Hit[] {
  const hits: Hit[] = [];
  for (const rule of rules) {
    if (rule.allowFiles && rule.allowFiles.test(file)) continue;
    for (const p of rule.patterns) {
      const re = new RegExp(p.source, p.flags.includes("g") ? p.flags : p.flags + "g");
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        if (m[0].length === 0) {
          re.lastIndex++;
          continue;
        }
        const sentence = sentenceAround(text, m.index, m.index + m[0].length);
        if (rule.allowSentence && rule.allowSentence.test(sentence)) continue;
        hits.push({ file, rule: rule.id, line, match: m[0], sentence: sentence.slice(0, 200) });
      }
    }
  }
  return hits;
}

export interface ScanConfig {
  root: string;
  /** Repo-relative directories or files to scan. */
  include: string[];
  /** Repo-relative path regexes to skip. */
  exclude?: RegExp[];
  rules?: Rule[];
  /** ruleId -> the rule applies ONLY to files matching this pattern. */
  scope?: Record<string, RegExp>;
  /** ruleId -> files matching this pattern are exempt from the rule. */
  exempt?: Record<string, RegExp>;
}

const SCAN_EXT = /\.(?:ts|tsx|js|jsx|mjs|json|txt|md)$/;

function walk(dir: string, out: string[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (SCAN_EXT.test(e.name)) out.push(p);
  }
}

export function listFiles(cfg: ScanConfig): string[] {
  const all: string[] = [];
  for (const inc of cfg.include) {
    const abs = path.join(cfg.root, inc);
    if (!fs.existsSync(abs)) continue;
    if (fs.statSync(abs).isDirectory()) walk(abs, all);
    else all.push(abs);
  }
  return all
    .map((f) => path.relative(cfg.root, f).split(path.sep).join("/"))
    .filter((f) => !/(?:\.test\.|\.spec\.|__tests__\/|\/policy\/claims-lint)/.test(f))
    .filter((f) => !(cfg.exclude ?? []).some((re) => re.test(f)))
    .sort();
}

export function scanRepo(cfg: ScanConfig): Hit[] {
  const hits: Hit[] = [];
  for (const file of listFiles(cfg)) {
    const content = fs.readFileSync(path.join(cfg.root, file), "utf8");
    const rules = (cfg.rules ?? RULES).filter(
      (r) => (!cfg.scope?.[r.id] || cfg.scope[r.id].test(file)) && !cfg.exempt?.[r.id]?.test(file),
    );
    for (const ex of extractTexts(file, content)) hits.push(...lintText(ex.text, file, ex.line, rules));
  }
  return hits;
}

// ---------------------------------------------------------------------------
// Ratchet
// ---------------------------------------------------------------------------

export function groupHits(hits: Hit[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const h of hits) {
    const k = `${h.file}::${h.rule}`;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

export interface RatchetResult {
  newViolations: string[];
  staleBaseline: string[];
}

export function applyBaseline(hits: Hit[], baseline: BaselineEntry[]): RatchetResult {
  const actual = groupHits(hits);
  const base = new Map(baseline.map((b) => [`${b.file}::${b.rule}`, b.count]));
  const tolerant = new Set(baseline.filter((b) => b.tolerateStale).map((b) => `${b.file}::${b.rule}`));
  const newViolations: string[] = [];
  const staleBaseline: string[] = [];
  for (const [k, n] of Array.from(actual.entries())) {
    const allowed = base.get(k) ?? 0;
    if (n > allowed) {
      const sample = hits.filter((h) => `${h.file}::${h.rule}` === k).slice(0, 3);
      newViolations.push(
        `${k} has ${n} hit(s), baseline allows ${allowed}. ` +
          sample.map((h) => `L${h.line} "${h.match}" in: ${h.sentence}`).join(" | "),
      );
    }
  }
  for (const [k, allowed] of Array.from(base.entries())) {
    const n = actual.get(k) ?? 0;
    if (n < allowed && !tolerant.has(k))
      staleBaseline.push(`${k} baseline allows ${allowed} but only ${n} found: shrink or remove the entry in claims-lint.baseline.json`);
  }
  return { newViolations, staleBaseline };
}

/** Every match of `re` in the scanned copy, for positive assertions (for example Facebook URLs). */
export function scanMatches(cfg: ScanConfig, re: RegExp): { file: string; line: number; match: string }[] {
  const out: { file: string; line: number; match: string }[] = [];
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  for (const file of listFiles(cfg)) {
    const content = fs.readFileSync(path.join(cfg.root, file), "utf8");
    for (const ex of extractTexts(file, content)) {
      let m: RegExpExecArray | null;
      g.lastIndex = 0;
      while ((m = g.exec(ex.text))) out.push({ file, line: ex.line, match: m[0] });
    }
  }
  return out;
}
