import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About TantaGlobal Assist',
  description:
    'Learn how TantaGlobal Assist connects training, screening, and placement for businesses that need dependable virtual assistants.',
  path: '/about',
  image: '/og-about.svg',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]);

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="section-pad">
        <div className="section-container max-w-4xl space-y-6">
          <p className="eyebrow">About</p>
          <h1>Built around a simple idea: trained people should reach employers faster.</h1>
          <p className="max-w-3xl text-lg leading-8 text-ink-muted">
            TantaGlobal Assist is the placement side of a larger Tanta workflow. Candidates enter here,
            go through the academy step, and move into employer matching with a clearer standard than a typical
            open marketplace can provide.
          </p>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface p-7">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-3">Placement with a point of view.</h2>
            <p className="mt-4 leading-8 text-ink-muted">
              We do not try to be everything to everyone. We focus on the path that matters most: a candidate who is
              better prepared because they were trained, screened, and evaluated before they hit an employer inbox.
            </p>
            <p className="mt-4 leading-8 text-ink-muted">
              If an employer has to spend less time filtering noise and more time deciding between good options,
              the process is doing its job.
            </p>
          </div>

          <div className="surface p-7">
            <p className="eyebrow">Who it serves</p>
            <div className="mt-4 space-y-4">
              {[
                {
                  title: 'Employers',
                  body: 'Founders, operators, and team leads who need reliable remote support without a long sorting cycle.',
                },
                {
                  title: 'Candidates',
                  body: 'VA professionals who want a more serious route into client work and placement support.',
                },
                {
                  title: 'Training partners',
                  body: 'The academy side keeps standards consistent before placement starts.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-parchment-light p-5 shadow-sm border border-border">
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-2 leading-7 text-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface p-7">
            <p className="eyebrow">The network</p>
            <h2 className="mt-3">Training and placement stay close.</h2>
            <p className="mt-4 leading-8 text-ink-muted">
              The academy lives at{' '}
              <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline">
                academy.tantaglobal.com
              </a>
              . Tanta Holdings provides the parent structure. TantaGlobal Assist focuses on matching and placement.
            </p>
          </div>
          <div className="surface p-7">
            <p className="eyebrow">What we value</p>
            <h2 className="mt-3">Clear standards, no inflated language.</h2>
            <ul className="mt-4 space-y-3 text-ink-muted">
              <li>&bull; Real screening before placement</li>
              <li>&bull; Clear handoffs between training and client work</li>
              <li>&bull; Practical communication and measurable expectations</li>
              <li>&bull; A clean path for employers and candidates alike</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container">
          <div className="surface flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Next step</p>
              <h2 className="mt-3">Choose the route that fits your situation.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/hire" className="btn btn-primary">Request VA shortlist</Link>
              <Link href="/apply" className="btn btn-secondary">Apply for placement</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
