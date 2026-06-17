import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import HireForm from '@/components/HireForm';

export const metadata = pageMetadata({
  title: 'Hire a Virtual Assistant',
  description:
    'Tell us about the role you need covered and get matched with a certified virtual assistant shortlist.',
  path: '/hire',
  image: '/og-hire.svg',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Hire', path: '/hire' },
]);

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Virtual assistant placement',
  provider: {
    '@type': 'Organization',
    name: site.name,
    url: site.url,
  },
  areaServed: 'Worldwide',
  serviceType: 'Virtual assistant placement',
};

export default function HirePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <section className="section-pad">
        <div className="section-container grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <p className="eyebrow">For employers</p>
            <h1>Request a VA shortlist built from trained, certified candidates.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Use the form to share the role, time commitment, and expectations. We review the brief, then route you
              toward candidates who are closer to the work you need done and into the HubSpot portal 243753317
              workflow on automation-hub.
            </p>
            <div className="surface p-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">What helps us match well</p>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li>• The tasks the VA will actually own</li>
                <li>• Weekly hours and preferred overlap</li>
                <li>• Tools or systems they will use</li>
                <li>• Timeline for start and onboarding</li>
              </ul>
            </div>
          </div>

          <div className="surface p-6 sm:p-8">
            <h2 className="text-3xl">Role brief</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Fill out the form below and we will follow up with the next step in the placement process.
            </p>
            <div className="mt-6">
              <HireForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface-soft p-7">
            <p className="eyebrow">Before you submit</p>
            <h2 className="mt-3">A clearer brief gets a clearer shortlist.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              We are looking for enough detail to understand the job, not a polished job description. A practical
              brief keeps the placement process moving.
            </p>
          </div>
          <div className="surface p-7">
            <p className="eyebrow">Need context?</p>
            <h2 className="mt-3">See the pricing model first.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Pricing is scoped by engagement type rather than a one-size-fits-all directory fee.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pricing" className="btn-primary">Review pricing model</Link>
              <Link href="/how-it-works" className="btn-secondary">See the process</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
