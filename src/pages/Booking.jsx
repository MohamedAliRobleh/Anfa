import { SEO } from '../components/SEO'
import { BookingWizard } from '../booking/BookingWizard'

export default function Booking() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-mist/70 via-sand to-sand py-14 md:py-20">
      <SEO
        title="Booking"
        description="Book a free 15-minute consultation or a session with Anfa Counselling & Psychotherapy in Ottawa."
        path="/booking"
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[46rem] -translate-x-1/2 rounded-full bg-sea/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-4">
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_25px_60px_-20px_rgba(11,92,87,0.25)] ring-1 ring-ink/5">
          <div className="h-1.5 bg-gradient-to-r from-sea via-sea-deep to-sunlit" aria-hidden="true" />
          <div className="p-6 sm:p-10 md:p-12">
            <BookingWizard />
          </div>
        </div>
      </div>
    </div>
  )
}
