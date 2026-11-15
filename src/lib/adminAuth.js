import { supabase } from './supabaseClient'

// An authenticated Supabase user only counts as an admin if a matching row
// exists in admin_profiles (see supabase/migrations/0002_admin_cms.sql).
// There is no public sign-up — accounts are created with
// scripts/create-admin.mjs, run once by whoever manages the Supabase
// project.
export async function isCurrentUserAdmin() {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return false

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return false
  return Boolean(data)
}
