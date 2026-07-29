import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { BrainIcon, BookIcon, HeartIcon, LeafIcon, PaletteIcon, PuzzleIcon, CompassIcon, GlobeIcon } from '../components/icons'

const METHODS = [
  ['cbt', BrainIcon],
  ['narrative', BookIcon],
  ['act', HeartIcon],
  ['mindfulness', LeafIcon],
  ['artTherapy', PaletteIcon],
  ['playTherapy', PuzzleIcon],
  ['motivational', CompassIcon],
  ['culturallySensitive', GlobeIcon],
]

export default function Approach() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Approach" description={t('approach.intro')} path="/approach" />
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="font-display text-4xl mb-2">{t('approach.heading')}</h1>
        <p className="mb-10 max-w-2xl text-ink/60">{t('approach.intro')}</p>

        <div className="mb-12 grid gap-5 sm:grid-cols-2">
          {METHODS.map(([key, Icon]) => (
            <div
              key={key}
              className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-sea-deep">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg mb-1">{t(`approach.methods.${key}.title`)}</h3>
                <p className="text-sm text-ink/70">{t(`approach.methods.${key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
          <h2 className="font-display text-2xl mb-3">{t('approach.firstSessionHeading')}</h2>
          <p className="text-ink/80">{t('approach.firstSession')}</p>
        </div>
      </div>
    </div>
  )
}
