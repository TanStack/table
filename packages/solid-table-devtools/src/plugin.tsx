import { createSolidPlugin } from '@tanstack/devtools-utils/solid'
import { TableDevtoolsPanel } from './TableDevtools'
import type { TanStackDevtoolsPlugin } from '@tanstack/devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'
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
): TanStackDevtoolsPlugin {
  const [Plugin] = createSolidPlugin({
    name: 'TanStack Table',
    Component: (props: DevtoolsPanelProps) => (
      <TableDevtoolsPanel {...props} table={options.table} />
    ),
  })
  return Plugin() as TanStackDevtoolsPlugin
}

function tableDevtoolsNoOpPlugin<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _options: TableDevtoolsPluginOptions<TFeatures, TData>,
): TanStackDevtoolsPlugin {
  const [, NoOp] = createSolidPlugin({
    name: 'TanStack Table',
    Component: TableDevtoolsPanel,
  })
  return NoOp() as TanStackDevtoolsPlugin
}

export { tableDevtoolsPlugin, tableDevtoolsNoOpPlugin }
