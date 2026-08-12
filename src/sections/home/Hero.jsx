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
      <div className="relative z-10 mx-auto w-full max-w-[100rem] px-6 pb-20 text-sand sm:pb-24 lg:px-8">
        <div className="inline-block max-w-md rounded-2xl bg-ink/35 px-5 py-6 shadow-[0_20px_45px_-18px_rgba(0,0,0,0.55)] ring-1 ring-sand/15 backdrop-blur-md sm:max-w-lg sm:px-7 sm:py-7">
          <h1 className="font-display text-sand text-3xl sm:text-4xl lg:text-5xl leading-[1.1] mb-4 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
            {t('home.hero.title')}
          </h1>
          <p className="text-base sm:text-lg mb-6 text-sand/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">{t('home.hero.subtitle')}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/booking" className="rounded-full bg-sunlit hover:bg-sea-deep text-sand transition-colors duration-300 px-6 py-3 font-semibold shadow-[0_10px_28px_-10px_rgba(0,0,0,0.55)]">{t('common.cta.bookFree')}</Link>
            <Link to="/services" className="rounded-full border border-sand px-6 py-3 font-semibold text-sand transition-colors duration-300 hover:bg-sand/10">{t('common.cta.discoverServices')}</Link>
          </div>
        </div>
      </div>
      <HorizonDivider animated className="absolute bottom-0 left-0 right-0 w-full h-16" />
    </section>
  )
}
