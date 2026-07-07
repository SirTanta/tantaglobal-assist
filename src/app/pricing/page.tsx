import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';

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

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="section-pad">
        <div className="section-container max-w-4xl space-y-6">
          <p className="eyebrow">Pricing</p>
          <h1>Pricing that matches the engagement, not a generic flat-rate directory.</h1>
          <p className="max-w-3xl text-lg leading-8 text-ink-muted">
            The site does not publish a fake one-size-fits-all fee. Employer work is scoped after the role brief,
            while candidate-side training follows the academy path.
          </p>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Employer placement',
              body: 'Scoped after we review the role brief, timeline, and support needs.',
            },
            {
              title: 'Candidate application',
              body: 'The application itself is the entry point to the pipeline and does not start with a hard sell.',
            },
            {
              title: 'Academy certification',
              body: 'Certification lives at TGA Academy and supports the pipeline that reaches employers.',
            },
          ].map((card) => (
            <div key={card.title} className="surface p-6">
              <p className="eyebrow">Cost model</p>
              <h2 className="mt-3 text-2xl">{card.title}</h2>
              <p className="mt-3 leading-7 text-ink-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface p-7">
            <p className="eyebrow">What affects scope</p>
            <h2 className="mt-3">The brief tells us what kind of work this is.</h2>
            <ul className="mt-4 space-y-3 text-ink-muted">
              <li>&bull; Role complexity and expected hours</li>
              <li>&bull; Whether the work is one-off or ongoing</li>
              <li>&bull; Tooling and communication requirements</li>
              <li>&bull; Speed of turnaround for shortlist review</li>
            </ul>
          </div>
          <div className="surface p-7">
            <p className="eyebrow">Need a number?</p>
            <h2 className="mt-3">Ask after the brief, not before.</h2>
            <p className="mt-4 leading-8 text-ink-muted">
              The fastest route to an accurate price is to submit a role brief first. We can then respond with a
              scoped conversation instead of guessing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/hire" className="btn btn-primary">Request VA shortlist</Link>
              <a href={`mailto:${site.emailEmployer}`} className="btn btn-secondary">Email employer team</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
