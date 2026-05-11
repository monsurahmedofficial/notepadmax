import { create } from 'zustand'
import { getInitialSession, onAuthChange, signInWithPassword, signOut, signUpWithPassword } from '../services/authService.js'

export const useAuthStore = create((set) => ({
  session: null,
  loading: true,
  error: '',
  initialize: async () => {
    try {
      const session = await getInitialSession()
      set({ session, loading: false })
      onAuthChange((nextSession) => set({ session: nextSession, loading: false }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  login: async (credentials) => {
    set({ loading: true, error: '' })
    try {
      const session = await signInWithPassword(credentials)
      set({ session, loading: false })
      return session
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  register: async (credentials) => {
    set({ loading: true, error: '' })
    try {
      const session = await signUpWithPassword(credentials)
      set({ session, loading: false })
      return session
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  logout: async () => {
    await signOut()
    set({ session: null })
  },
}))
