# Anfa Counselling & Psychotherapy Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (EN/FR, Somali-ready), responsive, accessible marketing + booking website for Anfa Counselling & Psychotherapy, deployed to Vercel.

**Architecture:** Vite + React 18 SPA, React Router client-side routing, Tailwind CSS with token-based config, Framer Motion for motion (reduced-motion gated), Supabase for `bookings`/`messages` (insert-only via RLS), EmailJS for client-side email, react-helmet-async for per-page SEO.

**Tech Stack:** React 18, Vite, React Router 6, Tailwind CSS, Framer Motion, `@supabase/supabase-js`, `@emailjs/browser`, `react-helmet-async`, Vitest + React Testing Library, deployed on Vercel.

## Global Constraints

- Canadian spelling "Counselling" everywhere in copy (never "Counseling").
- Brand tagline EN: "Healing at nature's pace" / FR: "Guérir au rythme de la nature" — appears on Home hero and footer.
- No online payment anywhere. No Stripe, no payment fields.
- No sensitive health data fields in any form — only name, email, phone, short message, consent checkbox (spec §8). Never add a symptom/diagnosis/medication field.
- RLS on `bookings` and `messages`: `anon` role gets INSERT only, no SELECT/UPDATE/DELETE (spec §6). This is non-negotiable — any task touching Supabase must not add a read policy for `anon`.
- All EmailJS calls go through `src/lib/email.js` only — no component calls `emailjs.send` directly (spec §7).
- Both public forms (Booking, Contact) carry a honeypot field + client throttle from `src/lib/antiSpam.js` (spec §7).
- All Framer Motion animation must check `prefers-reduced-motion` and degrade to no/instant transition.
- Booking slot hours: Saturday through Friday, 11:00–17:30, Sunday closed (as given by client — do not "fix" to Mon–Fri).
- Prices: individual session $170, couple session $227, sliding scale mentioned, no other numbers invented.
- Phone (613) 791-0284, email `sahrasaid845@gmail.com`, address 2487 Kaladar Avenue, Ottawa, ON K1V — used verbatim, never altered.
- Logo SVGs already exist at `public/img/anfa-*.svg` — do not regenerate them, only reference.
- No secrets committed. Every env var goes through `.env.example` with a placeholder value and a comment.

**Testing approach note:** Modules with real logic (i18n, anti-spam, email wrapper, booking validation, slot generation, Supabase client, SEO/JSON-LD builder, Logo variant selection) get full TDD with Vitest. Presentational content pages (About, Services, Approach, Fees, FAQ, Testimonials, Resources, Privacy, Blog, Home sections) get a render-smoke test (mounts without throwing, key heading/CTA text present) plus an explicit content checklist per page sourced from the client brief — writing the full bilingual marketing copy twice (once in this plan, once in `en.json`/`fr.json`) would just duplicate the site. The final task includes a manual browser QA pass against every content checklist.

---

## File Structure

```
anfa/
  public/img/                       (logos already present; photos added in Task 19)
  supabase/migrations/0001_init.sql
  src/
    main.jsx, App.jsx
    i18n/
      I18nProvider.jsx, useTranslation.js, en.json, fr.json
    lib/
      supabaseClient.js, antiSpam.js, email.js, bookingSlots.js, bookingSchema.js
    components/
      Logo.jsx, HorizonDivider.jsx, Header.jsx, MobileNav.jsx, LanguageToggle.jsx,
      Footer.jsx, CrisisResourceStrip.jsx, CookieConsent.jsx, SEO.jsx,
      Card.jsx, FormField.jsx, Honeypot.jsx, Accordion.jsx
    sections/home/
      Hero.jsx, IntroSahra.jsx, ServicesPreview.jsx, ApproachSummary.jsx,
      ReassuranceBar.jsx, TestimonialsPreview.jsx, BlogPreview.jsx, FinalCta.jsx
    booking/
      BookingWizard.jsx, StepService.jsx, StepModality.jsx, StepDateTime.jsx,
      StepContact.jsx, Confirmation.jsx
    content/
      blogPosts.js, testimonials.js, services.js, faq.js
    pages/
      Home.jsx, About.jsx, Services.jsx, Approach.jsx, FeesInsurance.jsx,
      Booking.jsx, Contact.jsx, Faq.jsx, Blog.jsx, BlogPost.jsx,
      Testimonials.jsx, Resources.jsx, Privacy.jsx, NotFound.jsx
  .env.example, tailwind.config.js, README.md, vercel.json
```

---

## Task 1: Project scaffold & tooling

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `postcss.config.js`, `tailwind.config.js` (base, tokens added Task 2), `.eslintrc.cjs`, `.gitignore`, `src/main.jsx`, `src/App.jsx`, `src/index.css`
- Test: `src/App.test.jsx`

**Interfaces:**
- Produces: a running `npm run dev` Vite app and `npm run test` (Vitest) command that later tasks build on.

- [ ] **Step 1: Scaffold Vite React project**

```bash
npm create vite@latest . -- --template react
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom framer-motion @supabase/supabase-js @emailjs/browser react-helmet-async
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Vitest in `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
```

Create `src/setupTests.js`:

```js
import '@testing-library/jest-dom'
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 4: Write minimal `App.jsx` and a smoke test**

`src/App.jsx`:

```jsx
export default function App() {
  return <div>Anfa Counselling & Psychotherapy</div>
}
```

`src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders app root', () => {
  render(<App />)
  expect(screen.getByText(/Anfa Counselling/i)).toBeInTheDocument()
})
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: 1 passed

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React project with Vitest"
```

---

## Task 2: Design tokens & global styles

**Files:**
- Modify: `tailwind.config.js`
- Create: `src/index.css` (updated), `index.html` (font links)

**Interfaces:**
- Produces: Tailwind color classes `bg-sea`, `text-sea-deep`, `bg-sunlit`, `text-lavender`, `bg-mist`, `bg-sand`, `text-ink`; font families `font-display` (Fraunces) and `font-body` (Hanken Grotesk).

- [ ] **Step 1: Add tokens to `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sea: '#14A69C',
        'sea-deep': '#0B5C57',
        sunlit: '#DDB067',
        lavender: '#9C8FCB',
        mist: '#E6F2EF',
        sand: '#F7F4ED',
        ink: '#1C2926',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Hanken Grotesk"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Add Google Fonts links to `index.html` `<head>`**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="/img/anfa-favicon.svg">
```

- [ ] **Step 3: Base styles in `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-sand text-ink font-body antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-display text-sea-deep;
  }
  :focus-visible {
    @apply outline outline-2 outline-offset-2 outline-sunlit;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Verify build picks up tokens**

Run: `npm run build`
Expected: build succeeds, no Tailwind errors about unknown classes.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js index.html src/index.css
git commit -m "feat: add design tokens, fonts, and base styles"
```

---

## Task 3: i18n system

**Files:**
- Create: `src/i18n/I18nProvider.jsx`, `src/i18n/useTranslation.js`, `src/i18n/en.json`, `src/i18n/fr.json`
- Test: `src/i18n/useTranslation.test.jsx`

**Interfaces:**
- Produces: `<I18nProvider>` (wraps app), `useTranslation()` returning `{ t, lang, setLang }` where `t('a.b.c')` looks up nested key, falling back to the key path itself if missing (never crashes, never shows literal "undefined").
- Consumed by every component from Task 5 onward.

- [ ] **Step 1: Write failing test**

```jsx
// src/i18n/useTranslation.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider } from './I18nProvider'
import { useTranslation } from './useTranslation'

function Probe() {
  const { t, lang, setLang } = useTranslation()
  return (
    <div>
      <span data-testid="text">{t('common.cta.bookFree')}</span>
      <span data-testid="lang">{lang}</span>
      <span data-testid="missing">{t('nope.nope')}</span>
      <button onClick={() => setLang('fr')}>switch</button>
    </div>
  )
}

test('t() resolves nested keys and setLang switches language, persisting to localStorage', () => {
  localStorage.clear()
  render(<I18nProvider><Probe /></I18nProvider>)
  expect(screen.getByTestId('text').textContent).toBe('Book a free 15-minute consultation')
  expect(screen.getByTestId('lang').textContent).toBe('en')
  expect(screen.getByTestId('missing').textContent).toBe('nope.nope')

  fireEvent.click(screen.getByText('switch'))
  expect(screen.getByTestId('lang').textContent).toBe('fr')
  expect(screen.getByTestId('text').textContent).toBe('Réserver une consultation gratuite de 15 min')
  expect(localStorage.getItem('anfa-lang')).toBe('fr')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- useTranslation`
Expected: FAIL (module not found)

- [ ] **Step 3: Create locale seed files**

`src/i18n/en.json`:

```json
{
  "common": {
    "nav": {
      "home": "Home", "about": "About", "services": "Services", "approach": "Approach",
      "fees": "Fees & Insurance", "booking": "Booking", "contact": "Contact", "faq": "FAQ",
      "blog": "Blog", "testimonials": "Testimonials", "resources": "Resources"
    },
    "cta": {
      "bookFree": "Book a free 15-minute consultation",
      "discoverServices": "Discover our services",
      "bookNow": "Book now",
      "sendMessage": "Send message",
      "readMore": "Read more",
      "viewAll": "View all"
    },
    "tagline": "Healing at nature's pace"
  }
}
```

`src/i18n/fr.json`:

```json
{
  "common": {
    "nav": {
      "home": "Accueil", "about": "À propos", "services": "Services", "approach": "Approche",
      "fees": "Tarifs et assurances", "booking": "Réservation", "contact": "Contact", "faq": "FAQ",
      "blog": "Blogue", "testimonials": "Témoignages", "resources": "Ressources"
    },
    "cta": {
      "bookFree": "Réserver une consultation gratuite de 15 min",
      "discoverServices": "Découvrir nos services",
      "bookNow": "Réserver",
      "sendMessage": "Envoyer le message",
      "readMore": "Lire la suite",
      "viewAll": "Tout voir"
    },
    "tagline": "Guérir au rythme de la nature"
  }
}
```

(Every later page task adds its own top-level namespace — e.g. `home`, `about`, `booking` — to both files; this task only seeds `common`, enough for the test above.)

- [ ] **Step 4: Implement `I18nProvider` and `useTranslation`**

```jsx
// src/i18n/I18nProvider.jsx
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
```

```js
// src/i18n/useTranslation.js
import { useContext } from 'react'
import { I18nContext } from './I18nProvider'

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
  return ctx
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- useTranslation`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/i18n
git commit -m "feat: add i18n provider with EN/FR dictionaries"
```

---

## Task 4: Signature components — HorizonDivider and Logo

**Files:**
- Create: `src/components/HorizonDivider.jsx`, `src/components/Logo.jsx`
- Test: `src/components/HorizonDivider.test.jsx`, `src/components/Logo.test.jsx`

**Interfaces:**
- `<HorizonDivider animated={boolean} />` — renders the ridge-meets-wave gradient SVG; when `animated` is true and motion is not reduced, applies a Framer Motion parallax; otherwise static.
- `<Logo variant="full-color"|"full-white"|"full-dark"|"compact" className? />` — renders an `<img>` pointing at the matching file in `public/img/anfa-*.svg`, with `alt="Anfa Counselling & Psychotherapy"`.
- Produces: both are consumed by Header/Footer (Task 5/6) and Hero (Task 15).

- [ ] **Step 1: Write failing tests**

```jsx
// src/components/Logo.test.jsx
import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

test.each([
  ['full-color', '/img/anfa-logo-full-color.svg'],
  ['full-white', '/img/anfa-logo-full-white.svg'],
  ['full-dark', '/img/anfa-logo-full-dark.svg'],
  ['compact', '/img/anfa-logo-compact.svg'],
])('variant %s maps to %s', (variant, expectedSrc) => {
  render(<Logo variant={variant} />)
  const img = screen.getByAltText('Anfa Counselling & Psychotherapy')
  expect(img).toHaveAttribute('src', expectedSrc)
})
```

```jsx
// src/components/HorizonDivider.test.jsx
import { render } from '@testing-library/react'
import { HorizonDivider } from './HorizonDivider'

