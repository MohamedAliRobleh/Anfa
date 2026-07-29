import { useTranslation } from '../i18n/useTranslation'
import { SEO, businessJsonLd } from '../components/SEO'
import { ContactForm } from '../components/ContactForm'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 grid gap-10 md:grid-cols-2">
      <SEO title="Contact" description="Contact Anfa Counselling & Psychotherapy in Ottawa." path="/contact" jsonLd={businessJsonLd()} />
      <div>
        <h1 className="font-display text-3xl mb-4">{t('contact.title')}</h1>
        <p>{t('contact.address')}</p>
        <a href="tel:+16137910284" className="block mt-2 text-sea hover:underline">(613) 791-0284</a>
        <a href="mailto:sahrasaid845@gmail.com" className="block text-sea hover:underline">sahrasaid845@gmail.com</a>
        <p className="mt-4">{t('contact.hours')}</p>
        <iframe
          title="Map to 2487 Kaladar Avenue, Ottawa"
          src="https://www.google.com/maps?q=2487+Kaladar+Avenue,+Ottawa,+ON+K1V&output=embed"
          className="w-full h-64 mt-6 rounded-xl border-0"
          loading="lazy"
        />
      </div>
      <ContactForm />
    </div>
  )
}
