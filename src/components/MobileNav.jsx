import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'

const SECTIONS = [
  { items: [['home', '/']] },
  { label: 'about', items: [['about', '/about'], ['approach', '/approach']] },
  { label: 'services', items: [['services', '/services'], ['fees', '/fees']] },
  { items: [['contact', '/contact']] },
  { label: 'learnMore', items: [['faq', '/faq'], ['blog', '/blog'], ['testimonials', '/testimonials'], ['resources', '/resources']] },
]

export function MobileNav() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="ml-auto lg:hidden">
      <button
        aria-label={open ? t('common.nav.closeMenu') : t('common.nav.openMenu')}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="p-2"
      >
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full flex flex-col gap-1 bg-sand p-4 shadow-lg">
          {SECTIONS.map((section, i) => (
            <div key={i} className={i > 0 ? 'mt-2 border-t border-ink/10 pt-2' : ''}>
              {section.label && (
                <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
                  {t(`common.nav.${section.label}`)}
                </p>
              )}
              {section.items.map(([key, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-1 py-2 ${isActive ? 'text-sea-deep font-semibold' : 'text-ink'}`
                  }
                >
                  {t(`common.nav.${key}`)}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      )}
    </div>
  )
}
