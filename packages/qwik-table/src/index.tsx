import * as Qwik from '@builder.io/qwik'
export * from '@tanstack/table-core'

import {
  TableOptions,
  TableOptionsResolved,
  RowData,
  createTable,
  type Table,
  type TableState,
} from '@tanstack/table-core'

export const flexRender = (comp: any, attrs: any) => {
  if (typeof comp === 'function') {
    return comp(attrs)
  }

  return comp
}

// @ts-ignore
const dummyState: TableState = {
  columnPinning: { left: [], right: [] },
  pagination: { pageIndex: 0, pageSize: 5 },
}

export function useQwikTable<TData extends RowData>(
  options: TableOptions<TData>
) {
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: dummyState,
    onStateChange: () => {},
    renderFallbackValue: null,
    ...options,
  }

  const table = Qwik.useStore<{
    instance: Qwik.NoSerialize<Table<TData>>
    state: TableState
  }>({
    instance: Qwik.noSerialize(createTable(resolvedOptions)),
    state: dummyState,
  })

  table.instance?.setOptions(prev => ({
    ...prev,
    ...options,
    state: {
      ...table.state,
      ...options.state,
    },
    onStateChange: updater => {
      // @ts-ignore
      table.state = updater(table.state)
      options.onStateChange?.(updater)
    },
  }))

  return table.instance!
}
