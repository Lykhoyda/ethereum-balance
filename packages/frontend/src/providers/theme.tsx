import { createContext, useContext, useState } from 'react'

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
} as const

type Theme = typeof THEMES[keyof typeof THEMES]

interface ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const THEME_CONFIG = {
  STORAGE_KEY: 'ethereum-balance-theme',
  DEFAULT: THEMES.LIGHT,
  COLORS_MOBILE: {
    DARK: '#1a1b26',
    LIGHT: '#ffffff'
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Theme provider that manages the application's theme state
 * Supports 'light' and 'dark' themes
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Load and apply the initial theme in a single initialization
  const initialTheme = loadStoredTheme()
  // Apply initial theme during module execution (no need for useEffect)
  if (typeof window !== 'undefined') {
    applyThemeToDocument(initialTheme)
  }
  
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  
  // Action function for theme changes
  function setTheme(newTheme: Theme) {
    // Update state
    setThemeState(newTheme)
    
    // Persist to localStorage
    try {
      localStorage.setItem(THEME_CONFIG.STORAGE_KEY, newTheme)
    } catch (e) {
      console.error('Error writing to localStorage:', e)
    }
    
    // Apply to document
    applyThemeToDocument(newTheme)
  }
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function loadStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_CONFIG.STORAGE_KEY)
    if (stored === THEMES.DARK || stored === THEMES.LIGHT) {
      return stored
    }
    return THEME_CONFIG.DEFAULT
  } catch (error) {
    console.error('Error reading theme from localStorage:', error)
    return THEME_CONFIG.DEFAULT
  }
}

/**
 * Updates the meta theme-color tag for mobile browsers
 * This affects the UI color of mobile browser chrome elements
 */
function updateMetaThemeColor(theme: Theme): void {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    const themeColor =
      theme === THEMES.DARK
        ? THEME_CONFIG.COLORS_MOBILE.DARK
        : THEME_CONFIG.COLORS_MOBILE.LIGHT
    metaThemeColor.setAttribute('content', themeColor)
  }
}

/**
 * Applies a theme to the document
 * Extracted to a separate function to avoid duplicating code
 */
function applyThemeToDocument(theme: Theme): void {
  const root = window.document.documentElement
  root.classList.remove(THEMES.DARK, THEMES.LIGHT)
  root.classList.add(theme)
  
  // Update meta theme-color for mobile browsers
  updateMetaThemeColor(theme)
}

/**
 * Hook to access theme context
 * Must be used within a ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
