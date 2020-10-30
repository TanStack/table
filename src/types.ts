export interface TableInstance {
  options: TableOptions
  plugs: InstancePlugs
  setState: (...any: any[]) => any
  columns: TableColumn[]
  allColumns: TableColumn[]
  leafColumns: TableColumn[]
  state: TableState
  reset: () => void
  getColumnWidth: (id?: Id) => number
  getTotalWidth: () => number
  getTableHeadProps: (userProps: any) => TableHeadProps
  getTableFooterProps: (userProps: any) => TableFooterProps
  getTableBodyProps: (userProps: any) => TableBodyProps
  getTableProps: (userProps: any) => TableProps
  headerGroups: HeaderGroup[]
  footerGroups: FooterGroup[]
  flatHeaders: Header[]
  flatFooters: Footer[]
  rows: Row[]
  flatRows: Row[]

  // withSorting
  setSorting: (updater: Updater<TableState['sorting']>) => void
  resetSorting: () => void
  toggleColumnSorting: (columnId?: Id, desc?: boolean, multi?: boolean) => void
  getColumnCanSort: (columnId?: Id) => boolean
  getColumnSortedIndex: (columnId?: Id) => number
  getColumnIsSorted: (columnId?: Id) => boolean
  getColumnIsSortedDesc: (columnId?: Id) => boolean
  clearColumnSorting: (columnId?: Id) => void
}

type Id = string | number

type Updater<T> = T | ((old: T) => T)

export interface TableOptions {
  data: unknown[]
  columns: Column[]
  debug?: boolean
  defaultColumn?: Column
  initialState?: TableState
  state?: TableState
  onStateChange?: (newState: TableState, instance: TableInstance) => void
  getSubRows?: <T extends { subRows?: any[] }>(
    originalRow: T,
    index: number
  ) => unknown[]
  getRowId?: <T>(originalRow: T, index: number, parent?: Row) => string
  enableFilters?: boolean
  filterFromChildrenUp?: boolean
  paginateExpandedRows?: boolean

  // withSorting
  sortTypes?: Record<string, SortFn>
  manualSorting?: boolean
  autoResetSorting?: boolean
  isMultiSortEvent?: (event: any) => boolean
  onSortingChange?: (
    updater: Updater<TableState['sorting']>,
    instance: TableInstance
  ) => void
  disableMultiSort?: boolean
  disableSortRemove?: boolean
  disableMultiRemove?: boolean
  maxMultiSortColCount?: number
  disableSorting?: boolean
}

export interface TableState {
  sorting?: SortObj[]
}

export interface SortObj {
  id: Id
  desc?: boolean
}

export interface Row<T = any> {
  id: Id
  subRows: Row[]
  getRowProps: (userProps: any) => RowProps
  original: T
  index: number
  depth: number
  values: RowValues
  originalSubRows: T[]
  leafRows: Row[]
  cells: Cell[]
  getVisibleCells: () => Cell[]
}

export interface RowValues {
  [key: string]: any
}

export interface Column {
  Header?: unknown | ((...any: any) => JSX.Element)
  accessor?: string | ((originalRow: any, index: number, row: Row) => unknown)
  id?: Id
  Cell?: unknown | ((...any: any) => JSX.Element)
  defaultIsVisible?: boolean
  width?: number
  minWidth?: number
  maxWidth?: number
  columns?: Column[]

  // withSorting
  sortDescFirst?: boolean
  disableSorting?: boolean
  defaultCanSort?: boolean
  sortType?: SortType
}

export interface TableColumn extends Column {
  accessor?: (originalRow: any, index: number, row: Row) => unknown
  depth: number
  originalColumn: Column
  parent?: TableColumn
  prepared?: boolean
  render?: (Comp?: any, props?: any) => JSX.Element | null
  getWidth?: () => number
  columns?: TableColumn[]

  // withSorting
  sortInverted?: boolean
  getCanSort?: () => boolean
  getSortedIndex?: () => number
  getIsSorted?: () => boolean
  toggleSorting?: (desc?: boolean, multi?: boolean) => void
  clearSorting?: () => void
  getIsSortedDesc?: () => boolean
  getToggleSortingProps?: (userProps: any) => ToggleSortingProps
}

