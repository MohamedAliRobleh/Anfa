import { SEO } from '../components/SEO'
import { BookingWizard } from '../booking/BookingWizard'

export default function Booking() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="Booking" description="Book a free 15-minute consultation or a session with Anfa Counselling & Psychotherapy in Ottawa." path="/booking" />
      <BookingWizard />
    </div>
  )
}
