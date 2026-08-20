import { createPreactPlugin } from '@tanstack/devtools-utils/preact'
import { TableDevtoolsPanel } from './PreactTableDevtools'

type PreactTableDevtoolsPlugin = ReturnType<
  ReturnType<typeof createPreactPlugin>[0]
>

const [plugin] = createPreactPlugin({
  name: 'TanStack Table',
  Component: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: () => PreactTableDevtoolsPlugin = plugin
