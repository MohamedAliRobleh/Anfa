import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'

const ROUTES = [
  ['home', '/'], ['about', '/about'], ['services', '/services'], ['approach', '/approach'],
  ['fees', '/fees'], ['booking', '/booking'], ['contact', '/contact'], ['faq', '/faq'],
  ['blog', '/blog'], ['testimonials', '/testimonials'], ['resources', '/resources'],
]

export function MobileNav() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? t('common.nav.closeMenu') : t('common.nav.openMenu')}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="p-2"
      >
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full bg-sand shadow-lg p-4 flex flex-col gap-3">
          {ROUTES.map(([key, path]) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)} className="py-2">
              {t(`common.nav.${key}`)}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
