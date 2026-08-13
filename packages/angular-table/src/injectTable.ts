import {
  DestroyRef,
  Injector,
  NgZone,
  assertInInjectionContext,
  computed,
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
} from '@tanstack/table-core'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/angular-store'

export type SubscribeSource<TValue> =
  Atom<TValue> | ReadonlyAtom<TValue> | Store<TValue> | ReadonlyStore<TValue>

export type AngularTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData>

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
  optionsFactory: () => TableOptions<TFeatures, TData>,
): AngularTable<TFeatures, TData> {
assertInInjectionContext(injectTable)
const injector = inject(Injector)
const ngZone = inject(NgZone)
  const destroyRef = inject(DestroyRef)
  const options = computed(() => optionsFactory())
  const coreReactivityFeature = angularReactivity(injector)

  const lazyTable = ngZone.runOutsideAngular(() =>
    lazyInit(() => {
      const currentOptions = options()
      const features = {
        coreReactivityFeature,
        ...currentOptions.features,
      } satisfies TableFeatures
      return constructTable<TFeatures, TData>({
        ...currentOptions,
        features,
      })
    }),
  )

  destroyRef.onDestroy(() => {
    if (lazyTable.initialized) {
      lazyTable.value._reactivity.unmount?.()
    }
  })

  let previousOptions: TableOptions<TFeatures, TData> | undefined = undefined
  effect(
    () => {
      const currentOptions = options()
      // rawValue will be always valued here due to internal lazyInit effect
      const tableInstance = lazyTable.rawValue
      if (previousOptions === currentOptions) return
      untracked(() =>
        tableInstance.setOptions((previous) => ({
          ...previous,
          ...currentOptions,
        })),
      )
      previousOptions = currentOptions
    },
    { injector, debugName: 'tableOptionsUpdate' },
  )

  return lazyTable.value
}
