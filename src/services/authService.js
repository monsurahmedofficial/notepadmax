import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import { localDatabase } from './localDatabase.js'

export async function getInitialSession() {
  if (!isSupabaseConfigured) return localDatabase.getSession()

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
  if (!isSupabaseConfigured) {
    const session = localDatabase.signIn(email)
    localDatabase.setSession(session)
    return session
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function signUpWithPassword({ email, password }) {
  if (!isSupabaseConfigured) {
    const session = localDatabase.signIn(email)
    localDatabase.setSession(session)
    return session
  }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data.session
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    localDatabase.signOut()
    return
  }

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
