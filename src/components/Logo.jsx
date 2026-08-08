const VARIANT_SRC = {
  icon: '/img/lotus-icon.png',
}

export function Logo({ variant = 'icon', alt = 'Anfa Counselling & Psychotherapy', className = '' }) {
  return (
    <img
      src={VARIANT_SRC[variant]}
      alt={alt}
      className={className}
    />
  )
}
