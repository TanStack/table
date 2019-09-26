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

  export type Hooks<D extends object = {}> = UseTableHooks<D> //&
  // UseSortByHooks<D> &
  // UseGroupByHooks<D> &
  // UseExpandedHooks<D> &
  // UseRowSelectHooks<D>

  export type Cell<D extends object = {}> = UseTableCellProps<D>

  export type Column<D extends object = {}> = UseTableColumnOptions<D> //& UseGroupByColumnOptions<D> & UseFiltersColumnOptions<D>

  export type ColumnInstance<D extends object = {}> = Column<D> &
    UseTableColumnProps<D> //& UseGroupByColumnProps<D> & UseFiltersColumnProps<D>

  export type HeaderGroup<D extends object = {}> = UseTableHeaderGroupProps<D>

  export type Row<D extends object = {}> = UseTableRowProps<D>

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

  export type UseTableColumnOptions<D extends object> = Accessor<D> &
    Partial<{
      columns: Column<D>[]
      show: boolean | ((instance: TableInstance<D>) => boolean)
      Header: ComponentType<HeaderProps<D>> | ReactNode
      Cell: ComponentType<CellProps<D>> | ReactNode
    }>

  export interface UseTableInstanceProps<D extends object> {
    columns: ColumnInstance<D>[]
    flatColumns: ColumnInstance<D>[]
    headerGroups: HeaderGroup<D>[]
    headers: HeaderGroup<D>[]
    flatHeaders: HeaderGroup<D>[]
    rows: Row<D>[]
    getTableProps: (props?: object) => object
    prepareRow: (row: Row<D>) => any
    rowPaths: string[]
    flatRows: Row<D>[]
    setRowState: (rowPath: string, updated: Function | any) => void
    setCellState: (
      rowPath: string,
      columnID: IdType<D>,
      updater: Function | any
    ) => void
  }

  export interface UseTableHeaderGroupProps<D extends object> {
    headers: ColumnInstance<D>[]
    getHeaderGroupProps: (props?: object) => object
  }

  export interface UseTableColumnProps<D extends object> {
    id: string
    isVisible: boolean
    render: (type: 'Header' | 'Filter', props?: object) => any // FIXME
    getHeaderProps: (props?: object) => object
  }

  export interface UseTableRowProps<D extends object> {
    cells: Cell<D>[]
    values: Record<IdType<D>, any>
    getRowProps: (props?: object) => object
    index: number
    original: D[StringKey<D>]
    path: IdType<D>[]
    subRows: Row<D>[]
    state: object
  }

  export interface UseTableCellProps<D extends object> {
    column: ColumnInstance<D>
    row: Row<D>
    value: unknown
    getCellProps: (props?: object) => object
    render: (type: 'Cell' | 'Aggregated', userProps?: any) => any // FIXME
  }

  type HeaderProps<D extends object> = TableInstance<D> & {
    column: ColumnInstance<D>
  } & Record<string, any>
  type CellProps<D extends object> = TableInstance<D> & {
    column: ColumnInstance<D>
    row: Row<D>
    cell: Cell<D>
  } & Record<string, any>

  interface StringAccessor<D extends object> {
    accessor?: IdType<D>
    id?: IdType<D>
  }

  interface FunctionAccessor<D extends object> {
    accessor?: (
      originalRow: D,
      index: number,
      sub: {
        subRows: D[]
        depth: number
        data: D[]
      }
    ) => string
    id: IdType<D>
  }

  // TODO: Fix, currently not properly recognizing optional `id`
  // TODO: Fix, accessor is optional on columns?
  export type Accessor<D extends object> =
    | FunctionAccessor<D>
    | StringAccessor<D>
  /* #endregion */

  // Plugins

  /* #region useColumnOrder */
  export function useColumnOrder<D extends object = {}>(hooks: Hooks<D>): void

  export interface UseColumnOrderState<D extends object> {
    columnOrder: IdType<D>[]
  }

  export interface UseColumnOrderInstanceProps<D extends object> {
    setColumnOrder: (
      updater: (columnOrder: IdType<D>[]) => IdType<D>[] | IdType<D>[]
    ) => void
  }
  /* #endregion */

  /* #region useExpanded */
  export function useExpanded<D extends object = {}>(hooks: Hooks<D>): void

  export type UseExpandedOptions<D extends object> = Partial<{
    getSubRows: (row: Row<D>, relativeIndex: number) => Row<D>[]
    manualExpandedKey: IdType<D>
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
  }

  export interface UseExpandedRowProps<D extends object> {
    isExpanded: boolean
    toggleExpanded: (isExpanded?: boolean) => void
    getExpandedToggleProps: (props?: object) => object
  }
  /* #endregion */

  /* #region useFilters */
  export function useFilters<D extends object = {}>(hooks: Hooks<D>): void

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
    Filter: ComponentType<HeaderProps<D>> | ReactNode
    filter: DefaultFilterTypes | FilterType<D> | string // TODO: string added so you don't have to use `as const` cast
  }>

  export interface UseFiltersInstanceProps<D extends object> {
    rows: Row<D>[]
    preFilteredRows: Row<D>[]
    setFilter: (
      columnId: IdType<D>,
      updater: FilterType<D> | ((filter: FilterType<D>) => FilterType<D>)
    ) => void
    setAllFilters: (
      updater: Filters<D> | ((filters: Filters<D>) => Filters<D>)
    ) => void
  }

  export interface UseFiltersColumnProps<D extends object> {
    canFilter: boolean
    setFilter: (filterValue: unknown) => void
    filterValue: any
    preFilteredRows: Row<D>[]
  }

  type Filters<D extends object> = Record<IdType<D>, FilterType<D>> // QUESTION: Should the value be a string?

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
    (rows: Row<D>[], id: IdType<D>, filterValue: unknown): Row<D>[]
    autoRemove: (filterValue: unknown) => boolean
  }
  /* #endregion */

  /* #region useGroupBy */
  export function useGroupBy<D extends object = {}>(hooks: Hooks<D>): void

  export type UseGroupByOptions<D extends object> = Partial<{
    manualGroupBy: boolean
    disableGrouping: boolean
    aggregations: Record<string, Aggregator<D>>
    groupByFn: (rows: Row<D>[], columnId: IdType<D>) => Row<D>[]
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
    aggregate:
      | (DefaultAggregators | Aggregator<D> | string)
      | (DefaultAggregators | Aggregator<D> | string)[]
    Aggregated: ComponentType<CellProps<D>> | ReactNode
    disableGrouping: boolean
    groupByBoundary: boolean
  }>

  export interface UseGroupByInstanceProps<D extends object> {
    rows: Row<D>[]
    preGroupedRows: Row<D>[]
    toggleGroupBy: (columnId: IdType<D>, set: boolean) => void
  }

  export interface UseGroupByColumnProps<D extends object> {
    canGroupBy: boolean
    isGrouped: boolean
    groupedIndex: number
    toggleGroupBy: (set: boolean) => void
    getGroupByToggleProps: (props?: object) => object
  }

  export interface UseGroupByRowProps<D extends object> {
    groupByID: IdType<D>
    groupByVal: unknown
    values: Record<IdType<D>, unknown>
    subRows: Row<D>[]
    depth: number
    path: (IdType<D> | number)[]
    isAggregated: boolean
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
  export type Aggregator<D extends object> = (
    columnValues: unknown[],
    rows: Row<D>[]
  ) => unknown
  /* #endregion */

  /* #region usePagination */
  export function usePagination<D extends object = {}>(hooks: Hooks<D>): void

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
    gotoPage: (pageIndex: number) => void
    previousPage: () => void
    nextPage: () => void
    setPageSize: (pageSize: number) => void
    pageIndex: number
    pageSize: number
  }
  /* #endregion */

  /* #region useRowSelect */
  export function useRowSelect<D extends object = {}>(hooks: Hooks<D>): void

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
    manualRowSelectedKey: IdType<D>
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
  }
  /* #endregion */

  /* #region useRowState */
  export function useRowState<D extends object = {}>(hooks: Hooks<D>): void

  export type UseRowStateOptions<D extends object> = Partial<{
    initialRowStateAccessor: (row: Row<D>) => object
  }>

  export interface UseRowStateState<D extends object> {
    rowState: Partial<{
      cellState: UseRowStateLocalState<D>
      rowState: UseRowStateLocalState<D>
    }>
  }

  export interface UseRowStateInstanceProps<D extends object> {
    setRowState: (rowPath: string[], updater: UseRowUpdater) => void
    setCellState: (
      rowPath: string[],
      columnID: IdType<D>,
      updater: UseRowUpdater
    ) => void
  }

  export interface UseRowStateRowProps<D extends object> {
    state: unknown
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
      sortFns: SortByFn[],
      directions: boolean[]
    ) => Row<D>[]
    sortTypes: Record<string, SortByFn<Row<D>>>
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
    sortType: string | Function // FIXME
  }>

  export interface UseSortByInstanceProps<D extends object> {
    rows: Row<D>
    preSortedRows: Row<D>
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
    isSortedDesc: boolean
  }

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
      ) => unknown
      useState?: typeof useState
    }
  ): TableStateTuple<D>

  export const actions: Record<string, string>

  export function addActions(...actions: string[]): void

  export const defaultState: Record<string, unknown>

  // Helpers
  type StringKey<D> = Extract<keyof D, string>
  type IdType<D> = StringKey<D> | string

  export type SortByFn<T = unknown> = (a: T, b: T, desc: boolean) => 0 | 1 | -1

  export type PluginHook<D extends object> = (hooks: Hooks<D>) => void

  export type SetState<D extends object> = (
    updater: (old: TableState<D>) => TableState<D>,
    actions: any
  ) => void

  export type TableStateTuple<D extends object> = [TableState<D>, SetState<D>]
}
