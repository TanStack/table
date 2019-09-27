// TypeScript Version: 3.0

declare module 'react-table' {
  import { ReactNode, useState, ComponentType, MouseEvent } from 'react'

  export interface TableOptions<D extends object> extends UseTableOptions<D> {
    //,
    // UseSortByOptions<D>,
    // UseFiltersOptions<D>,
    // UseGroupByOptions<D>,
    // UseExpandedOptions<D>,
    // UsePaginationOptions<D>,
    // UseRowSelectOptions<D>,
    // UseRowStateOptions<D> {
    // columns: [] // FIXME
    // state: [] //FIXME
  }

  export interface TableInstance<D extends object = {}>
    extends TableOptions<D>,
      UseTableInstanceProps<D> {}

  /**
   * The empty definition of TableState provides a definition for the state, that can then be extended in the users code.
   *
   * @example
   *  export interface TableState<D extends object = {}}>
   *    extends UsePaginationState,
   *      UseGroupByState,
   *      UseSortbyState<D>,
   *      UseFiltersState<D> {}
   */
  export interface TableState<D extends object = {}> {} // eslint-disable-line @typescript-eslint/no-empty-interface

  export interface Hooks<D extends object = {}> extends UseTableHooks<D> {} //&
  // UseSortByHooks<D> &
  // UseGroupByHooks<D> &
  // UseExpandedHooks<D> &
  // UseRowSelectHooks<D>

  export interface Cell<D extends object = {}> extends UseTableCellProps<D> {}

  export interface Column<D extends object = {}>
    extends UseTableColumnOptions<D> {} //, UseGroupByColumnOptions<D>, UseFiltersColumnOptions<D> {}

  export interface ColumnInstance<D extends object = {}>
    extends Omit<Column<D>, 'id'>,
      UseTableColumnProps<D> {} //, UseGroupByColumnProps<D>, UseFiltersColumnProps<D> {}

  export interface HeaderGroup<D extends object = {}>
    extends ColumnInstance<D>,
      UseTableHeaderGroupProps<D> {}

  export interface Row<D extends object = {}> extends UseTableRowProps<D> {} //, UseRowSelectRowProps<D> {}

  /* #region useTable */
  export function useTable<D extends object = {}>(
    options: TableOptions<D>,
    ...plugins: PluginHook<D>[]
  ): TableInstance<D>

  export type UseTableOptions<D extends object> = Partial<{
    // columns: Column<D>[] // FIXME
    // state: TableStateTuple<D> // FIXME
    data: D[]
    defaultColumn: Partial<Column<D>>
    initialRowStateKey: IdType<D>
    getSubRows: (row: Row<D>, relativeIndex: number) => Row<D>[]
    getRowID: (row: Row<D>, relativeIndex: number) => string
    debug: boolean
  }>

  export interface UseTableHooks<D extends object> {
    columnsBeforeHeaderGroups: ((
      flatColumns: Column<D>[],
      instance: TableInstance<D>
    ) => Column<D>[])[]
    columnsBeforeHeaderGroupsDeps: ((
      deps: any[],
      instance: TableInstance<D>
    ) => any[])[]
    useMain: ((instance: TableInstance<D>) => TableInstance<D>)[]
    useRows: ((rows: Row<D>[], instance: TableInstance<D>) => Row<D>[])[]
    prepareRow: ((row: Row<D>, instance: TableInstance<D>) => Row<D>)[]

    // Prop Hooks
    getTableProps: ((instance: TableInstance<D>) => object)[]
    getRowProps: ((row: Row<D>, instance: TableInstance<D>) => object)[]
    getHeaderGroupProps: ((
      headerGroup: HeaderGroup<D>,
      instance: TableInstance<D>
    ) => object)[]
    getHeaderProps: ((
      column: Column<D>,
      instance: TableInstance<D>
    ) => object)[]
    getCellProps: ((cell: Cell<D>, instance: TableInstance<D>) => object)[]
  }

