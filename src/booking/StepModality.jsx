import { useTranslation } from '../i18n/useTranslation'

export function StepModality({ value, onSelect }) {
  const { t } = useTranslation()
  return (
    <fieldset>
      <legend className="font-display text-2xl mb-4">{t('booking.step2.heading')}</legend>
      <div className="flex gap-3">
        {['inPerson', 'online'].map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={value === m}
            onClick={() => onSelect(m)}
            className={`rounded-xl border px-6 py-3 ${value === m ? 'border-sea bg-mist' : 'border-mist'}`}
          >
            {t(`booking.step2.${m}`)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
