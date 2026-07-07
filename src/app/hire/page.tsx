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

const briefItems = [
  'The tasks the VA will actually own',
  'Weekly hours and preferred overlap',
  'Tools or systems they will use',
  'Timeline for start and onboarding',
];

export default function HirePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <section className="band-dark">
        <div className="section-container py-16 md:py-20">
          <p className="kicker">For employers / role brief intake</p>
          <h1 className="mt-5 max-w-4xl">
            The shortlist starts with your brief, not our inventory.
          </h1>
          <p className="lede mt-6 max-w-3xl">
            Share the role, time commitment, and expectations. The brief gets reviewed by a person,
            matched against certified candidates, and answered within 1 business day.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-6">
            <div className="surface p-7">
              <p className="mono-label">What makes a brief matchable</p>
              <ul className="mt-5 space-y-4">
                {briefItems.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="pipeline-num pt-0 text-sea-600">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-soft p-7">
              <p className="mono-label">Before you submit</p>
              <h2 className="mt-3 text-2xl">A clearer brief gets a clearer shortlist.</h2>
              <p className="mt-3 leading-7 text-muted">
                Enough detail to understand the job beats a polished job description. A practical
                brief keeps the placement process moving.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/pricing" className="btn-secondary">Review pricing</Link>
                <Link href="/how-it-works" className="btn-secondary">See the process</Link>
              </div>
            </div>
          </div>

          <div className="surface p-6 sm:p-8">
            <p className="kicker">Role brief</p>
            <h2 className="mt-3 text-3xl">Define the work. The rest follows.</h2>
            <p className="mt-3 leading-7 text-muted">
              Fill out the form and the next step in the placement process comes back to your inbox.
            </p>
            <div className="mt-7">
              <HireForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
