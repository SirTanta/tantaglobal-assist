import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import PageHero from '@/components/PageHero';

export const metadata = pageMetadata({
  title: 'Pricing',
  description:
    'Understand how TantaGlobal Assist scopes pricing for employer placement and candidate support.',
  path: '/pricing',
  image: '/og-pricing.svg',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
]);

const costModel = [
  {
    title: 'Employer placement',
    body: 'Scoped after the role brief, timeline, and support needs are reviewed. No flat directory fee, because the work is not flat.',
  },
  {
    title: 'Candidate application',
    body: 'The application is the entry point to the pipeline. No hard sell attached to it.',
  },
  {
    title: 'Academy certification',
    body: 'Certification lives at TGA Academy and feeds the pipeline that reaches employers.',
  },
];

const scopeFactors = [
  'Role complexity and expected hours',
  'Whether the work is one-off or ongoing',
  'Tooling and communication requirements',
  'Speed of turnaround for shortlist review',
];

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <PageHero
        kicker="Pricing / scoped per engagement"
        title="Pricing matches the engagement, not a flat-rate directory."
        lede="Employer work is scoped after the role brief. Candidate-side training follows the academy path. A number before the brief would be a guess, and guesses get expensive on both sides."
      />

      <section className="section-pad">
        <div className="section-container grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-3">
          {costModel.map((card, index) => (
            <div key={card.title} className="bg-panel p-8">
              <p className="mono-label">{String(index + 1).padStart(2, '0')} / Cost model</p>
              <h2 className="mt-4 text-2xl">{card.title}</h2>
              <p className="mt-3 leading-7 text-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-soft p-8">
            <p className="kicker">What affects scope</p>
            <h2 className="mt-4">The brief tells us what kind of work this is.</h2>
            <ul className="mt-6 space-y-4">
              {scopeFactors.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="pipeline-num pt-0 text-sea-600">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface p-8">
            <p className="kicker">Need a number?</p>
            <h2 className="mt-4">Ask after the brief, not before.</h2>
            <p className="mt-4 leading-8 text-muted">
              The fastest route to an accurate price is a submitted role brief. The response is a
              scoped conversation instead of a guess.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/hire" className="btn-primary">Submit a role brief</Link>
              <a href={`mailto:${site.emailEmployer}`} className="btn-secondary">Email employer team</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
