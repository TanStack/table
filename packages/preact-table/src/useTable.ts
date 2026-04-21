import { useMemo, useState } from 'preact/hooks'
import { constructTable } from '@tanstack/table-core'
import { shallow, useSelector } from '@tanstack/preact-store'
import { FlexRender } from './FlexRender'
import { Subscribe } from './Subscribe'
import type {
  CellData,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Atom, ReadonlyAtom } from '@tanstack/preact-store'
import type { ComponentChildren } from 'preact'
import type { FlexRenderProps } from './FlexRender'
import type { SubscribePropsWithStore } from './Subscribe'

export type PreactTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * A Preact HOC (Higher Order Component) that allows you to subscribe to the table state.
   *
   * Pass `atom` to subscribe to a single slice atom instead of the full `table.store`.
   *
   * @example
   * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
   *   {({ rowSelection }) => (
   *     <tr key={row.id}>...</tr>
   *   )}
   * </table.Subscribe>
   *
   * @example
   * <table.Subscribe atom={table.atoms.rowSelection}>
   *   {(rowSelection) => <div>...</div>}
   * </table.Subscribe>
   *
   * @example
   * <table.Subscribe atom={table.atoms.rowSelection} selector={(s) => s?.[row.id]}>
   *   {() => <tr key={row.id}>...</tr>}
   * </table.Subscribe>
   */
  /**
   * Overloads (atom first, then store) so JSX contextual typing works for both modes.
   * Atom without `selector` is separate so children infer `TAtomValue` (identity projection).
   */
  Subscribe: {
    <TAtomValue>(props: {
      atom: Atom<TAtomValue> | ReadonlyAtom<TAtomValue>
      selector?: undefined
      children: ((state: TAtomValue) => ComponentChildren) | ComponentChildren
    }): ComponentChildren
    <TAtomValue, TSubSelected>(props: {
      atom: Atom<TAtomValue> | ReadonlyAtom<TAtomValue>
      selector: (state: TAtomValue) => TSubSelected
      children: ((state: TSubSelected) => ComponentChildren) | ComponentChildren
    }): ComponentChildren
    <TSubSelected>(
      props: Omit<
        SubscribePropsWithStore<TFeatures, TData, TSubSelected>,
        'table'
      >,
    ): ComponentChildren
  }
  /**
   * A Preact component that renders headers, cells, or footers with custom markup.
   * Use this utility component instead of manually calling flexRender.
   */
  FlexRender: <TValue extends CellData = CellData>(
    props: FlexRenderProps<TFeatures, TData, TValue>,
  ) => ComponentChildren
  /**
   * The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `useTable`.
   */
  readonly state: Readonly<TSelected> & {
    columns: TableOptions<TFeatures, TData>['columns']
    data: TableOptions<TFeatures, TData>['data']
  }
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

    tableInstance.Subscribe = ((props: any) => {
      return Subscribe({
        ...props,
        table: tableInstance,
      })
    }) as PreactTable<TFeatures, TData, TSelected>['Subscribe']

    tableInstance.FlexRender = FlexRender

    return tableInstance
  })

  // sync table options on every render
  table.setOptions((prev) => ({
    ...prev,
    ...tableOptions,
  }))

  const selectorWithDataAndColumns = (state: TableState<TFeatures>) => ({
    columns: tableOptions.columns,
    data: tableOptions.data,
    ...selector(state),
  })

  const state = useSelector(table.store, selectorWithDataAndColumns, {
    compare: shallow,
  })

  return useMemo(
    () => ({
      ...table,
      state,
    }),
    [state, table],
  ) as PreactTable<TFeatures, TData, TSelected>
}
