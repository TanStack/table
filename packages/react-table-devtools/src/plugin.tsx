import React from 'react'
import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { TableDevtoolsPanel } from './ReactTableDevtools'
import type { TanStackDevtoolsReactPlugin } from '@tanstack/react-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'
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
>(
  options: TableDevtoolsPluginOptions<TFeatures, TData>,
): TanStackDevtoolsReactPlugin {
  const [Plugin] = createReactPlugin({
    name: 'TanStack Table',
    Component: (props: DevtoolsPanelProps) => (
      <TableDevtoolsPanel {...props} table={options.table} />
    ),
  })
  return Plugin() as TanStackDevtoolsReactPlugin
}

function tableDevtoolsNoOpPlugin<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _options: TableDevtoolsPluginOptions<TFeatures, TData>,
): TanStackDevtoolsReactPlugin {
  const [, NoOp] = createReactPlugin({
    name: 'TanStack Table',
    Component: TableDevtoolsPanel,
  })
  return NoOp() as TanStackDevtoolsReactPlugin
}

export { tableDevtoolsPlugin, tableDevtoolsNoOpPlugin }
