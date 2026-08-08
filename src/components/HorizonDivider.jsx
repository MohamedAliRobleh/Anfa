import { motion, useReducedMotion } from 'framer-motion'

export function HorizonDivider({ animated = false, className = '' }) {
  const prefersReduced = useReducedMotion()
  const shouldAnimate = animated && !prefersReduced

  return (
    <svg
      role="img"
      aria-label="Rolling waves, a horizon line"
      viewBox="0 0 1200 80"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="horizon-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B0CD8C" />
          <stop offset="100%" stopColor="#DDB067" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0,42 Q100,6 200,42 Q300,74 400,42 Q500,6 600,42 Q700,74 800,42 Q900,6 1000,42 Q1100,74 1200,42 L1200,80 L0,80 Z"
        fill="url(#horizon-gradient)"
        initial={shouldAnimate ? { x: -20, opacity: 0 } : false}
        animate={shouldAnimate ? { x: 0, opacity: 1 } : false}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}
