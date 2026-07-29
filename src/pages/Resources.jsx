import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { CrisisResourceStrip } from '../components/CrisisResourceStrip'
import { ExternalLinkIcon } from '../components/icons'

const LINKS = [
  { name: 'Canadian Mental Health Association', url: 'https://cmha.ca' },
  { name: 'ConnexOntario', url: 'https://www.connexontario.ca' },
  { name: 'Kids Help Phone', url: 'https://kidshelpphone.ca' },
]

export default function Resources() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Resources" description={t('resources.intro')} path="/resources" />
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-display text-4xl mb-2">{t('resources.heading')}</h1>
        <p className="mb-8 text-ink/60">{t('resources.intro')}</p>

        <div className="mb-8 overflow-hidden rounded-2xl border-2 border-sunlit">
          <CrisisResourceStrip />
        </div>

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
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
      </div>
    </div>
  )
}
