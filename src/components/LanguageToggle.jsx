import { useTranslation } from '../i18n/useTranslation'

export function LanguageToggle() {
  const { lang, setLang } = useTranslation()
  const other = lang === 'en' ? 'fr' : 'en'
  return (
    <button
      onClick={() => setLang(other)}
      aria-label={`Switch to ${other === 'en' ? 'English' : 'French'}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3.5 py-1.5 text-[14px] font-semibold uppercase tracking-wide text-ink/60 transition-colors duration-300 hover:border-sea-deep/30 hover:bg-mist/60 hover:text-sea-deep"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 14.3 0 18M12 3c-2.5 2.7-2.5 14.3 0 18" />
      </svg>
      {other.toUpperCase()}
    </button>
  )
}
