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
    <section className="relative h-[75vh] min-h-[480px] flex items-center overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-10 text-sand">
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