  export interface UseTableColumnOptions<D extends object>
    extends Accessor<D>,
      Partial<{
        columns: Column<D>[]
        show: boolean | ((instance: TableInstance<D>) => boolean)
        Header: Renderer<HeaderProps<D>>
        Cell: Renderer<CellProps<D>>
      }> {}

  export interface UseTableInstanceProps<D extends object> {
    columns: ColumnInstance<D>[]
    flatColumns: ColumnInstance<D>[]
    headerGroups: HeaderGroup<D>[]
    headers: ColumnInstance<D>[]
    flatHeaders: ColumnInstance<D>[]
    rows: Row<D>[]
    getTableProps: (props?: object) => object
    prepareRow: (row: Row<D>) => void
    rowPaths: string[]
    flatRows: Row<D>[]
  }

  export interface UseTableHeaderGroupProps<D extends object> {
    headers: ColumnInstance<D>[]
    getHeaderGroupProps: (props?: object) => object
    // Added by helpers
    totalHeaderCount: number
  }

  export interface UseTableColumnProps<D extends object> {
    id: IdType<D>
    isVisible: boolean
    render: (type: 'Header' | string, props?: object) => ReactNode
    getHeaderProps: (props?: object) => object
    // added by default
    parent: ColumnInstance<D>
    depth: number
    index: number
  }

  export interface UseTableRowProps<D extends object> {
    cells: Cell<D>[]
    values: Record<IdType<D>, CellValue>
    getRowProps: (props?: object) => object
    index: number
    original: D
    path: IdType<D>[]
    subRows: Row<D>[]
    state: object
  }

  export interface UseTableCellProps<D extends object> {
    column: ColumnInstance<D>
    row: Row<D>
    value: CellValue
    getCellProps: (props?: object) => object
    render: (type: 'Cell' | string, userProps?: object) => ReactNode
  }

  type HeaderProps<D extends object> = TableInstance<D> & {
    column: ColumnInstance<D>
  } & Record<string, any>
  type CellProps<D extends object> = TableInstance<D> & {
    column: ColumnInstance<D>
    row: Row<D>
    cell: Cell<D>
  } & Record<string, any>

  // NOTE: At least one of (id | accessor | Header as string) required
  export interface Accessor<D extends object> {
    accessor?:
      | IdType<D>
      | ((
          originalRow: D,
          index: number,
          sub: {
            subRows: D[]
            depth: number
            data: D[]
          }
        ) => string)
    id?: IdType<D>
  }
  /* #endregion */

  // Plugins

  /* #region useColumnOrder */
  export function useColumnOrder<D extends object = {}>(hooks: Hooks<D>): void
  // I _THINK_ this will work
  // TODO: Double-check
  export namespace useColumnOrder {
    export const pluginName = 'useColumnOrder'
  }

  export interface UseColumnOrderState<D extends object> {
    columnOrder: IdType<D>[]
  }

  export interface UseColumnOrderInstanceProps<D extends object> {
    setColumnOrder: (updater: (columnOrder: IdType<D>[]) => IdType<D>[]) => void
  }
  /* #endregion */

  /* #region useExpanded */
  export function useExpanded<D extends object = {}>(hooks: Hooks<D>): void
  // I _THINK_ this will work
  // TODO: Double-check
  export namespace useExpanded {
    export const pluginName = 'useExpanded'
  }

  export type UseExpandedOptions<D extends object> = Partial<{
    getSubRows: (row: Row<D>, relativeIndex: number) => Row<D>[]
    manualExpandedKey: IdType<D>
    paginateExpandedRows: boolean
  }>

  export interface UseExpandedHooks<D extends object> {
    getExpandedToggleProps: ((
      row: Row<D>,
      instance: TableInstance<D>
    ) => object)[]
  }

  export interface UseExpandedState<D extends object> {
    expanded: IdType<D>[]
  }

  export interface UseExpandedInstanceProps<D extends object> {
    rows: Row<D>[]
    toggleExpandedByPath: (path: IdType<D>[], isExpanded: boolean) => void
    expandedDepth: number
  }

