// A small mock "slice" of the real site, styled with the exact same
// Tailwind tokens (bg-sea-deep, font-display, text-ink, …) the public
// pages use. Those tokens read CSS variables that src/theme/ThemeProvider's
// applyColors()/applyFonts() set live, so whatever palette or font pairing
// the admin is currently trying appears here immediately and accurately —
// with no separate preview-only styling to keep in sync.
export function ThemePreview() {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-ink/10">
      <div className="bg-mist px-6 py-8 sm:px-10 sm:py-12">
        <span className="mb-3 inline-flex items-center rounded-full bg-sunlit/15 px-3 py-1 text-xs font-semibold text-sunlit">
          Accompagnement bienveillant
        </span>
        <h2 className="font-display text-2xl text-sea-deep sm:text-3xl">
          Vous méritez un espace où être vraiment entendu(e).
        </h2>
        <p className="mt-3 max-w-md font-body text-ink/80">
          Chez Anfa, l&rsquo;accompagnement thérapeutique se fait à votre rythme, dans un cadre
          chaleureux et confidentiel.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            tabIndex={-1}
            className="rounded-full bg-sea-deep px-5 py-2.5 font-body text-sm font-semibold text-sand transition-colors duration-300 hover:bg-sea"
          >
            Prendre rendez-vous
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="rounded-full border border-lavender-ink/25 bg-lavender-wash px-5 py-2.5 font-body text-sm font-semibold text-lavender-ink"
          >
            En savoir plus
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 bg-sand px-6 py-5 sm:px-10">
        <div className="rounded-xl bg-lavender-soft px-4 py-3 text-sm font-body text-ink/80">
          Carte secondaire
        </div>
        <div className="rounded-xl bg-white px-4 py-3 text-sm font-body text-ink/80 ring-1 ring-ink/10">
          Carte neutre
        </div>
      </div>
    </div>
  )
}
