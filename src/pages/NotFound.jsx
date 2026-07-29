import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-4">404</h1>
      <p className="mb-6">{t('notFound.body')}</p>
      <Link to="/" className="text-sea font-semibold hover:underline">{t('common.nav.home')}</Link>
    </div>
  )
}
