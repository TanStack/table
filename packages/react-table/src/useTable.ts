'use client'

import { useMemo, useState } from 'react'
import { constructTable } from '@tanstack/table-core'
import { shallow, useSelector } from '@tanstack/react-store'
import { FlexRender } from './FlexRender'
import { Subscribe } from './Subscribe'
import type {
  CellData,
  ColumnDefTemplate,
  AccessorColumnDef as CoreAccessorColumnDef,
  AccessorFnColumnDef as CoreAccessorFnColumnDef,
  AccessorKeyColumnDef as CoreAccessorKeyColumnDef,
  CellContext as CoreCellContext,
  DisplayColumnDef as CoreDisplayColumnDef,
  GroupColumnDef as CoreGroupColumnDef,
  HeaderContext as CoreHeaderContext,
  TableOptions as CoreTableOptions,
  RowData,
  Table,
  TableFeatures,
  TableState,
} from '@tanstack/table-core'
import type { Atom, ReadonlyAtom } from '@tanstack/react-store'
import type { FunctionComponent, ReactNode } from 'react'
import type { FlexRenderProps } from './FlexRender'
import type { SubscribePropsWithStore } from './Subscribe'

export type ReactTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * A React HOC (Higher Order Component) that allows you to subscribe to the table state.
   *
   * This is useful for opting into state re-renders for specific parts of the table state.
   *
   * Pass `source` to subscribe to a single atom or store (e.g. `table.atoms.rowSelection`
   * or `table.optionsStore`) instead of the full `table.store`.
   *
   * @example
   * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
   *   {({ rowSelection }) => (
   *     <tr key={row.id}>...</tr>
   *   )}
   * </table.Subscribe>
   *
   * @example
   * <table.Subscribe source={table.atoms.rowSelection}>
   *   {(rowSelection) => <div>...</div>}
   * </table.Subscribe>
   *
   * @example
   * <table.Subscribe source={table.atoms.rowSelection} selector={(s) => s?.[row.id]}>
   *   {() => <tr key={row.id}>...</tr>}
   * </table.Subscribe>
   */
  /**
   * Overloads (not a single union) so `selector` callbacks get correct contextual
   * types in JSX; a union of two `selector` signatures degrades to implicit `any`.
   *
   * Source **without** `selector` is a separate overload so children receive `TSourceValue`
   * (identity projection). If `selector` were optional on one overload, `TSubSelected`
   * would default to `unknown` instead of inferring from the source.
   *
   * The **source** overloads are listed first so `TSourceValue` is inferred from `source`.
   */
  Subscribe: {
    <TSourceValue>(props: {
      source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
      selector?: undefined
      children: ((state: TSourceValue) => ReactNode) | ReactNode
    }): ReturnType<FunctionComponent>
    <TSourceValue, TSubSelected>(props: {
      source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
      selector: (state: TSourceValue) => TSubSelected
      children: ((state: TSubSelected) => ReactNode) | ReactNode
    }): ReturnType<FunctionComponent>
    <TSubSelected>(
      props: Omit<
        SubscribePropsWithStore<TFeatures, TData, TSubSelected>,
        'table'
      >,
    ): ReturnType<FunctionComponent>
  }
  /**
   * A React component that renders headers, cells, or footers with custom markup.
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
  ) => ReactNode
  /**
   * The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `useTable`.
   *
   * @example
   * const table = useTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state
   *
   * console.log(table.state.globalFilter)
   */
  readonly state: Readonly<TSelected> & {
    columns: TableOptions<TFeatures, TData, TSelected>['columns']
    data: TableOptions<TFeatures, TData, TSelected>['data']
  }
}

export type CellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = {},
> = Omit<CoreCellContext<TFeatures, TData, TValue>, 'table'> & {
  table: ReactTable<TFeatures, TData, TSelected>
}

export type HeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = {},
> = Omit<CoreHeaderContext<TFeatures, TData, TValue>, 'table'> & {
  table: ReactTable<TFeatures, TData, TSelected>
}

type ColumnDefWithReactContext<
  TColumnDef extends object,
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TSelected,
> = Omit<TColumnDef, 'cell' | 'footer' | 'header'> & {
  cell?: ColumnDefTemplate<CellContext<TFeatures, TData, TValue, TSelected>>
  footer?: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue, TSelected>>
  header?:
    | string
    | ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue, TSelected>>
}

export type DisplayColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = {},
> = ColumnDefWithReactContext<
  CoreDisplayColumnDef<TFeatures, TData, TValue>,
  TFeatures,
  TData,
  TValue,
  TSelected
>

export type GroupColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = {},
> = ColumnDefWithReactContext<
  Omit<CoreGroupColumnDef<TFeatures, TData, TValue>, 'columns'>,
  TFeatures,
  TData,
  TValue,
  TSelected
> & {
  columns?: ReadonlyArray<ColumnDef<TFeatures, TData, unknown, TSelected>>
}

export type AccessorFnColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = {},
> = ColumnDefWithReactContext<
  CoreAccessorFnColumnDef<TFeatures, TData, TValue>,
  TFeatures,
  TData,
  TValue,
  TSelected
>

export type AccessorKeyColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = {},
> = ColumnDefWithReactContext<
  CoreAccessorKeyColumnDef<TFeatures, TData, TValue>,
  TFeatures,
  TData,
  TValue,
  TSelected
>

export type AccessorColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = {},
> =
  | AccessorKeyColumnDef<TFeatures, TData, TValue, TSelected>
  | AccessorFnColumnDef<TFeatures, TData, TValue, TSelected>

export type ColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = {},
> =
  | DisplayColumnDef<TFeatures, TData, TValue, TSelected>
  | GroupColumnDef<TFeatures, TData, TValue, TSelected>
  | AccessorColumnDef<TFeatures, TData, TValue, TSelected>

export type TableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Omit<CoreTableOptions<TFeatures, TData>, 'columns' | 'defaultColumn'> & {
  columns: ReadonlyArray<ColumnDef<TFeatures, TData, any, TSelected>>
  defaultColumn?: Partial<ColumnDef<TFeatures, TData, any, TSelected>>
}

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
>(
  tableOptions: TableOptions<TFeatures, TData, TSelected>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): ReactTable<TFeatures, TData, TSelected> {
  const [table] = useState(() => {
    const tableInstance = constructTable(
      tableOptions as CoreTableOptions<TFeatures, TData>,
    ) as ReactTable<TFeatures, TData, TSelected>

    tableInstance.Subscribe = ((props: any) => {
      return Subscribe({
        ...props,
        table: tableInstance,
      })
    }) as ReactTable<TFeatures, TData, TSelected>['Subscribe']

    tableInstance.FlexRender = FlexRender

    return tableInstance
  })

  // sync table options on every render
  table.setOptions((prev) => ({
    ...prev,
    ...tableOptions,
  }))

  const state = useSelector(table.store, selector, { compare: shallow })

  // we know this is not the most efficient way to return the table,
  // but it is required for the react compiler to work
  return useMemo(
    () => ({
      ...table,
      options: tableOptions,
      state,
    }),
    [table, tableOptions, state],
  ) as ReactTable<TFeatures, TData, TSelected>
}
