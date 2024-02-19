import {
  RowData,
  TableOptions,
  TableOptionsResolved,
  createTable,
} from '@tanstack/table-core'

export * from '@tanstack/table-core'
export * from './flexrender.directive'
export function createAngularTable<TData extends RowData>(
  options: TableOptions<TData>
) {
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {},
    onStateChange: () => {},
    renderFallbackValue: null,
    ...options,
  }

  let table = createTable<TData>(resolvedOptions)
  let state = table.initialState

  // Compose the default state above with any user state.
  table.setOptions((prev: any) => {
    return {
      ...prev,
      ...options,
      state: {
        ...state,
        ...options.state,
      },
      onStateChange: (updater: any) => {
        options.onStateChange?.(updater)
      },
    }
  })

  return table
}
