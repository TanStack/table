import { computed } from '@angular/core'
import { constructTable } from '@tanstack/table-core'
import { injectStore } from '@tanstack/angular-store'
import { lazyInit } from './lazy-signal-initializer'
import { proxifyTable } from './proxy'
import { angularReactivityFeature } from './angularReactivityFeature'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Signal } from '@angular/core'

export type AngularTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> &
  Signal<Table<TFeatures, TData>> & {
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
  return lazyInit(() => {
    const resolvedOptions: TableOptions<TFeatures, TData> = {
      ...options(),
      _features: {
        ...options()._features,
        angularReactivityFeature,
      },
    } as TableOptions<TFeatures, TData>

    const table = constructTable(resolvedOptions)

    // Compose table options using computed.
    // This is to allow `tableSignal` to listen and set table option
    const updatedOptions = computed<TableOptions<TFeatures, TData>>(() => {
      // listen to input options changed
      const tableOptionsValue = options()

      const result: TableOptions<TFeatures, TData> = {
        ...table.options,
        ...resolvedOptions,
        ...tableOptionsValue,
        _features: {
          ...tableOptionsValue._features,
          angularReactivityFeature,
        },
      }

      // Store handles state internally, but allow controlled state to be passed
      const tableOptionsAny = tableOptionsValue as any
      if (tableOptionsAny.state) {
        ;(result as any).state = tableOptionsAny.state
      }
      if (tableOptionsAny.onStateChange) {
        ;(result as any).onStateChange = tableOptionsAny.onStateChange
      }

      return result
    })

    // convert table instance to signal for proxify to listen to any table state and options changes
    const tableSignal = computed(
      () => {
        table.setOptions(updatedOptions())
        return table
      },
      {
        equal: () => false,
      },
    )

    table._setRootNotifier?.(tableSignal as any)

    // Wrap all "get*" methods to make them reactive
    const allState = injectStore(
      table.store,
      (state: TableState<TFeatures>) => state,
    )
    Object.keys(table).forEach((key) => {
      const value = (table as any)[key]
      if (typeof value === 'function' && key.startsWith('get')) {
        const originalMethod = value.bind(table)
        ;(table as any)[key] = (...args: any[]) => {
          // Access state to create reactive dependency
          allState()
          return originalMethod(...args)
        }
      }
    })

    // Add Subscribe function
    ;(table as any).Subscribe = function Subscribe<TSubSelected = {}>(props: {
      selector: (state: TableState<TFeatures>) => TSubSelected
      children: ((state: Signal<Readonly<TSubSelected>>) => any) | any
    }) {
      const selected = injectStore(table.store, props.selector)
      if (typeof props.children === 'function') {
        return props.children(selected)
      }
      return props.children
    }

    const stateStore = injectStore(table.store, selector)

    // proxify Table instance to provide ability for consumer to listen to any table state changes
    const proxifiedTable = proxifyTable(tableSignal) as AngularTable<
      TFeatures,
      TData,
      TSelected
    >

    // Add state property
    Object.defineProperty(proxifiedTable, 'state', {
      get() {
        return stateStore
      },
      enumerable: true,
      configurable: true,
    })

    return proxifiedTable
  })
}
