import { Show, createMemo } from 'solid-js'
import { ThemeContextProvider } from '@tanstack/devtools-ui'
import { TableContextProvider } from './TableContextProvider'
import { Shell } from './components/Shell'
import { resolveDevtoolsPanelProps, seedDevtoolsFontStyle } from './panelProps'
import type { TanStackDevtoolsTheme } from '@tanstack/devtools-ui'

export default function TableDevtools(props: {
  theme?: TanStackDevtoolsTheme | { theme?: unknown; devtoolsOpen?: boolean }
  devtoolsOpen?: boolean
}) {
  seedDevtoolsFontStyle()
  const panelProps = createMemo(() =>
    resolveDevtoolsPanelProps({
      theme: props.theme,
      devtoolsOpen: props.devtoolsOpen,
    }),
  )

  return (
    <ThemeContextProvider theme={panelProps().theme}>
      <Show when={panelProps().devtoolsOpen}>
        <TableContextProvider>
          <Shell />
        </TableContextProvider>
      </Show>
    </ThemeContextProvider>
  )
}
