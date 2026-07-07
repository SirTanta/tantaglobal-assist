import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';
import ContactForm from '@/components/ContactForm';

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

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="section-pad">
        <div className="section-container max-w-4xl space-y-6">
          <p className="eyebrow">Contact</p>
          <h1>Reach the right team without guessing the inbox.</h1>
          <p className="max-w-3xl text-lg leading-8 text-ink-muted">
            Use the direct email routes if you already know what you need. Otherwise, send a message below and we will
            route it to the right place.
          </p>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-3">
          {[
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
          ].map((card) => (
            <div key={card.title} className="surface p-6">
              <p className="eyebrow">Direct route</p>
              <h2 className="mt-3 text-2xl">{card.title}</h2>
              <p className="mt-3 leading-7 text-ink-muted">{card.body}</p>
              <a className="mt-5 inline-flex font-semibold text-accent underline-offset-4 hover:underline" href={`mailto:${card.email}`}>
                {card.email}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface p-7">
            <p className="eyebrow">What to send</p>
            <h2 className="mt-3">A useful message is short and specific.</h2>
            <ul className="mt-4 space-y-3 text-ink-muted">
              <li>&bull; The page or workflow you are asking about</li>
              <li>&bull; The role or candidate type you need</li>
              <li>&bull; Any deadline or constraint we should know</li>
              <li>&bull; A direct email address for the reply</li>
            </ul>
          </div>
          <div className="surface p-6 sm:p-8">
            <h2 className="text-3xl">Send a message</h2>
            <p className="mt-3 leading-7 text-ink-muted">
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
