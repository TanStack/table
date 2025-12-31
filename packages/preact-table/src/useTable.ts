import { useMemo, useState } from 'preact/hooks'
import { constructTable } from '@tanstack/table-core'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import { useStore } from '@tanstack/preact-store'
import type { ComponentChildren } from 'preact'

export type PreactTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * A Preact HOC (Higher Order Component) that allows you to subscribe to the table state.
   *
   * This is useful for opting into state re-renders for specific parts of the table state.
   *
   * @example
   * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
   *   {({ rowSelection }) => ( // important to include `{() => {()}}` syntax
   *     <tr key={row.id}>
   *       // render the row
   *     </tr>
   *   )}
   * </table.Subscribe>
   */
  Subscribe: <TSelected>(props: {
    selector: (state: NoInfer<TableState<TFeatures>>) => TSelected
    children: ((state: TSelected) => ComponentChildren) | ComponentChildren
  }) => ComponentChildren
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
  tableOptions: TableOptions<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): PreactTable<TFeatures, TData, TSelected> {
  const [table] = useState(() => {
    const instance = constructTable(tableOptions) as PreactTable<
      TFeatures,
      TData,
      TSelected
    >

    instance.Subscribe = function Subscribe<TSelected>(props: {
      selector: (state: TableState<TFeatures>) => TSelected
      children: ((state: TSelected) => ComponentChildren) | ComponentChildren
    }) {
      const selected = useStore(instance.store, props.selector)

      return typeof props.children === 'function'
        ? props.children(selected)
        : props.children
    }

    return instance
  })

  const state = useStore(table.store, selector)

  return useMemo(
    () => ({
      ...table,
      state,
    }),
    [state, table],
  )
}
