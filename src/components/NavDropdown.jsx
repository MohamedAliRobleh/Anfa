import { useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function ChevronIcon({ open }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
      className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NavDropdown({ label, items, linkBase, itemLabel }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(null)
  const { pathname } = useLocation()
  const isActive = items.some(([, path]) => pathname === path)

  function openNow() {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={[
          linkBase,
          'inline-flex items-center gap-1',
          isActive
            ? 'bg-lavender-soft text-sea-deep'
            : 'text-ink/60 hover:bg-lavender-soft hover:text-sea-deep',
        ].join(' ')}
      >
        {label}
        <ChevronIcon open={open} />
      </button>
      <div
        className={`absolute left-1/2 top-full z-10 mt-3 w-52 -translate-x-1/2 rounded-2xl bg-white p-2 shadow-[0_16px_40px_-12px_rgba(122,107,168,0.25)] ring-1 ring-ink/10 transition-all duration-200 ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        {items.map(([key, path]) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setOpen(false)}
            className={({ isActive: itemActive }) =>
              `block rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                itemActive ? 'bg-mist/70 text-sea-deep' : 'text-ink/70 hover:bg-mist/50 hover:text-sea-deep'
              }`
            }
          >
            {itemLabel(key)}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
