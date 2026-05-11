import { create } from 'zustand'

const THEME_KEY = 'notepad-max-theme'

function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light')
}

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem(THEME_KEY) || 'dark',
  initialize: () => applyTheme(get().theme),
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem(THEME_KEY, theme)
      applyTheme(theme)
      return { theme }
    }),
}))
