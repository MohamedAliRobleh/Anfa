# Anfa Counselling & Psychotherapy — Website Design Spec

Date: 2026-07-28
Status: Approved by client — proceeding to implementation plan.

## 1. Purpose

Bilingual (EN/FR, Somali-ready), responsive, accessible marketing + booking website for a
solo psychotherapy practice in Ottawa. React 18 + Vite SPA, deployed to Vercel. No online
payments in v1. Primary conversion goal: free 15-minute consultation booking.

## 2. Stack

- React 18 + Vite, React Router (client-side routed SPA)
- Tailwind CSS with a token-based config (palette below)
- Framer Motion for scroll reveals, hero parallax/Ken Burns, card hover lift — all gated
  behind `prefers-reduced-motion`
- Supabase (`bookings`, `messages` tables) — insert-only from the browser, see §6 security
- EmailJS for confirmation/notification emails (client-side, no backend function — see §7)
- react-helmet-async for per-page SEO + LocalBusiness/MedicalBusiness JSON-LD
- Vercel Analytics, gated behind cookie consent (PIPEDA)
- No secrets committed. `.env.example` documents every variable.

## 3. Design tokens

Colors (Tailwind `theme.extend.colors` + CSS custom properties):

| Token | Hex | Use |
|---|---|---|
| `sea` | `#14A69C` | primary |
| `sea-deep` | `#0B5C57` | headings, footer |
| `sunlit` | `#DDB067` | accent / secondary CTA |
| `lavender` | `#9C8FCB` | secondary accent |
| `mist` | `#E6F2EF` | section backgrounds |
| `sand` | `#F7F4ED` | page background |
| `ink` | `#1C2926` | body text |

Fonts (Google Fonts, self-hosted via `@fontsource` or `<link>` with `display=swap`):
- Display: **Fraunces** (headings only, used sparingly)
- Body: **Hanken Grotesk**
- Labels: Hanken Grotesk, uppercase, tracked-out (`tracking-widest`)

Signature element: `<HorizonDivider>` — an SVG ridge-meets-wave path, turquoise→gold
gradient, reused as a section separator across the site and as a 2–3 layer parallax
background in the Hero. One component, no competing decorative effects elsewhere.

## 4. Logo

Six SVGs already exist in `public/img/` (verified — summit-wave concept, correct palette,
Fraunces wordmark): `anfa-logo-full-color.svg`, `anfa-logo-full-white.svg`,
`anfa-logo-full-dark.svg`, `anfa-logo-compact.svg`, `anfa-icon.svg`, `anfa-favicon.svg`.

`<Logo>` component picks the variant by prop (`variant="full-color" | "full-white" |
"full-dark" | "compact"`) and by breakpoint: full lockup on desktop header/footer,
`compact` under 768px, subtitle text hidden under ~200px container width (CSS
container-query or JS width check — implementation detail for the plan).

## 5. i18n

`src/i18n/` — a lightweight React context (`I18nProvider`) holding `lang` state
(`"en" | "fr"`, persisted to `localStorage`, default `"en"`), loading `en.json` and
`fr.json` eagerly (site is small; no need for lazy locale bundles). `useTranslation()`
hook exposes `t(key)` and `lang`/`setLang`. Keys namespaced by page/section
(`home.hero.title`, `booking.step1.heading`, …). Adding Somali later is dropping in
`so.json` with the same key shape — no code changes required beyond the language
switcher option list.

## 6. Data model & Supabase security (firm requirement)

Two tables, both **RLS-enabled**, both **insert-only for `anon`**:

```sql
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service text not null,           -- individual | couple | group | spiritual | free-consult
  modality text not null,          -- in-person | online
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

-- No SELECT/UPDATE/DELETE policies for anon: default-deny means the public
-- anon key can never read, modify, or delete rows. The practice reads
-- submissions via the Supabase dashboard (authenticated) only.
```

No `select`/`update`/`delete` policy is created for `anon`, so RLS default-deny applies —
the publishable anon key embedded in client JS can write but never read data back. This
file ships as `supabase/migrations/0001_init.sql`.

No sensitive health data fields exist in either table — confirmed against the field list
in §8.

## 7. Email delivery & anti-spam (firm requirement)

