import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n/useTranslation'

const KEY = 'anfa-cookie-consent'

export function CookieConsent({ onAccept }) {
  const { t } = useTranslation()
  const [accepted, setAccepted] = useState(() => localStorage.getItem(KEY) === 'accepted')

  useEffect(() => {
    if (accepted) onAccept()
  }, [accepted, onAccept])

  if (accepted) return null

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 inset-x-0 z-50 bg-ink text-sand p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
      <p className="text-sm">{t('common.cookie.text')}</p>
      <button
        onClick={() => { localStorage.setItem(KEY, 'accepted'); setAccepted(true) }}
        className="rounded-full bg-sunlit text-ink px-5 py-2 text-sm font-semibold"
      >
        {t('common.cookie.accept')}
      </button>
    </div>
  )
}
