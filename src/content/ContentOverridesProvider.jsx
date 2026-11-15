import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { fetchContentOverrides } from '../lib/contentOverrides'

const ContentOverridesContext = createContext(null)

// Mount once, near the root of the real app (see src/App.jsx). Deliberately
// NOT mounted by page-level tests, which render pages wrapped only in
// <I18nProvider> — useContentOverrides() then returns null and every page
// renders its built-in default text, with no network call and no behavior
// change for the existing test suite.
export function ContentOverridesProvider({ children }) {
  const [overrides, setOverrides] = useState({})

  const refresh = useCallback(() => {
    fetchContentOverrides().then(setOverrides)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => ({ overrides, refresh }), [overrides, refresh])

  return <ContentOverridesContext.Provider value={value}>{children}</ContentOverridesContext.Provider>
}

// Safe to call outside the provider (returns null) — consumers must treat a
// null result as "no overrides available".
export function useContentOverrides() {
  return useContext(ContentOverridesContext)
}
