import { useMedia } from '../media/MediaOverridesProvider'
import { services } from '../content/services'

// `services` (src/content/services.js) is a static, module-level constant
// of fixed length and order, so calling useMedia once per service here is
// safe — the hook call order never changes across renders. Shared by
// src/pages/Services.jsx and src/sections/home/ServicesPreview.jsx so the
// two don't duplicate this resolution logic.
export function useServicesWithMedia() {
  return services.map((s) => ({ ...s, image: useMedia(`services.${s.key}.image`, s.image) }))
}
