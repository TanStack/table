import {
  Injector,
  assertInInjectionContext,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core'
import { constructTable } from '@tanstack/table-core'
import { injectStore } from '@tanstack/angular-store'
import { lazyInit } from './lazySignalInitializer'
import { angularReactivityFeature } from './angularReactivityFeature'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Signal, ValueEqualityFn } from '@angular/core'

export type AngularTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * The selected state from the table store, based on the selector provided.
   */
  readonly state: Signal<Readonly<TSelected>>
  /**
   * Subscribe to changes in the table store with a custom selector.
   */
  Subscribe: <TSubSelected = {}>(props: {
    selector: (state: TableState<TFeatures>) => TSubSelected
    equal?: ValueEqualityFn<TSubSelected>
  }) => Signal<Readonly<TSubSelected>>
}

export function injectTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
>(
  options: () => TableOptions<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = (state) =>
    state as TSelected,
): AngularTable<TFeatures, TData, TSelected> {
  assertInInjectionContext(injectTable)
  const injector = inject(Injector)

  return lazyInit(() => {
    const resolvedOptions: TableOptions<TFeatures, TData> = {
      ...options(),
      _features: {
        ...options()._features,
        angularReactivityFeature,
      },
    } as TableOptions<TFeatures, TData>

    const table: AngularTable<TFeatures, TData, TSelected> = constructTable(
      resolvedOptions,
    ) as AngularTable<TFeatures, TData, TSelected>

    const updatedOptions = computed<TableOptions<TFeatures, TData>>(() => {
      const tableOptionsValue = options()
      const result: TableOptions<TFeatures, TData> = {
        ...table.options,
        ...tableOptionsValue,
        _features: {
          ...tableOptionsValue._features,
          angularReactivityFeature,
        },
      }
      if (tableOptionsValue.state) {
        result.state = tableOptionsValue.state
      }
      return result
    })

    effect(
      (onCleanup) => {
        const cleanup = table.store.mount()
        onCleanup(() => cleanup())
      },
      { injector },
    )

    const tableState = injectStore(
      table.store,
      (state: TableState<TFeatures>) => state,
      { injector },
    )

    const tableSignalNotifier = computed(
      () => {
        tableState()
        table.setOptions(updatedOptions())
        untracked(() => table.baseStore.setState((prev) => ({ ...prev })))
        return table
      },
      { equal: () => false },
    )

    table.setTableNotifier(tableSignalNotifier)

    table.Subscribe = function Subscribe<TSubSelected = {}>(props: {
      selector: (state: TableState<TFeatures>) => TSubSelected
      equal?: ValueEqualityFn<TSubSelected>
    }) {
      return injectStore(table.store, props.selector, {
        injector,
        equal: props.equal,
      })
    }

    Object.defineProperty(table, 'state', {
      value: injectStore(table.store, selector, { injector }),
    })

    return table
  })
}
