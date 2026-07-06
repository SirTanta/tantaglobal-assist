import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import PageHero from '@/components/PageHero';

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

const audiences = [
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
];

const values = [
  'Real screening before placement',
  'Clear handoffs between training and client work',
  'Practical communication and measurable expectations',
  'A clean path for employers and candidates alike',
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <PageHero
        kicker="About / placement side of the Tanta workflow"
        title="Built around a simple idea: trained people should reach employers faster."
        lede="TantaGlobal Assist is the placement side of a larger Tanta workflow. Candidates enter here, go through the academy step, and move into employer matching with a clearer standard than a typical open marketplace can provide."
      />

      <section className="section-pad">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface p-8">
            <p className="kicker">What this is</p>
            <h2 className="mt-4">Placement with a point of view.</h2>
            <p className="mt-4 leading-8 text-muted">
              Being everything to everyone is not the goal. The focus is the path that matters most:
              a candidate who is better prepared because they were trained, screened, and evaluated
              before they hit an employer inbox.
            </p>
            <p className="mt-4 leading-8 text-muted">
              If an employer spends less time filtering noise and more time deciding between good
              options, the process is doing its job.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line">
            {audiences.map((item, index) => (
              <div key={item.title} className="bg-panel p-6">
                <div className="flex items-baseline gap-4">
                  <span className="pipeline-num pt-0 text-sea-600">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl">{item.title}</h3>
                </div>
                <p className="mt-2 pl-[2.75rem] leading-7 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface p-8">
            <p className="kicker">The network</p>
            <h2 className="mt-4">Training and placement stay close.</h2>
            <p className="mt-4 leading-8 text-muted">
              The academy lives at{' '}
              <a
                href={site.academyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sea-600 underline-offset-4 hover:underline"
              >
                academy.tantaglobal.com
              </a>
              . Tanta Holdings provides the parent structure. TantaGlobal Assist focuses on matching
              and placement.
            </p>
          </div>
          <div className="surface-soft p-8">
            <p className="kicker">Operating standards</p>
            <h2 className="mt-4">Clear standards, no inflated language.</h2>
            <ul className="mt-6 space-y-4">
              {values.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="pipeline-num pt-0 text-sea-600">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container">
          <div className="band-dark flex flex-col gap-5 rounded-lg p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-2xl">
              <p className="kicker">Next step</p>
              <h2 className="mt-3">Choose the route that fits your situation.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/hire" className="btn-primary">Hire a VA</Link>
              <Link href="/apply" className="btn-secondary">Apply for placement</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
