import { useTranslation } from '../i18n/useTranslation'
import { SEO, businessJsonLd } from '../components/SEO'
import { Hero } from '../sections/home/Hero'
import { IntroSahra } from '../sections/home/IntroSahra'
import { ServicesPreview } from '../sections/home/ServicesPreview'
import { ApproachSummary } from '../sections/home/ApproachSummary'
import { ReassuranceBar } from '../sections/home/ReassuranceBar'
import { TestimonialsPreview } from '../sections/home/TestimonialsPreview'
import { BlogPreview } from '../sections/home/BlogPreview'
import { FinalCta } from '../sections/home/FinalCta'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <SEO title="Home" description={t('home.hero.subtitle')} path="/" jsonLd={businessJsonLd()} />
      <Hero />
      <IntroSahra />
      <ServicesPreview />
      <ApproachSummary />
      <ReassuranceBar />
      <TestimonialsPreview />
      <BlogPreview />
      <FinalCta />
    </div>
  )
}
