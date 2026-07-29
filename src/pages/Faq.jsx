import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Accordion } from '../components/Accordion'
import { faqIds } from '../content/faq'

export default function Faq() {
  const { t } = useTranslation()
  const items = faqIds.map((id) => ({ id, question: t(`faq.items.${id}.question`), answer: t(`faq.items.${id}.answer`) }))
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="FAQ" description={t('faq.intro')} path="/faq" />
      <h1 className="font-display text-4xl mb-8">{t('faq.heading')}</h1>
      <Accordion items={items} />
    </div>
  )
}
