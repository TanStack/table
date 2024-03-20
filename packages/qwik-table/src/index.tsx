import * as Qwik from '@builder.io/qwik'
export * from '@tanstack/table-core'

import {
  TableOptions,
  TableOptionsResolved,
  RowData,
  createTable,
  type Table,
} from '@tanstack/table-core'

export const flexRender = (comp: any, attrs: any) => {
  // TODO: this might not handle all cases I'm not sure? Probably needs to be tested
  if (typeof comp === 'function') {
    return comp(attrs)
  }

  return comp
}

export function useQwikTable<TData extends RowData>(
  options: TableOptions<TData>
) {
  // Compose in the generic options to the user options
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {},
    onStateChange: () => {},
    renderFallbackValue: null,
    ...options,
  }

  const table = Qwik.useStore<{
    instance: Qwik.NoSerialize<Table<TData>>
  }>({
    instance: Qwik.noSerialize(createTable(resolvedOptions)),
  })

  // By default, manage table state here using the table's initial state
  let state = Qwik.useStore(table.instance!.initialState)

  // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.
  table.instance!.setOptions(prev => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    onStateChange: updater => {
      state = updater instanceof Function ? updater(state) : updater
      options.onStateChange?.(updater)
    },
  }))

  return table.instance!
}
