import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { conditions } from '../content/conditions'
import { SparkleIcon, CompassIcon, LeafIcon, HeartIcon, ShieldIcon, ClockIcon, PuzzleIcon, PaletteIcon } from '../components/icons'

const ICONS = {
  anxiety: SparkleIcon,
  depression: CompassIcon,
  grief: LeafIcon,
  relationships: HeartIcon,
  trauma: ShieldIcon,
  stressBurnout: ClockIcon,
  lifeTransitions: PuzzleIcon,
  childrenTeens: PaletteIcon,
}

export default function WhatWeHelpWith() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="What We Help With" description={t('whatWeHelpWith.intro')} path="/what-we-help-with" />
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="font-display text-4xl mb-2">{t('whatWeHelpWith.heading')}</h1>
        <p className="mb-10 max-w-2xl text-ink/60">{t('whatWeHelpWith.intro')}</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {conditions.map(({ key, treatments }) => {
            const Icon = ICONS[key]
            return (
              <div
                key={key}
                className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-md sm:p-8"
              >
                <div className="mb-4 flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mist text-sea-deep">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2 className="font-display text-xl text-sea-deep">{t(`whatWeHelpWith.items.${key}.title`)}</h2>
                </div>
                <p className="mb-5 text-ink/70">{t(`whatWeHelpWith.items.${key}.description`)}</p>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                    {t('whatWeHelpWith.treatmentsLabel')}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {treatments.map((methodKey) => (
                      <li
                        key={methodKey}
                        className="rounded-full bg-lavender-soft px-3 py-1 text-xs font-semibold text-lavender-ink"
                      >
                        {t(`approach.methods.${methodKey}.title`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
