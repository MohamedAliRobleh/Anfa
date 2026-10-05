import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { PhoneIcon, ExternalLinkIcon } from '../components/icons'
import { LINKS, GUIDE_LINKS } from '../content/resourceLinks'

const CALLS = [
  { tel: '911', labelKey: 'call911Label', descKey: 'call911Desc' },
  { tel: '988', labelKey: 'callCrisisLabel', descKey: 'callCrisisDesc' },
  { tel: '+16132383311', labelKey: 'callDistressLabel', descKey: 'callDistressDesc' },
]

export default function Emergency() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Emergency Support" description={t('emergency.intro')} path="/emergency" />
      <div className="mx-auto max-w-3xl px-4">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sunlit/20 text-sea-deep">
          <PhoneIcon className="h-6 w-6" />
        </span>
        <h1 className="font-display text-4xl mb-2">{t('emergency.heading')}</h1>
        <p className="mb-8 text-ink/60">{t('emergency.intro')}</p>

        <div className="grid gap-4 sm:grid-cols-3">
          {CALLS.map(({ tel, labelKey, descKey }) => (
            <a
              key={tel}
              href={`tel:${tel}`}
              className="flex flex-col rounded-2xl border-2 border-sunlit bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <span className="mb-1 font-display text-xl text-sea-deep">{t(`emergency.${labelKey}`)}</span>
              <span className="text-sm text-ink/70">{t(`emergency.${descKey}`)}</span>
            </a>
          ))}
        </div>

        <div className="mb-8 mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
          <p className="text-ink/80">{t('resources.body')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {LINKS.map(({ name, url }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-md"
            >
              <span className="font-semibold text-sea-deep">{name}</span>
              <ExternalLinkIcon className="h-4 w-4 shrink-0 text-ink/40 transition-colors duration-300 group-hover:text-sea-deep" />
            </a>
          ))}
        </div>

        <h2 className="font-display text-2xl mb-2 mt-14">{t('resources.guideHeading')}</h2>
        <p className="mb-6 text-ink/60">{t('resources.guideIntro')}</p>

        <div className="divide-y divide-ink/5 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/5">
          {GUIDE_LINKS.map(({ name, url, description }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-3 p-5 transition-colors duration-300 hover:bg-mist/40 sm:p-6"
            >
              <div>
                <p className="font-semibold text-sea-deep">{name}</p>
                <p className="mt-1 text-sm text-ink/70">{description}</p>
              </div>
              <ExternalLinkIcon className="mt-1 h-4 w-4 shrink-0 text-ink/40 transition-colors duration-300 group-hover:text-sea-deep" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
