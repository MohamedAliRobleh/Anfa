const VARIANT_SRC = {
  'full-color': '/img/anfa-logo-full-color.svg',
  'full-white': '/img/anfa-logo-full-white.svg',
  'full-dark': '/img/anfa-logo-full-dark.svg',
  'color-on-dark': '/img/anfa-logo-color-on-dark.svg',
  compact: '/img/anfa-logo-compact.svg',
}

export function Logo({ variant = 'full-color', className = '' }) {
  return (
    <img
      src={VARIANT_SRC[variant]}
      alt="Anfa Counselling & Psychotherapy"
      className={className}
    />
  )
}
