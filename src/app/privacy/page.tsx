import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import PageHero from '@/components/PageHero';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'Read the privacy policy for TantaGlobal Assist and how submitted form data is handled.',
  path: '/privacy',
  image: '/og-privacy.svg',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Privacy policy', path: '/privacy' },
]);

const collected = [
  'Names, emails, and messages submitted through the contact forms',
  'Employer role details entered in the hire form',
  'Candidate background details entered in the apply form',
];

export default function PrivacyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <PageHero
        kicker="Legal / data handling"
        title="Privacy policy"
        lede="This page summarizes the data pathways used by the forms on this site. It is intentionally concise and written for the actual workflow rather than as generic filler."
      />

      <section className="section-pad">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface p-8">
            <p className="kicker">What is collected</p>
            <h2 className="mt-4">Only what you submit in the forms.</h2>
            <ul className="mt-6 space-y-4">
              {collected.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="pipeline-num pt-0 text-sea-600">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-soft p-8">
            <p className="kicker">How it is used</p>
            <h2 className="mt-4">To respond, route, and review submissions.</h2>
            <p className="mt-4 leading-8 text-muted">
              Submitted information is used to respond to inquiries and support the placement
              workflow. If you want data removed or corrected, contact{' '}
              <a href={`mailto:${site.emailGeneral}`} className="font-mono text-sm text-sea-600 hover:underline">
                {site.emailGeneral}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
