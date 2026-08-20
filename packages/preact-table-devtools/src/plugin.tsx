import { createPreactPlugin } from '@tanstack/devtools-utils/preact'
import { TableDevtoolsPanel } from './PreactTableDevtools'

type PreactTableDevtoolsPlugin = ReturnType<
  ReturnType<typeof createPreactPlugin>[0]
>

const plugins = createPreactPlugin({
  name: 'TanStack Table',
  Component: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: () => PreactTableDevtoolsPlugin = plugins[0]
export const tableDevtoolsNoOpPlugin: () => PreactTableDevtoolsPlugin =
  plugins[1]
