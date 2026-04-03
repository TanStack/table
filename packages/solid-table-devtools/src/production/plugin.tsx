import { createSolidPlugin } from '@tanstack/devtools-utils/solid'
import { TableDevtoolsPanel } from './TableDevtools'

type SolidTableDevtoolsPlugin = ReturnType<
  ReturnType<typeof createSolidPlugin>[0]
>

const [tableDevtoolsPluginFn] = createSolidPlugin({
  name: 'TanStack Table',
  Component: TableDevtoolsPanel,
})

export const tableDevtoolsPlugin: () => SolidTableDevtoolsPlugin =
  tableDevtoolsPluginFn