  export interface UseExpandedRowProps<D extends object> {
    isExpanded: boolean
    canExpand: boolean
    subRows: Row<D>[]
    toggleExpanded: (isExpanded?: boolean) => void
    getExpandedToggleProps: (props?: object) => object
  }
  /* #endregion */

  /* #region useFilters */
  export function useFilters<D extends object = {}>(hooks: Hooks<D>): void
  // I _THINK_ this will work
  // TODO: Double-check
  export namespace useFilters {
    export const pluginName = 'useFilters'
  }

  export type UseFiltersOptions<D extends object> = Partial<{
    manualFilters: boolean
    disableFilters: boolean
    filterTypes: Filters<D>
  }>

  export interface UseFiltersState<D extends object> {
    filters: Filters<D>
  }

  export type UseFiltersColumnOptions<D extends object> = Partial<{
    disableFilters: boolean
    Filter: Renderer<HeaderProps<D>>
    filter: FilterType<D> | DefaultFilterTypes | keyof Filters<D> // TODO: Check that this doesn't lose the DefaultFilterTypes intellisense
  }>

  export interface UseFiltersInstanceProps<D extends object> {
    rows: Row<D>[]
    preFilteredRows: Row<D>[]
    setFilter: (
      columnId: IdType<D>,
      updater: ((filterValue: FilterValue) => FilterValue) | FilterValue
    ) => void
    setAllFilters: (
      updater: Filters<D> | ((filters: Filters<D>) => Filters<D>)
    ) => void
  }

  export interface UseFiltersColumnProps<D extends object> {
    canFilter: boolean
    setFilter: (filterValue: FilterValue) => void
    filterValue: FilterValue
    preFilteredRows: Row<D>[]
  }

  type FilterValue = unknown
  type Filters<D extends object> = Record<IdType<D>, FilterValue>

  export type DefaultFilterTypes =
    | 'text'
    | 'exactText'
    | 'exactTextCase'
    | 'includes'
    | 'includesAll'
    | 'exact'
    | 'equals'
    | 'between'

  export interface FilterType<D extends object> {
    (
      rows: Row<D>[],
      columnId: IdType<D>,
      filterValue: FilterValue,
      column: ColumnInstance<D>
    ): Row<D>[]
    autoRemove?: (filterValue: FilterValue) => boolean
  }
  /* #endregion */

  /* #region useGroupBy */
  export function useGroupBy<D extends object = {}>(hooks: Hooks<D>): void
  // I _THINK_ this will work
  // TODO: Double-check
  export namespace useGroupBy {
    export const pluginName = 'useGroupBy'
  }

  export type UseGroupByOptions<D extends object> = Partial<{
    manualGroupBy: boolean
    disableGrouping: boolean
    aggregations: Record<string, AggregatorFn<D>>
    groupByFn: (rows: Row<D>[], columnId: IdType<D>) => Record<string, Row<D>>
  }>

  export interface UseGroupByHooks<D extends object> {
    getGroupByToggleProps: ((
      header: HeaderGroup<D>,
      instance: TableInstance<D>
    ) => object)[]
  }

  export interface UseGroupByState<D extends object> {
    groupBy: IdType<D>[]
  }

  export type UseGroupByColumnOptions<D extends object> = Partial<{
    aggregate: Aggregator<D> | Aggregator<D>[]
    Aggregated: Renderer<CellProps<D>>
    disableGrouping: boolean
    groupByBoundary: boolean
  }>

  export interface UseGroupByInstanceProps<D extends object> {
    rows: Row<D>[]
    preGroupedRows: Row<D>[]
    toggleGroupBy: (columnId: IdType<D>, toggle: boolean) => void
  }

  export interface UseGroupByColumnProps<D extends object> {
    canGroupBy: boolean
    isGrouped: boolean
    groupedIndex: number
    toggleGroupBy: () => void
  }

  export interface UseGroupByHeaderProps<D extends object> {
    getGroupByToggleProps: (props?: object) => object
  }

