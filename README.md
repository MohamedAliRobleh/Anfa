# Anfa Counselling & Psychotherapy — Website

Bilingual (EN/FR, Somali-ready), responsive, accessible marketing and booking website for
Anfa Counselling & Psychotherapy, a psychotherapy practice in Ottawa, Ontario.

**Stack:** React 18 + Vite, React Router, Tailwind CSS, Framer Motion, Supabase, EmailJS,
react-helmet-async. Deployed as a static SPA on Vercel.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is fine)
- An [EmailJS](https://www.emailjs.com) account (free tier is fine)

## 1. Install dependencies

```bash
npm install
```

## 2. Set up environment variables

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

- **Supabase**: create a project, then in *Project Settings → API* copy the *Project URL*
  into `VITE_SUPABASE_URL` and the `anon` *public* key into `VITE_SUPABASE_ANON_KEY`.
  **Never use the `service_role` key here** — only the public anon key belongs in
  client-side code.
- **EmailJS**: create an account, connect an email service (e.g. Gmail), and create two
  email templates — one for booking confirmations, one for contact form notifications.
  Copy the service ID, public key, and both template IDs into the matching `VITE_EMAILJS_*`
  variables.

## 3. Run the Supabase migration

Open the SQL editor in your Supabase project (or use the Supabase CLI) and run the
contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
This creates the `bookings` and `messages` tables with Row Level Security enabled and an
**insert-only** policy for the `anon` role — the public website can submit new bookings and
messages, but the public API key can never read, edit, or delete existing rows. To review
submissions, use the Supabase dashboard's Table Editor (authenticated access only).

## 4. Run locally

```bash
npm run dev
```

Visit the printed local URL. The language toggle in the header switches between English
and French and persists across page loads.

## 5. Run tests

```bash
npm run test
```

Runs the Vitest suite (unit tests for i18n, anti-spam, booking logic, Supabase/EmailJS
wrappers, plus render tests for every page and component).

## 6. Build for production

```bash
npm run build
npm run preview   # serve the production build locally to sanity-check it
```

## 7. Deploy to Vercel

1. Push this repository to GitHub (or your Git provider of choice).
2. In Vercel, import the repository as a new project. Vercel auto-detects the Vite
   framework preset — no custom build command is required.
3. In the Vercel project's **Settings → Environment Variables**, add the same six
   variables from your `.env` file (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_PUBLIC_KEY`,
   `VITE_EMAILJS_BOOKING_TEMPLATE_ID`, `VITE_EMAILJS_CONTACT_TEMPLATE_ID`).
4. Deploy. `vercel.json` includes a rewrite rule so client-side routes (e.g. `/booking`)
   don't 404 on a hard refresh.
5. Vercel Analytics is wired in behind the cookie consent banner — enable the Analytics
   add-on in the Vercel dashboard for the project if you want traffic data.

## Project structure

```
src/
  pages/        one file per route (Home, About, Services, Approach, Fees, Booking, ...)
  sections/home/ Home page sections (Hero, IntroSahra, ServicesPreview, ...)
  booking/       the 4-step booking wizard and its steps
  components/    shared UI (Header, Footer, Logo, HorizonDivider, SEO, Card, Accordion, ...)
  i18n/          I18nProvider, useTranslation hook, en.json, fr.json
  lib/           supabaseClient.js, email.js, antiSpam.js, bookingSlots.js, bookingSchema.js
  content/       structured content data (services, testimonials, FAQ, blog posts)
public/img/      logo SVGs and photography (WebP)
supabase/migrations/  SQL schema + RLS policies
```

## Security notes

- **Row Level Security**: the `anon` Supabase key embedded in the client bundle can only
  `INSERT` into `bookings` and `messages` — there is no `SELECT`/`UPDATE`/`DELETE` policy
  for `anon`, so the public key can never read back submitted data.
- **No sensitive health data**: the booking and contact forms only collect name, email,
  phone, an optional short message, and a consent checkbox. No diagnosis, symptom, or
  medication fields exist anywhere on the public site.
- **Anti-spam**: both public forms include a hidden honeypot field and a client-side
  submission throttle (see `src/lib/antiSpam.js`), since EmailJS's free tier has no
  server-side rate limiting of its own. This is a client-side mitigation only — if abuse
  becomes a problem, the recommended upgrade path is moving email sending to Brevo behind
  a Vercel serverless function (the `src/lib/email.js` module is the single integration
  point to swap).
- All email sending goes through `src/lib/email.js` — no component calls the EmailJS SDK
  directly.

## Content you'll likely want to replace

- **Blog posts** (`src/content/blogPosts.js`): 3 demo articles are included as placeholder
  content and examples of the tone/format — replace with real posts as the practice
  publishes them.
- **Testimonials** (`src/content/testimonials.js` + the `testimonials.items.*` keys in
  `src/i18n/en.json`/`fr.json`): demo, anonymized testimonials — replace with real,
  client-consented reviews.
- **Photography** (`public/img/*.webp`): demo-quality stock photography selected to match
  the brand's turquoise/gold nature direction — swap in real, high-resolution photography
  from the practice when available.
- **Social links** in `src/components/Footer.jsx`: placeholder `#` hrefs for Facebook and
  Psychology Today, marked with a `FUTURE:` comment — update once real profile URLs exist.

## Out of scope (v1)

Newsletter signup, a client portal, and online admission forms are intentionally not
built. If needed later, integrating a PHIPA-compliant Canadian practice management
platform (e.g. Jane App or Owl Practice) is recommended over custom development.
