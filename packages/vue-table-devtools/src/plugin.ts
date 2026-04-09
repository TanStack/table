import { createVuePlugin } from '@tanstack/devtools-utils/vue'
import { TableDevtoolsPanel, TableDevtoolsPanelNoOp } from './VueTableDevtools'

const [tableDevtoolsPlugin, tableDevtoolsNoOpPlugin] = createVuePlugin(
  'TanStack Table',
  TableDevtoolsPanel,
)

export { tableDevtoolsPlugin, tableDevtoolsNoOpPlugin }