  export interface UseGroupByRowProps<D extends object> {
    isAggregated: boolean
    groupByID: IdType<D>
    groupByVal: string
    values: Record<IdType<D>, AggregatedValue>
    subRows: Row<D>[]
    depth: number
    path: IdType<D>[]
    index: number
  }

  export interface UseGroupByCellProps<D extends object> {
    isGrouped: boolean
    isRepeatedValued: boolean
    isAggregated: boolean
  }

  export type DefaultAggregators =
    | 'sum'
    | 'average'
    | 'median'
    | 'uniqueCount'
    | 'count'

  export type AggregatorFn<D extends object> = (
    columnValues: CellValue[],
    rows: Row<D>[]
  ) => AggregatedValue
  type Aggregator<D extends object> =
    | AggregatorFn<D>
    | DefaultAggregators
    | string // TODO: Check that DefaultAggregators works
  type AggregatedValue = unknown
  /* #endregion */

  /* #region usePagination */
  export function usePagination<D extends object = {}>(hooks: Hooks<D>): void
  // I _THINK_ this will work
  // TODO: Double-check
  export namespace usePagination {
    export const pluginName = 'usePagination'
  }

  export type UsePaginationOptions<D extends object> = Partial<{
    pageCount: number
    manualPagination: boolean
    disablePageResetOnDataChange: boolean
    paginateExpandedRows: boolean
  }>

  export interface UsePaginationState<D extends object> {
    pageSize: number
    pageIndex: number
  }

  export interface UsePaginationInstanceProps<D extends object> {
    page: Row<D>[]
    pageCount: number
    pageOptions: number[]
    canPreviousPage: boolean
    canNextPage: boolean
    gotoPage: (updater: ((pageIndex: number) => number) | number) => void
    previousPage: () => void
    nextPage: () => void
    setPageSize: (pageSize: number) => void
    pageIndex: number
    pageSize: number
  }
  /* #endregion */

  /* #region useRowSelect */
  export function useRowSelect<D extends object = {}>(hooks: Hooks<D>): void
  // I _THINK_ this will work
  // TODO: Double-check
  export namespace useRowSelect {
    export const pluginName = 'useRowSelect'
  }

  export type UseRowSelectOptions<D extends object> = Partial<{
    manualRowSelectedKey: IdType<D>
  }>

  export interface UseRowSelectHooks<D extends object> {
    getToggleRowSelectedProps: ((
      row: Row<D>,
      instance: TableInstance<D>
    ) => object)[]
    getToggleAllRowsSelectedProps: ((instance: TableInstance<D>) => object)[]
  }

  export interface UseRowSelectState<D extends object> {
    selectedRows: IdType<D>[]
  }

  export interface UseRowSelectInstanceProps<D extends object> {
    toggleRowSelected: (rowPath: IdType<D>, set?: boolean) => void
    toggleRowSelectedAll: (set?: boolean) => void
    getToggleAllRowsSelectedProps: (props?: object) => object
    isAllRowsSelected: boolean
  }

  export interface UseRowSelectRowProps<D extends object> {
    isSelected: boolean
    toggleRowSelected: (set?: boolean) => void
    getToggleRowSelectedProps: (props?: object) => object
  }
  /* #endregion */

  /* #region useRowState */
  export function useRowState<D extends object = {}>(hooks: Hooks<D>): void
  // I _THINK_ this will work
  // TODO: Double-check
  export namespace useRowState {
    export const pluginName = 'useRowState'
  }

  export type UseRowStateOptions<D extends object> = Partial<{
    initialRowStateAccessor: (row: Row<D>) => UseRowStateLocalState<D>
  }>

  export interface UseRowStateState<D extends object> {
    rowState: Partial<{
      cellState: UseRowStateLocalState<D>
      rowState: UseRowStateLocalState<D>
    }>
  }

