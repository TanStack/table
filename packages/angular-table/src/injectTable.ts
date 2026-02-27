import {
  Injector,
  assertInInjectionContext,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core'
import {
  constructReactivityFeature,
  constructTable,
} from '@tanstack/table-core'
import { injectStore } from '@tanstack/angular-store'
import { lazyInit } from './lazySignalInitializer'
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
  TSelected = TableState<TFeatures>,
> = Table<TFeatures, TData> & {
  /**
   * The selected state from the table store, based on the selector provided.
   */
  readonly state: Signal<Readonly<TSelected>>
  /**
   * A signal that returns the entire table instance. Will update on table/options change.
   */
  readonly value: Signal<AngularTable<TFeatures, TData, TSelected>>
  /**
   * Subscribe to changes in the table store with a custom selector.
   */
  Subscribe: <TSubSelected = {}>(props: {
    selector: (state: TableState<TFeatures>) => TSubSelected
    equal?: ValueEqualityFn<TSubSelected>
  }) => Signal<Readonly<TSubSelected>>
}

/**
 * Creates and returns an Angular-reactive table instance.
 *
 * The initializer is intentionally re-evaluated whenever any signal read inside it changes.
 * This is how the adapter keeps the table in sync with Angular's reactivity model.
 *
 * Because of that behavior, keep expensive/static values (for example `columns`, feature setup, row models)
 * as stable references outside the initializer, and only read reactive state (`data()`, pagination/filter/sorting signals, etc.)
 * inside it.
 *
 * The returned table is also signal-reactive: table state and table APIs are wired for Angular signals, so you can safely consume table methods inside `computed(...)` and `effect(...)`.
 *
 * @example
 * 1. Register the table features you need
 * ```ts
 * // Register only the features you need
 * import {tableFeatures, rowPaginationFeature} from '@tanstack/angular-table';
 * const _features = tableFeatures({
 *  rowPaginationFeature,
 *  // ...all other features you need
 * })
 *
 * // Use all table core features
 * import {stockFeatures} from '@tanstack/angular-table';
 * const _features = tableFeatures(stockFeatures);
 * ```
 * 2. Prepare the table columns
 * ```ts
 * import {ColumnDef} from '@tanstack/angular-table';
 *
 * type MyData = {}
 *
 * const columns: ColumnDef<typeof _features, MyData>[] = [
 *   // ...column definitions
 * ]
 *
 * // or using createColumnHelper
 * import {createColumnHelper} from '@tanstack/angular-table';
 * const columnHelper = createColumnHelper<typeof _features, MyData>();
 * const columns = columnHelper.columns([
 *  columnHelper.accessor(...),
 *  // ...other columns
 * ])
 * ```
 * 3. Create the table instance with `injectTable`
 * ```ts
 * const table = injectTable(() => {
 *   // ...table options,
 *   _features,
 *   columns: columns,
 *   data: myDataSignal(),
 * })
 * ```
 *
 * @returns An Angular-reactive TanStack Table instance.
 */
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
    const stateNotifier = signal(0)

    const angularReactivityFeature = constructReactivityFeature({
      stateNotifier: stateNotifier,
    })

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
      const currentOptions = table.options
      const result: TableOptions<TFeatures, TData> = {
        ...currentOptions,
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

    const tableState = injectStore(
      table.store,
      (state: TableState<TFeatures>) => state,
      { injector },
    )
    const tableOptions = injectStore(table.baseOptionsStore, (state) => state, {
      injector,
    })

    effect(
      () => {
        const newOptions = updatedOptions()
        untracked(() => table.setOptions(newOptions))
        untracked(() => table.baseStore.setState((prev) => ({ ...prev })))
      },
      { injector },
    )

    let firstRun = true
    effect(
      () => {
        void tableState()
        void tableOptions()
        if (firstRun) {
          firstRun = false
          return
        }
        untracked(() => stateNotifier.update((n) => n + 1))
      },
      { injector },
    )

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

    Object.defineProperty(table, 'value', {
      value: computed(() => {
        stateNotifier()
        return table
      }),
    })

    return table
  })
}
