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
> = Omit<TableOptions<TFeatures, TData>, 'data'> & {
  data: MaybeRef<ReadonlyArray<TData>>
}

function getOptionsWithReactiveData<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptionsWithReactiveData<TFeatures, TData>) {
  return mergeProxy(options, {
    data: unref(options.data),
  })
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

  const vueReactivityFeature = constructReactivityFeature({
    stateNotifier: () => notifier.value,
    optionsNotifier: () => notifier.value,
  })

  const IS_REACTIVE = isRef(tableOptions.data)

  const mergedOptions = {
    ...tableOptions,
    _features: {
      ...tableOptions._features,
      vueReactivityFeature,
    },
  }

  const resolvedOptions = mergeProxy(
    IS_REACTIVE
      ? getOptionsWithReactiveData(
          mergedOptions as TableOptions<TFeatures, TData>,
        )
      : mergedOptions,
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
      [
        IS_REACTIVE ? unref(tableOptions.data) : tableOptions.data,
        tableOptions,
      ] as const,
    () => {
      table.setOptions((prev) => {
        return mergeProxy(
          prev,
          IS_REACTIVE
            ? getOptionsWithReactiveData(
                tableOptions as TableOptions<TFeatures, TData>,
              )
            : tableOptions,
        ) as TableOptions<TFeatures, TData>
      })
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
