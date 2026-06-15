import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';

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
    title: 'Apply or submit the role brief',
    body:
      'Candidates share their background and availability. Employers submit the role, scope, and expectations they need supported.',
  },
  {
    step: '02',
    title: 'Complete TGA Academy certification',
    body:
      'Qualified candidates move to the academy step so the placement pipeline starts from a stronger baseline than raw intake.',
  },
  {
    step: '03',
    title: 'Review the shortlist and place',
    body:
      'We help keep the shortlist readable, the communication clean, and the handoff organized for both sides.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="section-pad">
        <div className="section-container max-w-4xl space-y-6">
          <p className="eyebrow">How it works</p>
          <h1>Three steps. One clear path from intake to placement.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            The workflow is designed to avoid noise. We start with a clean application or role brief,
            move candidates through certification, then hand employers a shortlist that already cleared the basics.
          </p>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-4">
          {steps.map((item) => (
            <div key={item.step} className="surface flex flex-col gap-5 p-6 md:flex-row md:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0d5c63] text-lg font-black text-white">
                {item.step}
              </div>
              <div>
                <h2 className="text-2xl">{item.title}</h2>
                <p className="mt-3 max-w-3xl leading-8 text-slate-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface-soft p-7">
            <p className="eyebrow">For candidates</p>
            <h2 className="mt-3">Start with a real application.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Tell us where you are based, what you have done before, and how you are available. We use the intake
              to decide whether you move to the academy step and how you should be considered.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/apply" className="btn-primary">Apply for placement</Link>
              <Link href="/contact" className="btn-secondary">Ask a question</Link>
            </div>
          </div>
          <div className="surface p-7">
            <p className="eyebrow">For employers</p>
            <h2 className="mt-3">Submit a role brief that people can actually respond to.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Hours, tools, core responsibilities, and timeline matter. The clearer the brief, the better the shortlist.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/hire" className="btn-primary">Request VA shortlist</Link>
              <Link href="/pricing" className="btn-secondary">Review pricing model</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container">
          <div className="surface p-7">
            <p className="eyebrow">Academy link</p>
            <h2 className="mt-3">Certification lives outside this site.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Candidates continue at{' '}
              <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0d5c63] underline-offset-4 hover:underline">
                academy.tantaglobal.com
              </a>
              . The placement workflow here only opens after the academy step has been completed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
