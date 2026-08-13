/** Theme state shared across the app — mirrors the react example's ThemeProvider. */
export type Theme = 'dark' | 'light' | 'system'

const storageKey = 'vite-ui-theme'

let theme = $state<Theme>(
  (localStorage.getItem(storageKey) as Theme | null) ?? 'system',
)

function applyTheme() {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  root.classList.add(resolved)
}

export function getTheme(): Theme {
  return theme
}

export function setTheme(next: Theme) {
  localStorage.setItem(storageKey, next)
  theme = next
  applyTheme()
}

applyTheme()
