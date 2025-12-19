import { constructTable, coreFeatures } from '@tanstack/table-core'
import { createEffect, mergeProps } from 'solid-js'
import type { RowData, TableFeatures, TableOptions } from '@tanstack/table-core'

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>) {
  const _features = { ...coreFeatures, ...tableOptions._features }

  const statefulOptions: TableOptions<TFeatures, TData> = {
    ...tableOptions,
    _features,
    // Remove state and onStateChange - store handles it internally
    // But keep onStateChange if user provided for backward compatibility
    onStateChange: tableOptions.onStateChange,
    mergeOptions: (defaultOptions, options) => {
      return mergeProps(defaultOptions, options)
    },
  }

  const table = constructTable<TFeatures, TData>(statefulOptions)

  // Subscribe to store changes for Solid reactivity
  createEffect(() => {
    // Access store.state to create reactive dependency
    table.store.state
    // Update options when store changes
    table.setOptions((prev) => {
      return mergeProps(prev, tableOptions, {
        _features: { ...coreFeatures, ...tableOptions._features },
      }) as any
    })
  })

  return table
}
