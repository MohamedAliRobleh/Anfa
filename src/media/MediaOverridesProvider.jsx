import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMediaOverrides } from '../lib/mediaOverrides'

const MediaOverridesContext = createContext(null)

// Mount once, near the root of the real app (see src/App.jsx). Not mounted
// by component-level tests — useMedia() then always returns the built-in
// default image, with no network call.
export function MediaOverridesProvider({ children }) {
  const [overrides, setOverrides] = useState({})

  const refresh = useCallback(() => {
    fetchMediaOverrides().then(setOverrides)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => ({ overrides, refresh }), [overrides, refresh])

  return <MediaOverridesContext.Provider value={value}>{children}</MediaOverridesContext.Provider>
}

export function useMediaOverridesContext() {
  return useContext(MediaOverridesContext)
}

// Use in any component that renders a replaceable image:
//   const src = useMedia('home.intro.portrait', '/img/sahra-portrait.webp')
// Falls back to defaultUrl when there's no override, no provider mounted
// (tests), or the admin hasn't set that slot yet.
export function useMedia(slotKey, defaultUrl) {
  const ctx = useMediaOverridesContext()
  return ctx?.overrides?.[slotKey]?.url || defaultUrl
}
