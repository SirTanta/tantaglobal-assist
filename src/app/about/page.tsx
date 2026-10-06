import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About',
  description:
    'TantaGlobal Assist is building a certification pathway for virtual assistants. Employers can join our waitlist while we build our pool; no VAs placed yet.',
  path: '/about',
  image: '/og-home.png',
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
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            TantaGlobal Assist is the employer waitlist and certification pathway side of a larger Tanta workflow. Candidates apply here,
            complete the academy certification step, and employers join a waitlist for when certified VAs are available.
            We have not placed any VAs yet, and placement or work is not guaranteed for anyone.
          </p>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface p-7">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-3">A certification pathway with a point of view.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              We do not try to be everything to everyone. We focus on the path that matters most: a candidate who is
              better prepared because they were trained and evaluated through certification.
            </p>
            <p className="mt-4 leading-8 text-slate-600">
              If an employer has to spend less time filtering noise and more time deciding between good options,
              the process is doing its job.
            </p>
          </div>

          <div className="surface-soft p-7">
            <p className="eyebrow">Who it serves</p>
            <div className="mt-4 space-y-4">
              {[
                {
                  title: 'Employers',
                  body: 'Founders, operators, and team leads who need reliable remote support without a long sorting cycle.',
                },
                {
                  title: 'Candidates',
                  body: 'VA professionals who want a structured certification pathway toward client work. No placement or work is promised.',
                },
                {
                  title: 'Training partners',
                  body: 'The academy side keeps certification standards consistent.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{item.body}</p>
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
            <h2 className="mt-3">Training and the employer waitlist stay close.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              The academy lives at{' '}
              <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0d5c63] underline-offset-4 hover:underline">
                academy.tantaglobal.com
              </a>
              . Tanta Holdings provides the parent structure. TantaGlobal Assist runs the employer waitlist and candidate applications.
            </p>
          </div>
          <div className="surface p-7">
            <p className="eyebrow">What we value</p>
            <h2 className="mt-3">Clear standards, no inflated language.</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• Certification before any employer matching</li>
              <li>• Clear handoffs between training and client work</li>
              <li>• Practical communication and measurable expectations</li>
              <li>• A clean path for employers and candidates alike</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container">
          <div className="surface-soft flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Next step</p>
              <h2 className="mt-3">Choose the route that fits your situation.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/hire" data-ga4-action="click_cta__global_assist__about" data-ga4-label="Join the employer waitlist" data-ga4-destination="/hire" data-ga4-zone="Z5" data-ga4-page-type="SECTION" data-ga4-ia-level="2" data-ga4-element-type="button" className="instr-btn-primary">Join the employer waitlist</Link>
              <Link href="/apply" data-ga4-action="click_cta__global_assist__about" data-ga4-label="Apply for placement" data-ga4-destination="/apply" data-ga4-zone="Z5" data-ga4-page-type="SECTION" data-ga4-ia-level="2" data-ga4-element-type="button" className="instr-btn-ghost">Apply to the VA Pathway</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
