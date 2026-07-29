import { useTranslation } from '../i18n/useTranslation'

export function LanguageToggle() {
  const { lang, setLang } = useTranslation()
  const other = lang === 'en' ? 'fr' : 'en'
  return (
    <button
      onClick={() => setLang(other)}
      aria-label={`Switch to ${other === 'en' ? 'English' : 'French'}`}
      className="text-sm font-body uppercase tracking-widest text-sea-deep hover:text-sea"
    >
      {other.toUpperCase()}
    </button>
  )
}
