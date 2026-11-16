import { NavLink, Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAdminAuth } from './AdminAuthProvider'
import { Logo } from '../components/Logo'

const NAV = [
  { to: '/admin/content', label: 'Site text' },
  { to: '/admin/media', label: 'Images' },
  { to: '/admin/theme', label: 'Colors & fonts' },
]

export function AdminLayout() {
  const { signOut } = useAdminAuth()

  return (
    <div className="min-h-screen bg-lavender-wash">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="flex flex-row items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 md:w-64 md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:px-5 md:py-6">
          <div className="flex items-center gap-2 md:mb-8">
            <Logo variant="icon" className="h-9" />
            <span className="font-display text-sm text-sea-deep">Admin</span>
          </div>
          <nav className="flex gap-2 md:flex-col md:gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'bg-lavender-soft text-ink' : 'text-ink/60 hover:bg-lavender-soft/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 md:mt-10 md:border-t md:border-ink/10 md:pt-6">
            <a href="/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-sea-deep hover:underline">
              View site →
            </a>
            <button type="button" onClick={signOut} className="text-left text-sm font-semibold text-ink/50 hover:text-ink">
              Sign out
            </button>
          </div>
        </aside>
        <main className="flex-1 px-4 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
