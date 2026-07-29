import { createContext, useState, useMemo, useCallback } from 'react'
import en from './en.json'
import fr from './fr.json'

const dictionaries = { en, fr }
export const I18nContext = createContext(null)
const STORAGE_KEY = 'anfa-lang'

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'en'
  )

  const setLang = useCallback((next) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const t = useCallback((key) => {
    const parts = key.split('.')
    let node = dictionaries[lang]
    for (const part of parts) {
      node = node?.[part]
      if (node === undefined) return key
    }
    return typeof node === 'string' ? node : key
  }, [lang])

  const value = useMemo(() => ({ t, lang, setLang }), [t, lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
