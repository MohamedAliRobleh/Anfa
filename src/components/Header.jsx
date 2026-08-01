import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { Logo } from './Logo'
import { LanguageToggle } from './LanguageToggle'
import { MobileNav } from './MobileNav'
import { NavDropdown } from './NavDropdown'

const ABOUT_GROUP = [
  ['about', '/about'],
  ['approach', '/approach'],
]
const SERVICES_GROUP = [
  ['services', '/services'],
  ['fees', '/fees'],
]
const LEARN_GROUP = [
  ['faq', '/faq'],
  ['blog', '/blog'],
  ['testimonials', '/testimonials'],
  ['resources', '/resources'],
]

const linkBase =
  'relative shrink-0 whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-300 xl:px-4'

function navLinkClassName({ isActive }) {
  return [
    linkBase,
    isActive
      ? 'bg-lavender-soft text-ink'
      : 'text-ink/60 hover:bg-lavender-soft hover:text-ink',
  ].join(' ')
}

export function Header() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const itemLabel = (key) => t(`common.nav.${key}`)

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-[box-shadow,border-color] duration-300 ${
        scrolled
          ? 'bg-sand/95 border-ink/5 shadow-[0_4px_24px_rgba(122,107,168,0.07)]'
          : 'bg-sand/80 border-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[100rem] items-center gap-4 px-6 transition-[padding] duration-300 lg:px-8 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <NavLink
          to="/"
          aria-label="Anfa Counselling & Psychotherapy home"
          className="shrink-0 transition-transform duration-300 hover:scale-[1.02]"
        >
          <Logo variant="full-color" className="hidden h-16 lg:block xl:h-24" />
          <Logo variant="compact" className="lg:hidden h-14" />
        </NavLink>
        <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
          <NavLink to="/" end className={navLinkClassName}>
            {t('common.nav.home')}
          </NavLink>
          <NavDropdown label={t('common.nav.about')} items={ABOUT_GROUP} linkBase={linkBase} itemLabel={itemLabel} />
          <NavDropdown label={t('common.nav.services')} items={SERVICES_GROUP} linkBase={linkBase} itemLabel={itemLabel} />
          <NavDropdown label={t('common.nav.learnMore')} items={LEARN_GROUP} linkBase={linkBase} itemLabel={itemLabel} />
          <NavLink to="/contact" className={navLinkClassName}>
            {t('common.nav.contact')}
          </NavLink>
        </nav>
        <div className="hidden shrink-0 items-center lg:flex">
          <LanguageToggle />
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
