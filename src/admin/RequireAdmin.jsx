import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthProvider'

export function RequireAdmin({ children }) {
  const { status } = useAdminAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink/60">
        Chargement…
      </div>
    )
  }

  if (status === 'signed-out') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (status === 'not-admin') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl mb-3 text-sea-deep">Accès refusé</h1>
        <p className="text-ink/70">
          Ce compte n'a pas accès à l'administration du site. Contactez la personne responsable du site pour obtenir l'accès.
        </p>
      </div>
    )
  }

  return children
}
