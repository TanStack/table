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
    index: number
    cells: Cell<D>[]
    getRowProps: (userProps?: any) => any
    original: D
    path: any[]
    values: any[]
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
    isAggregated?: any
  }

  export interface Column<D> extends HeaderColumn<D> {
    show?: boolean | ((instance: TableInstance<D>) => boolean)
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
    state: TableState<D>
    setState: SetState<D>
  }

  export interface TableOptions<D = {}> {
    data: D[]
    columns: HeaderColumn<D>[]
    debug?: boolean
    loading: boolean
    defaultColumn?: Partial<Column<D>>
    initialState?: Partial<TableState<D>>
    state?: Partial<TableState<D>>
    reducer?: (
      oldState: TableState<D>,
      newState: TableState<D>,
      type: string
    ) => any
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

  export const actions: Record<string, string>

  export function addActions(...actions: string[]): void

  export const defaultState: Record<string, any>
}
