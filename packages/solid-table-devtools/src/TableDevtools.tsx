import { createSolidPanel } from '@tanstack/devtools-utils/solid'
import {
  TableDevtoolsCore,
  setTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'
import type { JSX } from 'solid-js'

import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface TableDevtoolsSolidInit<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> extends DevtoolsPanelProps {
  table?: Table<TFeatures, TData>
}

type TableDevtoolsPanelComponent = (
  props: TableDevtoolsSolidInit,
) => JSX.Element

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createSolidPanel(TableDevtoolsCore)

function TableDevtoolsPanelImpl(props: TableDevtoolsSolidInit) {
  const { table, ...panelProps } = props
  setTableDevtoolsTarget(table)
  return <TableDevtoolsPanelBase {...panelProps} />
}

export const TableDevtoolsPanel: TableDevtoolsPanelComponent =
  TableDevtoolsPanelImpl

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent =
  TableDevtoolsPanelNoOpBase as TableDevtoolsPanelComponent
