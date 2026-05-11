import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { useThemeStore } from '../store/useThemeStore.js'

export default function ThemeToggle() {
  const { theme, initialize, toggleTheme } = useThemeStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <button className="icon-button" type="button" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
