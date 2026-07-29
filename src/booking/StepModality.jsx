import { useTranslation } from '../i18n/useTranslation'
import { CheckIcon, PinIcon, MonitorIcon } from '../components/icons'

const MODALITIES = [
  { key: 'inPerson', icon: PinIcon },
  { key: 'online', icon: MonitorIcon },
]

export function StepModality({ value, onSelect }) {
  const { t } = useTranslation()
  return (
    <fieldset>
      <legend className="font-display text-2xl text-sea-deep mb-5">{t('booking.step2.heading')}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {MODALITIES.map(({ key, icon: Icon }) => {
          const selected = value === key
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(key)}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                selected
                  ? 'border-sea-deep bg-mist/60 shadow-md'
                  : 'border-ink/10 bg-white shadow-sm hover:border-sea-deep/30 hover:bg-mist/30'
              }`}
            >
              {selected && (
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-sea-deep text-sand">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-deep/10 text-sea-deep">
                <Icon className="h-6 w-6" />
              </span>
              <span className="font-display text-lg text-sea-deep">{t(`booking.step2.${key}`)}</span>
              <span className="text-sm text-ink/55">{t(`booking.step2.${key}Helper`)}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
