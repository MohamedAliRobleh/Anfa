import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'
import { HorizonDivider } from '../../components/HorizonDivider'

export function Hero() {
  const { t } = useTranslation()
  const prefersReduced = useReducedMotion()
  return (
    <section className="relative h-[85vh] min-h-[560px] flex items-end overflow-hidden">
      <motion.img
        src="/img/hero-mountain-sea.webp"
        alt="Misty mountain meeting a turquoise sea at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
        initial={prefersReduced ? false : { scale: 1.08 }}
        animate={prefersReduced ? false : { scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-20 text-sand">
        <h1 className="font-display text-sand text-4xl md:text-5xl mb-4">{t('home.hero.title')}</h1>
        <p className="text-lg mb-8">{t('home.hero.subtitle')}</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/booking" className="rounded-full bg-sunlit text-ink px-6 py-3 font-semibold">{t('common.cta.bookFree')}</Link>
          <Link to="/services" className="rounded-full border border-sand px-6 py-3 font-semibold">{t('common.cta.discoverServices')}</Link>
        </div>
      </div>
      <HorizonDivider animated className="absolute bottom-0 left-0 right-0 w-full h-16" />
    </section>
  )
}
