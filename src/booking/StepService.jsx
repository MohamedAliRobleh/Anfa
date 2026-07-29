import { useTranslation } from '../i18n/useTranslation'
import { services } from '../content/services'
import { CheckIcon, SparkleIcon } from '../components/icons'

export function StepService({ value, onSelect }) {
  const { t } = useTranslation()
  return (
    <fieldset>
      <legend className="font-display text-2xl text-sea-deep mb-5">{t('booking.step1.heading')}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map(({ key, image }) => {
          const selected = value === key
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(key)}
              className={`group relative overflow-hidden rounded-2xl bg-white text-left transition-all duration-300 ${
                selected
                  ? 'shadow-lg ring-2 ring-sea-deep'
                  : 'shadow-sm ring-1 ring-ink/10 hover:shadow-md hover:ring-sea-deep/30'
              }`}
            >
              <div className="relative h-28 w-full overflow-hidden">
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                {selected && (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-sea-deep text-sand">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <p className="font-display p-4 text-lg text-sea-deep">{t(`booking.step1.${key}`)}</p>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        aria-pressed={value === 'freeConsult'}
        onClick={() => onSelect('freeConsult')}
        className={`mt-4 flex w-full items-center gap-4 rounded-2xl border-2 border-dashed p-5 text-left transition-all duration-300 ${
          value === 'freeConsult'
            ? 'border-sea-deep bg-mist/60'
            : 'border-sunlit/50 bg-sunlit/10 hover:border-sunlit hover:bg-sunlit/20'
        }`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sunlit/30 text-sea-deep">
          <SparkleIcon className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-lg text-sea-deep">{t('booking.step1.freeConsult')}</span>
          <span className="block text-sm text-ink/60">{t('booking.step1.noCommitment')}</span>
        </span>
        {value === 'freeConsult' && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sea-deep text-sand">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    </fieldset>
  )
}
