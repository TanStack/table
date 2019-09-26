// TypeScript Version: 3.0

declare module 'react-table' {
  import { ReactNode, useState } from 'react'

  type StringKey<D> = Extract<keyof D, string>
  type IdType<D> = StringKey<D> | string

  type SortingRule<D> = {
    id: IdType<D>
    desc: boolean
  }

  export type SortingRules<D> = SortingRule<D>[]

  export type SortByFn = (a: any, b: any, desc: boolean) => 0 | 1 | -1

  export type Filters<D> = Record<IdType<D>, string>

  export interface Cell<D = {}> extends TableInstance<D> {
    cell: { value: any }
    column: Column<D>
    row: Row<D>
    render: (type: 'Cell' | 'Aggregated', userProps?: any) => any
    isGrouped?: boolean
    isAggregated?: boolean
    isRepeatedValue?: boolean
    getCellProps: () => any
  }

  export interface Row<D = {}> {
    /**
     * The index of the original row in the data array that was passed to useTable.
     */
    index: number
    cells: Cell<D>[]
    getRowProps: (userProps?: any) => any

    /**
     * The original row object from the data array that was used to materialize this row.
     */
    original: D

    /**
     * This array is the sequential path of indices one could use to navigate to it,
     * eg. a row path of [3, 1, 0] would mean that it is the first subRow of a parent that is the second subRow of a parent that is the fourth row in the original data array
     */
    path: Array<string | number>

    /**
     * This object contains the aggregated values for this row's sub rows
     */
    values: any[]

    /**
     * If the row is a materialized group row,
     * this is the grouping depth at which this row was created.
     */
    depth: number
  }

  export interface UseExpandedRow<D = {}> {
    subRows?: D[]
    groupByID?: string | number
    toggleExpanded?: () => any
    isExpanded?: boolean
    isAggregated?: boolean
  }

  export type AccessorFn<D> = (
    originalRow: D,
    index: number,
    sub: {
      subRows: [D]
      depth: number
      data: [D]
    }
  ) => unknown

  export interface HeaderColumn<D> {
    /**
     * This string/function is used to build the data model for your column.
     */
    accessor: IdType<D> | AccessorFn<D>
    Header?: ReactNode | ((props: TableInstance<D>) => ReactNode)
    Filter?: ReactNode | ((props: TableInstance<D>) => ReactNode)
    Cell?: ReactNode | ((cell: Cell<D>) => ReactNode)

    /**
     * This is the unique ID for the column. It is used by reference in things like sorting, grouping, filtering etc.
     */
    id?: IdType<D>
    minWidth?: string | number
    maxWidth?: string | number
    width?: string | number
    disableSorting?: boolean
    canSortBy?: boolean
    sortByFn?: SortByFn
    defaultSortDesc?: boolean
    isAggregated?: boolean
  }

  export interface Column<D> extends HeaderColumn<D> {
    /**
     * @default true
     */
    show?: boolean | ((instance: TableInstance<D>) => boolean)

    /**
     * If defined, the column will act as a header group.
     * Columns can be recursively nested as much as needed.
     */
    columns?: Column<D>[]
  }

  export type Page<D = {}> = Row<D>[]

  export interface EnhancedColumn<D>
    extends Omit<Column<D>, 'columns'>,
      TableInstance<D> {
    id: IdType<D>
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

  export interface HeaderGroup<D = {}> {
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

  export interface UsePaginationValues<D = {}> {
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
    setFilter: (columnID: keyof D, value: string) => void
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
    sortByFn?: SortByFn
    manualSorting?: boolean
    disableSorting?: boolean
    defaultSortDesc?: boolean
    disableMultiSort?: boolean
  }

  export interface UseSortbyState<D> {
    sortBy?: SortingRules<D>
  }

  export interface TableInstance<D = {}> extends TableOptions<D> {
    hooks: Hooks
    rows: Row<D>[]
    columns: EnhancedColumn<D>[]
    headerGroups: HeaderGroup<D>[]
    headers: HeaderGroup<D>[]
    getTableProps: (userProps?: any) => any
    getRowProps: (userProps?: any) => any
    prepareRow: (row: Row<D>) => any
  }

  /**
   * @typeParam D shape of an item in table data
   */
  export interface TableOptions<D = {}> {
    /**
     * The data array that you want to display on the table.
     */
    data: D[]

    /**
     * The core columns configuration object for the entire table.
     */
    columns: HeaderColumn<D>[]

    /**
     * The state/updater pair for the table instance.
     * You would want to override this if you plan on controlling or hoisting table state into your own code.
     */
    state?: State<D>

    /**
     * A flag to turn on debug mode.
     */
    debug?: boolean

    loading?: boolean

    /**
     * The default column object for every column passed to React Table.
     */
    defaultColumn?: Partial<Column<D>>
  }

  // The empty definition of TableState is not an error. It provides a definition
  // for the state, that can then be extended in the users code.
  //
  // e.g.
  //
  // export interface TableState<D = {}}>
  //     extends UsePaginationState,
  //       UseGroupByState,
  //       UseSortbyState<D>,
  //       UseFiltersState<D> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface TableState<D = {}> {}

  export type SetState<D> = (
    updater: (old: TableState<D>) => TableState<D>,
    actions: any
  ) => void

  export type State<D> = [TableState<D>, SetState<D>]

  export function useTable<D = {}>(
    props: TableOptions<D>,
    ...plugins: any[]
  ): TableInstance<D>

  export function useFilters<D = {}>(
    props: TableOptions<D>
  ): TableOptions<D> & {
    rows: Row<D>[]
  }

  export function useSortBy<D = {}>(
    props: TableOptions<D>
  ): TableOptions<D> & {
    rows: Row<D>[]
  }

  export function useGroupBy<D = {}>(
    props: TableOptions<D>
  ): TableOptions<D> & { rows: Row<D>[] }

  export function usePagination<D = {}>(
    props: TableOptions<D>
  ): UsePaginationValues<D>

  export function useExpanded<D = {}>(
    props: TableOptions<D>
  ): TableOptions<D> & {
    toggleExpandedByPath: () => any
    expandedDepth: []
    rows: Row<D>[]
  }

  export function useTableState<D = {}>(
    initialState?: Partial<TableState<D>>,
    overriddenState?: Partial<TableState<D>>,
    options?: {
      reducer?: (
        oldState: TableState<D>,
        newState: TableState<D>,
        type: string
      ) => any
      useState?: typeof useState
    }
  ): State<D>

  export const actions: Record<string, string>

  export function addActions(...actions: string[]): void

  export const defaultState: Record<string, any>
}
