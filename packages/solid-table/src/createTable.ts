import {
  constructTable,
  coreFeatures,
  getInitialTableState,
} from '@tanstack/table-core'
import { createComputed, mergeProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import type {
  RowData,
  TableFeatures,
  TableOptions,
  TableState,
  Updater,
} from '@tanstack/table-core'

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>) {
  const _features = { ...coreFeatures, ...tableOptions._features }

  const [store, setStore] = createStore(
    getInitialTableState(_features, tableOptions.initialState),
  )

  const statefulOptions: TableOptions<TFeatures, TData> = {
    ...tableOptions,
    state: { ...store, ...tableOptions.state },
    onStateChange: (updater) => {
      setStore(updater)
      tableOptions.onStateChange?.(updater)
    },
  }

  const table = constructTable<TFeatures, TData>(statefulOptions)

  createComputed(() => {
    table.setOptions((prev) => {
      return mergeProps(prev, tableOptions, {
        state: mergeProps(store, tableOptions.state || {}),
        onStateChange: (updater: Updater<TableState<TFeatures>>) => {
          setStore(updater)
          tableOptions.onStateChange?.(updater)
        },
      }) as any
    })
  })

  return table
}
