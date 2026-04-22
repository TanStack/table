import {
  Injector,
  assertInInjectionContext,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core'
import { constructTable } from '@tanstack/table-core'
import { toObservable } from '@angular/core/rxjs-interop'
import { shallow } from '@tanstack/angular-store'
import { lazyInit } from './lazySignalInitializer'
import type { Atom, ReadonlyAtom } from '@tanstack/angular-store'
import type {
  RowData,
  Table,
  TableAtomOptions,
  TableFeatures,
  TableOptions,
  TableReactivityBindings,
  TableState,
} from '@tanstack/table-core'
import type { Signal, ValueEqualityFn, WritableSignal } from '@angular/core'

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
   * Creates a computed that subscribe to changes in the table store with a custom selector.
   * Default equality function is "shallow".
   */
  computed: <TSubSelected = {}>(props: {
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
    const resolvedOptions: TableOptions<TFeatures, TData> = {
      ...options(),
      reactivity: angularReactivity(injector),
    } as TableOptions<TFeatures, TData>

    const table = constructTable(resolvedOptions) as AngularTable<
      TFeatures,
      TData,
      TSelected
    >

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

    table.computed = function Subscribe<TSubSelected = {}>(props: {
      selector: (state: TableState<TFeatures>) => TSubSelected
      equal?: ValueEqualityFn<TSubSelected>
    }) {
      return computed(() => props.selector(table.store.get()), {
        equal: props.equal,
      })
    }

    Object.defineProperty(table, 'state', {
      value: computed(() => selector(table.store.get())),
    })

    Object.defineProperty(table, 'value', {
      value: computed(
        () => {
          table.store.get()
          table.optionsStore.get()
          return table
        },
        { equal: () => false },
      ),
    })

    return table
  })
}

function computedToReadonlyAtom<T>(
  signal: () => T,
  injector: Injector,
): ReadonlyAtom<T> {
  const atom: ReadonlyAtom<T> = computed(() =>
    signal(),
  ) as unknown as ReadonlyAtom<T>
  atom.get = () => signal()
  atom.subscribe = (observer) => {
    return toObservable(computed(signal), {
      injector: injector,
    }).subscribe(observer)
  }
  return atom
}

function signalToAtom<T>(
  signal: WritableSignal<T>,
  injector: Injector,
): Atom<T> {
  const atom: Atom<T> = () => {
    return signal()
  }
  atom.set = (value) =>
    // @ts-expect-error Fix
    typeof value === 'function' ? signal.update(value) : signal.set(value)
  atom.get = () => signal()
  atom.subscribe = (observer) => {
    return toObservable(computed(signal), { injector }).subscribe(observer)
  }
  return atom
}

function angularReactivity(injector: Injector): TableReactivityBindings {
  return {
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      return computedToReadonlyAtom(
        computed(() => fn(), {
          equal: options?.compare,
          debugName: options?.debugName,
        }),
        injector,
      )
    },
    createWritableAtom: <T>(
      value: T,
      options?: TableAtomOptions<T>,
    ): Atom<T> => {
      return signalToAtom(
        signal(value, {
          equal: options?.compare,
          debugName: options?.debugName,
        }),
        injector,
      )
    },
    untrack: untracked,
  }
}
