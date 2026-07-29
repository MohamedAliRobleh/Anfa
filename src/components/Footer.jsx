import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { Logo } from './Logo'
import { CrisisResourceStrip } from './CrisisResourceStrip'
import { PinIcon, PhoneIcon, MailIcon, ClockIcon, FacebookIcon, ExternalLinkIcon } from './icons'
import { MAPS_DIRECTIONS_URL } from '../lib/location'

const ABOUT_LINKS = [
  ['about', '/about'],
  ['approach', '/approach'],
  ['services', '/services'],
  ['fees', '/fees'],
]
const LEARN_LINKS = [
  ['faq', '/faq'],
  ['blog', '/blog'],
  ['testimonials', '/testimonials'],
  ['resources', '/resources'],
]

const linkClass = 'text-sand/80 transition-colors duration-300 hover:text-sunlit'
const columnHeadingClass = 'mb-4 text-xs font-semibold uppercase tracking-wide text-sand/45'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="relative bg-sea-deep text-sand">
      <svg
        role="img"
        aria-label="Mountain ridge meeting the sea, a horizon line"
        viewBox="0 0 1200 80"
        className="h-8 w-full md:h-10"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="footer-horizon-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14A69C" />
            <stop offset="100%" stopColor="#DDB067" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 L150,20 L300,55 Q450,10 600,50 T900,45 Q1050,15 1200,55 L1200,80 L0,80 Z"
          fill="url(#footer-horizon-gradient)"
        />
      </svg>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
        <div className="sm:col-span-2 md:col-span-1">
          <Logo variant="color-on-dark" className="h-14 mb-4" />
          <p className="mb-5 italic text-sand/80">{t('common.tagline')}</p>
          <div className="flex gap-3">
            {/* FUTURE: replace # with the practice's real Facebook and Psychology Today profile URLs once provided */}
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/10 transition-colors duration-300 hover:bg-sunlit hover:text-ink"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Psychology Today"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/10 transition-colors duration-300 hover:bg-sunlit hover:text-ink"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className={columnHeadingClass}>{t('common.nav.about')}</p>
          <ul className="space-y-2.5 text-sm">
            {ABOUT_LINKS.map(([key, path]) => (
              <li key={path}>
                <NavLink to={path} className={linkClass}>{t(`common.nav.${key}`)}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={columnHeadingClass}>{t('common.nav.learnMore')}</p>
          <ul className="space-y-2.5 text-sm">
            {LEARN_LINKS.map(([key, path]) => (
              <li key={path}>
                <NavLink to={path} className={linkClass}>{t(`common.nav.${key}`)}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={columnHeadingClass}>{t('common.nav.contact')}</p>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-start gap-2 ${linkClass}`}
              >
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sunlit" />
                <span>{t('common.footer.address')}</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 shrink-0 text-sunlit" />
              <a href="tel:+16137910284" className={linkClass}>(613) 791-0284</a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 shrink-0 text-sunlit" />
              <a href="mailto:sahrasaid845@gmail.com" className={linkClass}>sahrasaid845@gmail.com</a>
            </li>
            <li className="flex items-start gap-2 text-sand/60">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-sunlit" />
              <span>{t('contact.hours')}</span>
            </li>
          </ul>
          <NavLink
            to="/booking"
            className="mt-5 inline-flex rounded-full bg-sunlit px-5 py-2.5 text-sm font-semibold text-ink shadow-[0_2px_10px_rgba(221,176,103,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(221,176,103,0.45)]"
          >
            {t('common.cta.bookFree')}
          </NavLink>
        </div>
      </div>

      <div className="border-t border-sand/10">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-3 px-4 py-6 text-xs text-sand/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Anfa Counselling & Psychotherapy. {t('common.footer.rights')}</p>
          <NavLink to="/privacy" className="transition-colors duration-300 hover:text-sunlit">
            {t('common.footer.privacy')}
          </NavLink>
        </div>
      </div>

      <CrisisResourceStrip />
    </footer>
  )
}
