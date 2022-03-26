import React from 'react'
import {
  CoreColumn,
  CoreColumnDef,
  CoreOptions,
  CoreRow,
  TableCore,
} from './core'
import {
  VisibilityInstance,
  VisibilityTableState,
  VisibilityColumn as ColumnVisibilityColumn,
  VisibilityOptions,
  VisibilityColumnDef,
  VisibilityRow,
} from './features/Visibility'
import {
  ColumnOrderInstance,
  ColumnOrderOptions,
  ColumnOrderTableState,
} from './features/Ordering'
import {
  ColumnPinningColumn,
  ColumnPinningColumnDef,
  ColumnPinningInstance,
  ColumnPinningOptions,
  ColumnPinningTableState,
} from './features/Pinning'
import { HeadersInstance, HeadersRow } from './features/Headers'
import {
  FiltersColumn,
  FiltersColumnDef,
  FiltersInstance,
  FiltersOptions,
  FiltersTableState,
} from './features/Filters'
import {
  SortingColumn,
  SortingColumnDef,
  SortingInstance,
  SortingOptions,
  SortingTableState,
} from './features/Sorting'
import {
  GroupingColumn,
  GroupingColumnDef,
  GroupingInstance,
  GroupingOptions,
  GroupingRow,
  GroupingTableState,
} from './features/Grouping'
import {
  ExpandedInstance,
  ExpandedOptions,
  ExpandedTableState,
} from './features/Expanding'
import { Overwrite } from './utils'
import {
  ColumnSizingColumn,
  ColumnSizingColumnDef,
  ColumnSizingHeader,
  ColumnSizingInstance,
  ColumnSizingOptions,
  ColumnSizingTableState,
} from './features/ColumnSizing'
import {
  PaginationInstance,
  PaginationOptions,
  PaginationTableState,
} from './features/Pagination'
import {
  RowSelectionInstance,
  RowSelectionOptions,
  RowSelectionRow,
  RowSelectionTableState,
} from './features/RowSelection'

// declare global {
//   const process.env.NODE_ENV !== 'production': boolean
// }

export type DefaultGenerics = {
  Row: unknown
  Value: unknown
  FilterFns: object
  SortingFns: object
  AggregationFns: object
}

export type PartialGenerics = Partial<DefaultGenerics>

export type TableInstance<TGenerics extends PartialGenerics> =
  TableCore<TGenerics> &
    VisibilityInstance<TGenerics> &
    ColumnOrderInstance<TGenerics> &
    ColumnPinningInstance<TGenerics> &
    HeadersInstance<TGenerics> &
    FiltersInstance<TGenerics> &
    SortingInstance<TGenerics> &
    GroupingInstance<TGenerics> &
    ColumnSizingInstance<TGenerics> &
    ExpandedInstance<TGenerics> &
    PaginationInstance<TGenerics> &
    RowSelectionInstance<TGenerics>

export type Renderable<TProps> =
  | React.ReactNode
  | React.FunctionComponent<TProps>
  | React.Component<TProps>

//

export type Options<TGenerics extends PartialGenerics> =
  CoreOptions<TGenerics> &
    VisibilityOptions &
    ColumnOrderOptions &
    ColumnPinningOptions &
    FiltersOptions<TGenerics> &
    SortingOptions<TGenerics> &
    GroupingOptions<TGenerics> &
    ExpandedOptions<TGenerics> &
    ColumnSizingOptions &
    PaginationOptions<TGenerics> &
    RowSelectionOptions<TGenerics>

export type Updater<T> = T | ((old: T) => T)
export type OnChangeFn<T> = (updaterOrValue: Updater<T>, value: T) => void

export type TableState = VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState

export type Row<TGenerics extends PartialGenerics> = CoreRow<TGenerics> &
  VisibilityRow<TGenerics> &
  HeadersRow<TGenerics> &
  GroupingRow &
  RowSelectionRow

export type RowValues = {
  [key: string]: any
}

export type RowModel<TGenerics extends PartialGenerics> = {
  rows: Row<TGenerics>[]
  flatRows: Row<TGenerics>[]
  rowsById: Record<string, Row<TGenerics>>
}

