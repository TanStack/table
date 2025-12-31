import { isRef, unref, watch } from 'vue'
import { constructTable } from '@tanstack/table-core'
import { useStore } from '@tanstack/vue-store'
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
  data: MaybeRef<Array<TData>>
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
      | ((state: Readonly<TSelected>) => VNode | VNode[])
      | VNode
      | VNode[]
  }) => VNode | VNode[]
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
  const IS_REACTIVE = isRef(tableOptions.data)

  const statefulOptions = mergeProxy(
    IS_REACTIVE ? getOptionsWithReactiveData(tableOptions) : tableOptions,
    {
      // Remove state and onStateChange - store handles it internally
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => {
        return IS_REACTIVE
          ? {
              ...defaultOptions,
              ...newOptions,
            }
          : mergeProxy(defaultOptions, newOptions)
      },
    },
  ) as TableOptions<TFeatures, TData>

  const table = constructTable(statefulOptions) as VueTable<
    TFeatures,
    TData,
    TSelected
  >

  function updateOptions() {
    table.setOptions((prev) => {
      return mergeProxy(
        prev,
        IS_REACTIVE ? getOptionsWithReactiveData(tableOptions) : tableOptions,
      ) as TableOptions<TFeatures, TData>
    })
  }

  updateOptions()

  // Add reactivity support for reactive data
  if (IS_REACTIVE) {
    watch(
      () => tableOptions.data,
      () => {
        table.store.setState((prev: TableState<TFeatures>) => ({
          ...prev,
          data: unref(tableOptions.data),
        }))
      },
      { immediate: true },
    )
  }

  /**
   * Temp force reactivity to all state changes on every table.get* method
   */
  const allState = useStore(table.store, (state) => state)

  // Wrap all "get*" methods to make them reactive
  // Access allState.value directly to create reactive dependency
  Object.keys(table).forEach((key) => {
    const value = (table as any)[key]
    if (typeof value === 'function' && key.startsWith('get')) {
      const originalMethod = value.bind(table)
      ;(table as any)[key] = (...args: any[]) => {
        // Access state to create reactive dependency
        allState.value
        return originalMethod(...args)
      }
    }
  })

  table.Subscribe = function Subscribe<TSelected>(props: {
    selector: (state: TableState<TFeatures>) => TSelected
    children:
      | ((state: Readonly<TSelected>) => VNode | VNode[])
      | VNode
      | VNode[]
  }): VNode | VNode[] {
    const selected = useStore(table.store, props.selector)
    if (typeof props.children === 'function') {
      return props.children(selected.value)
    }
    return props.children
  }

  const stateStore = useStore(table.store, selector)

  return {
    ...table,
    get state() {
      return stateStore.value
    },
  } as VueTable<TFeatures, TData, TSelected>
}
