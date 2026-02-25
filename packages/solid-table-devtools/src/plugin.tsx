import React from 'react'
import { TableDevtoolsPanel } from './SolidTableDevtools'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface TableDevtoolsPluginOptions<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> {
  table: Table<TFeatures, TData>
}

function tableDevtoolsPlugin<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(options: TableDevtoolsPluginOptions<TFeatures, TData>) {
  return {
    name: 'TanStack Table',
    render: (_el: HTMLElement, theme: 'light' | 'dark') => (
      <TableDevtoolsPanel table={options.table} theme={theme} />
    ),
  }
}

function tableDevtoolsNoOpPlugin<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(_options: TableDevtoolsPluginOptions<TFeatures, TData>) {
  return {
    name: 'TanStack Table',
    render: (_el: HTMLElement, _theme: 'light' | 'dark') => <></>,
  }
}

export { tableDevtoolsPlugin, tableDevtoolsNoOpPlugin }
