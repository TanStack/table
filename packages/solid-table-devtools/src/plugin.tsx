import { createSolidPlugin } from '@tanstack/devtools-utils/solid'
import { TableDevtoolsPanel } from './TableDevtools'

type SolidTableDevtoolsPlugin = ReturnType<
  ReturnType<typeof createSolidPlugin>[0]
>

const plugins = createSolidPlugin({
  name: 'TanStack Table',
  Component: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: () => SolidTableDevtoolsPlugin = plugins[0]
export const tableDevtoolsNoOpPlugin: () => SolidTableDevtoolsPlugin =
  plugins[1]
