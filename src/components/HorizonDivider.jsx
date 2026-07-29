import { motion, useReducedMotion } from 'framer-motion'

const GRADIENT_STOPS = {
  default: ['#14A69C', '#DDB067'],
  lavender: ['#14A69C', '#9C8FCB'],
}

export function HorizonDivider({ animated = false, className = '', tone = 'default' }) {
  const prefersReduced = useReducedMotion()
  const shouldAnimate = animated && !prefersReduced
  const gradientId = `horizon-gradient-${tone}`
  const [from, to] = GRADIENT_STOPS[tone] || GRADIENT_STOPS.default

  return (
    <svg
      role="img"
      aria-label="Mountain ridge meeting the sea, a horizon line"
      viewBox="0 0 1200 80"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <motion.path
        d="M0,60 L150,20 L300,55 Q450,10 600,50 T900,45 Q1050,15 1200,55 L1200,80 L0,80 Z"
        fill={`url(#${gradientId})`}
        initial={shouldAnimate ? { x: -20, opacity: 0 } : false}
        animate={shouldAnimate ? { x: 0, opacity: 1 } : false}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}
