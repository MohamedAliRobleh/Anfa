import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'
import { HorizonDivider } from '../../components/HorizonDivider'

const SLIDES = [
  { src: '/img/hero-mountain-sea.webp', alt: 'Misty mountain meeting a turquoise sea at golden hour' },
  { src: '/img/hero-mountain-stream.webp', alt: 'A snow-capped mountain valley with a clear alpine stream and spring wildflowers' },
  { src: '/img/hero-forest-path.webp', alt: 'A sunlit winding path through a green forest meadow' },
]
const SLIDE_DURATION = 7000

export function Hero() {
  const { t } = useTranslation()
  const prefersReduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReduced) return
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_DURATION)
    return () => clearInterval(id)
  }, [prefersReduced])

  const current = SLIDES[prefersReduced ? 0 : index]

  return (
    <section className="relative h-[78vh] min-h-[540px] flex items-end overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={current.src}
          src={current.src}
          alt={current.alt}
          className="absolute inset-0 h-full w-full object-cover"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-[100rem] px-6 pb-16 text-sand sm:pb-20 lg:px-8">
        <div className="inline-block max-w-sm rounded-2xl bg-ink/60 px-5 py-5 shadow-[0_16px_36px_-16px_rgba(0,0,0,0.55)] ring-1 ring-sand/30 backdrop-blur-sm sm:max-w-md sm:px-6 sm:py-6">
          <h1 className="font-display text-sand text-2xl sm:text-3xl lg:text-4xl leading-[1.15] mb-3">
            {t('home.hero.title')}
          </h1>
          <p className="text-sm sm:text-base mb-5 text-sand/95">{t('home.hero.subtitle')}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/booking" className="rounded-full bg-sunlit hover:bg-sea-deep text-sand transition-colors duration-300 px-5 py-2.5 font-semibold shadow-[0_10px_28px_-10px_rgba(0,0,0,0.55)]">{t('common.cta.bookFree')}</Link>
            <Link to="/services" className="rounded-full border border-sand px-5 py-2.5 font-semibold text-sand transition-colors duration-300 hover:bg-sand/10">{t('common.cta.discoverServices')}</Link>
          </div>
        </div>
      </div>
      <HorizonDivider animated className="absolute bottom-0 left-0 right-0 w-full h-16" />
    </section>
  )
}
