import { useTranslation } from '../i18n/useTranslation'
import { getAvailableSlots } from '../lib/bookingSlots'

export function StepDateTime({ date, time, onDateChange, onTimeChange }) {
  const { t } = useTranslation()
  const slots = date ? getAvailableSlots(new Date(date)) : []

  return (
    <fieldset>
      <legend className="font-display text-2xl mb-4">{t('booking.step3.heading')}</legend>
      <label htmlFor="booking-date" className="block mb-2">Date</label>
      <input
        id="booking-date"
        type="date"
        value={date || ''}
        onChange={(e) => onDateChange(e.target.value)}
        className="border border-mist rounded-lg p-2 mb-4"
      />
      {date && slots.length === 0 && <p role="alert">{t('booking.step3.noSlots')}</p>}
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            aria-pressed={time === slot}
            onClick={() => onTimeChange(slot)}
            className={`rounded-lg border py-2 ${time === slot ? 'border-sea bg-mist' : 'border-mist'}`}
          >
            {slot}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
