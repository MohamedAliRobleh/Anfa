import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { CrisisResourceStrip } from '../components/CrisisResourceStrip'
import { ExternalLinkIcon } from '../components/icons'

const LINKS = [
  { name: 'Canadian Mental Health Association', url: 'https://cmha.ca' },
  { name: 'ConnexOntario', url: 'https://www.connexontario.ca' },
  { name: 'Kids Help Phone', url: 'https://kidshelpphone.ca' },
]

const GUIDE_LINKS = [
  {
    name: 'Anxiety & Depression Association of America (ADAA)',
    url: 'https://adaa.org/',
    description: 'A nonprofit organization dedicated to the prevention, treatment, and cure of anxiety, depression, and related disorders.',
  },
  {
    name: 'Anxiety Canada',
    url: 'https://www.anxietycanada.com/',
    description: 'Resources and tools to help manage anxiety, including self-help and professional support.',
  },
  {
    name: "Anxiety Research & Treatment Clinic (ATRC), St. Joseph's Healthcare Hamilton",
    url: 'https://www.stjoes.ca/hospital-services/mental-health-addiction-services/mental-health-services/anxiety-treatment-research-clinic-atrc',
    description: 'Specializes in research and treatment for anxiety and related disorders.',
  },
  {
    name: 'Association for Behavioral & Cognitive Therapies (ABCT)',
    url: 'https://www.abct.org/',
    description: 'A multidisciplinary organization focused on the advancement of cognitive and behavioral therapies.',
  },
  {
    name: 'BounceBack Ontario',
    url: 'https://bouncebackontario.ca/',
    description: 'Guided self-help programs for managing low mood, mild to moderate depression, and anxiety.',
  },
  {
    name: 'Canadian Association of Cognitive & Behavioural Therapies (CACBT)',
    url: 'https://www.cacbt.ca/',
    description: 'A national organization promoting cognitive and behavioural therapies in Canada.',
  },
  {
    name: 'Distress and Crisis Ontario',
    url: 'https://www.dcontario.org/',
    description: '24/7 support through a network of Distress Centres for depression, suicidal ideation, and other acute mental health challenges.',
  },
  {
    name: 'EMDR International Association (EMDRIA)',
    url: 'https://www.emdria.org/',
    description: 'Information and resources on Eye Movement Desensitization and Reprocessing (EMDR) therapy.',
  },
  {
    name: 'eMentalHealth.ca',
    url: 'https://www.ementalhealth.ca/',
    description: 'Information, services, and resources for mental health across Canada.',
  },
  {
    name: 'International OCD Foundation (IOCDF)',
    url: 'https://iocdf.org/',
    description: 'A nonprofit organization helping those affected by obsessive-compulsive disorder (OCD) and related disorders.',
  },
  {
    name: 'Mood Disorders Ottawa',
    url: 'http://www.mooddisordersottawa.ca/',
    description: 'A peer-run volunteer organization supporting individuals with mood disorders.',
  },
  {
    name: 'OCD Ottawa',
    url: 'https://ocdottawa.com/',
    description: 'A community-based support group for individuals affected by OCD.',
  },
  {
    name: 'Ontario Structured Psychotherapy (OSP)',
    url: 'https://www.ontariostructuredpsychotherapy.ca/',
    description: 'Free cognitive behavioural therapy (CBT) services for depression and anxiety across Ontario.',
  },
  {
    name: 'Sexual Assault Support Centre of Ottawa',
    url: 'http://sascottawa.com/',
    description: 'Support services for survivors of sexual assault and sexual violence.',
  },
  {
    name: 'The Counselling Group (Jewish Family Services)',
    url: 'https://thecounsellinggroup.com/',
    description: 'A wide range of counselling services in Ottawa, including individual, family, and group therapy.',
  },
  {
    name: 'Toronto Rape Crisis Centre',
    url: 'https://trccmwar.ca/',
    description: 'Crisis intervention and support services for survivors of sexual assault and violence.',
  },
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
