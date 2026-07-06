import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import ContactForm from '@/components/ContactForm';
import PageHero from '@/components/PageHero';

export const metadata = pageMetadata({
  title: 'Contact TantaGlobal Assist',
  description:
    'Reach the employer, candidate, or general contact routes at TantaGlobal Assist.',
  path: '/contact',
  image: '/og-contact.svg',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]);

const routes = [
  {
    title: 'Employers',
    body: 'Questions about role briefs, shortlist timing, or the placement workflow.',
    email: site.emailEmployer,
  },
  {
    title: 'Candidates',
    body: 'Questions about the application path, academy step, or placement expectations.',
    email: site.emailCandidates,
  },
  {
    title: 'General',
    body: 'Partnerships, general questions, and anything that does not fit the two routes above.',
    email: site.emailGeneral,
  },
];

const messageTips = [
  'The page or workflow you are asking about',
  'The role or candidate type you need',
  'Any deadline or constraint we should know',
  'A direct email address for the reply',
];

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <PageHero
        kicker="Contact / three direct routes"
        title="Reach the right team without guessing the inbox."
        lede="Use the direct email routes if you already know what you need. Otherwise, send a message below and it gets routed to the right place."
      />

      <section className="section-pad">
        <div className="section-container grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-3">
          {routes.map((card) => (
            <div key={card.title} className="flex flex-col bg-panel p-7">
              <p className="mono-label">Direct route</p>
              <h2 className="mt-3 text-2xl">{card.title}</h2>
              <p className="mt-3 leading-7 text-muted">{card.body}</p>
              <a
                className="mt-auto inline-flex pt-5 font-mono text-sm text-sea-600 hover:text-sea-700"
                href={`mailto:${card.email}`}
              >
                {card.email} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-soft p-8">
            <p className="kicker">What to send</p>
            <h2 className="mt-4">A useful message is short and specific.</h2>
            <ul className="mt-6 space-y-4">
              {messageTips.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="pipeline-num pt-0 text-sea-600">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface p-6 sm:p-8">
            <p className="kicker">Message form</p>
            <h2 className="mt-3 text-3xl">Send a message</h2>
            <p className="mt-3 leading-7 text-muted">
              If you do not want to email directly, use the form below.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
