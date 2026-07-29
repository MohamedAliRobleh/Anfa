import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Card({ title, description, ctaLabel, ctaTo, image }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      whileHover={prefersReduced ? {} : { y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col"
    >
      {image && <img src={image} alt="" loading="lazy" className="h-40 w-full object-cover" />}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl mb-2">{title}</h3>
        <p className="text-sm flex-1">{description}</p>
        {ctaTo && <Link to={ctaTo} className="mt-4 text-sea font-semibold hover:underline">{ctaLabel}</Link>}
      </div>
    </motion.div>
  )
}
