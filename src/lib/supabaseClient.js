import { createClient } from '@supabase/supabase-js'

// Fall back to placeholder values so a missing .env doesn't crash createClient()
// at import time (which would white-screen every page, since this module is
// imported transitively from App). Real inserts simply fail with a network
// error until VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are set for real.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function insertBooking(payload) {
  const { error } = await supabase.from('bookings').insert([payload])
  if (error) throw error
}

export async function insertMessage(payload) {
  const { error } = await supabase.from('messages').insert([payload])
  if (error) throw error
}
