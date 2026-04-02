import React from 'react'
import { createReactPanel } from '@tanstack/devtools-utils/react'
import {
  TableDevtoolsCore,
  setTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'
import type { JSX } from 'react'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface TableDevtoolsReactInit<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> extends DevtoolsPanelProps {
  table?: Table<TFeatures, TData>
}

type TableDevtoolsPanelComponent = (
  props: TableDevtoolsReactInit,
) => JSX.Element

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createReactPanel(TableDevtoolsCore)

function TableDevtoolsPanelImpl(props: TableDevtoolsReactInit) {
  const { table, ...panelProps } = props
  setTableDevtoolsTarget(table)
  return <TableDevtoolsPanelBase {...panelProps} />
}

export const TableDevtoolsPanel: TableDevtoolsPanelComponent =
  TableDevtoolsPanelImpl

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent =
  TableDevtoolsPanelNoOpBase as TableDevtoolsPanelComponent
