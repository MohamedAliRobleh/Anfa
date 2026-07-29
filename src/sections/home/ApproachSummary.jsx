import { useTranslation } from '../../i18n/useTranslation'
import { BrainIcon, BookIcon, LeafIcon, PaletteIcon } from '../../components/icons'

const APPROACHES = [
  ['cbt', BrainIcon],
  ['narrative', BookIcon],
  ['mindfulness', LeafIcon],
  ['artTherapy', PaletteIcon],
]

export function ApproachSummary() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <h2 className="font-display text-3xl text-sea-deep mb-10 text-center">{t('home.approachSummary.heading')}</h2>
      <ul className="grid gap-5 sm:grid-cols-2">
        {APPROACHES.map(([key, Icon]) => (
          <li
            key={key}
            className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-sea-deep">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg text-sea-deep mb-1">{t(`home.approachSummary.${key}.title`)}</h3>
              <p className="text-sm text-ink/70">{t(`home.approachSummary.${key}.description`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
