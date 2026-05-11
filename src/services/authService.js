import { canUseLocalDemo, isSupabaseConfigured, missingSupabaseMessage, supabase } from '../lib/supabase.js'
import { localDatabase } from './localDatabase.js'

function normalizeEmail(email) {
  const value = email.trim()
  if (value.toLowerCase() !== 'admin') return value

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  if (!adminEmail) {
    throw new Error('Admin alias is not configured. Add VITE_ADMIN_EMAIL in Vercel or use your full Supabase email.')
  }
  return adminEmail
}

export async function getInitialSession() {
  const localSession = localDatabase.getSession()
  if (canUseLocalDemo) return localSession
  if (!isSupabaseConfigured) throw new Error(missingSupabaseMessage)

  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export function onAuthChange(callback) {
  if (!isSupabaseConfigured) return () => {}

  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}

export async function signInWithPassword({ email, password }) {
  if (canUseLocalDemo) {
    const session = localDatabase.signIn(email)
    localDatabase.setSession(session)
    return session
  }
  if (!isSupabaseConfigured) throw new Error(missingSupabaseMessage)

  const { data, error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password })
  if (error) throw error
  return data.session
}

export async function signUpWithPassword({ email, password }) {
  if (canUseLocalDemo) {
    const session = localDatabase.signIn(email)
    localDatabase.setSession(session)
    return session
  }
  if (!isSupabaseConfigured) throw new Error(missingSupabaseMessage)

  const { data, error } = await supabase.auth.signUp({ email: normalizeEmail(email), password })
  if (error) throw error
  return data.session
}

export async function signOut() {
  if (canUseLocalDemo) {
    localDatabase.signOut()
    return
  }
  if (!isSupabaseConfigured) throw new Error(missingSupabaseMessage)

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