  export interface UseRowStateInstanceProps<D extends object> {
    setRowState: (rowPath: string[], updater: UseRowUpdater) => void // Purposely not exposing action
    setCellState: (
      rowPath: string[],
      columnID: IdType<D>,
      updater: UseRowUpdater
    ) => void
  }

  export interface UseRowStateRowProps<D extends object> {
    state: UseRowStateLocalState<D>
    setState: (updater: UseRowUpdater) => void
  }
  export interface UseRowStateCellProps<D extends object> {
    state: UseRowStateLocalState<D>
    setState: (updater: UseRowUpdater) => void
  }

  type UseRowUpdater<T = unknown> = T | ((prev: T) => T)
  type UseRowStateLocalState<D extends object, T = unknown> = Record<
    IdType<D>,
    T
  >
  /* #endregion */

  /* #region useSortBy */
  export function useSortBy<D extends object = {}>(hooks: Hooks<D>): void
  // I _THINK_ this will work
  // TODO: Double-check
  export namespace useSortBy {
    export const pluginName = 'useSortBy'
  }

  export type UseSortByOptions<D extends object> = Partial<{
    manualSorting: boolean
    disableSorting: boolean
    disableMultiSort: boolean
    isMultiSortEvent: (e: MouseEvent) => boolean
    maxMultiSortColCount: number
    disableSortRemove: boolean
    disabledMultiRemove: boolean
    orderByFn: (
      rows: Row<D>[],
      sortFns: SortByFn<D>[],
      directions: boolean[]
    ) => Row<D>[] // CHECK
    sortTypes: Record<string, SortByFn<D>>
  }>

  export interface UseSortByHooks<D extends object> {
    getSortByToggleProps: ((
      column: Column<D>,
      instance: TableInstance<D>
    ) => object)[]
  }

  export interface UseSortByState<D extends object> {
    sortBy: SortingRule<D>[]
  }

  export type UseSortByColumnOptions<D extends object> = Partial<{
    disableSorting: boolean
    sortDescFirst: boolean
    sortInverted: boolean
    sortType: SortByFn<D> | DefaultSortTypes | string // TODO: Check this works
  }>

  export interface UseSortByInstanceProps<D extends object> {
    rows: Row<D>[]
    preSortedRows: Row<D>[]
    toggleSortBy: (
      columnId: IdType<D>,
      descending: boolean,
      isMulti: boolean
    ) => void
  }

  export interface UseSortByColumnProps<D extends object> {
    canSort: boolean
    toggleSortBy: (descending: boolean, multi: boolean) => void
    getSortByToggleProps: (props?: object) => object
    clearSorting: () => void
    isSorted: boolean
    sortedIndex: number
    isSortedDesc: boolean | undefined
  }

  export type SortByFn<D extends object> = (
    rowA: Row<D>,
    rowB: Row<D>,
    columnId: IdType<D>
  ) => 0 | 1 | -1

  export type DefaultSortTypes = 'alphanumeric' | 'datetime' | 'basic'

  type SortingRule<D> = {
    id: IdType<D>
    desc?: boolean
  }
  /* #endregion */

  // Additional API
  export function useTableState<D extends object = {}>(
    initialState?: Partial<TableState<D>>,
    overrides?: Partial<TableState<D>>,
    options?: {
      reducer?: (
        oldState: TableState<D>,
        newState: TableState<D>,
        type: string
      ) => TableState<D>
      useState?: typeof useState
    }
  ): TableStateTuple<D>

  export const actions: Record<string, string>
  export function addActions(...actions: string[]): void

  // Helpers
  type StringKey<D> = Extract<keyof D, string>
  type IdType<D> = StringKey<D> | string
  export type CellValue = any

  type Renderer<Props> = ComponentType<Props> | ReactNode

  export type PluginHook<D extends object> = (hooks: Hooks<D>) => void

  export type SetState<D extends object> = (
    updater: (old: TableState<D>) => TableState<D>,
    type: keyof typeof actions
  ) => void

  export type TableStateTuple<D extends object> = [TableState<D>, SetState<D>]
}
