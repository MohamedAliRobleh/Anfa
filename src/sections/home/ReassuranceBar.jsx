import { useTranslation } from '../../i18n/useTranslation'
import { PinIcon, GlobeIcon, ReceiptIcon, ShieldIcon } from '../../components/icons'

const ITEMS = [
  ['modalities', PinIcon],
  ['languages', GlobeIcon],
  ['insurance', ReceiptIcon],
  ['confidentiality', ShieldIcon],
]

export function ReassuranceBar() {
  const { t } = useTranslation()
  return (
    <section className="bg-sea-deep py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 text-center sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(([key, Icon]) => (
          <div key={key} className="flex flex-col items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sand/10 text-sand">
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-sm text-sand/85">{t(`home.reassurance.${key}`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
