import {
  constructReactivityFeature,
  constructTable,
} from '@tanstack/table-core'
import { useStore } from '@tanstack/solid-store'
import {
  createComputed,
  createMemo,
  createSignal,
  getOwner,
  mergeProps,
  runWithOwner,
} from 'solid-js'
import type { Accessor, JSX } from 'solid-js'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type SolidTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * A Solid component that allows you to subscribe to the table state.
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
    children: ((state: Accessor<TSelected>) => JSX.Element) | JSX.Element
  }) => JSX.Element
  /**
   * The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `createTable`.
   *
   * @example
   * const table = createTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state
   *
   * console.log(table.state().globalFilter)
   */
  readonly state: Accessor<Readonly<TSelected>>
}

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): SolidTable<TFeatures, TData, TSelected> {
  const owner = getOwner()

  const solidReactivityFeature = constructReactivityFeature({
    createSignal: (value) => {
      const signal = createSignal(value)
      function interoperableSignal() {
        return signal[0]()
      }
      return Object.assign(interoperableSignal, {
        set: (value: any) => signal[1](() => value),
      })
    },
    createMemo: (fn) => {
      if (owner) {
        return runWithOwner(owner, () => createMemo(fn))!
      }
      return createMemo(fn)
    },
    isSignal: (value) => typeof value === 'function',
  })

  const mergedOptions = mergeProps(tableOptions, {
    _features: mergeProps(tableOptions._features, {
      solidReactivityFeature,
    }),
  }) as any

  const [renderVersion, setRenderVersion] = createSignal(0)

  const resolvedOptions = mergeProps(
    {
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        options: TableOptions<TFeatures, TData>,
      ) => {
        return mergeProps(defaultOptions, options)
      },
    },
    mergedOptions,
  ) as TableOptions<TFeatures, TData>

  const table = constructTable(resolvedOptions) as SolidTable<
    TFeatures,
    TData,
    TSelected
  >

  // @ts-ignore
  table.setTableNotifier(() => {
    renderVersion()
    return table
  })

  /**
   * Temp force reactivity to all state changes on every table.get* method
   */
  const allState = useStore(table.store, (state) => state)
  const allOptions = useStore(table.baseOptionsStore, (options) => options)

  createComputed(() => {
    table.setOptions((prev) => {
      return mergeProps(prev, mergedOptions) as TableOptions<TFeatures, TData>
    })
  })

  createComputed(() => {
    // Access storeState to create reactive dependency
    allState()
    allOptions()
    // Increment version to invalidate cached get* methods
    setRenderVersion((v) => v + 1)
    // Update options when store changes
    // table.setOptions((prev) => {
    //   return mergeProps(prev, tableOptions) as TableOptions<TFeatures, TData>
    // })
  })

  // Object.assign(table, {
  //   get options() {
  //     allOptions()
  //     return table.baseOptionsStore.get()
  //   },
  // })
  //
  // Object.defineProperty(table.store, 'get', {
  //   value: () => {
  //     allState()
  //     allOptions()
  //     return table.store['atom'].get()
  //   },
  // })
  // Object.defineProperty(table.store, 'state', {
  //   get() {
  //     allState()
  //     allOptions()
  //     return this['atom'].get()
  //   },
  // })

  table.Subscribe = function Subscribe<TSelected>(props: {
    selector: (state: TableState<TFeatures>) => TSelected
    children: ((state: Accessor<TSelected>) => JSX.Element) | JSX.Element
  }) {
    const selected = useStore(table.store, props.selector)
    return typeof props.children === 'function'
      ? props.children(selected)
      : props.children
  }

  const state = useStore(table.store, selector)

  return {
    ...table,
    state,
  } as SolidTable<TFeatures, TData, TSelected>
}
