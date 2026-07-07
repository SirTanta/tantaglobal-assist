import Link from 'next/link';
import { pageMetadata, breadcrumbJsonLd, site } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'TantaGlobal Assist — Hire Trained Virtual Assistants from the Philippines',
  description:
    'Connect your business with trained virtual assistants or apply for placement through a certification-led pipeline.',
  path: '/',
  image: '/og-home.svg',
});

const breadcrumbs = breadcrumbJsonLd([{ name: 'Home', path: '/' }]);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Filing strip header bar */}
      <div className="border-b border-border bg-parchment">
        <div className="section-container py-2.5 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
            Tantaglobal Assist · Rio Rancho, NM · Cebu, PH
          </span>
          <a
            href="https://tantaholdings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass hover:text-brass-light transition-colors"
          >
            Tanta Holdings →
          </a>
        </div>
      </div>

      {/* Hero section */}
      <section className="section-pad relative overflow-hidden">
        <div className="section-container grid gap-8 lg:grid-cols-[1.25fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-accent border border-accent/60 px-2 py-1">
              Placement · Assist
            </span>
            <h1>We connect trained VAs with businesses that need them.</h1>
            <p className="max-w-2xl text-lg leading-8 text-ink-muted">
              Candidates apply here, complete TGA Academy certification, and move into an employer-ready
              placement workflow. Employers share the role they need filled and we route them toward the
              right shortlist.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/hire" className="btn btn-primary">
                Hire a VA
              </Link>
              <Link href="/apply" className="btn btn-secondary">
                Apply as a VA
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                'Employer brief intake',
                'Certification-led candidate pipeline',
                'Follow-up through placement',
              ].map((item) => (
                <div key={item} className="surface px-4 py-4 text-sm font-semibold text-ink-muted">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Dual path</p>
                <h2 className="mt-2 text-2xl font-serif">Employers and candidates, one system.</h2>
              </div>
              <span className="rounded-full bg-parchment-light px-3 py-1 text-xs font-bold text-accent shadow-sm">
                TGA
              </span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-parchment-light p-5 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink-faint">For employers</p>
                <p className="mt-3 text-ink-muted">
                  Share the role, hours, and expectations. We review the brief and route you toward
                  a shortlist built for the work you actually need done.
                </p>
              </div>
              <div className="rounded-2xl bg-parchment-light p-5 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink-faint">For candidates</p>
                <p className="mt-3 text-ink-muted">
                  Submit your background, complete the academy step, and enter a placement pipeline that
                  values readiness over volume.
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-accent/30 bg-accent-light p-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Training partner</p>
                <p className="mt-3 text-ink-muted">
                  Academy training lives at{' '}
                  <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline">
                    academy.tantaglobal.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employer / Candidate cards */}
      <section className="section-pad pt-0">
        <div className="section-container">
          <div className="subtle-rule mb-8" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="surface p-7">
              <p className="eyebrow">Employers</p>
              <h2 className="mt-3">More signal, less sorting.</h2>
              <p className="mt-4 leading-8 text-ink-muted">
                This is a placement service, not a generic directory. We collect the role brief,
                align it with the candidate pipeline, and keep the process grounded in professional standards.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/hire" className="btn btn-primary">Request VA shortlist</Link>
                <Link href="/pricing" className="btn btn-secondary">Review pricing model</Link>
              </div>
            </div>

            <div className="surface p-7">
              <p className="eyebrow">Candidates</p>
              <h2 className="mt-3">A measured route into client work.</h2>
              <p className="mt-4 leading-8 text-ink-muted">
                If you are building a VA career, the process is straightforward: apply here, complete the academy
                step, and enter the placement queue with a stronger profile than a raw application alone.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/apply" className="btn btn-primary">Apply for placement</Link>
                <Link href="/how-it-works" className="btn btn-secondary">See the full process</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section className="section-pad pt-0">
        <div className="section-container">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-accent border border-accent/60 px-2 py-1">
                The Pipeline
              </span>
              <h2 className="mt-4 max-w-xl">Three steps, one outcome: a ready-to-work VA.</h2>
              <div className="subtle-rule mt-6 max-w-[12rem]" />
            </div>
            <div className="grid gap-4">
              {[
                {
                  step: '01',
                  title: 'Apply or submit a role brief',
                  body: 'Candidates share their background; employers submit the work that needs doing.',
                },
                {
                  step: '02',
                  title: 'Complete academy certification',
                  body: 'Candidates move through structured training before they are considered for placement.',
                },
                {
                  step: '03',
                  title: 'Match, review, and place',
                  body: 'We support the shortlist, candidate review, and handoff so the process stays tidy.',
                },
              ].map((item) => (
                <div key={item.step} className="surface flex items-start gap-6 p-5">
                  <div className="shrink-0 text-5xl sm:text-6xl font-serif text-ink tabular-nums leading-none">
                    {item.step}
                  </div>
                  <div className="border-l border-border pl-5">
                    <h3 className="text-xl">{item.title}</h3>
                    <p className="mt-2 leading-7 text-ink-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem strip */}
      <section className="border-y border-border bg-subtle py-6">
        <div className="section-container">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-ink-faint mb-6">
            Part of the Tanta Holdings ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { name: 'Tanta Holdings LLC',    role: 'Parent company',         href: 'https://tantaholdings.com' },
              { name: 'Tanta Global Academy',  role: 'VA certification',        href: 'https://academy.tantaglobal.com' },
              { name: 'Tanta Visa Pathways',   role: 'US immigration tools',    href: 'https://tantavisapathways.com' },
              { name: 'Tanta Solutions',       role: 'AI enablement consulting',href: 'https://tantaholdings.com/solutions' },
            ].map((co) => (
              <a
                key={co.name}
                href={co.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group"
              >
                <p className="text-sm font-bold text-ink-muted group-hover:text-accent transition-colors">{co.name}</p>
                <p className="text-[11px] text-ink-faint mt-0.5">{co.role}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Network */}
      <section className="section-pad pt-0">
        <div className="section-container grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="surface p-7">
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3">Need a direct line for a question?</h2>
            <p className="mt-4 leading-8 text-ink-muted">
              Employer questions go to <a href={`mailto:${site.emailEmployer}`} className="font-semibold text-accent underline-offset-4 hover:underline">{site.emailEmployer}</a>. Candidate questions go to <a href={`mailto:${site.emailCandidates}`} className="font-semibold text-accent underline-offset-4 hover:underline">{site.emailCandidates}</a>.
              If your question is general, send it to <a href={`mailto:${site.emailGeneral}`} className="font-semibold text-accent underline-offset-4 hover:underline">{site.emailGeneral}</a>.
            </p>
          </div>
          <div className="surface p-7">
            <p className="eyebrow">Network</p>
            <h2 className="mt-3">Part of the Tanta ecosystem.</h2>
            <p className="mt-4 leading-8 text-ink-muted">
              TantaGlobal Assist sits alongside Tanta Holdings and TGA Academy, keeping training and placement close
              enough to share standards without mixing the actual workflows.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
