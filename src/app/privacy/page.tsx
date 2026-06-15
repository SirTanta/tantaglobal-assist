import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';

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

export default function PrivacyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="section-pad">
        <div className="section-container max-w-4xl space-y-6">
          <p className="eyebrow">Legal</p>
          <h1>Privacy policy</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            This page summarizes the data pathways used by the forms on this site. It is intentionally concise and
            written for the actual workflow rather than as generic filler.
          </p>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-2">
          <div className="surface p-7">
            <p className="eyebrow">What we collect</p>
            <h2 className="mt-3">Only what you submit in the forms.</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• Names, emails, and messages submitted through the contact forms</li>
              <li>• Employer role details entered in the hire form</li>
              <li>• Candidate background details entered in the apply form</li>
            </ul>
          </div>
          <div className="surface-soft p-7">
            <p className="eyebrow">How it is used</p>
            <h2 className="mt-3">To respond, route, and review submissions.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Submitted information is used to respond to inquiries and support the placement workflow.
              If you want data removed or corrected, contact {site.emailGeneral}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
