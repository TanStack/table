import { createVuePlugin } from '@tanstack/devtools-utils/vue'
import { TableDevtoolsPanel, TableDevtoolsPanelNoOp } from './VueTableDevtools'

const [tableDevtoolsPlugin] = createVuePlugin(
  'TanStack Table',
  TableDevtoolsPanel,
)

const [tableDevtoolsNoOpPlugin] = createVuePlugin(
  'TanStack Table',
  TableDevtoolsPanelNoOp,
)

export { tableDevtoolsPlugin, tableDevtoolsNoOpPlugin }
