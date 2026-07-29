import { useTranslation } from '../../i18n/useTranslation'

const APPROACHES = ['cbt', 'narrative', 'mindfulness', 'artTherapy']

export function ApproachSummary() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="font-display text-3xl mb-8 text-center">{t('home.approachSummary.heading')}</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {APPROACHES.map((a) => (
          <li key={a} className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="font-display text-lg mb-1">{t(`home.approachSummary.${a}.title`)}</h3>
            <p className="text-sm">{t(`home.approachSummary.${a}.description`)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
