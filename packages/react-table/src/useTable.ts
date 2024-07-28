import * as React from 'react'

import {
  _createTable,
  builtInFeatures,
  getInitialTableState,
} from '@tanstack/table-core'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

function useTableRef<TFeatures extends TableFeatures, TData extends RowData>(
  options: TableOptions<TFeatures, TData>,
): Table<TFeatures, TData> {
  const tableRef = React.useRef<Table<TFeatures, TData>>()

  if (!tableRef.current) {
    tableRef.current = _createTable(options)
  }

  return tableRef.current
}

/**
 * Will re-render the table whenever the state or options change. Works just like the `useReactTable` from v8.
 * @example const table = useTable({ columns, data, state, ...options })
 */
export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>): Table<TFeatures, TData> {
  const [state, setState] = React.useState<TableState<TFeatures>>(() =>
    getInitialTableState(builtInFeatures, tableOptions.initialState),
  )

  const statefulOptions: TableOptions<TFeatures, TData> = {
    ...tableOptions,
    state: { ...state, ...tableOptions.state },
    onStateChange: (updater) => {
      setState(updater)
      tableOptions.onStateChange?.(updater)
    },
  }

  const table = useTableRef(statefulOptions)

  table.setOptions((prev) => ({ ...prev, ...statefulOptions })) // force re-render when state or options change

  return table
}
