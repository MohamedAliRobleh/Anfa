import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Card({ title, description, ctaLabel, ctaTo, image, accent }) {
  const prefersReduced = useReducedMotion()
  const isLavender = accent === 'lavender'
  return (
    <motion.div
      whileHover={prefersReduced ? {} : { y: -6 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl shadow-sm overflow-hidden flex flex-col ${
        isLavender ? 'bg-lavender-soft ring-1 ring-lavender/40' : 'bg-white'
      }`}
    >
      {image && <img src={image} alt="" loading="lazy" className="h-40 w-full object-cover" />}
      <div className="p-5 flex flex-col flex-1">
        <h3 className={`font-display text-xl mb-2 ${isLavender ? 'text-lavender-ink' : ''}`}>{title}</h3>
        <p className="text-sm flex-1">{description}</p>
        {ctaTo && (
          <Link
            to={ctaTo}
            className={`mt-4 font-semibold hover:underline ${isLavender ? 'text-lavender-ink' : 'text-sea'}`}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </motion.div>
  )
}
