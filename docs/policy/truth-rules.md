# Truth rules (current as of 2026-10-06)

These are the business decisions that every public word, price and link must respect. They are enforced by automated tests (`claims-lint`) in the web repos, so a copy or data edit that breaks one fails `npm test` and the preview build. Any human or agent editing copy or data is bound by them.

Where the tests live in each repo:

- tanta-holdings: `src/lib/policy/claims-lint.ts`, `src/lib/policy/claims-lint.config.ts`, `src/lib/claims-lint.test.ts`
- tga-academy: `src/lib/policy/claims-lint.ts`, `src/lib/policy/claims-lint.config.ts`, `src/lib/policy/__tests__/claims-lint.test.ts`
- tantaglobal-assist: `src/lib/policy/claims-lint.ts`, `src/lib/policy/claims-lint.config.ts`, `tests/claims-lint.test.ts`

Each repo keeps `src/lib/policy/claims-lint.baseline.json`, the list of known pre-existing hits with a reason for each. It is a ratchet: it can only shrink. A new violation fails the test. Fixing a baselined hit without removing or reducing its baseline entry also fails the test, so the baseline gets smaller over time. Do not add to a baseline without Jon's approval.

## How the lint reads copy

It scans string literals and JSX text in `src/app/**` and `src/components/**`, the public data files (blog JSON, newsletter data, books and shop catalogs, metadata and JSON-LD builders, chatbot knowledge bases) and `public/llms.txt` where present. Server code, API routes, course simulation content and chatbot QA fixtures are not copy and are skipped. A hit is ignored when the same sentence carries an honest disclaimer ("no", "not", "never", "yet", "until", "waitlist", "building", "when matching", "warning sign" and similar), so honest statements such as "we have not placed any VAs yet" pass.

## Rule 1. No placement or product-operating claims

No copy may state or imply that Tanta has placed VAs, has certified graduates placed, has a vetted or pre-vetted VA pool available, offers a shortlist, a "5 business days" match, a trial, guarantee or replacement promise, placement pricing, or client results, testimonials or customer counts. Global Assist and Academy copy may only describe the certification pathway, the candidate path and the employer waitlist ("still building our pool", "when matching is available").

Rule ids: `placement-claim`, `vetted-pool`, `shortlist-match`, `trial-guarantee`, `placement-pricing`, `social-proof`.

## Rule 2. No income or job promises, no invented statistics

Block "$X/hr" earnings comparisons, "earn", "six figures", "guaranteed", percent claims attributed to unnamed studies and "a 20XX study of N". The Amazon book title "How International Virtual Assistants Build Trust, Earn More, and Work the Way US Clients Expect" is a fixed title and is the one named exception.

Rule ids: `income-promise`, `invented-statistic`.

## Rule 3. Paused and held properties

- No Visa Pathways promotion. Links to tantavisapathways.com are allowed only from the existing visa pages, redirects and allowlisted data. Rule id: `visa-promotion`.
- No Hire a VA promotion. A "Hire a VA" call to action must use the waitlist wording (for example "Join the employer waitlist"). Rule id: `hire-a-va-cta`. The `/hire` and `/va-pool/hire` pages must keep their waitlist and "when matching is available" wording (checked by a test).
- No TantaPulse purchase call to action or old payment link. Rule id: `tantapulse-purchase`.
- No Aster Corvane promotion. The brand is parked, not closed. Rule id: `aster-corvane`.

## Rule 4. Product model

Every digital product has BUY (a one-time purchase, a downloadable file) and SUBSCRIBE (Academy Pro, use or read on the website). Gumroad is backup only: no Gumroad link and not the word Gumroad in marketing copy, calls to action, navigation or social drafts. The only allowed mention is the small "Also available on Gumroad" backup line on a product page. Storefront links point to the Academy storefront (`academy.tantaglobal.com/shop#slug`). Rule id: `gumroad-in-copy`.

## Rule 5. Facts must match live data

- Academy prices: Pro is $4.99 a month, exams are $5 or $3 with Pro, the bundle is $25 or $20 with Pro, VA101 is free. Rule ids: `fact-pro-price`, `fact-exam-price`, `fact-va101-free`.
- Jon's service record is stated only as "20-year Navy veteran". Rule id: `fact-navy`.
- The credential is not described as expiring. Rule id: `fact-credential-expiry`.
- Facebook links go only to the right page per property: Holdings 101925525738456 (@tantaholdings), Academy 710339802154571, Assist 867291873125261. The vanity URLs tantaholdingsllc, tantaglobalacademy and TantaGlobalAcademy are forbidden. Each repo also checks that it links only its own property's page. Rule id: `fact-facebook`.

## Rule 6. Style

No em dashes or en dashes in public copy (blog JSON, newsletter, page text strings). Use a comma, colon, period or a plain hyphen. Rule id: `no-long-dash`. WCAG compliance is a standing bar but is not testable here.

## Rule 7. Catalog integrity

The books catalog (14 books, ASIN format, no duplicates) and the shop catalog are validated by their own tests (`books-catalog.test.ts`, `shop-catalog.test.ts`); the claims lint extends them by scanning catalog copy against the rules above. In tga-academy, when the storefront catalog (`src/lib/shop/catalog.ts`) is present, its entries must have unique slugs and anchors, whole-dollar prices, a download file and no Gumroad wording in customer-facing fields.

## Not enforceable in tests

Social posts are drafted and published outside these repos. Enforcing these rules on social drafts needs the social publisher gate, which is handled separately. Live prices in Stripe, Gumroad and Moodle are checked against copy only where the copy is in the repo.

## Changing a rule

A rule changes only when Jon changes the decision. Update this file, the rule table in `claims-lint.ts`, and the matching file in the wiki (`docs/marketing/truth-rules-2026-10-06.md`) in the same change.
