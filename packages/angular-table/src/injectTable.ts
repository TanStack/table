import { computed, signal, untracked } from '@angular/core'
import {
  constructTable,
  coreFeatures,
  getInitialTableState,
  isFunction,
} from '@tanstack/table-core'
import { lazyInit } from './lazy-signal-initializer'
import { proxifyTable } from './proxy'
import { reactivityFeature } from './reactivityFeature'
import type { Signal } from '@angular/core'
import type {
  RowData,
  Table,
  TableFeature,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface Table_Plugins {
    _signalNotifier: Signal<{}>
    _notify: () => void
  }
}

export function injectTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  options: () => TableOptions<TFeatures, TData>,
): Table<TFeatures, TData> & Signal<Table<TFeatures, TData>> {
  return lazyInit(() => {
    const resolvedOptions = {
      ...options(),
      _features: {
        ...coreFeatures,
        ...options()._features,
        reactivityFeature,
      },
    }

    const table = constructTable(resolvedOptions)

    // By default, manage table state here using the table's initial state
    const state = signal<TableState<TFeatures>>(
      getInitialTableState(
        resolvedOptions._features,
        resolvedOptions.initialState,
      ),
    )

    // Compose table options using computed.
    // This is to allow `tableSignal` to listen and set table option
    const updatedOptions = computed<TableOptions<TFeatures, TData>>(() => {
      // listen to table state changed
      const tableState = state()
      // listen to input options changed
      const tableOptions = options()
      return {
        ...table.options,
        ...resolvedOptions,
        ...tableOptions,
        state: { ...tableState, ...tableOptions.state },
        onStateChange: (updater) => {
          const value = isFunction(updater) ? updater(tableState) : updater
          state.set(value)
          resolvedOptions.onStateChange?.(updater)
          table._notify()
        },
      }
    })

    // convert table instance to signal for proxify to listen to any table state and options changes
    const tableSignal = computed(
      () => {
        table.setOptions(updatedOptions())
        untracked(() => table._notify())
        return table
      },
      {
        equal: () => false,
      },
    )

    // proxify Table instance to provide ability for consumer to listen to any table state changes
    return proxifyTable(tableSignal)
  })
}
