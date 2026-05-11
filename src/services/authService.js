import { canUseLocalDemo, isSupabaseConfigured, missingSupabaseMessage, supabase } from '../lib/supabase.js'
import { localDatabase } from './localDatabase.js'

export async function getInitialSession() {
  if (canUseLocalDemo) return localDatabase.getSession()
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

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
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

  const { data, error } = await supabase.auth.signUp({ email, password })
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
