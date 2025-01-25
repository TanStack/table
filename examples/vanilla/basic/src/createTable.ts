import { atom } from 'nanostores'
import {
  constructTable,
  coreFeatures,
  getInitialTableState,
} from '@tanstack/table-core'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export const flexRender = <TProps extends object>(comp: any, props: TProps) => {
  if (typeof comp === 'function') {
    return comp(props)
  }
  return comp
}

export const createTable = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableOptions: TableOptions<TFeatures, TData>,
): Table<TFeatures, TData> => {
  const _features = { ...coreFeatures, ...tableOptions._features }

  // const initialState = getInitialTableState(_features)
  const state = atom(getInitialTableState(_features, tableOptions.initialState))

  // Compose in the generic options to the user options
  const statefulOptions: TableOptions<TFeatures, TData> = {
    ...tableOptions,
    _features,
    state: { ...state, ...tableOptions.state },
  }

  // Create a new table
  const table = constructTable(statefulOptions)

  // Subscribe to state changes
  state.subscribe((currentState) => {
    table.setOptions((prev) => ({
      ...prev,
      ...tableOptions,
      state: {
        ...(currentState as TableState<TFeatures>),
        ...tableOptions.state,
      },
      // Similarly, we'll maintain both our internal state and any user-provided state
      onStateChange: (updater) => {
        if (typeof updater === 'function') {
          const newState = updater(currentState as TableState<TFeatures>)
          state.set(newState)
        } else {
          state.set(updater)
        }
        tableOptions.onStateChange?.(updater)
      },
    }))
  })

  return table
}
