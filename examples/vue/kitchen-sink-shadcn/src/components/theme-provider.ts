import { defineComponent, inject, provide, ref, watchEffect } from 'vue'
import type { InjectionKey, PropType, Ref } from 'vue'

type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderState {
  theme: Ref<Theme>
  setTheme: (theme: Theme) => void
}

const ThemeProviderKey = Symbol(
  'ThemeProvider',
) as InjectionKey<ThemeProviderState>

export const ThemeProvider = defineComponent({
  name: 'ThemeProvider',
  props: {
    defaultTheme: {
      type: String as PropType<Theme>,
      default: 'system',
    },
    storageKey: {
      type: String,
      default: 'vite-ui-theme',
    },
  },
  setup(props, { slots }) {
    const theme = ref<Theme>(
      (localStorage.getItem(props.storageKey) as Theme | null) ??
        props.defaultTheme,
    )

    watchEffect(() => {
      const root = window.document.documentElement

      root.classList.remove('light', 'dark')

      if (theme.value === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light'
        root.classList.add(systemTheme)
        return
      }

      root.classList.add(theme.value)
    })

    provide(ThemeProviderKey, {
      theme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(props.storageKey, newTheme)
        theme.value = newTheme
      },
    })

    return () => slots.default?.()
  },
})

export function useTheme() {
  const context = inject(ThemeProviderKey)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
