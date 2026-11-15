import { useMedia } from '../media/MediaOverridesProvider'

const VARIANT_SRC = {
  icon: '/img/lotus-icon.png',
}

export function Logo({ variant = 'icon', alt = 'Anfa Counselling & Psychotherapy', className = '' }) {
  const src = useMedia('site.logo', VARIANT_SRC[variant])
  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  )
}
