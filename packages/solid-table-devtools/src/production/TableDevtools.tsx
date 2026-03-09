import { createSolidPanel } from '@tanstack/devtools-utils/solid'
import { TableDevtoolsCore } from '@tanstack/table-devtools/production'

import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'

const [TableDevtoolsPanel] = createSolidPanel(TableDevtoolsCore)

export interface TableDevtoolsSolidInit extends DevtoolsPanelProps {}

export { TableDevtoolsPanel }