export interface Cell {
  id: Id
  getCellProps: (userProps: any) => CellProps
  row: Row
  column: TableColumn
  value: any
  render: (Comp?: any, props?: any) => JSX.Element | null
}

export interface Plugin {
  name: string
  after: string[]
  plugs: PluginPlugs
}

export interface Header extends TableColumn {
  isPlaceholder: boolean
  column: TableColumn
  getHeaderProps: (userProps: any) => HeaderProps
  getFooterProps: (userProps: any) => FooterProps
  getWidth: () => number
  subHeaders: Header[]
}

export interface Footer extends Header {}

export interface HeaderGroup {
  headers: Header[]
}
export interface FooterGroup {
  footers: Footer[]
}
export interface TableProps {}
export interface TableBodyProps {}
export interface TableHeadProps {}
export interface TableFooterProps {}
export interface HeaderGroupProps {}
export interface FooterGroupProps {}
export interface HeaderProps {}
export interface FooterProps {}
export interface RowProps {}
export interface CellProps {}

export type UseReduceOptions = (
  options: TableOptions,
  { instance }: { instance: TableInstance }
) => TableOptions
export type UseInstanceAfterState = (instance: TableInstance) => TableInstance
export type UseReduceColumns = (
  columns: TableColumn[],
  { instance }: { instance: TableInstance }
) => TableColumn[]
export type UseReduceAllColumns = (
  allColumns: TableColumn[],
  { instance }: { instance: TableInstance }
) => TableColumn[]
export type UseReduceLeafColumns = (
  leafColumns: TableColumn[],
  { instance }: { instance: TableInstance }
) => TableColumn[]
export type DecorateColumn = (
  column: TableColumn,
  { instance }: { instance: TableInstance }
) => TableColumn
export type UseReduceHeaderGroups = (
  headerGroups: HeaderGroup[],
  { instance }: { instance: TableInstance }
) => HeaderGroup[]
export type UseReduceFooterGroups = (
  footerGroups: FooterGroup[],
  { instance }: { instance: TableInstance }
) => FooterGroup[]
export type UseReduceFlatHeaders = (
  flatHeaders: Header[],
  { instance }: { instance: TableInstance }
) => Header[]
export type DecorateHeader = (
  header: Header,
  { instance }: { instance: TableInstance }
) => Header
export type DecorateRow = (
  row: Row,
  { instance }: { instance: TableInstance }
) => Row
export type DecorateCell = (
  cell: Cell,
  { instance }: { instance: TableInstance }
) => Cell
export type UseInstanceAfterDataModel = (
  instance: TableInstance
) => TableInstance
export type ReduceTableProps = (
  tableProps: TableProps,
  { instance }: { instance: TableInstance }
) => TableProps
export type ReduceTableBodyProps = (
  tableBodyProps: TableBodyProps,
  { instance }: { instance: TableInstance }
) => TableBodyProps
export type ReduceTableHeadProps = (
  tableHeadProps: TableHeadProps,
  { instance }: { instance: TableInstance }
) => TableHeadProps
export type ReduceTableFooterProps = (
  tableFootProps: TableFooterProps,
  { instance }: { instance: TableInstance }
) => TableFooterProps
export type ReduceHeaderGroupProps = (
  headerGroupProps: HeaderGroupProps,
  { instance }: { instance: TableInstance }
) => HeaderGroupProps
export type ReduceFooterGroupProps = (
  footerGroupProps: FooterGroupProps,
  { instance, header }: { instance: TableInstance; header: Header }
) => FooterGroupProps
export type ReduceHeaderProps = (
  headerProps: HeaderProps,
  { instance, header }: { instance: TableInstance; header: Header }
) => HeaderProps
export type ReduceFooterProps = (
  footerProps: FooterProps,
  { instance, header }: { instance: TableInstance; header: Header }
) => HeaderProps
export type ReduceRowProps = (
  rowProps: RowProps,
  { instance, row }: { instance: TableInstance; row: Row }
) => RowProps
export type ReduceCellProps = (
  cellProps: CellProps,
  { instance, cell }: { instance: TableInstance; cell: Cell }
) => CellProps

