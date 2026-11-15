#!/usr/bin/env node
// Creates (or updates the password for) the one admin account allowed to
// use /admin. There is no public sign-up by design — this script is the
// only way to create an admin account, and it's meant to be run once by
// whoever manages the Supabase project, not shipped or run by the app.
//
// Usage:
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=the-service-role-key-from-Project-Settings-API \
//   node scripts/create-admin.mjs assistant@example.com "a-strong-password"
//
// The service role key must NEVER be committed, put in .env, or prefixed
// with VITE_ (which would ship it to the browser) — pass it inline on the
// command line, once, from a terminal only you have access to.

import { createClient } from '@supabase/supabase-js'

const [, , email, password] = process.argv
const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.')
  process.exit(1)
}
if (!email || !password) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password>')
  process.exit(1)
}
if (password.length < 12) {
  console.error('Please use a password of at least 12 characters.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  let userId = created?.user?.id

  if (createError) {
    // Already exists: look it up and update the password instead of failing.
    if (createError.status !== 422 && createError.code !== 'email_exists') {
      throw createError
    }
    const { data: list, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) throw listError
    const existing = list.users.find((u) => u.email === email)
    if (!existing) throw createError
    userId = existing.id
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password })
    if (updateError) throw updateError
    console.log(`Mot de passe mis à jour pour ${email}.`)
  } else {
    console.log(`Compte créé pour ${email}.`)
  }

  const { error: profileError } = await supabase
    .from('admin_profiles')
    .upsert({ user_id: userId })
  if (profileError) throw profileError

  console.log('Ce compte peut maintenant se connecter sur /admin/login.')
}

main().catch((err) => {
  console.error('Échec :', err.message || err)
  process.exit(1)
})
