import {
  DestroyRef,
  Injector,
  NgZone,
  assertInInjectionContext,
  effect,
  inject,
  untracked,
} from '@angular/core'
import { constructTable } from '@tanstack/table-core'
import { lazyInit } from './lazySignalInitializer'
import { angularReactivity } from './reactivity'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/angular-store'

export type SubscribeSource<TValue> =
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
  | ReadonlyStore<TValue>

export type AngularTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData> & {
  /**
   * @deprecated Prefer `table.atoms.<slice>.get()` for template/render reads
   * of a specific state slice, `table.state` for full-state debug snapshots, or
   * Angular computed values around explicit selectors. `table.store.state` is a
   * current-value snapshot and is easy to misuse in render code.
   */
  readonly store: Table<TFeatures, TData>['store']
  /**
   * The current table state exposed as a flat proxy. Prefer
   * `table.atoms.<slice>.get()` when reading a specific slice.
   */
  readonly state: Readonly<TableState<TFeatures>>
}

function createStateProxy<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): Readonly<TableState<TFeatures>> {
  const getSnapshot = () => {
    const snapshot = {} as TableState<TFeatures>
    const stateKeys = Object.keys(table.initialState) as Array<
      string & keyof TableState<TFeatures>
    >

    for (const key of stateKeys) {
      ;(snapshot as Record<string, unknown>)[key] = table.atoms[key].get()
    }

    return snapshot
  }

  const target = {} as TableState<TFeatures>

  return new Proxy(target, {
    get(target, prop, receiver) {
      if (prop === 'toJSON') {
        return getSnapshot
      }

      if (typeof prop === 'string' && prop in table.initialState) {
        return table.atoms[prop as keyof TableState<TFeatures>]?.get()
      }

      return Reflect.get(target, prop, receiver)
    },
    has(_, prop) {
      return typeof prop === 'string' && prop in table.initialState
    },
    ownKeys() {
      return Reflect.ownKeys(table.initialState)
    },
    getOwnPropertyDescriptor(_, prop) {
      if (typeof prop !== 'string' || !(prop in table.initialState)) {
        return undefined
      }

      return {
        enumerable: true,
        configurable: true,
      }
    },
  })
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
 * const features = tableFeatures({
 *  rowPaginationFeature,
 *  // ...all other features you need
 * })
 *
 * // Use all table core features
 * import {stockFeatures} from '@tanstack/angular-table';
 * const features = tableFeatures(stockFeatures);
 * ```
 * 2. Prepare the table columns
 * ```ts
 * import {ColumnDef} from '@tanstack/angular-table';
 *
 * type MyData = {}
 *
 * const columns: ColumnDef<typeof features, MyData>[] = [
 *   // ...column definitions
 * ]
 *
 * // or using createColumnHelper
 * import {createColumnHelper} from '@tanstack/angular-table';
 * const columnHelper = createColumnHelper<typeof features, MyData>();
 * const columns = columnHelper.columns([
 *  columnHelper.accessor(...),
 *  // ...other columns
 * ])
 * ```
 * 3. Create the table instance with `injectTable`
 * ```ts
 * const table = injectTable(() => {
 *   // ...table options,
 *   features,
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
>(
  options: () => TableOptions<TFeatures, TData>,
): AngularTable<TFeatures, TData> {
  assertInInjectionContext(injectTable)
  const injector = inject(Injector)
  const ngZone = inject(NgZone)

  return ngZone.runOutsideAngular(() =>
    lazyInit(() => {
      const table = constructTable({
        ...options(),
        features: {
          coreReativityFeature: angularReactivity(injector),
          ...options().features,
        },
      }) as AngularTable<TFeatures, TData>

      injector.get(DestroyRef).onDestroy(() => {
        table._reactivity.unmount?.()
      })

      const stateProxy = createStateProxy(table)

      Object.defineProperty(table, 'state', {
        get() {
          return stateProxy
        },
        configurable: true,
        enumerable: true,
      })

      let isMount = true
      effect(
        () => {
          const newOptions = options()
          if (isMount) {
            isMount = false
            return
          }
          untracked(() =>
            table.setOptions((previous) => ({
              ...previous,
              ...newOptions,
            })),
          )
        },
        { injector, debugName: 'tableOptionsUpdate' },
      )

      return table
    }),
  )
}
