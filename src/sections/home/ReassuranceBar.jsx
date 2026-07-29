import { useTranslation } from '../../i18n/useTranslation'

const ITEMS = ['modalities', 'languages', 'insurance', 'confidentiality']

export function ReassuranceBar() {
  const { t } = useTranslation()
  return (
    <section className="bg-sea-deep text-sand py-10">
      <div className="mx-auto max-w-6xl px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
        {ITEMS.map((i) => (
          <p key={i} className="text-sm">{t(`home.reassurance.${i}`)}</p>
        ))}
      </div>
    </section>
  )
}
