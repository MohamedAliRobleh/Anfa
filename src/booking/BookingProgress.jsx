import { useTranslation } from '../i18n/useTranslation'

const STEPS = ['service', 'modality', 'datetime', 'details']

export function BookingProgress({ current }) {
  const { t } = useTranslation()
  return (
    <div className="mb-10">
      <ol className="mb-3 flex justify-between gap-2">
        {STEPS.map((key, i) => {
          const num = i + 1
          const reached = num <= current
          return (
            <li
              key={key}
              className={`text-[11px] font-semibold uppercase tracking-wide transition-colors duration-300 ${
                reached ? 'text-sea-deep' : 'text-ink/35'
              } ${num === 1 ? 'text-left' : num === STEPS.length ? 'text-right' : 'text-center'} flex-1`}
            >
              {t(`booking.progress.${key}`)}
            </li>
          )
        })}
      </ol>
      <div className="flex gap-2" role="presentation">
        {STEPS.map((key, i) => {
          const num = i + 1
          return (
            <span
              key={key}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                num <= current ? 'bg-sea-deep' : 'bg-ink/10'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
