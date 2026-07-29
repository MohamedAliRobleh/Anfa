import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { Logo } from './Logo'
import { LanguageToggle } from './LanguageToggle'
import { MobileNav } from './MobileNav'

const ROUTES = [
  ['home', '/'], ['about', '/about'], ['services', '/services'], ['approach', '/approach'],
  ['fees', '/fees'], ['contact', '/contact'], ['faq', '/faq'],
  ['blog', '/blog'], ['testimonials', '/testimonials'], ['resources', '/resources'],
]

export function Header() {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-40 bg-sand/95 backdrop-blur border-b border-mist">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        <NavLink to="/" aria-label="Anfa Counselling & Psychotherapy home">
          <Logo variant="full-color" className="hidden md:block h-14" />
          <Logo variant="compact" className="md:hidden h-10" />
        </NavLink>
        <nav className="hidden md:flex items-center gap-6">
          {ROUTES.map(([key, path]) => (
            <NavLink key={path} to={path} className="text-sm font-body text-ink hover:text-sea">
              {t(`common.nav.${key}`)}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle />
          <NavLink
            to="/booking"
            className="rounded-full bg-sunlit px-5 py-2 text-sm font-semibold text-ink hover:opacity-90"
          >
            {t('common.cta.bookFree')}
          </NavLink>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
