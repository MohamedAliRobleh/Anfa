import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { Logo } from './Logo'
import { CrisisResourceStrip } from './CrisisResourceStrip'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-sea-deep text-sand">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Logo variant="full-white" className="h-14 mb-4" />
          <p className="italic">{t('common.tagline')}</p>
        </div>
        <div className="text-sm space-y-1">
          <p>{t('common.footer.address')}</p>
          <a href="tel:+16137910284" className="block hover:underline">(613) 791-0284</a>
          <a href="mailto:sahrasaid845@gmail.com" className="block hover:underline">sahrasaid845@gmail.com</a>
          <div className="flex gap-4 pt-2">
            {/* FUTURE: replace # with the practice's real Facebook and Psychology Today profile URLs once provided */}
            <a href="#" aria-label="Facebook" className="hover:underline">Facebook</a>
            <a href="#" aria-label="Psychology Today" className="hover:underline">Psychology Today</a>
          </div>
        </div>
        <div className="text-sm">
          <NavLink to="/privacy" className="hover:underline">{t('common.footer.privacy')}</NavLink>
          <p className="mt-2 text-sand/70">© {new Date().getFullYear()} Anfa Counselling & Psychotherapy. {t('common.footer.rights')}</p>
        </div>
      </div>
      <CrisisResourceStrip />
    </footer>
  )
}
