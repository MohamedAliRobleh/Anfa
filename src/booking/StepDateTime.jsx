import { useTranslation } from '../i18n/useTranslation'
import { getAvailableSlots } from '../lib/bookingSlots'
import { CalendarIcon, ClockIcon } from '../components/icons'

export function StepDateTime({ date, time, onDateChange, onTimeChange }) {
  const { t } = useTranslation()
  const slots = date ? getAvailableSlots(new Date(date)) : []
  const today = new Date().toISOString().slice(0, 10)

  return (
    <fieldset>
      <legend className="font-display text-2xl text-sea-deep mb-5">{t('booking.step3.heading')}</legend>

      <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-mist/60 px-4 py-2 text-sm text-sea-deep">
        <ClockIcon className="h-4 w-4 shrink-0" />
        {t('contact.hours')}
      </p>

      <label htmlFor="booking-date" className="mb-1.5 block text-sm font-semibold text-ink/70">
        Date
      </label>
      <div className="relative mb-6 max-w-xs">
        <CalendarIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          id="booking-date"
          type="date"
          min={today}
          value={date || ''}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-3 text-ink transition-colors duration-300 focus:border-sea-deep focus:outline-none focus:ring-2 focus:ring-sea-deep/15"
        />
      </div>

      {date && slots.length === 0 && (
        <p role="alert" className="rounded-xl bg-sunlit/15 px-4 py-3 text-sm text-ink/70">
          {t('booking.step3.noSlots')}
        </p>
      )}

      {slots.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              aria-pressed={time === slot}
              onClick={() => onTimeChange(slot)}
              className={`rounded-full border py-2 text-sm font-semibold transition-all duration-200 ${
                time === slot
                  ? 'border-sea-deep bg-sea-deep text-sand'
                  : 'border-ink/15 text-ink/70 hover:border-sea-deep/40 hover:bg-mist/50'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  )
}