All email sending is isolated behind `src/lib/email.js`, exporting a single
`sendConfirmationEmail(payload)` / `sendContactNotification(payload)` pair backed by
`@emailjs/browser`. This isolation means switching to Brevo + a Vercel serverless
function later touches one file, not the forms.

Because EmailJS runs client-side against a free-tier quota, both the Booking wizard and
the Contact form get:
- **Honeypot field**: a visually hidden (`aria-hidden`, off-screen, not `display:none` to
  dodge basic bot heuristics) extra input; if populated on submit, the request is silently
  dropped (no Supabase insert, no email call, no error shown to the bot).
- **Client-side throttle**: a submit timestamp kept in `localStorage` per form; a second
  submission of the same form within a cooldown window (e.g. 60s) is blocked client-side
  with a friendly "already sent, thanks" message rather than re-hitting Supabase/EmailJS.
- Minimum fill-time check (reject submits faster than ~2s after the form mounted) as a
  second, cheap bot signal alongside the honeypot.

This is client-side-only mitigation (no backend to do server-side rate limiting in this
architecture) — documented as a known limitation in the README, with the Brevo+serverless
path noted as the upgrade if abuse becomes a problem.

## 8. Forms — field inventory (firm requirement: no sensitive health data)

**Booking wizard** (4 steps): service type, modality, date/time slot, then contact step
with **only**: full name, email, phone, short message (optional, plain text, no symptom/
diagnosis prompts), consent checkbox. Slot grid: Sat–Fri 11:00–17:30, Sunday closed (per
client-provided hours).

**Contact form**: full name, email, subject, message, (+ honeypot, hidden).

Neither form asks about diagnoses, medications, symptoms, or any PHI-adjacent field.

## 9. Pages

Home, About, Services, Approach, Fees & Insurance, Booking, Contact, FAQ, Blog (index +
post template), Testimonials, Resources, Privacy — content per the client brief (bios,
credentials, pricing, service descriptions, FAQ answers, etc. — already fully specified
and not repeated here). 3 demo blog posts (anxiety management, couple therapy, grief) and
demo testimonials, clearly replaceable, ship as structured data in `src/content/`, not
hardcoded in JSX.

## 10. Images

`public/img/` already has the 6 logo SVGs. To add: the two real Sahra portraits and the
Wix logo (fetched from the client-provided URLs), plus curated Unsplash CDN nature/texture
images (golden-hour mountain + turquoise sea, lavender field, water ripples, mountain
trail) and diverse/authentic clientele photography — all converted to WebP, descriptive
alt text, blur-up placeholder loading. These are demo-quality stand-ins the practice can
swap for real high-res photography later.

## 11. Compliance

Privacy page (PHIPA/PIPEDA-worded, footer-linked). Crisis-resource strip in the footer on
every page: "In an emergency, call 911. Suicide Crisis Helpline: 988. Ottawa Distress
Centre: 613-238-3311" (+ FR equivalent). Cookie consent banner gates Vercel Analytics
until accepted.

## 12. Out of scope, anchored not built

Newsletter signup, client portal, online admission forms are not built. Each gets a
clearly named, commented extension point (e.g. `// FUTURE: Jane App / Owl Practice
integration point`) at the natural insertion spot (Booking page, footer) rather than any
scaffolding.

## 13. Deliverables checklist

- [ ] Full Vite/React/Tailwind/Router/Framer Motion app, all 12 routes
- [ ] `supabase/migrations/0001_init.sql` — schema + RLS policies as in §6
- [ ] `src/lib/supabaseClient.js`, `src/lib/email.js` (with honeypot/throttle helpers)
- [ ] `.env.example` documenting Supabase + EmailJS variables
- [ ] `tailwind.config.js` with full token set from §3
- [ ] `src/i18n/en.json`, `src/i18n/fr.json` — complete, no placeholder keys
- [ ] 3 demo blog articles, demo testimonials in `src/content/`
- [ ] `README.md`: install, env setup, local run, Supabase migration steps, Vercel deploy
- [ ] SEO (per-page meta + JSON-LD), WCAG AA pass, mobile-first down to 360px

## 14. Assumptions / open items carried forward

- EmailJS credentials and Supabase project must be created by the client; code ships
  fully wired against env vars but cannot be live-tested without real keys.
- Stock imagery is placeholder-quality, licensed for reuse, swappable later.
