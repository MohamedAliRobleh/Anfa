import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { SEO, businessJsonLd } from '../components/SEO'
import { ContactForm } from '../components/ContactForm'
import { PinIcon, PhoneIcon, MailIcon, ClockIcon, ExternalLinkIcon } from '../components/icons'
import { MAPS_EMBED_URL, MAPS_DIRECTIONS_URL } from '../lib/location'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Contact" description="Contact Anfa Counselling & Psychotherapy in Ottawa." path="/contact" jsonLd={businessJsonLd()} />
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="font-display text-3xl text-sea-deep mb-2 md:text-4xl">{t('contact.title')}</h1>
        <p className="mb-10 max-w-2xl text-ink/60">{t('contact.subtitle')}</p>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
            <ul className="space-y-4 text-ink/80">
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-sea-deep" />
                <span>{t('contact.address')}</span>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-sea-deep" />
                <a href="tel:+16137910284" className="hover:underline">(613) 791-0284</a>
              </li>
              <li className="flex items-start gap-3">
                <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-sea-deep" />
                <a href="mailto:sahrasaid845@gmail.com" className="hover:underline">sahrasaid845@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-sea-deep" />
                <span>{t('contact.hours')}</span>
              </li>
            </ul>

            <div className="mt-8 rounded-2xl bg-mist/50 p-5">
              <p className="font-display text-lg text-sea-deep mb-3">{t('contact.preferTalk')}</p>
              <NavLink
                to="/booking"
                className="inline-flex items-center rounded-full bg-sunlit px-5 py-2.5 text-sm font-semibold text-ink shadow-[0_2px_10px_rgba(221,176,103,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(221,176,103,0.45)]"
              >
                {t('common.cta.bookFree')}
              </NavLink>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
            <ContactForm />
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-3xl shadow-[0_25px_60px_-20px_rgba(122,107,168,0.25)] ring-1 ring-ink/5">
          <iframe
            title="Map to 2487 Kaladar Avenue, Ottawa"
            src={MAPS_EMBED_URL}
            className="h-72 w-full border-0 md:h-96"
            loading="lazy"
          />
          <a
            href={MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-sea-deep shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <PinIcon className="h-4 w-4" />
            {t('common.cta.getDirections')}
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
