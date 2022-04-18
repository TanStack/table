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
  GroupingCell,
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
  ExpandedRow,
} from './features/Expanding'
import { Overwrite, PartialKeys } from './utils'
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

export type DefaultGenerics = {
  Row: unknown
  Value: unknown
  FilterFns: object
  SortingFns: object
  AggregationFns: object
  Render: unknown
  ColumnMeta: object
}

export type AnyRender = (Comp: any, props: any) => any

export type UseRenderer<TGenerics extends AnyGenerics> =
  TGenerics['Render'] extends (...args: any) => any ? TGenerics['Render'] : any

export type PartialGenerics = Partial<DefaultGenerics>

export type AnyGenerics = {
  [TKey in keyof PartialGenerics]?: any
}

export type TableFeature = {
  getDefaultOptions?: (instance: any) => any
  getInitialState?: () => any
  getInstance?: (instance: any) => any
  getDefaultColumn?: () => any
  createColumn?: (column: any, instance: any) => any
  createCell?: (cell: any, column: any, row: any, instance: any) => any
  createRow?: (row: any, instance: any) => any
}

export type TableInstance<TGenerics extends AnyGenerics> =
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

//

export type Options<TGenerics extends AnyGenerics> = CoreOptions<TGenerics> &
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

export type Row<TGenerics extends AnyGenerics> = CoreRow<TGenerics> &
  VisibilityRow<TGenerics> &
  HeadersRow<TGenerics> &
  GroupingRow &
  RowSelectionRow &
  ExpandedRow

export type RowValues = {
  [key: string]: any
}

export type RowModel<TGenerics extends AnyGenerics> = {
  rows: Row<TGenerics>[]
  flatRows: Row<TGenerics>[]
  rowsById: Record<string, Row<TGenerics>>
}

export type AccessorFn<TData> = (originalRow: TData, index: number) => any

// export type UserColumnDef<TGenerics extends AnyGenerics> = Overwrite<
//   ColumnDef<TGenerics>,
//   GeneratedProperties<false>
// >

// type _GeneratedProperties = {
//   ['Column definitions should be generated with the table.createColumn() (and related) utilities']: false
// }

// export type GeneratedProperties<T> = T extends true
//   ? {
//       [TKey in keyof _GeneratedProperties]: true
//     }
//   : T extends false
//   ? {
//       [TKey in keyof _GeneratedProperties]?: false
//     }
// : never

export type Renderable<TGenerics extends AnyGenerics, TProps> =
  | string
  | ((props: TProps) => ReturnType<UseRenderer<TGenerics>>)

export type ColumnDef<TGenerics extends AnyGenerics> =
  CoreColumnDef<TGenerics> &
    VisibilityColumnDef &
    ColumnPinningColumnDef &
    FiltersColumnDef<TGenerics> &
    SortingColumnDef<TGenerics> &
    GroupingColumnDef<TGenerics> &
    ColumnSizingColumnDef

export type Column<TGenerics extends AnyGenerics> = ColumnDef<TGenerics> &
  CoreColumn<TGenerics> &
  ColumnVisibilityColumn &
  ColumnPinningColumn &
  FiltersColumn<TGenerics> &
  SortingColumn<TGenerics> &
  GroupingColumn<TGenerics> &
  ColumnSizingColumn<TGenerics>

export type Cell<TGenerics extends AnyGenerics> = CoreCell<TGenerics> &
  GroupingCell<TGenerics>

export type CoreCell<TGenerics extends AnyGenerics> = {
  id: string
  rowId: string
  columnId: string
  value: TGenerics['Value']
  row: Row<TGenerics>
  column: Column<TGenerics>
  getCellProps: PropGetter<CellProps>
  renderCell: () => string | null | ReturnType<UseRenderer<TGenerics>>
}

export type Header<TGenerics extends AnyGenerics> = CoreHeader<TGenerics> &
  ColumnSizingHeader<TGenerics>

export type CoreHeader<TGenerics extends AnyGenerics> = {
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
  renderHeader: (options?: {
    renderPlaceholder?: boolean
  }) => string | null | ReturnType<UseRenderer<TGenerics>>
  renderFooter: (options?: {
    renderPlaceholder?: boolean
  }) => string | null | ReturnType<UseRenderer<TGenerics>>
}

export type HeaderGroup<TGenerics extends AnyGenerics> = {
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
