import { useTranslation } from '../i18n/useTranslation'

export function CrisisResourceStrip() {
  const { t } = useTranslation()
  return (
    <div role="note" className="bg-sea-deep/80 text-sand text-xs md:text-sm px-4 py-3 text-center">
      {t('common.crisis.text')}
    </div>
  )
}
