import { createSolidPanel } from '@tanstack/devtools-utils/solid'
import {
  TableDevtoolsCore,
  setTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'

import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface TableDevtoolsSolidInit<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> extends DevtoolsPanelProps {
  table?: Table<TFeatures, TData>
}

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOp] =
  createSolidPanel(TableDevtoolsCore)

function TableDevtoolsPanel(props: TableDevtoolsSolidInit) {
  setTableDevtoolsTarget(props.table)
  return <TableDevtoolsPanelBase theme={props.theme} />
}

export { TableDevtoolsPanel, TableDevtoolsPanelNoOp }
