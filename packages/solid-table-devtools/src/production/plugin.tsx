import { createSolidPlugin } from '@tanstack/devtools-utils/solid'
import { TableDevtoolsPanel } from './TableDevtools'

const [tableDevtoolsPlugin] = createSolidPlugin({
  name: 'TanStack Table',
  Component: TableDevtoolsPanel,
})

export { tableDevtoolsPlugin }