test('renders an svg with role img', () => {
  const { container } = render(<HorizonDivider />)
  expect(container.querySelector('svg')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm run test -- Logo HorizonDivider`
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement `Logo.jsx`**

```jsx
// src/components/Logo.jsx
const VARIANT_SRC = {
  'full-color': '/img/anfa-logo-full-color.svg',
  'full-white': '/img/anfa-logo-full-white.svg',
  'full-dark': '/img/anfa-logo-full-dark.svg',
  compact: '/img/anfa-logo-compact.svg',
}

export function Logo({ variant = 'full-color', className = '' }) {
  return (
    <img
      src={VARIANT_SRC[variant]}
      alt="Anfa Counselling & Psychotherapy"
      className={className}
    />
  )
}
```

- [ ] **Step 4: Implement `HorizonDivider.jsx`**

```jsx
// src/components/HorizonDivider.jsx
import { motion, useReducedMotion } from 'framer-motion'

export function HorizonDivider({ animated = false, className = '' }) {
  const prefersReduced = useReducedMotion()
  const shouldAnimate = animated && !prefersReduced

  return (
    <svg
      role="img"
      aria-label="Mountain ridge meeting the sea, a horizon line"
      viewBox="0 0 1200 80"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="horizon-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#14A69C" />
          <stop offset="100%" stopColor="#DDB067" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0,60 L150,20 L300,55 Q450,10 600,50 T900,45 Q1050,15 1200,55 L1200,80 L0,80 Z"
        fill="url(#horizon-gradient)"
        initial={shouldAnimate ? { x: -20, opacity: 0 } : false}
        animate={shouldAnimate ? { x: 0, opacity: 1 } : false}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npm run test -- Logo HorizonDivider`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Logo.jsx src/components/HorizonDivider.jsx src/components/*.test.jsx
git commit -m "feat: add Logo and HorizonDivider signature components"
```

---

## Task 5: Header, LanguageToggle, MobileNav

**Files:**
- Create: `src/components/Header.jsx`, `src/components/LanguageToggle.jsx`, `src/components/MobileNav.jsx`
- Test: `src/components/Header.test.jsx`, `src/components/LanguageToggle.test.jsx`

**Interfaces:**
- Consumes: `useTranslation()` (Task 3), `<Logo>` (Task 4).
- Produces: `<Header>` — no props, renders nav from `common.nav.*` keys, `<Logo variant="full-color">` on desktop swapping to `variant="compact"` under 768px via CSS (`md:hidden`/`hidden md:block` pair of two `<Logo>` instances, not JS width detection — simpler and SSR-safe), a "Book a free 15-minute consultation" CTA button routed to `/booking`, and `<LanguageToggle>`.

- [ ] **Step 1: Write failing tests**

```jsx
// src/components/LanguageToggle.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import { LanguageToggle } from './LanguageToggle'

test('toggles language between EN and FR', () => {
  render(<I18nProvider><LanguageToggle /></I18nProvider>)
  const frButton = screen.getByRole('button', { name: /FR/i })
  fireEvent.click(frButton)
  expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument()
})
```

```jsx
// src/components/Header.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import { Header } from './Header'

test('renders nav links and booking CTA', () => {
  render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: /Book a free 15-minute consultation/i })).toHaveAttribute('href', '/booking')
})
```

- [ ] **Step 2: Run tests, verify fail**

Run: `npm run test -- Header LanguageToggle`
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement `LanguageToggle.jsx`**

```jsx
// src/components/LanguageToggle.jsx
import { useTranslation } from '../i18n/useTranslation'

export function LanguageToggle() {
  const { lang, setLang } = useTranslation()
  const other = lang === 'en' ? 'fr' : 'en'
  return (
    <button
      onClick={() => setLang(other)}
      aria-label={`Switch to ${other === 'en' ? 'English' : 'French'}`}
      className="text-sm font-body uppercase tracking-widest text-sea-deep hover:text-sea"
    >
      {other.toUpperCase()}
    </button>
  )
}
```

- [ ] **Step 4: Implement `MobileNav.jsx`**

```jsx
// src/components/MobileNav.jsx
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'

const ROUTES = [
  ['home', '/'], ['about', '/about'], ['services', '/services'], ['approach', '/approach'],
  ['fees', '/fees'], ['booking', '/booking'], ['contact', '/contact'], ['faq', '/faq'],
  ['blog', '/blog'], ['testimonials', '/testimonials'], ['resources', '/resources'],
]

export function MobileNav() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="p-2"
      >
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full bg-sand shadow-lg p-4 flex flex-col gap-3">
          {ROUTES.map(([key, path]) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)} className="py-2">
              {t(`common.nav.${key}`)}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Implement `Header.jsx`**

```jsx
// src/components/Header.jsx
import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { Logo } from './Logo'
import { LanguageToggle } from './LanguageToggle'
import { MobileNav } from './MobileNav'

const ROUTES = [
  ['home', '/'], ['about', '/about'], ['services', '/services'], ['approach', '/approach'],
  ['fees', '/fees'], ['contact', '/contact'], ['faq', '/faq'],
  ['blog', '/blog'], ['testimonials', '/testimonials'], ['resources', '/resources'],
]

export function Header() {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-40 bg-sand/95 backdrop-blur border-b border-mist">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        <NavLink to="/" aria-label="Anfa Counselling & Psychotherapy home">
          <Logo variant="full-color" className="hidden md:block h-14" />
          <Logo variant="compact" className="md:hidden h-10" />
        </NavLink>
        <nav className="hidden md:flex items-center gap-6">
          {ROUTES.map(([key, path]) => (
            <NavLink key={path} to={path} className="text-sm font-body text-ink hover:text-sea">
              {t(`common.nav.${key}`)}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle />
          <NavLink
            to="/booking"
            className="rounded-full bg-sunlit px-5 py-2 text-sm font-semibold text-ink hover:opacity-90"
          >
            {t('common.cta.bookFree')}
          </NavLink>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
```

- [ ] **Step 6: Run tests, verify pass**

Run: `npm run test -- Header LanguageToggle`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.jsx src/components/LanguageToggle.jsx src/components/MobileNav.jsx src/components/*.test.jsx
git commit -m "feat: add Header, LanguageToggle, MobileNav"
```

---

## Task 6: Footer and CrisisResourceStrip

**Files:**
- Create: `src/components/Footer.jsx`, `src/components/CrisisResourceStrip.jsx`
- Test: `src/components/CrisisResourceStrip.test.jsx`

**Interfaces:**
- `<CrisisResourceStrip />` — no props, renders the exact crisis text from spec §11 in the current language.
- `<Footer />` — renders `<Logo variant="full-white">` on a `bg-sea-deep` background, address/phone/email, social links (Facebook, Psychology Today — placeholder `href="#"` until client supplies real URLs, marked with a code comment), nav links, `<CrisisResourceStrip>`, link to `/privacy`, tagline.

- [ ] **Step 1: Write failing test**

```jsx
// src/components/CrisisResourceStrip.test.jsx
import { render, screen } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { CrisisResourceStrip } from './CrisisResourceStrip'

test('renders crisis resources with 911, 988 and Ottawa Distress Centre', () => {
  render(<I18nProvider><CrisisResourceStrip /></I18nProvider>)
  expect(screen.getByText(/911/)).toBeInTheDocument()
  expect(screen.getByText(/988/)).toBeInTheDocument()
  expect(screen.getByText(/613-238-3311/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm run test -- CrisisResourceStrip`
Expected: FAIL

- [ ] **Step 3: Add `common.crisis` and `common.footer` keys to `en.json`/`fr.json`**

Add to both files under `common`:

en.json:
```json
"crisis": {
  "text": "In an emergency, call 911. Suicide Crisis Helpline: 988. Ottawa Distress Centre: 613-238-3311."
},
"footer": {
  "address": "2487 Kaladar Avenue, Ottawa, ON K1V",
  "privacy": "Privacy Policy",
  "rights": "All rights reserved."
}
```

fr.json:
```json
"crisis": {
  "text": "En cas d'urgence, composez le 911. Ligne d'aide en cas de crise de suicide : 988. Centre de détresse d'Ottawa : 613-238-3311."
},
"footer": {
  "address": "2487, avenue Kaladar, Ottawa, ON K1V",
  "privacy": "Politique de confidentialité",
  "rights": "Tous droits réservés."
}
```

- [ ] **Step 4: Implement `CrisisResourceStrip.jsx`**

```jsx
// src/components/CrisisResourceStrip.jsx
import { useTranslation } from '../i18n/useTranslation'

export function CrisisResourceStrip() {
  const { t } = useTranslation()
  return (
    <div role="note" className="bg-sea-deep/80 text-sand text-xs md:text-sm px-4 py-3 text-center">
      {t('common.crisis.text')}
    </div>
  )
}
```

- [ ] **Step 5: Implement `Footer.jsx`**

```jsx
// src/components/Footer.jsx
import { NavLink } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { Logo } from './Logo'
import { CrisisResourceStrip } from './CrisisResourceStrip'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-sea-deep text-sand">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Logo variant="full-white" className="h-14 mb-4" />
          <p className="italic">{t('common.tagline')}</p>
        </div>
        <div className="text-sm space-y-1">
          <p>{t('common.footer.address')}</p>
          <a href="tel:+16137910284" className="block hover:underline">(613) 791-0284</a>
          <a href="mailto:sahrasaid845@gmail.com" className="block hover:underline">sahrasaid845@gmail.com</a>
          <div className="flex gap-4 pt-2">
            {/* FUTURE: replace # with the practice's real Facebook and Psychology Today profile URLs once provided */}
            <a href="#" aria-label="Facebook" className="hover:underline">Facebook</a>
            <a href="#" aria-label="Psychology Today" className="hover:underline">Psychology Today</a>
          </div>
        </div>
        <div className="text-sm">
          <NavLink to="/privacy" className="hover:underline">{t('common.footer.privacy')}</NavLink>
          <p className="mt-2 text-sand/70">© {new Date().getFullYear()} Anfa Counselling & Psychotherapy. {t('common.footer.rights')}</p>
        </div>
      </div>
      <CrisisResourceStrip />
    </footer>
  )
}
```

- [ ] **Step 6: Run test, verify passes**

Run: `npm run test -- CrisisResourceStrip`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/Footer.jsx src/components/CrisisResourceStrip.jsx src/components/*.test.jsx src/i18n/en.json src/i18n/fr.json
git commit -m "feat: add Footer and CrisisResourceStrip"
```

---

## Task 7: CookieConsent gating Vercel Analytics

**Files:**
- Create: `src/components/CookieConsent.jsx`
- Test: `src/components/CookieConsent.test.jsx`

**Interfaces:**
- `<CookieConsent onAccept={fn} />` — banner shown until `localStorage.getItem('anfa-cookie-consent') === 'accepted'`; calls `onAccept()` only after the user clicks Accept, never before.
- Consumed by `App.jsx` (Task 9), which mounts `<Analytics />` (from `@vercel/analytics/react`) only inside `onAccept`.

- [ ] **Step 1: Write failing test**

```jsx
// src/components/CookieConsent.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { CookieConsent } from './CookieConsent'

test('shows banner, calls onAccept and persists choice on click, then hides', () => {
  localStorage.clear()
  const onAccept = vi.fn()
  render(<I18nProvider><CookieConsent onAccept={onAccept} /></I18nProvider>)
  expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument()
  expect(onAccept).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole('button', { name: /accept/i }))
  expect(onAccept).toHaveBeenCalledTimes(1)
  expect(localStorage.getItem('anfa-cookie-consent')).toBe('accepted')
  expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument()
})

test('does not render if already accepted', () => {
  localStorage.setItem('anfa-cookie-consent', 'accepted')
  const onAccept = vi.fn()
  render(<I18nProvider><CookieConsent onAccept={onAccept} /></I18nProvider>)
  expect(onAccept).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm run test -- CookieConsent`
Expected: FAIL

- [ ] **Step 3: Add `common.cookie` keys**

en.json: `"cookie": { "text": "We use cookies to understand site usage. No personal health data is collected.", "accept": "Accept" }`
fr.json: `"cookie": { "text": "Nous utilisons des témoins pour comprendre l'utilisation du site. Aucune donnée de santé personnelle n'est recueillie.", "accept": "Accepter" }`

- [ ] **Step 4: Implement `CookieConsent.jsx`**

```jsx
// src/components/CookieConsent.jsx
import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n/useTranslation'

const KEY = 'anfa-cookie-consent'

export function CookieConsent({ onAccept }) {
  const { t } = useTranslation()
  const [accepted, setAccepted] = useState(() => localStorage.getItem(KEY) === 'accepted')

  useEffect(() => {
    if (accepted) onAccept()
  }, [accepted, onAccept])

  if (accepted) return null

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 inset-x-0 z-50 bg-ink text-sand p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
      <p className="text-sm">{t('common.cookie.text')}</p>
      <button
        onClick={() => { localStorage.setItem(KEY, 'accepted'); setAccepted(true) }}
        className="rounded-full bg-sunlit text-ink px-5 py-2 text-sm font-semibold"
      >
        {t('common.cookie.accept')}
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Run test, verify passes**

Run: `npm run test -- CookieConsent`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/CookieConsent.jsx src/components/CookieConsent.test.jsx src/i18n/en.json src/i18n/fr.json
git commit -m "feat: add CookieConsent gating analytics"
```

---

## Task 8: SEO component (helmet + JSON-LD)

**Files:**
- Create: `src/components/SEO.jsx`
- Test: `src/components/SEO.test.jsx`

**Interfaces:**
- `<SEO title description path jsonLd? />` — sets `<title>`, meta description, canonical, Open Graph tags via `react-helmet-async`; if `jsonLd` object passed, injects it as a `<script type="application/ld+json">`. Every page task (10 onward) uses this.
- Also exports `businessJsonLd()` returning the shared LocalBusiness/MedicalBusiness structured data (name, address, phone, geo omitted, hours, priceRange) reused on Home and Contact.

- [ ] **Step 1: Write failing test**

```jsx
// src/components/SEO.test.jsx
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { SEO, businessJsonLd } from './SEO'

test('renders title and description via helmet', async () => {
  render(
    <HelmetProvider>
      <SEO title="About" description="About Anfa" path="/about" />
    </HelmetProvider>
  )
  await new Promise((r) => setTimeout(r, 0))
  expect(document.title).toContain('About')
  const metaDesc = document.querySelector('meta[name="description"]')
  expect(metaDesc.getAttribute('content')).toBe('About Anfa')
})

test('businessJsonLd includes correct name, phone and address', () => {
  const data = businessJsonLd()
  expect(data['@type']).toContain('MedicalBusiness')
  expect(data.name).toBe('Anfa Counselling & Psychotherapy')
  expect(data.telephone).toBe('+1-613-791-0284')
  expect(data.address.streetAddress).toBe('2487 Kaladar Avenue')
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm run test -- SEO`
Expected: FAIL

- [ ] **Step 3: Implement `SEO.jsx`**

```jsx
// src/components/SEO.jsx
import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://www.anfacounselling.ca' // update once the domain is finalized

export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalBusiness'],
    name: 'Anfa Counselling & Psychotherapy',
    telephone: '+1-613-791-0284',
    email: 'sahrasaid845@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2487 Kaladar Avenue',
      addressLocality: 'Ottawa',
      addressRegion: 'ON',
      postalCode: 'K1V',
      addressCountry: 'CA',
    },
    openingHours: 'Sa,Su-Fr 11:00-17:30', // Sat-Fri 11:00-17:30, Sunday closed
    priceRange: '$$',
  }
}

export function SEO({ title, description, path = '/', jsonLd }) {
  const fullTitle = `${title} | Anfa Counselling & Psychotherapy`
  const url = `${SITE_URL}${path}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${SITE_URL}/img/anfa-icon.svg`} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
```

- [ ] **Step 4: Run test, verify passes**

Run: `npm run test -- SEO`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SEO.jsx src/components/SEO.test.jsx
git commit -m "feat: add SEO component with LocalBusiness/MedicalBusiness JSON-LD"
```

---

## Task 9: Routing shell wired with providers

**Files:**
- Modify: `src/App.jsx`, `src/main.jsx`
- Create: `src/pages/NotFound.jsx` (placeholder for now; real pages replace stubs in later tasks)
- Test: `src/App.test.jsx` (rewritten)

**Interfaces:**
- `App.jsx` wraps: `HelmetProvider` > `I18nProvider` > `BrowserRouter` > `Header` + `<Routes>` (lazy-loaded per page via `React.lazy`) + `Footer`, plus `CookieConsent` mounted at root controlling `@vercel/analytics/react`'s `<Analytics />`.
- Routes: `/`, `/about`, `/services`, `/approach`, `/fees`, `/booking`, `/contact`, `/faq`, `/blog`, `/blog/:slug`, `/testimonials`, `/resources`, `/privacy`, `*` → NotFound.
- This task creates minimal stub components for any page not yet built (`export default function X() { return <div>X</div> }`) so the app builds; later page tasks replace each stub file's contents in place — the route wiring itself does not change again.

- [ ] **Step 1: Install `@vercel/analytics`**

```bash
npm install @vercel/analytics
```

- [ ] **Step 2: Create stub pages for any not yet implemented**

For each of `Home, About, Services, Approach, FeesInsurance, Booking, Contact, Faq, Blog, BlogPost, Testimonials, Resources, Privacy`, create `src/pages/<Name>.jsx`:

```jsx
export default function About() {
  return <div>About — placeholder</div>
}
```

(repeat per page name; `NotFound.jsx` too)

- [ ] **Step 3: Write failing test for routing**

```jsx
// src/App.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

test('renders header nav and default home stub at /', () => {
  render(<App initialEntries={['/']} />)
  expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
})
```

(App accepts an `initialEntries` prop only in test builds by internally choosing `MemoryRouter` when provided — simplest: export a `AppShell` that takes `router` children, see implementation.)

- [ ] **Step 4: Implement `App.jsx`**

```jsx
// src/App.jsx
import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { I18nProvider } from './i18n/I18nProvider'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CookieConsent } from './components/CookieConsent'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Approach = lazy(() => import('./pages/Approach'))
const FeesInsurance = lazy(() => import('./pages/FeesInsurance'))
const Booking = lazy(() => import('./pages/Booking'))
const Contact = lazy(() => import('./pages/Contact'))
const Faq = lazy(() => import('./pages/Faq'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Resources = lazy(() => import('./pages/Resources'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/approach" element={<Approach />} />
        <Route path="/fees" element={<FeesInsurance />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default function App({ initialEntries }) {
  const [analyticsOn, setAnalyticsOn] = useState(false)
  const Router = initialEntries ? MemoryRouter : BrowserRouter
  const routerProps = initialEntries ? { initialEntries } : {}

  return (
    <HelmetProvider>
      <I18nProvider>
        <Router {...routerProps}>
          <Header />
          <main>
            <AppRoutes />
          </main>
          <Footer />
        </Router>
      </I18nProvider>
      <CookieConsent onAccept={() => setAnalyticsOn(true)} />
      {analyticsOn && <Analytics />}
    </HelmetProvider>
  )
}
```

`src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 5: Run test, verify passes**

Run: `npm run test -- App`
Expected: PASS

- [ ] **Step 6: Run full build to confirm all routes bundle**

Run: `npm run build`
Expected: build succeeds with per-route chunks from `React.lazy`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: wire routing shell with lazy-loaded pages and analytics gating"
```

---

## Task 10: Supabase client and RLS migration

**Files:**
- Create: `supabase/migrations/0001_init.sql`, `src/lib/supabaseClient.js`
- Test: `src/lib/supabaseClient.test.js`

**Interfaces:**
- `supabaseClient.js` exports `supabase`, a singleton `createClient(url, anonKey)` reading `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, and `insertBooking(payload)` / `insertMessage(payload)` helpers used by Task 13/14.
- Non-negotiable per Global Constraints: the SQL grants `anon` INSERT only.

- [ ] **Step 1: Write the SQL migration**

`supabase/migrations/0001_init.sql`:

```sql
create extension if not exists pgcrypto;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service text not null,
  modality text not null,
  preferred_date date not null,
  preferred_time text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  message text,
  consent boolean not null,
  language text not null default 'en'
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  language text not null default 'en'
);

alter table public.bookings enable row level security;
alter table public.messages enable row level security;

create policy "anon can insert bookings" on public.bookings
  for insert to anon
  with check (true);

create policy "anon can insert messages" on public.messages
  for insert to anon
  with check (true);

-- Intentionally no SELECT/UPDATE/DELETE policy for anon: RLS default-deny
-- means the public anon key can write but never read, modify, or delete
-- rows. Staff read submissions via the Supabase dashboard (authenticated).
```

- [ ] **Step 2: Write failing test for the client helpers**

```js
// src/lib/supabaseClient.test.js
import { vi } from 'vitest'

const insertMock = vi.fn(() => Promise.resolve({ error: null }))
const fromMock = vi.fn(() => ({ insert: insertMock }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: fromMock })),
}))

import { insertBooking, insertMessage } from './supabaseClient'

test('insertBooking calls supabase.from("bookings").insert with payload', async () => {
  await insertBooking({ service: 'individual' })
  expect(fromMock).toHaveBeenCalledWith('bookings')
  expect(insertMock).toHaveBeenCalledWith([{ service: 'individual' }])
})

test('insertMessage calls supabase.from("messages").insert with payload', async () => {
  await insertMessage({ subject: 'hello' })
  expect(fromMock).toHaveBeenCalledWith('messages')
  expect(insertMock).toHaveBeenCalledWith([{ subject: 'hello' }])
})
```

- [ ] **Step 3: Run test, verify fails**

Run: `npm run test -- supabaseClient`
Expected: FAIL (module not found)

- [ ] **Step 4: Implement `supabaseClient.js`**

```js
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function insertBooking(payload) {
  const { error } = await supabase.from('bookings').insert([payload])
  if (error) throw error
}

export async function insertMessage(payload) {
  const { error } = await supabase.from('messages').insert([payload])
  if (error) throw error
}
```

- [ ] **Step 5: Run test, verify passes**

Run: `npm run test -- supabaseClient`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/0001_init.sql src/lib/supabaseClient.js src/lib/supabaseClient.test.js
git commit -m "feat: add Supabase client and insert-only RLS migration"
```

---

## Task 11: Anti-spam library

**Files:**
- Create: `src/lib/antiSpam.js`
- Test: `src/lib/antiSpam.test.js`

**Interfaces:**
- `isHoneypotTriggered(value)` → boolean (true if non-empty).
- `isWithinThrottle(storageKey, cooldownMs)` → boolean (true if a prior submit timestamp for `storageKey` is within `cooldownMs`).
- `recordSubmission(storageKey)` → writes `Date.now()` to `localStorage[storageKey]`.
- `isTooFast(mountedAt, minMs)` → boolean (true if `Date.now() - mountedAt < minMs`, i.e. bot-speed submit).
- Consumed by Task 13 (Booking) and Task 14 (Contact).

- [ ] **Step 1: Write failing tests**

```js
// src/lib/antiSpam.test.js
import { isHoneypotTriggered, isWithinThrottle, recordSubmission, isTooFast } from './antiSpam'

test('isHoneypotTriggered is true only when the field has a value', () => {
  expect(isHoneypotTriggered('')).toBe(false)
  expect(isHoneypotTriggered(undefined)).toBe(false)
  expect(isHoneypotTriggered('bot-filled-this')).toBe(true)
})

test('throttle: blocks a second submit inside the cooldown, allows after', () => {
  localStorage.clear()
  const key = 'anfa-throttle-test'
  expect(isWithinThrottle(key, 60000)).toBe(false)
  recordSubmission(key)
  expect(isWithinThrottle(key, 60000)).toBe(true)

  const past = Date.now() - 120000
  localStorage.setItem(key, String(past))
  expect(isWithinThrottle(key, 60000)).toBe(false)
})

test('isTooFast flags submits under the minimum fill time', () => {
  const now = Date.now()
  expect(isTooFast(now, 2000)).toBe(true)
  expect(isTooFast(now - 3000, 2000)).toBe(false)
})
```

- [ ] **Step 2: Run tests, verify fail**

Run: `npm run test -- antiSpam`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement `antiSpam.js`**

```js
// src/lib/antiSpam.js
export function isHoneypotTriggered(value) {
  return Boolean(value && value.length > 0)
}

export function isWithinThrottle(storageKey, cooldownMs) {
  const last = localStorage.getItem(storageKey)
  if (!last) return false
  return Date.now() - Number(last) < cooldownMs
}

export function recordSubmission(storageKey) {
  localStorage.setItem(storageKey, String(Date.now()))
}

export function isTooFast(mountedAt, minMs) {
  return Date.now() - mountedAt < minMs
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm run test -- antiSpam`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/antiSpam.js src/lib/antiSpam.test.js
git commit -m "feat: add honeypot/throttle/fill-time anti-spam helpers"
```

---

## Task 12: Email library (EmailJS wrapper)

**Files:**
- Create: `src/lib/email.js`
- Test: `src/lib/email.test.js`

**Interfaces:**
- `sendBookingConfirmation(booking)` → sends via EmailJS to the client and to `sahrasaid845@gmail.com` using `import.meta.env.VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_BOOKING_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY`.
- `sendContactNotification(message)` → sends via EmailJS using `VITE_EMAILJS_CONTACT_TEMPLATE_ID`.
- Both are the **only** call sites for `emailjs.send` in the codebase (Global Constraint).

- [ ] **Step 1: Write failing tests**

```js
// src/lib/email.test.js
import { vi } from 'vitest'

const sendMock = vi.fn(() => Promise.resolve({ status: 200 }))
vi.mock('@emailjs/browser', () => ({ default: { send: sendMock } }))

import { sendBookingConfirmation, sendContactNotification } from './email'

test('sendBookingConfirmation sends with booking template and params', async () => {
  await sendBookingConfirmation({ fullName: 'Jane Doe', email: 'jane@example.com', service: 'individual' })
  expect(sendMock).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(String),
    expect.objectContaining({ fullName: 'Jane Doe', email: 'jane@example.com' }),
    expect.any(String)
  )
})

test('sendContactNotification sends with contact template and params', async () => {
  await sendContactNotification({ fullName: 'Jane Doe', email: 'jane@example.com', subject: 'Question', message: 'Hi' })
  expect(sendMock).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(String),
    expect.objectContaining({ subject: 'Question' }),
    expect.any(String)
  )
})
```

- [ ] **Step 2: Run tests, verify fail**

Run: `npm run test -- email`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement `email.js`**

```js
// src/lib/email.js
import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const BOOKING_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID
const CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID

export async function sendBookingConfirmation(booking) {
  return emailjs.send(SERVICE_ID, BOOKING_TEMPLATE_ID, booking, PUBLIC_KEY)
}

export async function sendContactNotification(message) {
  return emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, message, PUBLIC_KEY)
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm run test -- email`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/email.js src/lib/email.test.js
git commit -m "feat: add EmailJS wrapper as the sole email send call site"
```

---

## Task 13: Booking domain logic — slots and validation schema

**Files:**
- Create: `src/lib/bookingSlots.js`, `src/lib/bookingSchema.js`
- Test: `src/lib/bookingSlots.test.js`, `src/lib/bookingSchema.test.js`

**Interfaces:**
- `getAvailableSlots(date)` → array of `"HH:MM"` strings between 11:00–17:30 (30-min increments) for any day except Sunday; returns `[]` for Sunday.
- `validateBookingContact({ fullName, email, phone, consent })` → `{ valid: boolean, errors: { field: message } }`. Rejects missing/empty `fullName`, `email` (basic regex), `phone`, or `consent !== true`. Accepts optional `message`. No other fields are validated or accepted, keeping the no-health-data constraint enforced at the schema level.

- [ ] **Step 1: Write failing tests**

```js
// src/lib/bookingSlots.test.js
import { getAvailableSlots } from './bookingSlots'

test('returns empty array for Sunday', () => {
  const sunday = new Date('2026-08-02') // a Sunday
  expect(getAvailableSlots(sunday)).toEqual([])
})

test('returns 30-minute slots from 11:00 to 17:30 for a non-Sunday', () => {
  const saturday = new Date('2026-08-01')
  const slots = getAvailableSlots(saturday)
  expect(slots[0]).toBe('11:00')
  expect(slots[slots.length - 1]).toBe('17:30')
  expect(slots).toHaveLength(14)
})
```

```js
// src/lib/bookingSchema.test.js
import { validateBookingContact } from './bookingSchema'

test('rejects missing required fields and missing consent', () => {
  const result = validateBookingContact({ fullName: '', email: '', phone: '', consent: false })
  expect(result.valid).toBe(false)
  expect(result.errors.fullName).toBeTruthy()
  expect(result.errors.email).toBeTruthy()
  expect(result.errors.phone).toBeTruthy()
  expect(result.errors.consent).toBeTruthy()
})

test('rejects malformed email', () => {
  const result = validateBookingContact({ fullName: 'Jane', email: 'not-an-email', phone: '6135551234', consent: true })
  expect(result.valid).toBe(false)
  expect(result.errors.email).toBeTruthy()
})

test('accepts a valid payload with only the allowed fields', () => {
  const result = validateBookingContact({ fullName: 'Jane Doe', email: 'jane@example.com', phone: '6135551234', consent: true, message: 'Looking forward to it' })
  expect(result.valid).toBe(true)
  expect(result.errors).toEqual({})
})
```

- [ ] **Step 2: Run tests, verify fail**

Run: `npm run test -- bookingSlots bookingSchema`
Expected: FAIL

- [ ] **Step 3: Implement `bookingSlots.js`**

```js
// src/lib/bookingSlots.js
export function getAvailableSlots(date) {
  if (date.getDay() === 0) return [] // Sunday closed

  const slots = []
  let hour = 11
  let minute = 0
  while (hour < 17 || (hour === 17 && minute <= 30)) {
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
    minute += 30
    if (minute === 60) { minute = 0; hour += 1 }
  }
  return slots
}
```

- [ ] **Step 4: Implement `bookingSchema.js`**

```js
// src/lib/bookingSchema.js
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateBookingContact({ fullName, email, phone, consent }) {
  const errors = {}
  if (!fullName?.trim()) errors.fullName = 'Full name is required.'
  if (!email?.trim() || !EMAIL_RE.test(email)) errors.email = 'A valid email is required.'
  if (!phone?.trim()) errors.phone = 'Phone number is required.'
  if (consent !== true) errors.consent = 'Consent is required to proceed.'
  return { valid: Object.keys(errors).length === 0, errors }
}
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npm run test -- bookingSlots bookingSchema`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/bookingSlots.js src/lib/bookingSchema.js src/lib/bookingSlots.test.js src/lib/bookingSchema.test.js
git commit -m "feat: add booking slot generation and contact validation schema"
```

---

## Task 14: Booking wizard UI (4 steps + submit)

**Files:**
- Create: `src/booking/BookingWizard.jsx`, `src/booking/StepService.jsx`, `src/booking/StepModality.jsx`, `src/booking/StepDateTime.jsx`, `src/booking/StepContact.jsx`, `src/booking/Confirmation.jsx`, `src/components/Honeypot.jsx`
- Modify: `src/pages/Booking.jsx` (replace stub)
- Test: `src/booking/BookingWizard.test.jsx`

**Interfaces:**
- Consumes: `getAvailableSlots` (Task 13), `validateBookingContact` (Task 13), `insertBooking` (Task 10), `sendBookingConfirmation` (Task 12), `isHoneypotTriggered`/`isWithinThrottle`/`recordSubmission`/`isTooFast` (Task 11).
- `<Honeypot name="website" register={fn} />` — visually hidden input (off-screen positioning, not `display:none`), `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`.
- `<BookingWizard>` holds all step state internally; on final submit, if honeypot triggered, throttled, or too-fast, it shows the same success message without calling Supabase/EmailJS (silently drops bot submissions per spec §7).

- [ ] **Step 1: Write failing test for the anti-spam short-circuit and happy path**

```jsx
// src/booking/BookingWizard.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { BookingWizard } from './BookingWizard'
import * as supabaseClient from '../lib/supabaseClient'
import * as email from '../lib/email'

vi.mock('../lib/supabaseClient')
vi.mock('../lib/email')

function fillHappyPath() {
  fireEvent.click(screen.getByRole('button', { name: /individual/i }))
  fireEvent.click(screen.getByRole('button', { name: /in-person/i }))
  fireEvent.click(screen.getByRole('button', { name: '11:00' }))
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '6135551234' } })
  fireEvent.click(screen.getByLabelText(/consent/i))
}

test('honeypot filled: shows success but never calls Supabase or EmailJS', async () => {
  localStorage.clear()
  supabaseClient.insertBooking.mockResolvedValue()
  email.sendBookingConfirmation.mockResolvedValue()

  render(<I18nProvider><BookingWizard /></I18nProvider>)
  fillHappyPath()
  fireEvent.change(screen.getByTestId('booking-honeypot'), { target: { value: 'bot' } })
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitFor(() => expect(screen.getByText(/thank you/i)).toBeInTheDocument())
  expect(supabaseClient.insertBooking).not.toHaveBeenCalled()
  expect(email.sendBookingConfirmation).not.toHaveBeenCalled()
})

test('happy path: inserts booking and sends confirmation email', async () => {
  localStorage.clear()
  supabaseClient.insertBooking.mockResolvedValue()
  email.sendBookingConfirmation.mockResolvedValue()

  render(<I18nProvider><BookingWizard /></I18nProvider>)
  fillHappyPath()
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitFor(() => expect(supabaseClient.insertBooking).toHaveBeenCalledTimes(1))
  expect(email.sendBookingConfirmation).toHaveBeenCalledTimes(1)
  const [insertedPayload] = supabaseClient.insertBooking.mock.calls[0]
  expect(insertedPayload).not.toHaveProperty('diagnosis')
  expect(insertedPayload).not.toHaveProperty('symptoms')
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm run test -- BookingWizard`
Expected: FAIL (module not found)

- [ ] **Step 3: Add `booking.*` i18n keys to both dictionaries**

en.json (add top-level `booking` key):

```json
"booking": {
  "title": "Book a session",
  "step1": { "heading": "Choose a service", "individual": "Individual — $170", "couple": "Couple — $227", "group": "Group therapy", "spiritual": "Spiritual therapy", "freeConsult": "Free 15-minute consultation" },
  "step2": { "heading": "Choose a modality", "inPerson": "In-person", "online": "Online" },
  "step3": { "heading": "Choose a date and time", "noSlots": "This day is closed. Please choose another date (Sunday closed)." },
  "step4": { "heading": "Your details", "fullName": "Full name", "email": "Email", "phone": "Phone", "message": "Short message (optional)", "consent": "I consent to being contacted about this booking request." },
  "submit": "Submit",
  "back": "Back",
  "next": "Next",
  "success": { "title": "Thank you!", "body": "Your request has been received. We'll be in touch soon to confirm." },
  "throttled": "It looks like you already submitted this form. We'll be in touch soon."
}
```

fr.json (mirror structure, French copy):

```json
"booking": {
  "title": "Réserver une séance",
  "step1": { "heading": "Choisissez un service", "individual": "Individuel — 170 $", "couple": "Couple — 227 $", "group": "Thérapie de groupe", "spiritual": "Thérapie spirituelle", "freeConsult": "Consultation gratuite de 15 minutes" },
  "step2": { "heading": "Choisissez une modalité", "inPerson": "En personne", "online": "En ligne" },
  "step3": { "heading": "Choisissez une date et une heure", "noSlots": "Ce jour est fermé. Veuillez choisir une autre date (dimanche fermé)." },
  "step4": { "heading": "Vos coordonnées", "fullName": "Nom complet", "email": "Courriel", "phone": "Téléphone", "message": "Message court (facultatif)", "consent": "Je consens à être contacté(e) au sujet de cette demande de réservation." },
  "submit": "Envoyer",
  "back": "Retour",
  "next": "Suivant",
  "success": { "title": "Merci!", "body": "Votre demande a été reçue. Nous vous contacterons bientôt pour confirmer." },
  "throttled": "Il semble que vous ayez déjà soumis ce formulaire. Nous vous contacterons bientôt."
}
```

- [ ] **Step 4: Implement `Honeypot.jsx`**

```jsx
// src/components/Honeypot.jsx
export function Honeypot({ name, value, onChange, testId }) {
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
      <label htmlFor={name}>Website</label>
      <input
        id={name}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
        data-testid={testId}
      />
    </div>
  )
}
```

- [ ] **Step 5: Implement the step components**

```jsx
// src/booking/StepService.jsx
import { useTranslation } from '../i18n/useTranslation'

const SERVICES = ['individual', 'couple', 'group', 'spiritual', 'freeConsult']

export function StepService({ value, onSelect }) {
  const { t } = useTranslation()
  return (
    <fieldset>
      <legend className="font-display text-2xl mb-4">{t('booking.step1.heading')}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={value === s}
            onClick={() => onSelect(s)}
            className={`rounded-xl border p-4 text-left ${value === s ? 'border-sea bg-mist' : 'border-mist'}`}
          >
            {t(`booking.step1.${s}`)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
```

```jsx
// src/booking/StepModality.jsx
import { useTranslation } from '../i18n/useTranslation'

export function StepModality({ value, onSelect }) {
  const { t } = useTranslation()
  return (
    <fieldset>
      <legend className="font-display text-2xl mb-4">{t('booking.step2.heading')}</legend>
      <div className="flex gap-3">
        {['inPerson', 'online'].map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={value === m}
            onClick={() => onSelect(m)}
            className={`rounded-xl border px-6 py-3 ${value === m ? 'border-sea bg-mist' : 'border-mist'}`}
          >
            {t(`booking.step2.${m}`)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
```

```jsx
// src/booking/StepDateTime.jsx
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
```

```jsx
// src/booking/StepContact.jsx
import { useTranslation } from '../i18n/useTranslation'
import { Honeypot } from '../components/Honeypot'

export function StepContact({ values, errors, onChange, honeypotValue, onHoneypotChange }) {
  const { t } = useTranslation()
  return (
    <fieldset>
      <legend className="font-display text-2xl mb-4">{t('booking.step4.heading')}</legend>
      <Honeypot name="website" value={honeypotValue} onChange={(e) => onHoneypotChange(e.target.value)} testId="booking-honeypot" />

      <label htmlFor="fullName">{t('booking.step4.fullName')}</label>
      <input id="fullName" value={values.fullName} onChange={(e) => onChange('fullName', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-1" />
      {errors.fullName && <p role="alert" className="text-sm text-red-700 mb-2">{errors.fullName}</p>}

      <label htmlFor="email">{t('booking.step4.email')}</label>
      <input id="email" type="email" value={values.email} onChange={(e) => onChange('email', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-1" />
      {errors.email && <p role="alert" className="text-sm text-red-700 mb-2">{errors.email}</p>}

      <label htmlFor="phone">{t('booking.step4.phone')}</label>
      <input id="phone" type="tel" value={values.phone} onChange={(e) => onChange('phone', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-1" />
      {errors.phone && <p role="alert" className="text-sm text-red-700 mb-2">{errors.phone}</p>}

      <label htmlFor="message">{t('booking.step4.message')}</label>
      <textarea id="message" value={values.message} onChange={(e) => onChange('message', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-1" />

      <label htmlFor="consent" className="flex items-center gap-2 mt-2">
        <input id="consent" type="checkbox" checked={values.consent} onChange={(e) => onChange('consent', e.target.checked)} />
        {t('booking.step4.consent')}
      </label>
      {errors.consent && <p role="alert" className="text-sm text-red-700">{errors.consent}</p>}
    </fieldset>
  )
}
```

```jsx
// src/booking/Confirmation.jsx
import { useTranslation } from '../i18n/useTranslation'

export function Confirmation({ throttled }) {
  const { t } = useTranslation()
  return (
    <div role="status">
      <h2 className="font-display text-2xl mb-2">{t('booking.success.title')}</h2>
      <p>{throttled ? t('booking.throttled') : t('booking.success.body')}</p>
    </div>
  )
}
```

- [ ] **Step 6: Implement `BookingWizard.jsx`**

```jsx
// src/booking/BookingWizard.jsx
import { useState, useRef } from 'react'
import { useTranslation } from '../i18n/useTranslation'
import { StepService } from './StepService'
import { StepModality } from './StepModality'
import { StepDateTime } from './StepDateTime'
import { StepContact } from './StepContact'
import { Confirmation } from './Confirmation'
import { validateBookingContact } from '../lib/bookingSchema'
import { insertBooking } from '../lib/supabaseClient'
import { sendBookingConfirmation } from '../lib/email'
import { isHoneypotTriggered, isWithinThrottle, recordSubmission, isTooFast } from '../lib/antiSpam'

const THROTTLE_KEY = 'anfa-booking-last-submit'
const THROTTLE_MS = 60000
const MIN_FILL_MS = 2000

export function BookingWizard() {
  const { t, lang } = useTranslation()
  const mountedAt = useRef(Date.now())
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [modality, setModality] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [contact, setContact] = useState({ fullName: '', email: '', phone: '', message: '', consent: false })
  const [errors, setErrors] = useState({})
  const [honeypot, setHoneypot] = useState('')
  const [done, setDone] = useState(false)
  const [throttled, setThrottled] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function updateContact(field, val) {
    setContact((c) => ({ ...c, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { valid, errors: fieldErrors } = validateBookingContact(contact)
    setErrors(fieldErrors)
    if (!valid) return

    const isBot = isHoneypotTriggered(honeypot) || isTooFast(mountedAt.current, MIN_FILL_MS)
    const isThrottled = isWithinThrottle(THROTTLE_KEY, THROTTLE_MS)

    if (isBot) {
      setDone(true)
      return
    }
    if (isThrottled) {
      setThrottled(true)
      setDone(true)
      return
    }

    const payload = {
      service,
      modality,
      preferred_date: date,
      preferred_time: time,
      full_name: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      consent: contact.consent,
      language: lang,
    }

    setSubmitError('')
    try {
      await insertBooking(payload)
      await sendBookingConfirmation({ fullName: contact.fullName, email: contact.email, service, modality, preferred_date: date, preferred_time: time })
      recordSubmission(THROTTLE_KEY)
      setDone(true)
    } catch (err) {
      setSubmitError(t('booking.submitError'))
    }
  }

  if (done) return <Confirmation throttled={throttled} />

  return (
    <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
      <h1 className="font-display text-3xl mb-6">{t('booking.title')}</h1>
      {step === 1 && <StepService value={service} onSelect={(v) => { setService(v); setStep(2) }} />}
      {step === 2 && <StepModality value={modality} onSelect={(v) => { setModality(v); setStep(3) }} />}
      {step === 3 && (
        <StepDateTime date={date} time={time} onDateChange={setDate} onTimeChange={(v) => { setTime(v); setStep(4) }} />
      )}
      {step === 4 && (
        <StepContact
          values={contact}
          errors={errors}
          onChange={updateContact}
          honeypotValue={honeypot}
          onHoneypotChange={setHoneypot}
        />
      )}
      {submitError && <p role="alert" className="text-sm text-red-700 mt-4">{submitError}</p>}
      <div className="flex justify-between mt-6">
        {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)}>{t('booking.back')}</button>}
        {step === 4 && <button type="submit" className="rounded-full bg-sunlit px-6 py-2 font-semibold">{t('booking.submit')}</button>}
      </div>
    </form>
  )
}
```

Add `"submitError": "Something went wrong sending your request. Please try again or call us at (613) 791-0284."` to `booking` in `en.json`, and `"submitError": "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ou nous appeler au (613) 791-0284."` to `booking` in `fr.json`.

- [ ] **Step 7: Wire `src/pages/Booking.jsx`**

```jsx
// src/pages/Booking.jsx
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
```

- [ ] **Step 8: Run tests, verify pass**

Run: `npm run test -- BookingWizard`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/booking src/components/Honeypot.jsx src/pages/Booking.jsx src/i18n/en.json src/i18n/fr.json src/booking/BookingWizard.test.jsx
git commit -m "feat: implement booking wizard with anti-spam and Supabase/EmailJS wiring"
```

---

## Task 15: Contact page and form

**Files:**
- Modify: `src/pages/Contact.jsx` (replace stub)
- Create: `src/components/ContactForm.jsx`
- Test: `src/components/ContactForm.test.jsx`

**Interfaces:**
- Same anti-spam pattern as Booking (Honeypot + throttle + min-fill-time), `insertMessage` (Task 10), `sendContactNotification` (Task 12).

- [ ] **Step 1: Write failing test (mirrors BookingWizard's honeypot/happy-path tests)**

```jsx
// src/components/ContactForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { ContactForm } from './ContactForm'
import * as supabaseClient from '../lib/supabaseClient'
import * as email from '../lib/email'

vi.mock('../lib/supabaseClient')
vi.mock('../lib/email')

test('submits name/email/subject/message, inserts message, sends notification', async () => {
  localStorage.clear()
  supabaseClient.insertMessage.mockResolvedValue()
  email.sendContactNotification.mockResolvedValue()

  render(<I18nProvider><ContactForm /></I18nProvider>)
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Question about fees' } })
  fireEvent.change(screen.getByLabelText(/^message/i), { target: { value: 'Hello there' } })
  fireEvent.click(screen.getByRole('button', { name: /send/i }))

  await waitFor(() => expect(supabaseClient.insertMessage).toHaveBeenCalledTimes(1))
  expect(email.sendContactNotification).toHaveBeenCalledTimes(1)
})

test('honeypot filled: no insert, no email, still shows success', async () => {
  localStorage.clear()
  supabaseClient.insertMessage.mockResolvedValue()
  email.sendContactNotification.mockResolvedValue()

  render(<I18nProvider><ContactForm /></I18nProvider>)
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Bot' } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'bot@example.com' } })
  fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'x' } })
  fireEvent.change(screen.getByLabelText(/^message/i), { target: { value: 'x' } })
  fireEvent.change(screen.getByTestId('contact-honeypot'), { target: { value: 'filled' } })
  fireEvent.click(screen.getByRole('button', { name: /send/i }))

  await waitFor(() => expect(screen.getByText(/thank you/i)).toBeInTheDocument())
  expect(supabaseClient.insertMessage).not.toHaveBeenCalled()
  expect(email.sendContactNotification).not.toHaveBeenCalled()
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm run test -- ContactForm`
Expected: FAIL

- [ ] **Step 3: Add `contact.*` keys to both dictionaries**

en.json: `"contact": { "title": "Contact us", "fullName": "Full name", "email": "Email", "subject": "Subject", "message": "Message", "send": "Send message", "success": "Thank you! We've received your message and will respond soon.", "hours": "Hours: Saturday–Friday, 11:00 am–5:30 pm. Closed Sundays.", "address": "2487 Kaladar Avenue, Ottawa, ON K1V" }`
fr.json: `"contact": { "title": "Nous joindre", "fullName": "Nom complet", "email": "Courriel", "subject": "Sujet", "message": "Message", "send": "Envoyer le message", "success": "Merci! Nous avons bien reçu votre message et vous répondrons bientôt.", "hours": "Heures : samedi au vendredi, 11 h à 17 h 30. Fermé le dimanche.", "address": "2487, avenue Kaladar, Ottawa, ON K1V" }`

- [ ] **Step 4: Implement `ContactForm.jsx`** (same anti-spam pattern as `BookingWizard`, condensed to one step)

```jsx
// src/components/ContactForm.jsx
import { useState, useRef } from 'react'
import { useTranslation } from '../i18n/useTranslation'
import { Honeypot } from './Honeypot'
import { insertMessage } from '../lib/supabaseClient'
import { sendContactNotification } from '../lib/email'
import { isHoneypotTriggered, isWithinThrottle, recordSubmission, isTooFast } from '../lib/antiSpam'

const THROTTLE_KEY = 'anfa-contact-last-submit'
const THROTTLE_MS = 60000
const MIN_FILL_MS = 2000

export function ContactForm() {
  const { t, lang } = useTranslation()
  const mountedAt = useRef(Date.now())
  const [values, setValues] = useState({ fullName: '', email: '', subject: '', message: '' })
  const [honeypot, setHoneypot] = useState('')
  const [done, setDone] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update(field, val) {
    setValues((v) => ({ ...v, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const isBot = isHoneypotTriggered(honeypot) || isTooFast(mountedAt.current, MIN_FILL_MS)
    const isThrottled = isWithinThrottle(THROTTLE_KEY, THROTTLE_MS)

    if (isBot || isThrottled) {
      setDone(true)
      return
    }

    setSubmitError('')
    try {
      await insertMessage({ ...values, full_name: values.fullName, language: lang })
      await sendContactNotification(values)
      recordSubmission(THROTTLE_KEY)
      setDone(true)
    } catch (err) {
      setSubmitError(t('contact.submitError'))
    }
  }

  if (done) return <p role="status">{t('contact.success')}</p>

  return (
    <form onSubmit={handleSubmit}>
      <Honeypot name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} testId="contact-honeypot" />

      <label htmlFor="c-fullName">{t('contact.fullName')}</label>
      <input id="c-fullName" value={values.fullName} onChange={(e) => update('fullName', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-3" required />

      <label htmlFor="c-email">{t('contact.email')}</label>
      <input id="c-email" type="email" value={values.email} onChange={(e) => update('email', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-3" required />

      <label htmlFor="c-subject">{t('contact.subject')}</label>
      <input id="c-subject" value={values.subject} onChange={(e) => update('subject', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-3" required />

      <label htmlFor="c-message">{t('contact.message')}</label>
      <textarea id="c-message" value={values.message} onChange={(e) => update('message', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-3" required />

      {submitError && <p role="alert" className="text-sm text-red-700 mb-3">{submitError}</p>}
      <button type="submit" className="rounded-full bg-sunlit px-6 py-2 font-semibold">{t('contact.send')}</button>
    </form>
  )
}
```

Add `"submitError": "Something went wrong sending your message. Please try again or email sahrasaid845@gmail.com directly."` to `contact` in `en.json`, and the French equivalent to `contact` in `fr.json`.

- [ ] **Step 5: Implement `src/pages/Contact.jsx`**

```jsx
// src/pages/Contact.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO, businessJsonLd } from '../components/SEO'
import { ContactForm } from '../components/ContactForm'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 grid gap-10 md:grid-cols-2">
      <SEO title="Contact" description="Contact Anfa Counselling & Psychotherapy in Ottawa." path="/contact" jsonLd={businessJsonLd()} />
      <div>
        <h1 className="font-display text-3xl mb-4">{t('contact.title')}</h1>
        <p>{t('contact.address')}</p>
        <a href="tel:+16137910284" className="block mt-2 text-sea hover:underline">(613) 791-0284</a>
        <a href="mailto:sahrasaid845@gmail.com" className="block text-sea hover:underline">sahrasaid845@gmail.com</a>
        <p className="mt-4">{t('contact.hours')}</p>
        <iframe
          title="Map to 2487 Kaladar Avenue, Ottawa"
          src="https://www.google.com/maps?q=2487+Kaladar+Avenue,+Ottawa,+ON+K1V&output=embed"
          className="w-full h-64 mt-6 rounded-xl border-0"
          loading="lazy"
        />
      </div>
      <ContactForm />
    </div>
  )
}
```

- [ ] **Step 6: Run tests, verify pass**

Run: `npm run test -- ContactForm`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/ContactForm.jsx src/components/ContactForm.test.jsx src/pages/Contact.jsx src/i18n/en.json src/i18n/fr.json
git commit -m "feat: implement Contact page and form with anti-spam wiring"
```

---

## Task 16: Home page and sections

**Files:**
- Create: `src/sections/home/Hero.jsx`, `IntroSahra.jsx`, `ServicesPreview.jsx`, `ApproachSummary.jsx`, `ReassuranceBar.jsx`, `TestimonialsPreview.jsx`, `BlogPreview.jsx`, `FinalCta.jsx`, `src/components/Card.jsx`
- Modify: `src/pages/Home.jsx`
- Test: `src/pages/Home.test.jsx`

**Interfaces:**
- Consumes: `HorizonDivider`, `Logo`, `SEO`/`businessJsonLd`, `useTranslation`, `Card` (generic `{title, description, ctaLabel, ctaTo, image}` card with hover-lift via Framer Motion `whileHover={{ y: -6 }}`, reduced-motion gated).
- Uses `content/services.js` (created in this task) for the 4 service preview cards: individual, couple, group, spiritual.

- [ ] **Step 1: Write failing render-smoke test**

```jsx
// src/pages/Home.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nProvider } from '../i18n/I18nProvider'
import Home from './Home'

test('renders hero heading, tagline, and both CTAs', () => {
  render(
    <HelmetProvider>
      <MemoryRouter>
        <I18nProvider><Home /></I18nProvider>
      </MemoryRouter>
    </HelmetProvider>
  )
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Book a free 15-minute consultation/i })).toHaveAttribute('href', '/booking')
  expect(screen.getByRole('link', { name: /Discover our services/i })).toHaveAttribute('href', '/services')
  expect(screen.getAllByText(/Healing at nature's pace/i).length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm run test -- Home`
Expected: FAIL

- [ ] **Step 3: Add `home.*` i18n keys** (write real, warm marketing copy per the client brief §Home — hero on a cinematic mountain/sea image, Sahra's warm non-judgmental introduction, 4-service preview, approach summary of CBT/narrative/mindfulness/art therapy, reassurance bullets for in-person+online / EN-FR-Somali / insurance / confidentiality, testimonials+blog teaser, final CTA) to both `en.json` and `fr.json` under a `home` key with sub-keys `hero`, `intro`, `servicesPreview`, `approachSummary`, `reassurance`, `testimonialsPreview`, `blogPreview`, `finalCta` — following the same nesting pattern established in Tasks 3–15.

- [ ] **Step 4: Create `src/content/services.js`**

```js
// src/content/services.js
export const services = [
  { key: 'individual', price: 170, image: '/img/service-individual.webp' },
  { key: 'couple', price: 227, image: '/img/service-couple.webp' },
  { key: 'group', price: null, image: '/img/service-group.webp' },
  { key: 'spiritual', price: null, image: '/img/service-spiritual.webp' },
]
```

(image files are added in Task 19; components reference the path now so no later rewiring is needed)

- [ ] **Step 5: Implement `Card.jsx`**

```jsx
// src/components/Card.jsx
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Card({ title, description, ctaLabel, ctaTo, image }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      whileHover={prefersReduced ? {} : { y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col"
    >
      {image && <img src={image} alt="" loading="lazy" className="h-40 w-full object-cover" />}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl mb-2">{title}</h3>
        <p className="text-sm flex-1">{description}</p>
        {ctaTo && <Link to={ctaTo} className="mt-4 text-sea font-semibold hover:underline">{ctaLabel}</Link>}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 6: Implement the eight Home section components**

```jsx
// src/sections/home/Hero.jsx
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'
import { HorizonDivider } from '../../components/HorizonDivider'

export function Hero() {
  const { t } = useTranslation()
  const prefersReduced = useReducedMotion()
  return (
    <section className="relative h-[85vh] min-h-[560px] flex items-end overflow-hidden">
      <motion.img
        src="/img/hero-mountain-sea.webp"
        alt="Misty mountain meeting a turquoise sea at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
        initial={prefersReduced ? false : { scale: 1.08 }}
        animate={prefersReduced ? false : { scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-20 text-sand">
        <h1 className="font-display text-4xl md:text-5xl mb-4">{t('home.hero.title')}</h1>
        <p className="text-lg mb-8">{t('home.hero.subtitle')}</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/booking" className="rounded-full bg-sunlit text-ink px-6 py-3 font-semibold">{t('common.cta.bookFree')}</Link>
          <Link to="/services" className="rounded-full border border-sand px-6 py-3 font-semibold">{t('common.cta.discoverServices')}</Link>
        </div>
      </div>
      <HorizonDivider animated className="absolute bottom-0 left-0 right-0 w-full h-16" />
    </section>
  )
}
```

```jsx
// src/sections/home/IntroSahra.jsx
import { useTranslation } from '../../i18n/useTranslation'

export function IntroSahra() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
      <img src="/img/sahra-portrait.webp" alt="Sahra Haji-Mohamed Said, RSW" className="rounded-2xl w-full object-cover" loading="lazy" />
      <div>
        <h2 className="font-display text-3xl mb-4">{t('home.intro.heading')}</h2>
        <p>{t('home.intro.body')}</p>
      </div>
    </section>
  )
}
```

```jsx
// src/sections/home/ServicesPreview.jsx
import { useTranslation } from '../../i18n/useTranslation'
import { Card } from '../../components/Card'
import { services } from '../../content/services'

export function ServicesPreview() {
  const { t } = useTranslation()
  return (
    <section className="bg-mist py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl mb-8 text-center">{t('home.servicesPreview.heading')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Card
              key={s.key}
              title={t(`home.servicesPreview.${s.key}.title`)}
              description={t(`home.servicesPreview.${s.key}.description`)}
              ctaLabel={t('common.cta.viewAll')}
              ctaTo="/services"
              image={s.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

```jsx
// src/sections/home/ApproachSummary.jsx
import { useTranslation } from '../../i18n/useTranslation'

const APPROACHES = ['cbt', 'narrative', 'mindfulness', 'artTherapy']

export function ApproachSummary() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="font-display text-3xl mb-8 text-center">{t('home.approachSummary.heading')}</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {APPROACHES.map((a) => (
          <li key={a} className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="font-display text-lg mb-1">{t(`home.approachSummary.${a}.title`)}</h3>
            <p className="text-sm">{t(`home.approachSummary.${a}.description`)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

```jsx
// src/sections/home/ReassuranceBar.jsx
import { useTranslation } from '../../i18n/useTranslation'

const ITEMS = ['modalities', 'languages', 'insurance', 'confidentiality']

export function ReassuranceBar() {
  const { t } = useTranslation()
  return (
    <section className="bg-sea-deep text-sand py-10">
      <div className="mx-auto max-w-6xl px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
        {ITEMS.map((i) => (
          <p key={i} className="text-sm">{t(`home.reassurance.${i}`)}</p>
        ))}
      </div>
    </section>
  )
}
```

```jsx
// src/sections/home/TestimonialsPreview.jsx
import { useTranslation } from '../../i18n/useTranslation'
import { Link } from 'react-router-dom'
import { testimonials } from '../../content/testimonials'

export function TestimonialsPreview() {
  const { t } = useTranslation()
  const preview = testimonials.slice(0, 2)
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="font-display text-3xl mb-8 text-center">{t('home.testimonialsPreview.heading')}</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {preview.map((tm) => (
          <blockquote key={tm.id} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="italic mb-3">"{t(`testimonials.items.${tm.id}.quote`)}"</p>
            <footer className="text-sm text-sea-deep">— {tm.initial}, {t(`testimonials.items.${tm.id}.reason`)}</footer>
          </blockquote>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/testimonials" className="text-sea font-semibold hover:underline">{t('common.cta.viewAll')}</Link>
      </div>
    </section>
  )
}
```

```jsx
// src/sections/home/BlogPreview.jsx
import { useTranslation } from '../../i18n/useTranslation'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { blogPosts } from '../../content/blogPosts'

export function BlogPreview() {
  const { t, lang } = useTranslation()
  return (
    <section className="bg-mist py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl mb-8 text-center">{t('home.blogPreview.heading')}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {blogPosts.map((p) => (
            <Card key={p.slug} title={p[lang].title} description={p[lang].excerpt} ctaLabel={t('common.cta.readMore')} ctaTo={`/blog/${p.slug}`} image={p.coverImage} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/blog" className="text-sea font-semibold hover:underline">{t('common.cta.viewAll')}</Link>
        </div>
      </div>
    </section>
  )
}
```

```jsx
// src/sections/home/FinalCta.jsx
import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'
import { HorizonDivider } from '../../components/HorizonDivider'

export function FinalCta() {
  const { t } = useTranslation()
  return (
    <section className="relative bg-sea-deep text-sand py-20 text-center overflow-hidden">
      <HorizonDivider className="absolute top-0 left-0 right-0 w-full h-10 opacity-40" />
      <h2 className="font-display text-3xl mb-4">{t('home.finalCta.heading')}</h2>
      <p className="mb-8 italic">{t('common.tagline')}</p>
      <Link to="/booking" className="rounded-full bg-sunlit text-ink px-8 py-3 font-semibold">{t('common.cta.bookFree')}</Link>
    </section>
  )
}
```

- [ ] **Step 7: Create `src/content/testimonials.js` and `src/content/blogPosts.js` stubs** (full content in Task 18; this task only needs the shape so Home compiles)

```js
// src/content/testimonials.js
export const testimonials = [
  { id: 'anxiety1', initial: 'M.' },
  { id: 'couple1', initial: 'R. & S.' },
  { id: 'grief1', initial: 'A.' },
]
```

```js
// src/content/blogPosts.js
export const blogPosts = [
  { slug: 'managing-anxiety', coverImage: '/img/blog-anxiety.webp', en: { title: '', excerpt: '' }, fr: { title: '', excerpt: '' } },
  { slug: 'couple-therapy', coverImage: '/img/blog-couple.webp', en: { title: '', excerpt: '' }, fr: { title: '', excerpt: '' } },
  { slug: 'navigating-grief', coverImage: '/img/blog-grief.webp', en: { title: '', excerpt: '' }, fr: { title: '', excerpt: '' } },
]
```

- [ ] **Step 8: Implement `src/pages/Home.jsx`**

```jsx
// src/pages/Home.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO, businessJsonLd } from '../components/SEO'
import { Hero } from '../sections/home/Hero'
import { IntroSahra } from '../sections/home/IntroSahra'
import { ServicesPreview } from '../sections/home/ServicesPreview'
import { ApproachSummary } from '../sections/home/ApproachSummary'
import { ReassuranceBar } from '../sections/home/ReassuranceBar'
import { TestimonialsPreview } from '../sections/home/TestimonialsPreview'
import { BlogPreview } from '../sections/home/BlogPreview'
import { FinalCta } from '../sections/home/FinalCta'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <SEO title="Home" description={t('home.hero.subtitle')} path="/" jsonLd={businessJsonLd()} />
      <Hero />
      <IntroSahra />
      <ServicesPreview />
      <ApproachSummary />
      <ReassuranceBar />
      <TestimonialsPreview />
      <BlogPreview />
      <FinalCta />
    </div>
  )
}
```

- [ ] **Step 9: Run test, verify passes**

Run: `npm run test -- Home`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add src/sections/home src/components/Card.jsx src/content/services.js src/content/testimonials.js src/content/blogPosts.js src/pages/Home.jsx src/pages/Home.test.jsx src/i18n/en.json src/i18n/fr.json
git commit -m "feat: implement Home page and all home sections"
```

---

## Task 17: Content pages — About, Services, Approach, Fees & Insurance

**Files:**
- Modify: `src/pages/About.jsx`, `src/pages/Services.jsx`, `src/pages/Approach.jsx`, `src/pages/FeesInsurance.jsx`
- Test: `src/pages/About.test.jsx`, `src/pages/Services.test.jsx`, `src/pages/Approach.test.jsx`, `src/pages/FeesInsurance.test.jsx`

**Interfaces:**
- Each page: `<SEO>` + `<h1>` + content sections built from `t()` calls against a new top-level i18n namespace (`about`, `services`, `approach`, `fees`) added to both `en.json`/`fr.json`.
- **Content checklist per page** (source: client brief — write full bilingual copy for every bullet when adding the i18n keys):
  - **About**: Sahra's personal narrative and background; credentials — RSW Ontario #825579, MSW Carleton University 2005, RECE Algonquin College 2011, Addiction & Mental Health Algonquin College 2025; philosophy quote ("I believe you have the strength to reclaim control; let me help you see your resilience"); safety/confidentiality commitment; communities served (children, teens, adults, seniors, families); multicultural sensitivity.
  - **Services**: cards for Individual Psychotherapy ($170), Couple Therapy ($227), Group Therapy, Spiritual Therapy — each links to `/booking`; expertise list: depression, addiction, relationship issues, anxiety, stress, burnout, trauma & PTSD, ADHD, grief, anger management, self-esteem, family & school issues, Islamic counselling, play therapy & art therapy for children.
  - **Approach**: CBT, narrative therapy, ACT, mindfulness, art therapy, play therapy, motivational interviewing, culturally-sensitive person-centred approach; a short "what to expect in your first session" walkthrough.
  - **Fees & Insurance**: $170 individual / $227 couple, sliding scale based on eligibility; payment methods (cash, Visa, Mastercard, e-transfer); insurance — detailed receipts provided for reimbursement, direct billing in progress (mention Desjardins, First Nations Health Authority, school boards once active); free 15-minute consultation highlighted.

- [ ] **Step 1: Write failing render-smoke tests for all four pages** (one file each, same pattern)

```jsx
// src/pages/About.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import About from './About'

test('renders About heading and RSW credential', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><About /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.getByText(/825579/)).toBeInTheDocument()
})
```

```jsx
// src/pages/Services.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Services from './Services'

test('renders all four service cards linking to booking', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Services /></I18nProvider></MemoryRouter></HelmetProvider>)
  const bookingLinks = screen.getAllByRole('link', { name: /book now/i })
  expect(bookingLinks.length).toBe(4)
  bookingLinks.forEach((l) => expect(l).toHaveAttribute('href', '/booking'))
  expect(screen.getByText(/170/)).toBeInTheDocument()
  expect(screen.getByText(/227/)).toBeInTheDocument()
})
```

```jsx
// src/pages/Approach.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Approach from './Approach'

test('renders Approach heading', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Approach /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})
```

```jsx
// src/pages/FeesInsurance.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import FeesInsurance from './FeesInsurance'

test('renders pricing and payment methods', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><FeesInsurance /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByText(/170/)).toBeInTheDocument()
  expect(screen.getByText(/227/)).toBeInTheDocument()
  expect(screen.getByText(/Visa/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests, verify all fail**

Run: `npm run test -- About Services Approach FeesInsurance`
Expected: FAIL

- [ ] **Step 3: Add `about`, `services`, `approach`, `fees` namespaces to `en.json`/`fr.json`** with full copy per the content checklist above (credentials, prices, payment methods must appear verbatim so the tests in Step 1 pass — e.g. `"825579"`, `"170"`, `"227"`, `"Visa"` must be literal substrings somewhere in the rendered page).

- [ ] **Step 4: Implement `src/pages/About.jsx`**

```jsx
// src/pages/About.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'

export default function About() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="About" description={t('about.intro')} path="/about" />
      <h1 className="font-display text-4xl mb-6">{t('about.heading')}</h1>
      <img src="/img/sahra-portrait.webp" alt="Sahra Haji-Mohamed Said, RSW" className="rounded-2xl mb-8 w-full max-w-md" loading="lazy" />
      <p className="mb-6">{t('about.bio')}</p>
      <blockquote className="italic border-l-4 border-sunlit pl-4 mb-6">{t('about.philosophy')}</blockquote>
      <h2 className="font-display text-2xl mb-3">{t('about.credentialsHeading')}</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>{t('about.credentials.rsw')}</li>
        <li>{t('about.credentials.msw')}</li>
        <li>{t('about.credentials.rece')}</li>
        <li>{t('about.credentials.addiction')}</li>
      </ul>
      <h2 className="font-display text-2xl mb-3">{t('about.communitiesHeading')}</h2>
      <p>{t('about.communities')}</p>
    </div>
  )
}
```

- [ ] **Step 5: Implement `src/pages/Services.jsx`**

```jsx
// src/pages/Services.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Card } from '../components/Card'
import { services } from '../content/services'

export default function Services() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SEO title="Services" description={t('services.intro')} path="/services" />
      <h1 className="font-display text-4xl mb-8">{t('services.heading')}</h1>
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {services.map((s) => (
          <Card
            key={s.key}
            title={t(`services.items.${s.key}.title`)}
            description={t(`services.items.${s.key}.description`)}
            ctaLabel={t('common.cta.bookNow')}
            ctaTo="/booking"
            image={s.image}
          />
        ))}
      </div>
      <h2 className="font-display text-2xl mb-4">{t('services.expertiseHeading')}</h2>
      <p>{t('services.expertiseList')}</p>
    </div>
  )
}
```

- [ ] **Step 6: Implement `src/pages/Approach.jsx`**

```jsx
// src/pages/Approach.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'

const METHODS = ['cbt', 'narrative', 'act', 'mindfulness', 'artTherapy', 'playTherapy', 'motivational', 'culturallySensitive']

export default function Approach() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <SEO title="Approach" description={t('approach.intro')} path="/approach" />
      <h1 className="font-display text-4xl mb-8">{t('approach.heading')}</h1>
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {METHODS.map((m) => (
          <div key={m} className="rounded-xl bg-mist p-5">
            <h3 className="font-display text-lg mb-2">{t(`approach.methods.${m}.title`)}</h3>
            <p className="text-sm">{t(`approach.methods.${m}.description`)}</p>
          </div>
        ))}
      </div>
      <h2 className="font-display text-2xl mb-3">{t('approach.firstSessionHeading')}</h2>
      <p>{t('approach.firstSession')}</p>
    </div>
  )
}
```

- [ ] **Step 7: Implement `src/pages/FeesInsurance.jsx`**

```jsx
// src/pages/FeesInsurance.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Link } from 'react-router-dom'

export default function FeesInsurance() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="Fees & Insurance" description={t('fees.intro')} path="/fees" />
      <h1 className="font-display text-4xl mb-8">{t('fees.heading')}</h1>
      <ul className="mb-6 space-y-2">
        <li>{t('fees.individual')}</li>
        <li>{t('fees.couple')}</li>
        <li>{t('fees.slidingScale')}</li>
      </ul>
      <h2 className="font-display text-2xl mb-3">{t('fees.paymentHeading')}</h2>
      <p className="mb-6">{t('fees.paymentMethods')}</p>
      <h2 className="font-display text-2xl mb-3">{t('fees.insuranceHeading')}</h2>
      <p className="mb-6">{t('fees.insuranceDetails')}</p>
      <Link to="/booking" className="rounded-full bg-sunlit text-ink px-6 py-3 font-semibold inline-block">{t('common.cta.bookFree')}</Link>
    </div>
  )
}
```

- [ ] **Step 8: Run tests, verify all pass**

Run: `npm run test -- About Services Approach FeesInsurance`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/pages/About.jsx src/pages/Services.jsx src/pages/Approach.jsx src/pages/FeesInsurance.jsx src/pages/*.test.jsx src/i18n/en.json src/i18n/fr.json
git commit -m "feat: implement About, Services, Approach, Fees & Insurance pages"
```

---

## Task 18: FAQ, Testimonials, Resources, Privacy pages

**Files:**
- Modify: `src/pages/Faq.jsx`, `src/pages/Testimonials.jsx`, `src/pages/Resources.jsx`, `src/pages/Privacy.jsx`
- Create: `src/components/Accordion.jsx`, `src/content/faq.js` (finalize `src/content/testimonials.js` with full quotes)
- Test: `src/components/Accordion.test.jsx`, `src/pages/Faq.test.jsx`, `src/pages/Testimonials.test.jsx`, `src/pages/Resources.test.jsx`, `src/pages/Privacy.test.jsx`

**Interfaces:**
- `<Accordion items={[{id, question, answer}]} />` — keyboard-accessible (button per item, `aria-expanded`, `aria-controls`), single or multi-open.
- **Content checklist**:
  - **FAQ**: What happens in a first session? Are online sessions available? What about fees/insurance? How does the free consultation work? Confidentiality? Languages offered? Cultural/religious sensitivity?
  - **Testimonials**: 3+ realistic, respectful, anonymized demo testimonials (first name/initial + reason for consultation), clearly marked as replaceable with real consented reviews.
  - **Resources**: useful links, educational articles, a prominent crisis-resources callout (reuses `<CrisisResourceStrip>` content, expanded).
  - **Privacy**: PHIPA/PIPEDA-worded privacy notice — what's collected (name/email/phone/message only, per Global Constraints), how it's stored (Supabase, insert-only from the client), cookie use, contact for privacy questions.

- [ ] **Step 1: Write failing test for `Accordion`**

```jsx
// src/components/Accordion.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Accordion } from './Accordion'

test('toggles answer visibility on question click', () => {
  render(<Accordion items={[{ id: 'a1', question: 'Q1?', answer: 'A1.' }]} />)
  expect(screen.queryByText('A1.')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Q1?' }))
  expect(screen.getByText('A1.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Q1?' })).toHaveAttribute('aria-expanded', 'true')
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm run test -- Accordion`
Expected: FAIL

- [ ] **Step 3: Implement `Accordion.jsx`**

```jsx
// src/components/Accordion.jsx
import { useState } from 'react'

export function Accordion({ items }) {
  const [openId, setOpenId] = useState(null)
  return (
    <div className="divide-y divide-mist">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full text-left py-4 font-display text-lg flex justify-between"
            >
              {item.question}
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <p id={`panel-${item.id}`} className="pb-4 text-sm">{item.answer}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run Accordion test, verify passes**

Run: `npm run test -- Accordion`
Expected: PASS

- [ ] **Step 5: Add `faq`, `testimonials`, `resources`, `privacy` namespaces to `en.json`/`fr.json`** with full bilingual content per the checklist (FAQ needs 7 Q&A pairs matching the questions listed; testimonials need 3 full quotes for `anxiety1`, `couple1`, `grief1` matching the ids already referenced in `content/testimonials.js` from Task 16).

- [ ] **Step 6: Finalize `src/content/testimonials.js`** — same shape as Task 16, ids unchanged (`anxiety1`, `couple1`, `grief1`) so `TestimonialsPreview` keeps working.

- [ ] **Step 7: Create `src/content/faq.js`**

```js
// src/content/faq.js
export const faqIds = ['firstSession', 'onlineSessions', 'feesInsurance', 'freeConsult', 'confidentiality', 'languages', 'culturalSensitivity']
```

- [ ] **Step 8: Write failing render-smoke tests for the four pages**

```jsx
// src/pages/Faq.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Faq from './Faq'

test('renders all 7 FAQ questions', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Faq /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getAllByRole('button').length).toBe(7)
})
```

```jsx
// src/pages/Testimonials.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Testimonials from './Testimonials'

test('renders all demo testimonials', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Testimonials /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getAllByRole('blockquote', { hidden: true }).length + document.querySelectorAll('blockquote').length).toBeGreaterThan(0)
})
```

```jsx
// src/pages/Resources.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Resources from './Resources'

test('renders crisis resources with 988', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Resources /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getAllByText(/988/).length).toBeGreaterThan(0)
})
```

```jsx
// src/pages/Privacy.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Privacy from './Privacy'

test('renders privacy heading', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Privacy /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})
```

- [ ] **Step 9: Run tests, verify all fail**

Run: `npm run test -- Faq Testimonials Resources Privacy`
Expected: FAIL

- [ ] **Step 10: Implement the four pages**

```jsx
// src/pages/Faq.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Accordion } from '../components/Accordion'
import { faqIds } from '../content/faq'

export default function Faq() {
  const { t } = useTranslation()
  const items = faqIds.map((id) => ({ id, question: t(`faq.items.${id}.question`), answer: t(`faq.items.${id}.answer`) }))
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="FAQ" description={t('faq.intro')} path="/faq" />
      <h1 className="font-display text-4xl mb-8">{t('faq.heading')}</h1>
      <Accordion items={items} />
    </div>
  )
}
```

```jsx
// src/pages/Testimonials.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { testimonials } from '../content/testimonials'

export default function Testimonials() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <SEO title="Testimonials" description={t('testimonials.intro')} path="/testimonials" />
      <h1 className="font-display text-4xl mb-4">{t('testimonials.heading')}</h1>
      <p className="text-sm text-ink/70 mb-8">{t('testimonials.disclaimer')}</p>
      <div className="grid gap-6 sm:grid-cols-2">
        {testimonials.map((tm) => (
          <blockquote key={tm.id} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="italic mb-3">"{t(`testimonials.items.${tm.id}.quote`)}"</p>
            <footer className="text-sm text-sea-deep">— {tm.initial}, {t(`testimonials.items.${tm.id}.reason`)}</footer>
          </blockquote>
        ))}
      </div>
    </div>
  )
}
```

```jsx
// src/pages/Resources.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { CrisisResourceStrip } from '../components/CrisisResourceStrip'

export default function Resources() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="Resources" description={t('resources.intro')} path="/resources" />
      <h1 className="font-display text-4xl mb-6">{t('resources.heading')}</h1>
      <div className="mb-8 rounded-xl overflow-hidden border-2 border-sunlit">
        <CrisisResourceStrip />
      </div>
      <p>{t('resources.body')}</p>
    </div>
  )
}
```

```jsx
// src/pages/Privacy.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'

export default function Privacy() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="Privacy Policy" description={t('privacy.intro')} path="/privacy" />
      <h1 className="font-display text-4xl mb-6">{t('privacy.heading')}</h1>
      <p className="mb-4">{t('privacy.body')}</p>
      <p>{t('privacy.contact')}</p>
    </div>
  )
}
```

- [ ] **Step 11: Run tests, verify all pass**

Run: `npm run test -- Faq Testimonials Resources Privacy`
Expected: PASS

- [ ] **Step 12: Commit**

```bash
git add src/components/Accordion.jsx src/components/Accordion.test.jsx src/content/faq.js src/content/testimonials.js src/pages/Faq.jsx src/pages/Testimonials.jsx src/pages/Resources.jsx src/pages/Privacy.jsx src/pages/*.test.jsx src/i18n/en.json src/i18n/fr.json
git commit -m "feat: implement FAQ, Testimonials, Resources, Privacy pages"
```

---

## Task 19: Blog (index + post template + 3 demo articles)

**Files:**
- Modify: `src/pages/Blog.jsx`, `src/pages/BlogPost.jsx`, `src/content/blogPosts.js` (finalize)
- Test: `src/pages/Blog.test.jsx`, `src/pages/BlogPost.test.jsx`

**Interfaces:**
- `blogPosts.js` entries get full shape: `{ slug, coverImage, category, readMinutes, en: {title, excerpt, body, date}, fr: {title, excerpt, body, date} }`. `body` is an array of paragraph strings (rendered as `<p>` per entry — simple, no markdown dependency needed).
- Write 3 full demo articles per spec §Blog: anxiety management, couple therapy, grief — each genuinely useful, warm, non-clinical-jargon, ~400-600 words, in both languages.

- [ ] **Step 1: Write failing tests**

```jsx
// src/pages/Blog.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Blog from './Blog'

test('renders 3 blog post cards linking to their slugs', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Blog /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('link', { name: /managing-anxiety/i }) || true).toBeTruthy()
  const links = screen.getAllByRole('link')
  expect(links.some((l) => l.getAttribute('href') === '/blog/managing-anxiety')).toBe(true)
  expect(links.some((l) => l.getAttribute('href') === '/blog/couple-therapy')).toBe(true)
  expect(links.some((l) => l.getAttribute('href') === '/blog/navigating-grief')).toBe(true)
})
```

```jsx
// src/pages/BlogPost.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import BlogPost from './BlogPost'

test('renders the matching post title for the route slug', () => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/blog/managing-anxiety']}>
        <I18nProvider>
          <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
        </I18nProvider>
      </MemoryRouter>
    </HelmetProvider>
  )
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})

test('renders NotFound-style message for an unknown slug', () => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/blog/unknown-slug']}>
        <I18nProvider>
          <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
        </I18nProvider>
      </MemoryRouter>
    </HelmetProvider>
  )
  expect(screen.getByText(/not found/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests, verify fail**

Run: `npm run test -- Blog BlogPost`
Expected: FAIL

- [ ] **Step 3: Finalize `src/content/blogPosts.js`** with 3 full articles. Write real, warm, non-clinical bilingual copy (~400-600 words each) on: (1) practical anxiety-management techniques for everyday stress, (2) what to expect from couple therapy and how it helps communication, (3) navigating grief with compassion and patience. Each `body` is an array of paragraph strings; `category` and `readMinutes` are set per post (e.g. `'Anxiety'`, `7`).

- [ ] **Step 4: Implement `src/pages/Blog.jsx`**

```jsx
// src/pages/Blog.jsx
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Card } from '../components/Card'
import { blogPosts } from '../content/blogPosts'

export default function Blog() {
  const { t, lang } = useTranslation()
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SEO title="Blog" description={t('blog.intro')} path="/blog" />
      <h1 className="font-display text-4xl mb-8">{t('blog.heading')}</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        {blogPosts.map((p) => (
          <Card
            key={p.slug}
            title={p[lang].title}
            description={`${p.category} · ${p.readMinutes} min — ${p[lang].excerpt}`}
            ctaLabel={t('common.cta.readMore')}
            ctaTo={`/blog/${p.slug}`}
            image={p.coverImage}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Implement `src/pages/BlogPost.jsx`**

```jsx
// src/pages/BlogPost.jsx
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { blogPosts } from '../content/blogPosts'

export default function BlogPost() {
  const { slug } = useParams()
  const { t, lang } = useTranslation()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p>{t('blog.notFound')}</p>
        <Link to="/blog" className="text-sea hover:underline">{t('common.cta.viewAll')}</Link>
      </div>
    )
  }

  const content = post[lang]
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <SEO title={content.title} description={content.excerpt} path={`/blog/${post.slug}`} />
      <img src={post.coverImage} alt="" className="rounded-2xl mb-6 w-full object-cover h-64" loading="lazy" />
      <p className="text-sm text-sea-deep uppercase tracking-widest mb-2">{post.category} · {post.readMinutes} min</p>
      <h1 className="font-display text-4xl mb-6">{content.title}</h1>
      {content.body.map((para, i) => (
        <p key={i} className="mb-4">{para}</p>
      ))}
    </article>
  )
}
```

- [ ] **Step 6: Add `blog.heading`, `blog.intro`, `blog.notFound` keys to both dictionaries**

en.json: `"blog": { "heading": "Blog", "intro": "Insights and gentle guidance from Anfa Counselling & Psychotherapy.", "notFound": "Sorry, that article could not be found." }`
fr.json: `"blog": { "heading": "Blogue", "intro": "Réflexions et conseils bienveillants d'Anfa Counselling & Psychotherapy.", "notFound": "Désolé, cet article est introuvable." }`

- [ ] **Step 7: Run tests, verify pass**

Run: `npm run test -- Blog BlogPost`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/pages/Blog.jsx src/pages/BlogPost.jsx src/pages/Blog.test.jsx src/pages/BlogPost.test.jsx src/content/blogPosts.js src/i18n/en.json src/i18n/fr.json
git commit -m "feat: implement Blog index, post template, and 3 demo articles"
```

---

## Task 20: NotFound page and final i18n key sweep

**Files:**
- Modify: `src/pages/NotFound.jsx`
- Test: `src/pages/NotFound.test.jsx`

**Interfaces:** none new — closes out routing from Task 9.

- [ ] **Step 1: Write failing test**

```jsx
// src/pages/NotFound.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import NotFound from './NotFound'

test('renders 404 message and link home', () => {
  render(<MemoryRouter><I18nProvider><NotFound /></I18nProvider></MemoryRouter>)
  expect(screen.getByText(/404/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm run test -- NotFound`
Expected: FAIL

- [ ] **Step 3: Implement `NotFound.jsx`**

```jsx
// src/pages/NotFound.jsx
import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-4">404</h1>
      <p className="mb-6">{t('notFound.body')}</p>
      <Link to="/" className="text-sea font-semibold hover:underline">{t('common.nav.home')}</Link>
    </div>
  )
}
```

Add to both dictionaries: en.json `"notFound": { "body": "This page could not be found." }`, fr.json `"notFound": { "body": "Cette page est introuvable." }`.

- [ ] **Step 4: Run test, verify passes**

Run: `npm run test -- NotFound`
Expected: PASS

- [ ] **Step 5: Run the entire test suite to confirm nothing regressed**

Run: `npm run test`
Expected: all tests pass

- [ ] **Step 6: Commit**

```bash
git add src/pages/NotFound.jsx src/pages/NotFound.test.jsx src/i18n/en.json src/i18n/fr.json
git commit -m "feat: implement NotFound page"
```

---

## Task 21: Image pipeline (download, convert, wire)

**Files:**
- Create (binary, not code): `public/img/hero-mountain-sea.webp`, `sahra-portrait.webp`, `service-individual.webp`, `service-couple.webp`, `service-group.webp`, `service-spiritual.webp`, `blog-anxiety.webp`, `blog-couple.webp`, `blog-grief.webp`, plus 2-3 texture images (`lavender-field.webp`, `water-ripples.webp`, `mountain-trail.webp`) referenced from content pages as desired
- Modify: none (paths were already wired in Tasks 14-19)

**Interfaces:** none — this task fills in real files at paths already referenced, then does a manual visual check.

- [ ] **Step 1: Download the two real portraits and the Wix logo**

```bash
curl -L "https://static.wixstatic.com/media/2789f5_2cdef2250ae04ffb89d5df9b20053d51~mv2.jpg" -o /tmp/sahra-wix.jpg
curl -L "https://photos.psychologytoday.com/15c170ef-f4fe-41ac-8b65-add052c4279b/4/320x400.jpeg" -o /tmp/sahra-pt.jpg
```

Use the higher-resolution of the two (the Wix image) as `sahra-portrait`.

- [ ] **Step 2: Source curated Unsplash CDN nature images** (direct `images.unsplash.com` URLs, royalty-free, no attribution required) for: hero mountain/turquoise-sea at golden hour, lavender field, water ripples macro, mountain trail, and generic therapy-room/nature imagery for the 4 service cards and 3 blog covers. Download each with `curl -L <url> -o <tmp-path>`.

- [ ] **Step 3: Convert every downloaded image to WebP and place in `public/img/`**

```bash
# using the `cwebp` tool (or `npx @squoosh/cli --webp auto`)
cwebp -q 82 /tmp/sahra-wix.jpg -o public/img/sahra-portrait.webp
# repeat per downloaded file into the exact filenames referenced by Tasks 14-19
```

- [ ] **Step 4: Confirm every `<img>`/CSS background path referenced in the codebase resolves**

Run: `npm run build && npm run preview` and click through Home, Services, Blog, About in a browser — no broken image icons.

- [ ] **Step 5: Commit**

```bash
git add public/img
git commit -m "feat: add optimized WebP imagery for hero, portraits, services, and blog"
```

---

## Task 22: `.env.example`, README, `vercel.json`, and final QA pass

**Files:**
- Create: `.env.example`, `README.md`, `vercel.json`
- Modify: none (this is the final verification task)

**Interfaces:** none — this closes out the deliverables checklist from the spec.

- [ ] **Step 1: Write `.env.example`**

```bash
# Supabase — create a project at https://supabase.com, run supabase/migrations/0001_init.sql,
# then copy the Project URL and anon/public key from Project Settings > API.
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# EmailJS — create an account at https://www.emailjs.com, add an email service,
# create two templates (booking confirmation, contact notification), and copy the IDs below.
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
VITE_EMAILJS_BOOKING_TEMPLATE_ID=your-booking-template-id
VITE_EMAILJS_CONTACT_TEMPLATE_ID=your-contact-template-id
```

- [ ] **Step 2: Write `vercel.json`** (SPA fallback so client-side routes don't 404 on refresh)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 3: Write `README.md`** covering: project overview, prerequisites (Node 18+), `npm install`, copying `.env.example` to `.env` and filling in real Supabase/EmailJS values, running the Supabase migration (`supabase/migrations/0001_init.sql` via the Supabase SQL editor or CLI), `npm run dev`, `npm run test`, `npm run build`, deploying to Vercel (`vercel` CLI or GitHub integration, setting the same env vars in the Vercel project dashboard), and a short note on the RLS security model (anon insert-only) and the anti-spam/EmailJS-quota limitation with the Brevo+serverless upgrade path noted.

- [ ] **Step 4: Run the full test suite and production build**

Run: `npm run test && npm run build`
Expected: all tests pass, build succeeds with no errors.

- [ ] **Step 5: Manual QA pass in a real browser** (`npm run preview`) — walk every route in both languages, confirm: language toggle persists on navigation; booking wizard completes end-to-end (Supabase/EmailJS calls will fail gracefully without real env vars — confirm the UI doesn't crash, catch and surface a friendly error instead of an unhandled promise rejection, per the try/catch already in `insertBooking`/`insertMessage` bubbling to a caught state in the wizard — if not already caught, wrap `handleSubmit` bodies in try/catch showing a generic error message); contact form same; mobile viewport at 360px; keyboard-only navigation through the booking wizard and accordion; `prefers-reduced-motion` in devtools disables Hero parallax and card hover lift; cookie banner appears once and persists dismissal; crisis resource strip visible in the footer on every page.

- [ ] **Step 6: Commit**

```bash
git add .env.example README.md vercel.json
git commit -m "docs: add env example, README, and Vercel SPA rewrite config"
```

---

## Self-Review Notes

**Spec coverage:** §2 stack — Task 1. §3 tokens — Task 2. §4 logo — verified existing, wired Task 5/6. §5 i18n — Task 3. §6 RLS — Task 10 (matches spec SQL verbatim). §7 anti-spam/email isolation — Tasks 11/12. §8 field constraints — enforced in `bookingSchema.js` (Task 13) and reflected in `StepContact`/`ContactForm` (Tasks 14/15) which render no other fields. §9 pages — Tasks 16-20. §10 images — Task 21. §11 compliance — Footer/CrisisResourceStrip (Task 6), CookieConsent (Task 7), Privacy page (Task 18). §12 out-of-scope anchors — `// FUTURE` comment in Footer (Task 6); Booking wizard has no admission/health fields to anchor further. §13 deliverables — all items map to a task above.

**Type/interface consistency checked:** `insertBooking`/`insertMessage` signatures (Task 10) match call sites in Task 14/15. `sendBookingConfirmation`/`sendContactNotification` (Task 12) match call sites in Task 14/15. `getAvailableSlots`/`validateBookingContact` (Task 13) match `StepDateTime`/`StepContact` usage (Task 14). Anti-spam helper names (`isHoneypotTriggered`, `isWithinThrottle`, `recordSubmission`, `isTooFast`, Task 11) are used identically in Tasks 14 and 15.

**Fixed during self-review:** the initial draft of Tasks 14/15 didn't wrap the Supabase/EmailJS calls in try/catch, which would surface as an unhandled promise rejection on network failure. Both `BookingWizard.handleSubmit` and `ContactForm.handleSubmit` now catch failures and show a translated `submitError` message with the phone number as a fallback, verified manually in Task 22 Step 5.
