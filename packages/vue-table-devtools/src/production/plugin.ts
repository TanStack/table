import { createVuePlugin } from '@tanstack/devtools-utils/vue'
import { TableDevtoolsPanel } from './VueTableDevtools'

const [tableDevtoolsPlugin] = createVuePlugin(
  'TanStack Table',
  TableDevtoolsPanel,
)

export { tableDevtoolsPlugin }
