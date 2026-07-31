import { createSolidPanel } from '@tanstack/devtools-utils/solid'
import { TableDevtoolsCore } from '@tanstack/table-devtools/production'

import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'
import type { JSX } from 'solid-js'

const [TableDevtoolsPanelBase] = createSolidPanel(TableDevtoolsCore)

export interface TableDevtoolsSolidInit extends Partial<DevtoolsPanelProps> {}

type TableDevtoolsPanelComponent = (
  props?: TableDevtoolsSolidInit,
) => JSX.Element

function resolvePanelProps(props?: TableDevtoolsSolidInit): DevtoolsPanelProps {
  return {
    get theme() {
      return props?.theme ?? 'dark'
    },
    get devtoolsOpen() {
      return props?.devtoolsOpen ?? false
    },
  }
}

export const TableDevtoolsPanel: TableDevtoolsPanelComponent = (props) =>
  TableDevtoolsPanelBase(resolvePanelProps(props))
