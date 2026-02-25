import React from 'react'
import { createReactPanel } from '@tanstack/devtools-utils/react'
import { TableDevtoolsCore, setTableDevtoolsTarget } from '@tanstack/table-devtools'

import type { RowData, Table, TableFeatures } from '@tanstack/table-core'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'

export interface TableDevtoolsReactInit<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> extends DevtoolsPanelProps {
  table?: Table<TFeatures, TData>
}

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOp] =
  createReactPanel(TableDevtoolsCore)

function TableDevtoolsPanel(props: TableDevtoolsReactInit) {
  setTableDevtoolsTarget(props.table)
  return <TableDevtoolsPanelBase theme={props.theme} />
}

export { TableDevtoolsPanel, TableDevtoolsPanelNoOp }
