import { useEffect, useLayoutEffect, useMemo, useState } from 'preact/hooks'
import { constructTable } from '@tanstack/table-core'
import { shallow, useStore } from '@tanstack/preact-store'
import { FlexRender } from './FlexRender'
import { Subscribe } from './Subscribe'
import type {
  CellData,
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { ComponentChildren } from 'preact'
import type { FlexRenderProps } from './FlexRender'
import type { SubscribeProps } from './Subscribe'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

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
   * A Preact component that renders headers, cells, or footers with custom markup.
   * Use this utility component instead of manually calling flexRender.
   *
   * @example
   * ```tsx
   * <table.FlexRender cell={cell} />
   * <table.FlexRender header={header} />
   * <table.FlexRender footer={footer} />
   * ```
   *
   * This replaces calling `flexRender` directly like this:
   * ```tsx
   * flexRender(cell.column.columnDef.cell, cell.getContext())
   * flexRender(header.column.columnDef.header, header.getContext())
   * flexRender(footer.column.columnDef.footer, footer.getContext())
   * ```
   */
  FlexRender: <TValue extends CellData = CellData>(
    props: FlexRenderProps<TFeatures, TData, TValue>,
  ) => ComponentChildren
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
    const tableInstance = constructTable(tableOptions) as PreactTable<
      TFeatures,
      TData,
      TSelected
    >

    tableInstance.Subscribe = function SubscribeBound<TSelected>(
      props: Omit<SubscribeProps<TFeatures, TData, TSelected>, 'table'>,
    ) {
      return Subscribe({ ...props, table: tableInstance })
    }

    tableInstance.FlexRender = FlexRender

    return tableInstance
  })

  // sync table options on every render
  table.setOptions((prev) => ({
    ...prev,
    ...tableOptions,
  }))

  useIsomorphicLayoutEffect(() => {
    // prevent race condition between table.setOptions and table.baseStore.setState
    queueMicrotask(() => {
      table.baseStore.setState((prev) => ({
        ...prev,
      }))
    })
  }, [
    table.options.columns, // re-render when columns change
    table.options.data, // re-render when data changes
    table.options.state, // sync preact state to the table store
  ])

  const state = useStore(table.store, selector, { equal: shallow })

  return useMemo(
    () => ({
      ...table,
      state,
    }),
    [state, table],
  )
}
