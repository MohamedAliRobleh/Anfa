import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { Logo } from '../../components/Logo'

const LOCKOUT_KEY = 'anfa-admin-login-attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000

// Client-side lockout is a UX courtesy (fast, friendly feedback) — it is
// not the real defense against brute-forcing, since localStorage is easy to
// clear. The real defense is Supabase Auth's own server-side rate limiting
// on sign-in attempts, which applies regardless of what the browser does.
function getAttemptState() {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY)
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 }
  } catch {
    return { count: 0, lockedUntil: 0 }
  }
}

function setAttemptState(state) {
  try {
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(state))
  } catch {
    // Storage disabled/unavailable (private browsing) — fail open on the
    // client-side courtesy lockout; Supabase's own rate limiting still holds.
  }
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const attempts = getAttemptState()
    const now = Date.now()
    if (attempts.lockedUntil > now) {
      const minutes = Math.ceil((attempts.lockedUntil - now) / 60000)
      setError(`Trop de tentatives. Veuillez réessayer dans ${minutes} minute${minutes > 1 ? 's' : ''}.`)
      return
    }

    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (signInError) {
      const nextCount = attempts.count + 1
      const lockedUntil = nextCount >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0
      setAttemptState({ count: lockedUntil ? 0 : nextCount, lockedUntil })
      setError(
        lockedUntil
          ? `Trop de tentatives. Veuillez réessayer dans ${Math.ceil(LOCKOUT_MS / 60000)} minutes.`
          : 'Courriel ou mot de passe incorrect.'
      )
      return
    }

    setAttemptState({ count: 0, lockedUntil: 0 })
    navigate(location.state?.from?.pathname || '/admin', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-lavender-wash px-4">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Administration | Anfa Counselling &amp; Psychotherapy</title>
      </Helmet>
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_25px_50px_-15px_rgba(8,95,104,0.2)] ring-1 ring-ink/5">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo variant="icon" className="mb-3 h-14" />
          <h1 className="font-display text-xl text-sea-deep">Administration du site</h1>
          <p className="mt-1 text-sm text-ink/60">Anfa Counselling &amp; Psychotherapy</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-sm font-semibold text-ink/80">
              Courriel
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm focus:border-sea focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold text-ink/80">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-ink/15 px-3.5 py-2.5 pr-11 text-sm focus:border-sea focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-ink/40 hover:text-ink/70"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
                    <path d="M3 3l18 18" strokeLinecap="round" />
                    <path
                      d="M10.58 10.58a2 2 0 0 0 2.83 2.83M9.36 5.3A10.5 10.5 0 0 1 12 5c5 0 8.5 4 9.5 7-.38 1.1-.98 2.23-1.78 3.27M6.1 6.1C4.2 7.5 2.9 9.4 2.5 12c1 3 4.5 7 9.5 7 1.13 0 2.17-.21 3.1-.57"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
                    <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sea-deep px-5 py-2.5 font-semibold text-sand transition-colors duration-300 hover:bg-sea disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
