import { useTranslation } from '../i18n/useTranslation'

const SERVICES = ['individual', 'couple', 'group', 'spiritual', 'freeConsult']

export function StepService({ value, onSelect }) {
  const { t } = useTranslation()
  return (
    <fieldset>
      <legend className="font-display text-2xl mb-4">{t('booking.step1.heading')}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={value === s}
            onClick={() => onSelect(s)}
            className={`rounded-xl border p-4 text-left ${value === s ? 'border-sea bg-mist' : 'border-mist'}`}
          >
            {t(`booking.step1.${s}`)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
