"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

interface ThemeContextType {
  theme: Theme | undefined
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => null,
})

export const useTheme = () => React.useContext(ThemeContext)

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) {
      setThemeState(stored)
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    const root = window.document.documentElement
    
    // Enforce strict light mode
    root.classList.add("light")
    root.classList.remove("dark")
    
    localStorage.setItem("theme", "light")
  }, [mounted])

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  )
}
