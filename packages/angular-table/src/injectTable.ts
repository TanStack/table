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
import { injectSelector } from '@tanstack/angular-store'
import { lazyInit } from './lazySignalInitializer'
import type { Atom, ReadonlyAtom } from '@tanstack/angular-store'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Signal, ValueEqualityFn } from '@angular/core'

/**
 * Store mode: pass `selector` (required) to project from full table state.
 * Source mode: pass `source` (atom or store); omit `selector` for the whole value
 * (identity), or pass `selector` to project. Split overloads match React `Subscribe`
 * inference.
 */
export interface AngularTableComputed<TFeatures extends TableFeatures> {
  <TSourceValue>(props: {
    source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
    selector?: undefined
    equal?: ValueEqualityFn<TSourceValue>
  }): Signal<Readonly<TSourceValue>>
  <TSourceValue, TSubSelected>(props: {
    source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
    selector: (state: TSourceValue) => TSubSelected
    equal?: ValueEqualityFn<TSubSelected>
  }): Signal<Readonly<TSubSelected>>
  <TSubSelected>(props: {
    selector: (state: TableState<TFeatures>) => TSubSelected
    equal?: ValueEqualityFn<TSubSelected>
  }): Signal<Readonly<TSubSelected>>
}

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
   * Alias: **`Subscribe`** — same function reference as `computed` (naming parity with other adapters).
   */
  computed: AngularTableComputed<TFeatures>
  Subscribe: AngularTableComputed<TFeatures>
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
  const stateNotifier = signal(0)
  const angularReactivityFeature = constructReactivityFeature({
    stateNotifier: () => stateNotifier(),
  })

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
    const tableState = injectSelector(table.store, (state) => state, {
      injector,
    })
    const tableOptions = injectSelector(table.optionsStore, (state) => state, {
      injector,
    })

    const updatedOptions = computed<TableOptions<TFeatures, TData>>(() => {
      const tableOptionsValue = options()
      const result: TableOptions<TFeatures, TData> = {
        ...untracked(() => table.options),
        ...tableOptionsValue,
        _features: { ...tableOptionsValue._features, angularReactivityFeature },
      }
      if (tableOptionsValue.state) {
        result.state = tableOptionsValue.state
      }
      return result
    })

    effect(
      () => {
        const newOptions = updatedOptions()
        untracked(() => table.setOptions(newOptions))
      },
      { injector, debugName: 'tableOptionsUpdate' },
    )

    let isMount = true
    effect(
      () => {
        void [tableOptions(), tableState()]
        if (!isMount) untracked(() => stateNotifier.update((n) => n + 1))
        isMount && (isMount = false)
      },
      { injector, debugName: 'tableStateNotifier' },
    )

    const computedFn = function computedSubscribe(props: {
      source?: Atom<unknown> | ReadonlyAtom<unknown>
      selector?: (state: unknown) => unknown
      equal?: ValueEqualityFn<unknown>
    }) {
      if (props.source !== undefined) {
        return injectSelector(
          props.source,
          props.selector ?? ((value) => value),
          {
            injector,
            ...(props.equal && { compare: props.equal }),
          },
        )
      }
      return injectSelector(table.store, props.selector, {
        injector,
        ...(props.equal && { compare: props.equal }),
      })
    }
    table.computed = computedFn as AngularTable<
      TFeatures,
      TData,
      TSelected
    >['computed']
    table.Subscribe = computedFn as AngularTable<
      TFeatures,
      TData,
      TSelected
    >['Subscribe']

    Object.defineProperty(table, 'state', {
      value: injectSelector(table.store, selector, { injector }),
    })

    Object.defineProperty(table, 'value', {
      value: computed(() => {
        tableOptions()
        tableState()
        return table
      }),
    })

    return table
  })
}
