# Admin CMS — setup (for whoever manages the Supabase project)

This covers the one-time setup for `/admin`: a password-protected panel where a
non-technical team member can edit site text, swap images, and change the color
palette/fonts, all without touching code. The day-to-day guide for *using* it lives in
[`ADMIN_GUIDE_FR.md`](ADMIN_GUIDE_FR.md) (in French, for the person who'll actually use it).

## 1. Run the migration

In the Supabase SQL editor (or via the Supabase CLI), run
[`supabase/migrations/0002_admin_cms.sql`](../supabase/migrations/0002_admin_cms.sql) —
in addition to `0001_init.sql`, which must already be applied. This creates:

- `content_overrides`, `media_overrides`, `site_theme` — the editable text/images/theme,
  readable by anyone (the public site needs them to render) but writable only by admins.
- `admin_profiles` — the allowlist of who's allowed to write. **There is no public
  sign-up form anywhere on the site.**
- A public Storage bucket `site-media` (5 MB limit, image types only) for uploaded photos.

## 2. Create the admin account

There's deliberately no sign-up UI. Create the one account from your own machine, once,
using the Supabase **service role** key (never the anon key — the service role key must
never end up in `.env`, in the browser bundle, or prefixed with `VITE_`):

```bash
SUPABASE_URL=https://your-project-ref.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=the-service-role-key-from-Project-Settings-API \
node scripts/create-admin.mjs assistant@example.com "a-strong-password"
```

Get the service role key from *Project Settings → API* in the Supabase dashboard — it's
separate from the anon key already in `.env`. Running the script again with the same
email updates that account's password instead of failing (handy for a reset). Give the
assistant the email + password directly (e.g. in person or over a secure channel) — not
over plain email if avoidable.

To revoke access later, either delete the row for that user in the `admin_profiles` table
(Table Editor) or delete the user entirely under *Authentication → Users*.

## 3. Deploy

No new environment variables are needed beyond what's already in `.env`/Vercel
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — the admin panel reuses the same public
anon key as the rest of the site; it's safe because every write is gated by Postgres RLS
checking `admin_profiles`, not by a secret key.

Once deployed, the panel is at `https://your-domain/admin/login`. It's excluded from
search engines (`public/robots.txt` + an `X-Robots-Tag` header) but isn't otherwise
hidden — the real protection is the login + RLS, not obscurity.

## 4. Security notes

- `vercel.json` ships baseline security headers (`X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) plus a
  `Content-Security-Policy-Report-Only` header. It's in **report-only** mode on purpose —
  it logs would-be violations to the browser console without blocking anything, since this
  was written without a live deployment to test against. After deploying, open the browser
  console on a few pages (including `/admin`) and check for `[Report Only]` CSP warnings;
  if there are none after a few days of normal use, rename that header key in
  `vercel.json` from `Content-Security-Policy-Report-Only` to `Content-Security-Policy` to
  start actually enforcing it.
- Brute-force login attempts are rate-limited server-side by Supabase Auth itself; the
  login page also adds a friendly client-side lockout (5 attempts → 5 minute pause) as a
  courtesy, not as the real defense.
- All admin-entered text renders as plain text (React's default escaping) — there's no
  rich-text/HTML editor anywhere, so there's no stored-XSS surface from content editing.
- Uploaded images are restricted to 5 MB and image MIME types, enforced by the
  `site-media` bucket policy server-side (not just client-side).
