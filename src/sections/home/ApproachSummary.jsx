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
    <section className="bg-lavender-wash py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-display text-4xl text-sea-deep mb-12 text-center">{t('home.approachSummary.heading')}</h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {APPROACHES.map(([key, Icon]) => (
            <li
              key={key}
              className="flex gap-5 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-md sm:p-8"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mist text-sea-deep">
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <h3 className="font-display text-xl text-sea-deep mb-2">{t(`home.approachSummary.${key}.title`)}</h3>
                <p className="text-base text-ink/70">{t(`home.approachSummary.${key}.description`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
