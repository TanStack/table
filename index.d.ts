declare module 'react-table{
  import { ReactNode, ReactText, Dispatch, SetStateAction } from 'react'
    export type SortingRule<D> = {
    id: keyof D
    desc: boolean
  }

  export type SortingRules<D> = SortingRule<D>[]

  export type Filters<D> = {
    [key: keyof D]: string
  }

  export interface Cell<D = any> extends TableInstance<D> {
    cell: { value: any }
    column: Column<D>
    row: Row<D>
    render: (type: 'Cell' | 'Aggregated', userProps?: any) => any
    isGrouped?: boolean
    isAggregated?: boolean
    isRepeatedValue?: boolean
    getCellProps: () => any
  }

  export interface Row<D = any> {
    index: number
    cells: Cell<D>[]
    getRowProps: (userProps?: any) => any
    original: D
    path: any[]
    values: any[]
    depth: number
  }

  export interface UseExpandedRow<D = any> {
    subRows?: D[]
    groupByID?: string | number
    toggleExpanded?: () => any
    isExpanded?: boolean
    isAggregated?: boolean
  }

  export interface HeaderColumn<D> {
    /**
     * This string/function is used to build the data model for your column.
     */
    accessor: string | ((originalRow: D) => string)
    Header?: ReactText | ((props: TableInstance<D>) => ReactNode)
    Filter?: ReactText | ((props: TableInstance<D>) => ReactNode)
    Cell?: ReactText | ((cell: Cell<D>) => ReactNode)
    /**
     * This is the unique ID for the column. It is used by reference in things like sorting, grouping, filtering etc.
     */
    id?: string | number
    minWidth?: string | number
    maxWidth?: string | number
    width?: string | number
    disableSorting?: boolean
    canSortBy?: boolean
    sortByFn?: (a: any, b: any, desc: boolean) => 0 | 1 | -1
    defaultSortDesc?: boolean
    isAggregated?: any
  }

  export interface Column<D> extends HeaderColumn<D> {
    id?: string | number
    show?: boolean | ((instance: TableInstance<D>) => boolean)
    columns?: Column<D>[]
  }

  export type Page<D = any> = Row<D>[]

  export interface EnhancedColumn<D> extends Pick<Column<D>, Exclude<keyof Column<D>, 'columns'>>, TableInstance<D> {
    column: Column<D>
    render: (type: 'Header' | 'Filter', userProps?: any) => any
    getHeaderProps: (userProps?: any) => any
    getSortByToggleProps: (userProps?: any) => any
    isSorted: boolean
    isSortedDesc: boolean
    sortedIndex: number
    isVisible: boolean
    canSort?: boolean
  }

  export interface HeaderGroup<D = any> {
    headers: EnhancedColumn<D>[]
    getHeaderGroupProps: (userProps?: any) => any
  }

  export interface Hooks {
    columnsBeforeHeaderGroups: any[]
    columnsBeforeHeaderGroupsDeps: any[]
    useMain: any[]
    useColumns: any[]
    useHeaders: any[]
    useHeaderGroups: any[]
    useRows: any[]
    prepareRow: any[]
    getTableProps: any[]
    getRowProps: any[]
    getHeaderGroupProps: any[]
    getHeaderProps: any[]
    getCellProps: any[]
  }

  export interface RowsProps {
    subRowsKey: string
  }

  export interface FiltersProps {
    filterFn: () => void
    manualFilters: boolean
    disableFilters: boolean
    setFilter: () => any
    setAllFilters: () => any
  }

  export interface UsePaginationState {
    pageIndex: number
    pageSize: number
    pageCount: number
    rowCount: number
  }

  export interface UsePaginationValues<D = any> {
    page: Page<D>
    pageIndex: number // yes, this is on instance and state
    pageSize: number // yes, this is on instance and state
    canPreviousPage: boolean
    canNextPage: boolean
    nextPage: () => any
    previousPage: () => any
    setPageSize: (size: number) => any
    pageOptions: any[]
    manualPagination: boolean
    paginateExpandedRows: boolean
    disablePageResetOnDataChange: boolean
    pageCount: number
    gotoPage: (page: number) => any
  }

  export interface UseFiltersState<D> {
    filters?: Filters<D>
  }

  export interface UseFiltersValues<D> {
    setFilter: (columnID: keyof T, value: string) => void
    setAllFilters: (values: Filters<D>) => void
    disableFilters: boolean
  }

  export interface UseGroupByValues {
    groupByFn: any
    manualGroupBy: boolean
    disableGrouping: boolean
    aggregations: any
  }

  export interface UseGroupByState {
    groupBy: string[]
    isAggregated?: boolean
  }

  export interface UseExpandedValues {
    toggleExpanded?: () => any
  }

  export interface UseSortbyOptions {
    sortByFn?: (a: any, b: any, desc: boolean) => 0 | 1 | -1
    manualSorting?: boolean
    disableSorting?: boolean
    defaultSortDesc?: boolean
    disableMultiSort?: boolean
  }

  export interface UseSortbyState<D> {
    sortBy?: SortingRules<D>
  }

  export interface TableInstance<D = any> extends TableOptions<D> {
    hooks: Hooks
    rows: Row<D>[]
    columns: EnhancedColumn<D>[]
    headerGroups: HeaderGroup<D>[]
    headers: HeaderGroup<D>[]
    getTableProps: (userProps?: any) => any
    getRowProps: (userProps?: any) => any
    prepareRow: (row: Row<D>) => any
  }

  export interface TableOptions<D = any> {
    data: D[]
    columns: HeaderColumn<D>[]
    state: State<D>
    debug?: boolean
    loading: boolean
    defaultColumn?: Partial<Column<D>>
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface TableState<D = any> {}

  export type SetState<D> = (
    updater: (old: TableState<D>) => TableState<D>,
    actions: any
  ) => void

  export type State<D> = [TableState<D>, SetState<D>]

  export function useTable<D = any>(
    props: TableOptions<D>,
    ...plugins: any[]
  ): TableInstance<D>

  export function useFilters<D = any>(
    props: TableOptions<D>
  ): TableOptions<D> & {
    rows: Row<D>[]
  }

  export function useSortBy<D = any>(
    props: TableOptions<D>
  ): TableOptions<D> & {
    rows: Row<D>[]
  }

  export function useGroupBy<D = any>(
    props: TableOptions<D>
  ): TableOptions<D> & { rows: Row<D>[] }

  export function usePagination<D = any>(
    props: TableOptions<D>
  ): UsePaginationValues<D>

  export function useExpanded<D = any>(
    props: TableOptions<D>
  ): TableOptions<D> & {
    toggleExpandedByPath: () => any
    expandedDepth: []
    rows: Row<D>[]
  }

  export function useTableState<D = any>(
    initialState?: Partial<TableState<D>>,
    overriddenState?:  Partial<TableState<D>>,
    options?: {
      reducer?: (
        oldState: TableState<D>,
        newState: TableState<D>,
        type: string
      ) => any
      useState?: Dispatch<SetStateAction<any>>
    }
  ): State<D>

  export const actions: any

  export function addActions(...actions: string[]): void

  export const defaultState: any
}
