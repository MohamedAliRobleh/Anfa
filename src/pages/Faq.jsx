import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Accordion } from '../components/Accordion'
import { faqIds } from '../content/faq'

export default function Faq() {
  const { t } = useTranslation()
  const items = faqIds.map((id) => ({ id, question: t(`faq.items.${id}.question`), answer: t(`faq.items.${id}.answer`) }))
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SEO title="FAQ" description={t('faq.intro')} path="/faq" />
        <h1 className="font-display text-4xl mb-2">{t('faq.heading')}</h1>
        <p className="mb-10 text-ink/60">{t('faq.intro')}</p>
        <Accordion items={items} />
      </div>
    </div>
  )
}