export type AccessorFn<TData> = (originalRow: TData, index: number) => any

export const Please_use_the_create_table_column_utilities_to_define_columns: unique symbol =
  Symbol()

export type _NonGenerated<T> = Overwrite<
  T,
  {
    [Please_use_the_create_table_column_utilities_to_define_columns]?: never
  }
>

export type ColumnDef<TGenerics extends PartialGenerics> =
  CoreColumnDef<TGenerics> &
    VisibilityColumnDef &
    ColumnPinningColumnDef &
    FiltersColumnDef<TGenerics> &
    SortingColumnDef<TGenerics> &
    GroupingColumnDef<TGenerics> &
    ColumnSizingColumnDef

export type Column<TGenerics extends PartialGenerics> = ColumnDef<TGenerics> &
  CoreColumn<TGenerics> &
  ColumnVisibilityColumn &
  ColumnPinningColumn &
  FiltersColumn<TGenerics> &
  SortingColumn<TGenerics> &
  GroupingColumn<TGenerics> &
  ColumnSizingColumn<TGenerics>

export type Cell<TGenerics extends PartialGenerics> = {
  id: string
  rowId: string
  columnId: string
  value: TGenerics['Value']
  row: Row<TGenerics>
  column: Column<TGenerics>
  getCellProps: PropGetter<CellProps>
  renderCell: () => React.ReactNode
}

export type Header<TGenerics extends PartialGenerics> = CoreHeader<TGenerics> &
  ColumnSizingHeader<TGenerics>

export type CoreHeader<TGenerics extends PartialGenerics> = {
  id: string
  depth: number
  column: Column<TGenerics>
  getWidth: () => number
  subHeaders: Header<TGenerics>[]
  colSpan?: number
  rowSpan?: number
  getHeaderProps: PropGetter<HeaderProps>
  getFooterProps: PropGetter<HeaderProps>
  getLeafHeaders: () => Header<TGenerics>[]
  isPlaceholder?: boolean
  placeholderId?: string
  renderHeader: (options?: { renderPlaceholder?: boolean }) => React.ReactNode
  renderFooter: (options?: { renderPlaceholder?: boolean }) => React.ReactNode
}

export type HeaderGroup<TGenerics extends PartialGenerics> = {
  id: string
  depth: number
  headers: Header<TGenerics>[]
  getHeaderGroupProps: PropGetter<HeaderGroupProps>
  getFooterGroupProps: PropGetter<FooterGroupProps>
}

export type HeaderRenderProps<THeader> = {
  header: THeader
}

export type FooterRenderProps<THeader> = {
  header: THeader
}

export type CellRenderProps<TCell, TRow> = {
  cell: TCell
  row: TRow
}

export type TableProps = {
  role: string
}

export type TableBodyProps = {
  role: string
}

export type TableHeadProps = {
  key: string
  role: string
}

export type TableFooterProps = {
  key: string
  role: string
}

export type HeaderGroupProps = {
  key: string
  role: string
}

export type FooterGroupProps = {
  key: string
  role: string
}

export type HeaderProps = {
  key: string
  role: string
  colSpan?: number
  rowSpan?: number
}

export type FooterProps = {
  key: string
  role: string
  colSpan?: number
  rowSpan?: number
}

export type RowProps = {
  key: string
  role: string
}

export type CellProps = {
  key: string
  role: string
}

//

export type PropGetter<TBase> = <TGetter extends Getter<TBase>>(
  userProps?: TGetter
) => PropGetterValue<TBase, TGetter>

export type Getter<TInitial> =
  | ((initial: TInitial) => object)
  | object
  | undefined

export type PropGetterValue<TBase, TGetter> = TGetter extends undefined
  ? TBase
  : TGetter extends (...args: any[]) => infer TReturn
  ? Overwrite<TBase, TReturn>
  : TGetter extends object
  ? Overwrite<TBase, TGetter>
  : never

export type NoInfer<A extends any> = [A][A extends any ? 0 : never]
