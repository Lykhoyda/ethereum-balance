import { useTheme, THEMES } from '../providers/theme'
import { SunIcon } from '../assets/icons/SunIcon'
import { MoonIcon } from '../assets/icons/MoonIcon'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  function toggleTheme() {
    setTheme(theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === THEMES.LIGHT ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  )
}
