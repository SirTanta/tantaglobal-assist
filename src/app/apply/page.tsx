import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import ApplyForm from '@/components/ApplyForm';

const tallyFormUrl = 'https://tally.so/r/VLVZbE';

export const metadata = pageMetadata({
  title: 'Apply for Placement',
  description:
    'Apply to TantaGlobal Assist and move into a certification-led virtual assistant placement pipeline.',
  path: '/apply',
  image: '/og-apply.svg',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Apply', path: '/apply' },
]);

const applicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Virtual assistant application and placement',
  provider: {
    '@type': 'Organization',
    name: site.name,
    url: site.url,
  },
  areaServed: 'Worldwide',
  serviceType: 'Virtual assistant application and placement',
};

const includeItems = [
  'Your core VA skills and tools',
  'Relevant client or employer experience',
  'Time zone and availability',
  'The type of client work you want next',
];

export default function ApplyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }} />

      <section className="band-dark">
        <div className="section-container py-16 md:py-20">
          <p className="kicker">For candidates / application intake</p>
          <h1 className="mt-5 max-w-4xl">Apply for placement and start the route into client work.</h1>
          <p className="lede mt-6 max-w-3xl">
            Tell us about your background, availability, and the kind of work you want to do. If the
            fit is there, you move to the academy step and then into placement.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-6">
            <div className="surface p-7">
              <p className="mono-label">What to include</p>
              <ul className="mt-5 space-y-4">
                {includeItems.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="pipeline-num pt-0 text-sea-600">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-soft p-7">
              <p className="mono-label">Training partner</p>
              <h2 className="mt-3 text-2xl">Certification lives at TGA Academy.</h2>
              <p className="mt-3 leading-7 text-muted">
                The academy step separates interested applicants from candidates ready for client work.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Visit TGA Academy
                </a>
                <Link href="/how-it-works" className="btn-secondary">See the full process</Link>
              </div>
            </div>
            <div className="surface p-7">
              <p className="mono-label">Questions first?</p>
              <p className="mt-3 leading-7 text-muted">
                Candidate questions go to{' '}
                <a href={`mailto:${site.emailCandidates}`} className="font-mono text-sm text-sea-600 hover:underline">
                  {site.emailCandidates}
                </a>
                . General questions go to{' '}
                <a href={`mailto:${site.emailGeneral}`} className="font-mono text-sm text-sea-600 hover:underline">
                  {site.emailGeneral}
                </a>
                .
              </p>
            </div>
          </div>

          <div className="surface p-6 sm:p-8">
            <p className="kicker">Application</p>
            <h2 className="mt-3 text-3xl">Two ways in. Same pipeline.</h2>
            <p className="mt-3 leading-7 text-muted">
              The preferred application path is the Tally form. If you need an on-page fallback, the
              intake form below still sends your details into the placement workflow.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={tallyFormUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Open Tally application
              </a>
            </div>
            <div className="subtle-rule mt-7" />
            <div className="mt-7">
              <ApplyForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
