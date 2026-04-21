import { isRef, ref, unref, watch, watchEffect } from 'vue'
import {
  constructReactivityFeature,
  constructTable,
} from '@tanstack/table-core'
import { useSelector } from '@tanstack/vue-store'
import { mergeProxy } from './merge-proxy'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
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
   * A Vue component that allows you to subscribe to the table state.
   *
   * This is useful for opting into state subscriptions for specific parts of the table state.
   *
   * @example
   * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
   *   {(state) => (
   *     <tr>
   *       // render the row
   *     </tr>
   *   )}
   * </table.Subscribe>
   */
  Subscribe: <TSelected>(props: {
    selector: (state: NoInfer<TableState<TFeatures>>) => TSelected
    children:
      | ((state: Readonly<TSelected>) => VNode | Array<VNode>)
      | VNode
      | Array<VNode>
  }) => VNode | Array<VNode>
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
  tableOptions: TableOptionsWithReactiveData<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): VueTable<TFeatures, TData, TSelected> {
  const notifier = ref<number>(0)

  const syncTableOptions = (
    table: Table<TFeatures, TData>,
    options: TableOptionsWithReactiveData<TFeatures, TData>,
  ) => {
    table.setOptions(
      () =>
        getOptionsWithReactiveValues(options) as TableOptions<TFeatures, TData>,
    )
  }

  const vueReactivityFeature = constructReactivityFeature({
    stateNotifier: () => notifier.value,
    optionsNotifier: () => notifier.value,
  })

  const mergedOptions = {
    ...tableOptions,
    _features: {
      ...tableOptions._features,
      vueReactivityFeature,
    },
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
  ) as TableOptions<TFeatures, TData>

  const table = constructTable(resolvedOptions) as VueTable<
    TFeatures,
    TData,
    TSelected
  >

  const allState = useSelector(table.store, (state) => state)
  const allOptions = useSelector(table.optionsStore, (state) => state)

  watchEffect(() => {
    allState.value
    allOptions.value
    notifier.value++
  })

  watch(
    () =>
      getReactiveOptionDeps(
        mergedOptions as TableOptionsWithReactiveData<TFeatures, TData>,
      ),
    () => {
      syncTableOptions(
        table,
        mergedOptions as TableOptionsWithReactiveData<TFeatures, TData>,
      )
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
        syncTableOptions(
          table,
          mergedOptions as TableOptionsWithReactiveData<TFeatures, TData>,
        )
      }
    },
    { immediate: true },
  )

  table.Subscribe = function Subscribe<TSelected>(props: {
    selector: (state: TableState<TFeatures>) => TSelected
    children:
      | ((state: Readonly<TSelected>) => VNode | Array<VNode>)
      | VNode
      | Array<VNode>
  }): VNode | Array<VNode> {
    const selected = useSelector(table.store, props.selector)
    if (typeof props.children === 'function') {
      return props.children(selected.value)
    }
    return props.children
  }

  const stateStore = useSelector(table.store, selector)

  return {
    ...table,
    get state() {
      return stateStore.value
    },
  } as VueTable<TFeatures, TData, TSelected>
}
