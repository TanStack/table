import {
  _createTable,
  builtInFeatures,
  getInitialTableState,
} from '@tanstack/table-core'
import { createComputed, mergeProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { RowData, TableFeatures, TableOptions } from '@tanstack/table-core'

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>) {
  const [store, setStore] = createStore(
    getInitialTableState(builtInFeatures, tableOptions.initialState),
  )

  const statefulOptions: TableOptions<TFeatures, TData> = {
    ...tableOptions,
    state: { ...store, ...tableOptions.state },
    onStateChange: (updater) => {
      setStore(updater)
      tableOptions.onStateChange?.(updater)
    },
  }

  const table = _createTable<TFeatures, TData>(statefulOptions)

  createComputed(() => {
    table.setOptions((prev) => {
      return mergeProps(prev, tableOptions, {
        state: mergeProps(store, tableOptions.state || {}),
        onStateChange: (updater: any) => {
          setStore(updater)
          tableOptions.onStateChange?.(updater)
        },
      })
    })
  })

  return table
}
