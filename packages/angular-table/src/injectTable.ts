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
import type { Signal } from '@angular/core'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

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
    children: ((state: Signal<Readonly<TSubSelected>>) => any) | any
  }) => any
}

export function injectTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
>(
  options: () => TableOptions<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
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

    const table = constructTable(resolvedOptions) as AngularTable<
      TFeatures,
      TData,
      TSelected
    >

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
        // TODO: replace computed just using effects could be better?
        tableState()
        table.setOptions(updatedOptions())
        untracked(() => {
          table.baseStore.setState((prev) => ({ ...prev }))
        })
        return table
      },
      { equal: () => false },
    )

    table.setTableNotifier(tableSignalNotifier)

    table.Subscribe = function Subscribe<TSubSelected = {}>(props: {
      selector: (state: TableState<TFeatures>) => TSubSelected
      children: ((state: Signal<Readonly<TSubSelected>>) => any) | any
    }) {
      const selected = injectStore(table.store, props.selector, { injector })
      if (typeof props.children === 'function') {
        return props.children(selected)
      }
      return props.children
    }

    const stateStore = injectStore(table.store, selector, { injector })

    Reflect.set(table, 'state', stateStore)

    return table
  })
}
