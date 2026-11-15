import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { isCurrentUserAdmin } from '../lib/adminAuth'

const AdminAuthContext = createContext(null)

// 'loading' | 'signed-out' | 'signed-in' | 'not-admin'
// 'not-admin' means: a valid Supabase session exists, but that account is
// not in admin_profiles — distinct from signed-out so RequireAdmin can show
// a clear "access denied" message instead of silently bouncing to login.
export function AdminAuthProvider({ children }) {
  const [status, setStatus] = useState('loading')
  const [session, setSession] = useState(null)

  const evaluate = useCallback(async (nextSession) => {
    setSession(nextSession)
    if (!nextSession) {
      setStatus('signed-out')
      return
    }
    const admin = await isCurrentUserAdmin()
    setStatus(admin ? 'signed-in' : 'not-admin')
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => evaluate(data.session))
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      evaluate(nextSession)
    })
    return () => subscription.subscription.unsubscribe()
  }, [evaluate])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = useMemo(() => ({ status, session, signOut }), [status, session, signOut])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
