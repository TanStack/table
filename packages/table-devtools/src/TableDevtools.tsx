import { ThemeContextProvider } from '@tanstack/devtools-ui'
import { TableContextProvider } from './TableContextProvider'
import { Shell } from './components/Shell'
import type { TanStackDevtoolsTheme } from '@tanstack/devtools-ui'

export default function TableDevtools(props: {
  theme: TanStackDevtoolsTheme
  devtoolsOpen: boolean
}) {
  return (
    <ThemeContextProvider theme={props.theme}>
      <TableContextProvider>
        <Shell />
      </TableContextProvider>
    </ThemeContextProvider>
  )
}
