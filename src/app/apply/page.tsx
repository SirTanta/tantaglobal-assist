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

export default function ApplyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }} />

      <section className="section-pad">
        <div className="section-container grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="eyebrow">For candidates</p>
            <h1>Apply for placement and start the route into client work.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Tell us about your background, availability, and the kind of work you want to do. If the fit is there,
              you move to the academy step and then into placement.
            </p>
            <div className="surface p-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">What to include</p>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li>• Your core VA skills and tools</li>
                <li>• Relevant client or employer experience</li>
                <li>• Time zone and availability</li>
                <li>• The type of client work you want next</li>
              </ul>
            </div>
          </div>

          <div className="surface p-6 sm:p-8">
            <h2 className="text-3xl">Application form</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The preferred application path is the Tally form. If you need an on-page fallback, the intake form
              below will still send your details into the placement workflow.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={tallyFormUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Open Tally application
              </a>
              <Link href="/how-it-works" className="btn-secondary">
                See the process
              </Link>
            </div>
            <div className="mt-6">
              <ApplyForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface-soft p-7">
            <p className="eyebrow">Training partner</p>
            <h2 className="mt-3">Certification lives at TGA Academy.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              The academy step helps separate interested applicants from candidates ready for client work.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Visit TGA Academy
              </a>
              <Link href="/how-it-works" className="btn-secondary">See the full process</Link>
            </div>
          </div>
          <div className="surface p-7">
            <p className="eyebrow">Need help first?</p>
            <h2 className="mt-3">Ask before you apply if the path is unclear.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Candidate questions go to {site.emailCandidates}. General questions go to {site.emailGeneral}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Contact us</Link>
              <Link href="/pricing" className="btn-secondary">Review pricing model</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
