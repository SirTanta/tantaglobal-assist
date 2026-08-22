import RemoteReadyLogo from "@/components/RemoteReadyLogo";

const ANDROID_LISTING_URL = "https://play.google.com/store/apps/details?id=com.tantaholdings.remoteready";

export default function RemoteReadyPromo() {
  return (
    <aside aria-labelledby="remote-ready-title" className="overflow-hidden rounded-2xl border border-instruments-sea/20 bg-instruments-ink text-instruments-vellum shadow-lift">
      <div className="grid gap-7 px-6 py-7 sm:px-8 sm:py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
        <div>
          <RemoteReadyLogo />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-instruments-gold">Have you tried Remote Ready yet?</p>
          <h2 id="remote-ready-title" className="mt-2 max-w-xl font-display text-3xl font-medium leading-tight tracking-[-0.035em] text-white sm:text-4xl">A more prepared path to remote work, in your pocket.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">Start with free professional tools and keep your Academy-connected learning close at hand. Android is live now; iOS is coming soon.</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <a href={ANDROID_LISTING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-instruments-gold px-5 py-3 text-sm font-semibold text-instruments-ink transition hover:bg-instruments-gold-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-instruments-ink" aria-label="Get Remote Ready on Google Play, opens in a new tab">Get it on Google Play <span className="ml-2" aria-hidden="true">↗</span></a>
          <span className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white/55" aria-label="iOS version coming soon">iOS coming soon</span>
        </div>
      </div>
    </aside>
  );
}
