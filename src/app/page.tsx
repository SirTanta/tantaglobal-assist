import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'TantaGlobal Assist — Hire Trained Virtual Assistants from the Philippines',
  description:
    'Connect your business with trained virtual assistants or apply for placement through a certification-led pipeline.',
  path: '/',
  image: '/og-home.svg',
});

const breadcrumbs = breadcrumbJsonLd([{ name: 'Home', path: '/' }]);

const pipeline = [
  {
    num: '01',
    stage: 'Intake',
    body: 'Employer submits the role brief. Candidate submits the application.',
  },
  {
    num: '02',
    stage: 'Screen',
    body: 'Background, availability, and fit reviewed before anything moves forward.',
  },
  {
    num: '03',
    stage: 'Certify',
    body: 'Candidates clear TGA Academy certification before entering placement.',
  },
  {
    num: '04',
    stage: 'Match',
    body: 'Shortlist built against the brief, not a keyword search.',
  },
  {
    num: '05',
    stage: 'Place',
    body: 'Interview, handoff, and follow-up through the first weeks on the job.',
  },
];

const failureModes = [
  {
    label: 'Undefined roles',
    body: 'A VA hired without a defined role spends the first month guessing. The role brief forces the definition up front: tasks, hours, tools, and what success looks like in the first 90 days.',
  },
  {
    label: 'Unvetted candidates',
    body: 'A resume says available. It does not say reliable. Candidates here pass screening and TGA Academy certification before they reach a shortlist.',
  },
  {
    label: 'No follow-through',
    body: 'Placement is not the finish line. The handoff, onboarding, and early check-ins decide whether the hire sticks. Those stay part of the process here.',
  },
];

const network = [
  { name: 'Tanta Holdings LLC', role: 'Parent company', href: 'https://tantaholdings.com' },
  { name: 'Tanta Global Academy', role: 'VA certification', href: 'https://academy.tantaglobal.com' },
  { name: 'Tanta Visa Pathways', role: 'US immigration tools', href: 'https://tantavisapathways.com' },
  { name: 'Tanta Solutions', role: 'AI enablement consulting', href: 'https://tantaholdings.com/solutions' },
];

const routes = [
  {
    label: 'Employers',
    email: site.emailEmployer,
    body: 'Role briefs, shortlist timing, and the placement workflow.',
  },
  {
    label: 'Candidates',
    email: site.emailCandidates,
    body: 'Applications, the academy step, and placement expectations.',
  },
  {
    label: 'General',
    email: site.emailGeneral,
    body: 'Partnerships and anything that does not fit the routes above.',
  },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Hero */}
      <section className="band-dark">
        <div className="section-container grid gap-14 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
          <div>
            <p className="kicker">VA placement / Rio Rancho NM · Cebu PH</p>
            <h1 className="mt-6 max-w-2xl">
              Hire a VA who was screened and certified before you ever saw a name.
            </h1>
            <p className="lede mt-6 max-w-xl">
              Most VA hires fail for two reasons: the role was never defined, and the candidate was
              never vetted. TantaGlobal Assist fixes both. Employers submit a role brief. Candidates
              clear TGA Academy certification. Matching happens against the work you actually need done.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/hire" className="btn-primary">
                Submit a role brief
              </Link>
              <Link href="/apply" className="btn-secondary">
                Apply as a VA
              </Link>
            </div>
          </div>

          <div className="surface-dark p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-daylight/10 pb-4">
              <p className="mono-label">Placement pipeline</p>
              <p className="mono-label text-sea-300">Intake → Place</p>
            </div>
            <div className="mt-2">
              {pipeline.map((item) => (
                <div key={item.num} className="pipeline-row stage-in">
                  <span className="pipeline-num">{item.num}</span>
                  <div>
                    <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.14em] text-daylight">
                      {item.stage}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-daylight/60">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-daylight/10 pt-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-daylight/60">
              Every submission reviewed / response within 1 business day
            </p>
          </div>
        </div>
      </section>

      {/* Failure modes */}
      <section className="section-pad">
        <div className="section-container">
          <p className="kicker">The problem</p>
          <h2 className="mt-4 max-w-3xl">
            Most VA relationships fail early. The causes are boring and fixable.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-3">
            {failureModes.map((item, index) => (
              <div key={item.label} className="bg-panel p-7">
                <p className="mono-label">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3">{item.label}</h3>
                <p className="mt-3 leading-7 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual path */}
      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface flex flex-col p-8">
            <p className="kicker">For employers</p>
            <h2 className="mt-4 text-3xl">Submit the role. Get a shortlist that already cleared the basics.</h2>
            <p className="mt-4 leading-8 text-muted">
              This is a placement service, not a directory. The role brief goes in, the pipeline does
              its screening and certification work, and the shortlist that comes back is built for the
              job you described. Less sorting, more deciding.
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Link href="/hire" className="btn-primary">Request a shortlist</Link>
              <Link href="/pricing" className="btn-secondary">Review pricing</Link>
            </div>
          </div>

          <div className="surface-soft flex flex-col p-8">
            <p className="kicker">For candidates</p>
            <h2 className="mt-4 text-3xl">A measured route into client work.</h2>
            <p className="mt-4 leading-8 text-muted">
              If you are building a VA career, the process is direct: apply here, complete the academy
              step, and enter the placement queue with a stronger profile than a raw application alone.
              Certification lives at{' '}
              <a
                href={site.academyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sea-600 underline-offset-4 hover:underline"
              >
                academy.tantaglobal.com
              </a>
              .
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Link href="/apply" className="btn-primary">Apply for placement</Link>
              <Link href="/how-it-works" className="btn-secondary">See the full process</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Network */}
      <section className="border-y border-line bg-tint py-10">
        <div className="section-container">
          <p className="mono-label mb-6 text-center">Part of the Tanta Holdings ecosystem</p>
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {network.map((co) => (
              <a
                key={co.name}
                href={co.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-panel px-5 py-5 no-underline"
              >
                <p className="text-sm font-semibold text-body transition-colors group-hover:text-sea-600">
                  {co.name}
                </p>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                  {co.role}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact routes */}
      <section className="section-pad">
        <div className="section-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="kicker">Direct routes</p>
            <h2 className="mt-4">Skip the generic inbox.</h2>
            <p className="mt-4 leading-8 text-muted">
              Each route lands with the team that owns the answer. Pick the one that matches your
              question and expect a reply from a person, not an autoresponder chain.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line">
            {routes.map((route) => (
              <a
                key={route.email}
                href={`mailto:${route.email}`}
                className="group flex flex-col gap-2 bg-panel px-6 py-5 no-underline sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="mono-label">{route.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{route.body}</p>
                </div>
                <span className="shrink-0 font-mono text-sm text-sea-600 transition-colors group-hover:text-sea-700">
                  {route.email} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
