import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import PageHero from '@/components/PageHero';

export const metadata = pageMetadata({
  title: 'How It Works',
  description:
    'See how applications move from intake to academy certification to employer placement at TantaGlobal Assist.',
  path: '/how-it-works',
  image: '/og-how-it-works.svg',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'How it works', path: '/how-it-works' },
]);

const steps = [
  {
    step: '01',
    stage: 'Intake',
    title: 'Apply or submit the role brief',
    body: 'Candidates share their background and availability. Employers submit the role, scope, and expectations they need supported.',
  },
  {
    step: '02',
    stage: 'Certify',
    title: 'Complete TGA Academy certification',
    body: 'Qualified candidates move to the academy step so the placement pipeline starts from a stronger baseline than raw intake.',
  },
  {
    step: '03',
    stage: 'Place',
    title: 'Review the shortlist and place',
    body: 'The shortlist stays readable, the communication stays clean, and the handoff stays organized for both sides.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <PageHero
        kicker="Process / intake to placement"
        title="Three steps. One clear path from intake to placement."
        lede="The workflow is designed to avoid noise. It starts with a clean application or role brief, moves candidates through certification, then hands employers a shortlist that already cleared the basics."
      />

      <section className="section-pad">
        <div className="section-container grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="bg-panel p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[0.78rem] font-medium text-sea-600">{item.step}</span>
                <span className="mono-label">{item.stage}</span>
              </div>
              <h2 className="mt-5 text-2xl">{item.title}</h2>
              <p className="mt-3 leading-7 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface-soft p-8">
            <p className="kicker">For candidates</p>
            <h2 className="mt-4">Start with a real application.</h2>
            <p className="mt-4 leading-8 text-muted">
              Tell us where you are based, what you have done before, and how you are available. The
              intake decides whether you move to the academy step and how you should be considered.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/apply" className="btn-primary">Apply for placement</Link>
              <Link href="/contact" className="btn-secondary">Ask a question</Link>
            </div>
          </div>
          <div className="surface p-8">
            <p className="kicker">For employers</p>
            <h2 className="mt-4">Submit a role brief people can actually respond to.</h2>
            <p className="mt-4 leading-8 text-muted">
              Hours, tools, core responsibilities, and timeline matter. The clearer the brief, the
              better the shortlist.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/hire" className="btn-primary">Request a shortlist</Link>
              <Link href="/pricing" className="btn-secondary">Review pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container">
          <div className="surface flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="kicker">Academy link</p>
              <h2 className="mt-3 text-2xl">Certification lives outside this site.</h2>
              <p className="mt-3 leading-7 text-muted">
                Candidates continue at academy.tantaglobal.com. The placement workflow here only opens
                after the academy step is complete.
              </p>
            </div>
            <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary shrink-0">
              Visit TGA Academy
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
