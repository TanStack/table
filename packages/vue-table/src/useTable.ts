import { unref, watch } from 'vue'
import { constructTable } from '@tanstack/table-core'
import { shallow, useSelector } from '@tanstack/vue-store'
import { mergeProxy } from './merge-proxy'
import { vueReactivity } from './signals'
import type { Atom, ReadonlyAtom } from '@tanstack/vue-store'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableReactivityBindings,
  TableState,
} from '@tanstack/table-core'
import type { MaybeRef, VNode } from 'vue'

export type TableOptionsWithReactiveData<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  [K in keyof TableOptions<TFeatures, TData>]: K extends 'data'
    ? MaybeRef<ReadonlyArray<TData>>
    : MaybeRef<TableOptions<TFeatures, TData>[K]>
}

function getOptionsWithReactiveValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptionsWithReactiveData<TFeatures, TData>) {
  const resolvedOptions: Record<string, unknown> = {}

  for (const key of Object.keys(options)) {
    resolvedOptions[key] = unref(
      options[key as keyof TableOptionsWithReactiveData<TFeatures, TData>],
    )
  }

  return mergeProxy(options, resolvedOptions)
}

function getReactiveOptionDeps<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptionsWithReactiveData<TFeatures, TData>) {
  return Object.keys(options).map((key) =>
    unref(options[key as keyof TableOptionsWithReactiveData<TFeatures, TData>]),
  )
}

export type VueTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * Store mode: `selector` required. Source mode: pass `source` (atom or store); omit
   * `selector` for the whole value (identity), or pass `selector` to project. Split
   * overloads so source-only infers `TSourceValue` for `children` (see React `Subscribe`).
   */
  Subscribe: {
    <TSourceValue>(props: {
      source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
      selector?: undefined
      children:
        | ((state: Readonly<TSourceValue>) => VNode | Array<VNode>)
        | VNode
        | Array<VNode>
    }): VNode | Array<VNode>
    <TSourceValue, TSubSelected>(props: {
      source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
      selector: (state: TSourceValue) => TSubSelected
      children:
        | ((state: Readonly<TSubSelected>) => VNode | Array<VNode>)
        | VNode
        | Array<VNode>
    }): VNode | Array<VNode>
    <TSubSelected>(props: {
      selector: (state: NoInfer<TableState<TFeatures>>) => TSubSelected
      children:
        | ((state: Readonly<TSubSelected>) => VNode | Array<VNode>)
        | VNode
        | Array<VNode>
    }): VNode | Array<VNode>
  }
  /**
   * The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `useTable`.
   *
   * @example
   * const table = useTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state
   *
   * console.log(table.state.globalFilter)
   */
  readonly state: Readonly<TSelected>
}

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
>(
  tableOptions:
    | TableOptions<TFeatures, TData>
    | TableOptionsWithReactiveData<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): VueTable<TFeatures, TData, TSelected> {
  const syncTableOptions = (
    table: Table<TFeatures, TData>,
    options: TableOptionsWithReactiveData<TFeatures, TData>,
  ) => {
    table.setOptions(
      () =>
        getOptionsWithReactiveValues(options) as TableOptions<TFeatures, TData>,
    )
  }

  const mergedOptions = {
    ...tableOptions,
    reactivity: tableOptions.reactivity ?? vueReactivity(),
  }

  const resolvedOptions = mergeProxy(
    getOptionsWithReactiveValues(
      mergedOptions as TableOptionsWithReactiveData<TFeatures, TData>,
    ),
    {
      // Remove state and onStateChange - store handles it internally
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => {
        return mergeProxy(defaultOptions, newOptions)
      },
    },
  ) as TableOptions<TFeatures, TData> & { reactivity: TableReactivityBindings }

  const table = constructTable(resolvedOptions) as VueTable<
    TFeatures,
    TData,
    TSelected
  >

  watch(
    () =>
      getReactiveOptionDeps(
        mergedOptions as TableOptionsWithReactiveData<TFeatures, TData>,
      ),
    () => {
      syncTableOptions(table, mergedOptions)
    },
    { immediate: true },
  )

  watch(
    () => {
      const controlledState = unref(tableOptions.state) as
        | Record<string, unknown>
        | undefined
      const controlledAtoms = unref(tableOptions.atoms) as
        | Record<string, unknown>
        | undefined

      if (!controlledState) {
        return []
      }

      const controlledValues: Array<unknown> = []

      for (const key of Object.keys(table.initialState)) {
        if (!(key in controlledState) || controlledAtoms?.[key] !== undefined) {
          continue
        }

        // Reading only controlled state slices here lets Vue subscribe to
        // getters/computed values that are passed through `options.state`.
        controlledValues.push(controlledState[key])
      }

      return controlledValues
    },
    (controlledValues) => {
      if (controlledValues.length > 0) {
        syncTableOptions(table, mergedOptions)
      }
    },
    { immediate: true },
  )

  table.Subscribe = ((props: {
    source?: Atom<unknown> | ReadonlyAtom<unknown>
    selector?: ((state: unknown) => unknown) | undefined
    children:
      | ((state: Readonly<unknown>) => VNode | Array<VNode>)
      | VNode
      | Array<VNode>
  }) => {
    const source = props.source !== undefined ? props.source : table.store
    const selectFn =
      props.source !== undefined
        ? (props.selector ?? ((x: unknown) => x))
        : props.selector
    const selected = useSelector(source as never, selectFn as never, {
      compare: shallow,
    })
    if (typeof props.children === 'function') {
      return props.children(selected.value as Readonly<unknown>)
    }
    return props.children
  }) as VueTable<TFeatures, TData, TSelected>['Subscribe']

  const stateStore = useSelector(table.store, selector)

  return {
    ...table,
    get state() {
      return stateStore.value
    },
  }
}
