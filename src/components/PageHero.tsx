import type { ReactNode } from 'react';

/**
 * Dark hero band used at the top of interior pages.
 * Kicker is a monospace route label; keep it short and literal.
 */
export default function PageHero({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="band-dark">
      <div className="section-container py-16 md:py-24">
        <p className="kicker">{kicker}</p>
        <h1 className="mt-5 max-w-4xl">{title}</h1>
        {lede ? <p className="lede mt-6 max-w-3xl">{lede}</p> : null}
        {children}
      </div>
    </section>
  );
}
