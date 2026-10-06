import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import HireForm from '@/components/HireForm';

export const metadata = pageMetadata({
  title: 'Employer Waitlist',
  description:
    'Tell TantaGlobal Assist about the role, hours, and tools you need covered. We are building our certified VA pool and will contact you when matching opens.',
  path: '/hire',
  image: '/og-home.png',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Hire', path: '/hire' },
]);

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Employer waitlist for certified virtual assistants',
  provider: {
    '@type': 'Organization',
    name: site.name,
    url: site.url,
  },
  areaServed: 'Worldwide',
  serviceType: 'Employer waitlist',
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
            <h1>Tell us what VA support you need. We will reach out when matching opens.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Share the role, time commitment, and expectations. We are still building our pool of certified
              virtual assistants, so we cannot match you today. Your brief joins our employer waitlist and we will
              contact you when matching is available. We are not promising a timeline.
            </p>
            <div className="surface p-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">A focused brief takes about 2 minutes</p>
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
              You do not need a polished job description. Tell us what needs to get done and we will keep your brief on file for when matching opens.
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
            <h2 className="mt-3">A clearer brief makes matching easier.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              We are looking for enough detail to understand the job, not a polished job description. A practical
              brief helps us match you well once matching opens.
            </p>
          </div>
          <div className="surface p-7">
            <p className="eyebrow">Need context?</p>
            <h2 className="mt-3">See the pricing model first.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Pricing is scoped by engagement type rather than a one-size-fits-all directory fee.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pricing" data-ga4-action="click_cta__global_assist__hire" data-ga4-label="Review pricing model" data-ga4-destination="/pricing" data-ga4-zone="Z5" data-ga4-page-type="FORM" data-ga4-ia-level="2" data-ga4-element-type="button" className="instr-btn-primary">Review pricing model</Link>
              <Link href="/how-it-works" data-ga4-action="click_cta__global_assist__hire" data-ga4-label="See the process" data-ga4-destination="/how-it-works" data-ga4-zone="Z5" data-ga4-page-type="FORM" data-ga4-ia-level="2" data-ga4-element-type="button" className="instr-btn-ghost">See the process</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
