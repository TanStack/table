import type { TanStackDevtoolsTheme } from '@tanstack/devtools-ui'

export interface TableDevtoolsPanelProps {
  theme: TanStackDevtoolsTheme
  devtoolsOpen: boolean
}

const DEVTOOLS_FONT_STYLE_ID = 'tanstack-devtools-fonts'

/**
 * `@tanstack/vue-devtools` 0.2.24 still treats the plugin `render` second
 * argument as a theme string and wraps it in `{ theme }`. Current
 * `@tanstack/devtools` passes `{ theme, devtoolsOpen }`, so the panel can
 * receive a nested props object (or `'system'`) instead of `'light' | 'dark'`.
 */
export function resolveDevtoolsTheme(theme: unknown): TanStackDevtoolsTheme {
  if (theme === 'light' || theme === 'dark') {
    return theme
  }

  if (theme && typeof theme === 'object' && 'theme' in theme) {
    return resolveDevtoolsTheme(theme.theme)
  }

  if (
    theme === 'system' &&
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
  ) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  return 'dark'
}

export function resolveDevtoolsPanelProps(
  input?: {
    theme?: unknown
    devtoolsOpen?: boolean
  } | null,
): TableDevtoolsPanelProps {
  const nested =
    input &&
    typeof input.theme === 'object' &&
    input.theme !== null &&
    'theme' in input.theme
      ? (input.theme as { theme?: unknown; devtoolsOpen?: boolean })
      : input

  return {
    theme: resolveDevtoolsTheme(nested?.theme),
    devtoolsOpen: nested?.devtoolsOpen ?? true,
  }
}

/**
 * `@tanstack/devtools-ui` 0.7.0 injects `@font-face` rules whose
 * `import.meta.url` assets 404 under Angular's Vite `@fs` resolver. Seeding
 * the style tag first makes that injection a no-op; the panel falls back to
 * system fonts.
 */
export function seedDevtoolsFontStyle(targetDocument?: Document) {
  const doc =
    targetDocument ?? (typeof document === 'undefined' ? undefined : document)

  if (!doc?.head) {
    return
  }

  let style = doc.getElementById(
    DEVTOOLS_FONT_STYLE_ID,
  ) as HTMLStyleElement | null

  if (!style) {
    style = doc.createElement('style')
    style.id = DEVTOOLS_FONT_STYLE_ID
    doc.head.append(style)
  }

  // Drop @font-face rules whose import.meta.url assets 404 under Angular Vite.
  if (style.textContent) {
    style.textContent = ''
  }
}