interface WithAfter<T extends (...args: any[]) => any> {
  <U extends Parameters<T>>(...args: U): ReturnType<T>
  after?: string[]
}

export type InstancePlugs = {
  useReduceOptions: UseReduceOptions
  useInstanceAfterState: UseInstanceAfterState
  useReduceColumns: UseReduceColumns
  useReduceAllColumns: UseReduceAllColumns
  useReduceLeafColumns: UseReduceLeafColumns
  decorateColumn: DecorateColumn
  useReduceHeaderGroups: UseReduceHeaderGroups
  useReduceFooterGroups: UseReduceFooterGroups
  useReduceFlatHeaders: UseReduceFlatHeaders
  decorateHeader: DecorateHeader
  decorateRow: DecorateRow
  decorateCell: DecorateCell
  useInstanceAfterDataModel: UseInstanceAfterDataModel
  reduceTableProps: ReduceTableProps
  reduceTableBodyProps: ReduceTableBodyProps
  reduceTableHeadProps: ReduceTableHeadProps
  reduceTableFooterProps: ReduceTableFooterProps
  reduceHeaderGroupProps: ReduceHeaderGroupProps
  reduceFooterGroupProps: ReduceFooterGroupProps
  reduceHeaderProps: ReduceHeaderProps
  reduceFooterProps: ReduceFooterProps
  reduceRowProps: ReduceRowProps
  reduceCellProps: ReduceCellProps
}

export type PluginPlugs = {
  useReduceOptions?: WithAfter<UseReduceOptions>
  useInstanceAfterState?: WithAfter<UseInstanceAfterState>
  useReduceColumns?: WithAfter<UseReduceColumns>
  useReduceAllColumns?: WithAfter<UseReduceAllColumns>
  useReduceLeafColumns?: WithAfter<UseReduceLeafColumns>
  decorateColumn?: WithAfter<DecorateColumn>
  useReduceHeaderGroups?: WithAfter<UseReduceHeaderGroups>
  useReduceFooterGroups?: WithAfter<UseReduceFooterGroups>
  useReduceFlatHeaders?: WithAfter<UseReduceFlatHeaders>
  decorateHeader?: WithAfter<DecorateHeader>
  decorateRow?: WithAfter<DecorateRow>
  decorateCell?: WithAfter<DecorateCell>
  useInstanceAfterDataModel?: WithAfter<UseInstanceAfterDataModel>
  reduceTableProps?: WithAfter<ReduceTableProps>
  reduceTableBodyProps?: WithAfter<ReduceTableBodyProps>
  reduceTableHeadProps?: WithAfter<ReduceTableHeadProps>
  reduceTableFooterProps?: WithAfter<ReduceTableFooterProps>
  reduceHeaderGroupProps?: WithAfter<ReduceHeaderGroupProps>
  reduceFooterGroupProps?: WithAfter<ReduceFooterGroupProps>
  reduceHeaderProps?: WithAfter<ReduceHeaderProps>
  reduceFooterProps?: WithAfter<ReduceFooterProps>
  reduceRowProps?: WithAfter<ReduceRowProps>
  reduceCellProps?: WithAfter<ReduceCellProps>
}

export interface PluginPlugFn {
  (...any: any): any
  after?: string[]
}

export type PlugName = keyof PluginPlugs

export type PlugType = [PlugName, PluginPlugBuilder]

export type PluginPlugBuilder = any

export interface RendererMeta {}

// withSorting

type SortType =
  | 'basic'
  | 'alphanumeric'
  | 'text'
  | 'datetime'
  | 'basic'
  | string
  | SortFn

export type SortFn = (
  rowA: Row,
  rowB: Row,
  columnId: Id,
  desc: boolean
) => number

export interface ToggleSortingProps {
  onClick?: any
  title?: string
}
