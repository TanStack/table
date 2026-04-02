import { createSolidPlugin } from '@tanstack/devtools-utils/solid'
import type { TanStackDevtoolsPlugin } from '@tanstack/devtools'
import { TableDevtoolsPanel } from './TableDevtools'

const [tableDevtoolsPluginFn] = createSolidPlugin({
  name: 'TanStack Table',
  Component: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: () => TanStackDevtoolsPlugin =
  tableDevtoolsPluginFn
