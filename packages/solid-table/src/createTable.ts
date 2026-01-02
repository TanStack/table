import { constructTable } from '@tanstack/table-core'
import { useStore } from '@tanstack/solid-store'
import { createComputed, createSignal } from 'solid-js'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Accessor, JSX } from 'solid-js'

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
  const table = constructTable(tableOptions) as SolidTable<
    TFeatures,
    TData,
    TSelected
  >

  /**
   * Temp force reactivity to all state changes on every table.get* method
   */
  const allState = useStore(table.store, (state) => state)
  const [renderVersion, setRenderVersion] = createSignal(0)

  createComputed(() => {
    // Access storeState to create reactive dependency
    allState()
    // Increment version to invalidate cached get* methods
    setRenderVersion((v) => v + 1)
    // Update options when store changes
    // table.setOptions((prev) => {
    //   return mergeProps(prev, tableOptions) as TableOptions<TFeatures, TData>
    // })
  })

  // Wrap all "get*" methods to make them reactive
  Object.keys(table).forEach((key) => {
    const value = (table as any)[key]
    if (typeof value === 'function' && key.startsWith('get')) {
      const originalMethod = value.bind(table)
      ;(table as any)[key] = (...args: Array<any>) => {
        renderVersion()
        return originalMethod(...args)
      }
    }
  })

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
