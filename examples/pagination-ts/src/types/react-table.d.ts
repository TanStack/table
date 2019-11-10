declare module 'react-table' {
  import { ReactNode, ComponentType, MouseEvent } from 'react'

  type UnionToIntersection<U> = (U extends any
    ? (k: U) => void
    : never) extends ((k: infer I) => void)
    ? I
    : never

  type PluginConfig = {
    options?: any
    instance?: any
    state?: any
    cell?: any
    column?: any
    columnInstance?: any
    headerGroup?: any
    row?: any
  }

  type Plugins = PluginConfig[]

  type ArrayPick<T extends Plugins, K extends keyof T[number]> = T[number][K]

  type PluginEnhancements<
    P extends Plugins,
    K extends keyof P[number]
  > = UnionToIntersection<NonNullable<ArrayPick<P, K>>>

  export type TableOptions<
    D extends object,
    P extends Plugins
  > = UseTableOptions<D, P> & PluginEnhancements<P, 'options'>

  export type TableInstance<D extends object, P extends Plugins> = Omit<
    TableOptions<D, P>,
    'columns' | 'state'
  > &
    UseTableInstanceProps<D, P> &
    PluginEnhancements<P, 'instance'>

  export type TableState<
    D extends object,
    P extends Plugins
  > = PluginEnhancements<P, 'state'>

  export type Hooks<D extends object, P extends Plugins> = UseTableHooks<D, P>

  export type Cell<D extends object, P extends Plugins> = UseTableCellProps<
    D,
    P
  > &
    PluginEnhancements<P, 'cell'>

  export interface Column<D extends object, P extends Plugins>
    extends UseTableColumnOptions<D, P>,
      PluginEnhancements<P, 'column'> {}

  export type ColumnInstance<D extends object, P extends Plugins> = Omit<
    Column<D, P>,
    'id'
  > &
    UseTableColumnProps<D, P> &
    PluginEnhancements<P, 'columnInstance'>

  export type HeaderGroup<D extends object, P extends Plugins> = ColumnInstance<
    D,
    P
  > &
    UseTableHeaderGroupProps<D, P> &
    PluginEnhancements<P, 'headerGroup'>

  export type Row<D extends object, P extends Plugins> = UseTableRowProps<
    D,
    P
  > &
    PluginEnhancements<P, 'row'>

  /* #region useTable */
  export function useTable<D extends object, P extends Plugins>(
    options: TableOptions<D, P>,
    ...plugins: Array<PluginHook<D, P>>
  ): TableInstance<D, P>

  /**
   * NOTE: To use custom options, use "Interface Merging" to add the custom options
   */
  export type UseTableOptions<D extends object, P extends Plugins> = {
    columns: Array<Column<D, P>>
    data: D[]
  } & Partial<{
    initialState: Partial<TableState<D, P>>
    state: Partial<TableState<D, P>>
    reducer: (
      oldState: TableState<D, P>,
      newState: TableState<D, P>,
      type: string
    ) => TableState<D, P>
    defaultColumn: Partial<Column<D, P>>
    initialRowStateKey: IdType<D>
    getSubRows: (row: Row<D, P>, relativeIndex: number) => Array<Row<D, P>>
    getRowID: (row: Row<D, P>, relativeIndex: number) => string
    debug: boolean
  }>

  export interface UseTableHooks<D extends object, P extends Plugins> {
    columnsBeforeHeaderGroups: Array<
      (
        flatColumns: Array<Column<D, P>>,
        instance: TableInstance<D, P>
      ) => Array<Column<D, P>>
    >
    columnsBeforeHeaderGroupsDeps: Array<
      (deps: any[], instance: TableInstance<D, P>) => any[]
    >
    useMain: Array<(instance: TableInstance<D, P>) => TableInstance<D, P>>
    useRows: Array<
      (
        rows: Array<Row<D, P>>,
        instance: TableInstance<D, P>
      ) => Array<Row<D, P>>
    >
    prepareRow: Array<
      (row: Row<D, P>, instance: TableInstance<D, P>) => Row<D, P>
    >

    // Prop Hooks
    getTableProps: Array<(instance: TableInstance<D, P>) => object>
    getTableBodyProps: Array<(instance: TableInstance<D, P>) => object>
    getRowProps: Array<
      (row: Row<D, P>, instance: TableInstance<D, P>) => object
    >
    getHeaderGroupProps: Array<
      (headerGroup: HeaderGroup<D, P>, instance: TableInstance<D, P>) => object
    >
    getHeaderProps: Array<
      (column: Column<D, P>, instance: TableInstance<D, P>) => object
    >
    getCellProps: Array<
      (cell: Cell<D, P>, instance: TableInstance<D, P>) => object
    >
  }

  export type UseTableColumnOptions<
    D extends object,
    P extends Plugins
  > = Accessor<D> &
    Partial<{
      columns: Array<Column<D, P>>
      show: boolean | ((instance: TableInstance<D, P>) => boolean)
      Header: Renderer<HeaderProps<D, P>>
      Cell: Renderer<CellProps<D, P>>
      width?: number
      minWidth?: number
      maxWidth?: number
    }>

  export type UseTableInstanceProps<D extends object, P extends Plugins> = {
    columns: Array<ColumnInstance<D, P>>
    flatColumns: Array<ColumnInstance<D, P>>
    headerGroups: Array<HeaderGroup<D, P>>
    headers: Array<ColumnInstance<D, P>>
    flatHeaders: Array<ColumnInstance<D, P>>
    rows: Array<Row<D, P>>
    getTableProps: (props?: object) => object
    getTableBodyProps: (props?: object) => object
    prepareRow: (row: Row<D, P>) => void
    rowPaths: string[]
    flatRows: Array<Row<D, P>>
    state: TableState<D, P>
    setState: SetState<D, P>
    totalColumnsWidth: number
  }

  export type UseTableHeaderGroupProps<D extends object, P extends Plugins> = {
    headers: Array<ColumnInstance<D, P>>
    getHeaderGroupProps: (props?: object) => object
    totalHeaderCount: number
  }

  export type UseTableColumnProps<D extends object, P extends Plugins> = {
    id: IdType<D>
    isVisible: boolean
    render: (type: 'Header' | string, props?: object) => ReactNode
    getHeaderProps: (props?: object) => object
    parent: ColumnInstance<D, P>
    depth: number
    index: number
  }

  export type UseTableRowProps<D extends object, P extends Plugins> = {
    cells: Array<Cell<D, P>>
    values: Record<IdType<D>, CellValue>
    getRowProps: (props?: object) => object
    index: number
    original: D
    path: Array<IdType<D>>
    subRows: Array<Row<D, P>>
  }

  export type UseTableCellProps<D extends object, P extends Plugins> = {
    column: ColumnInstance<D, P>
    row: Row<D, P>
    value: CellValue
    getCellProps: (props?: object) => object
    render: (type: 'Cell' | string, userProps?: object) => ReactNode
  }

  export type HeaderProps<D extends object, P extends Plugins> = TableInstance<
    D,
    P
  > & {
    column: ColumnInstance<D, P>
  }

  export type CellProps<D extends object, P extends Plugins> = TableInstance<
    D,
    P
  > & {
    column: ColumnInstance<D, P>
    row: Row<D, P>
    cell: Cell<D, P>
  }

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
        ) => CellValue)
    id?: IdType<D>
  }

  /* #endregion */

  // Plugins

  /* #region useColumnOrder */
  export interface useColumnOrder<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
    state: useColumnOrder.UseColumnOrderState<D>
    instance: useColumnOrder.UseColumnOrderInstanceProps<D>
  }

  export const useColumnOrder: useColumnOrder<D, P>

  export namespace useColumnOrder {
    const pluginName = 'useColumnOrder'

    export type UseColumnOrderState<D extends object> = {
      columnOrder: Array<IdType<D>>
    }

    export type UseColumnOrderInstanceProps<D extends object> = {
      setColumnOrder: (
        updater: (columnOrder: Array<IdType<D>>) => Array<IdType<D>>
      ) => void
    }
  }

  /* #endregion */

  /* #region useExpanded */
  export interface useExpanded<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
    options: useExpanded.UseExpandedOptions<D, P>
    state: useExpanded.UseExpandedState<D>
    instance: useExpanded.UseExpandedInstanceProps<D, P>
    row: useExpanded.UseExpandedRowProps<D, P>
  }

  export const useExpanded: useExpanded<D, P>

  export namespace useExpanded {
    const pluginName = 'useExpanded'

    export type UseExpandedOptions<
      D extends object,
      P extends Plugins
    > = Partial<{
      getSubRows: (row: Row<D, P>, relativeIndex: number) => Array<Row<D, P>>
      manualExpandedKey: IdType<D>
      paginateExpandedRows: boolean
    }>

    export interface UseExpandedState<D extends object> {
      expanded: Array<IdType<D>>
    }

    export interface UseExpandedInstanceProps<
      D extends object,
      P extends Plugins
    > {
      rows: Array<Row<D, P>>
      toggleExpandedByPath: (
        path: Array<IdType<D>>,
        isExpanded: boolean
      ) => void
      expandedDepth: number
    }

    export interface UseExpandedRowProps<D extends object, P extends Plugins> {
      isExpanded: boolean
      canExpand: boolean
      subRows: Array<Row<D, P>>
      toggleExpanded: (isExpanded?: boolean) => void
      getExpandedToggleProps: (props?: object) => object
    }
  }

  export interface UseExpandedHooks<D extends object, P extends Plugins> {
    getExpandedToggleProps: Array<
      (row: Row<D, P>, instance: TableInstance<D, P>) => object
    >
  }

  /* #endregion */

  /* #region useFilters */
  export interface useFilters<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
    options: useFilters.UseFiltersOptions<D>
    state: useFilters.UseFiltersState<D>
    column: useFilters.UseFiltersColumnOptions<D, P>
    instance: useFilters.UseFiltersInstanceProps<D, P>
    columnInstance: useFilters.UseFiltersColumnProps<D, P>
  }

  export const useFilters: useFilters<D, P>

  export namespace useFilters {
    const pluginName = 'useFilters'

    export type UseFiltersOptions<D extends object> = Partial<{
      manualFilters: boolean
      disableFilters: boolean
      filterTypes: Filters<D>
    }>

    export interface UseFiltersState<D extends object> {
      filters: Filters<D>
    }

    export type UseFiltersColumnOptions<
      D extends object,
      P extends Plugins
    > = Partial<{
      disableFilters: boolean
      Filter: Renderer<FilterProps<D, P>>
      filter: FilterType<D, P> | DefaultFilterTypes | keyof Filters<D>
    }>

    export interface UseFiltersInstanceProps<
      D extends object,
      P extends Plugins
    > {
      rows: Array<Row<D, P>>
      preFilteredRows: Array<Row<D, P>>
      setFilter: (
        columnId: IdType<D>,
        updater: ((filterValue: FilterValue) => FilterValue) | FilterValue
      ) => void
      setAllFilters: (
        updater: Filters<D> | ((filters: Filters<D>) => Filters<D>)
      ) => void
    }

    export interface UseFiltersColumnProps<
      D extends object,
      P extends Plugins
    > {
      canFilter: boolean
      setFilter: (
        updater: ((filterValue: FilterValue) => FilterValue) | FilterValue
      ) => void
      filterValue: FilterValue
      preFilteredRows: Array<Row<D, P>>
      filteredRows: Array<Row<D, P>>
    }
  }
  export type FilterProps<D extends object, P extends Plugins> = HeaderProps<
    D,
    P
  >
  export type FilterValue = any
  export type Filters<D extends object> = Record<IdType<D>, FilterValue>

  export type DefaultFilterTypes =
    | 'text'
    | 'exactText'
    | 'exactTextCase'
    | 'includes'
    | 'includesAll'
    | 'exact'
    | 'equals'
    | 'between'

  export interface FilterType<D extends object, P extends Plugins> {
    (
      rows: Array<Row<D, P>>,
      columnId: IdType<D>,
      filterValue: FilterValue,
      column: ColumnInstance<D, P>
    ): Array<Row<D, P>>

    autoRemove?: (filterValue: FilterValue) => boolean
  }

  /* #endregion */

  /* #region useGroupBy */
  export interface useGroupBy<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
    options: useGroupBy.UseGroupByOptions<D, P>
    state: useGroupBy.UseGroupByState<D>
    column: useGroupBy.UseGroupByColumnOptions<D, P>
    instance: useGroupBy.UseGroupByInstanceProps<D, P>
    columnInstance: useGroupBy.UseGroupByColumnProps<D>
    headerGroup: useGroupBy.UseGroupByHeaderProps<D>
    row: useGroupBy.UseGroupByRowProps<D, P>
    cell: useGroupBy.UseGroupByCellProps<D>
  }

  export const useGroupBy: useGroupBy<D, P>

  export namespace useGroupBy {
    const pluginName = 'useGroupBy'

    export type UseGroupByOptions<
      D extends object,
      P extends Plugins
    > = Partial<{
      manualGroupBy: boolean
      disableGrouping: boolean
      aggregations: Record<string, AggregatorFn<D, P>>
      groupByFn: (
        rows: Array<Row<D, P>>,
        columnId: IdType<D>
      ) => Record<string, Row<D, P>>
    }>

    export interface UseGroupByState<D extends object> {
      groupBy: Array<IdType<D>>
    }

    export type UseGroupByColumnOptions<
      D extends object,
      P extends Plugins
    > = Partial<{
      aggregate: Aggregator<D, P> | Array<Aggregator<D, P>>
      Aggregated: Renderer<CellProps<D, P>>
      disableGrouping: boolean
      groupByBoundary: boolean
    }>

    export interface UseGroupByInstanceProps<
      D extends object,
      P extends Plugins
    > {
      rows: Array<Row<D, P>>
      preGroupedRows: Array<Row<D, P>>
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

    export interface UseGroupByRowProps<D extends object, P extends Plugins> {
      isAggregated: boolean
      groupByID: IdType<D>
      groupByVal: string
      values: Record<IdType<D>, AggregatedValue>
      subRows: Array<Row<D, P>>
      depth: number
      path: Array<IdType<D>>
      index: number
    }

    export interface UseGroupByCellProps<D extends object> {
      isGrouped: boolean
      isRepeatedValue: boolean
      isAggregated: boolean
    }
  }

  export interface UseGroupByHooks<D extends object, P extends Plugins> {
    getGroupByToggleProps: Array<
      (header: HeaderGroup<D, P>, instance: TableInstance<D, P>) => object
    >
  }

  export type DefaultAggregators =
    | 'sum'
    | 'average'
    | 'median'
    | 'uniqueCount'
    | 'count'

  export type AggregatorFn<D extends object, P extends Plugins> = (
    columnValues: CellValue[],
    rows: Array<Row<D, P>>
  ) => AggregatedValue

  export type Aggregator<D extends object, P extends Plugins> =
    | AggregatorFn<D, P>
    | DefaultAggregators
    | string

  export type AggregatedValue = any
  /* #endregion */

  /* #region usePagination */
  type usePagination<
    D extends object,
    P extends Plugins = TUsePagination
  > = PluginConfig & {
    (hooks: Hooks<D, P>): void
    options: nsUsePagination.UsePaginationOptions<D>
    state: nsUsePagination.UsePaginationState<D>
    instance: nsUsePagination.UsePaginationInstanceProps<D, P>
  }

  export const usePagination: usePagination<D, P>

  export namespace nsUsePagination {
    const pluginName = 'usePagination'

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

    export interface UsePaginationInstanceProps<
      D extends object,
      P extends Plugins
    > {
      page: Array<Row<D, P>>
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
  }

  /* #endregion */

  /* #region useRowSelect */
  export interface useRowSelect<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
    options: useRowSelect.UseRowSelectOptions<D>
    state: useRowSelect.UseRowSelectState<D>
    instance: useRowSelect.UseRowSelectInstanceProps<D, P>
    row: useRowSelect.UseRowSelectRowProps<D>
  }

  export const useRowSelect: useRowSelect<D, P>

  export namespace useRowSelect {
    const pluginName = 'useRowSelect'

    export type UseRowSelectOptions<D extends object> = Partial<{
      manualRowSelectedKey: IdType<D>
    }>

    export interface UseRowSelectState<D extends object> {
      selectedRowPaths: Array<IdType<D>>
    }

    export interface UseRowSelectInstanceProps<
      D extends object,
      P extends Plugins
    > {
      toggleRowSelected: (rowPath: IdType<D>, set?: boolean) => void
      toggleRowSelectedAll: (set?: boolean) => void
      getToggleAllRowsSelectedProps: (props?: object) => object
      isAllRowsSelected: boolean
      selectedFlatRows: Array<Row<D, P>>
    }

    export interface UseRowSelectRowProps<D extends object> {
      isSelected: boolean
      toggleRowSelected: (set?: boolean) => void
      getToggleRowSelectedProps: (props?: object) => object
    }
  }

  export interface UseRowSelectHooks<D extends object, P extends Plugins> {
    getToggleRowSelectedProps: Array<
      (row: Row<D, P>, instance: TableInstance<D, P>) => object
    >
    getToggleAllRowsSelectedProps: Array<
      (instance: TableInstance<D, P>) => object
    >
  }

  /* #endregion */

  /* #region useRowState */
  export interface useRowState<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
    options: useRowState.UseRowStateOptions<D, P>
    state: useRowState.UseRowStateState<D>
    instance: useRowState.UseRowStateInstanceProps<D>
    row: useRowState.UseRowStateRowProps<D>
    cell: useRowState.UseRowStateCellProps<D>
  }

  export const useRowState: useRowState<D, P>

  export namespace useRowState {
    const pluginName = 'useRowState'

    export type UseRowStateOptions<
      D extends object,
      P extends Plugins
    > = Partial<{
      initialRowStateAccessor: (row: Row<D, P>) => UseRowStateLocalState<D>
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

    export type UseRowUpdater<T = unknown> = T | ((prev: T) => T)
    export type UseRowStateLocalState<D extends object, T = unknown> = Record<
      IdType<D>,
      T
    >
  }
  /* #endregion */

  /* #region useSortBy */
  export interface useSortBy<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
    state: useSortBy.UseSortByState<D>
    column: useSortBy.UseSortByColumnOptions<D, P>
    instance: useSortBy.UseSortByInstanceProps<D, P>
    columnInstance: useSortBy.UseSortByColumnProps<D>
  }

  export const useSortBy: useSortBy<D, P>

  export namespace useSortBy {
    const pluginName = 'useSortBy'

    export type UseSortByOptions<
      D extends object,
      P extends Plugins
    > = Partial<{
      manualSorting: boolean
      disableSorting: boolean
      disableMultiSort: boolean
      isMultiSortEvent: (e: MouseEvent) => boolean
      maxMultiSortColCount: number
      disableSortRemove: boolean
      disabledMultiRemove: boolean
      orderByFn: (
        rows: Array<Row<D, P>>,
        sortFns: Array<SortByFn<D, P>>,
        directions: boolean[]
      ) => Array<Row<D, P>>
      sortTypes: Record<string, SortByFn<D, P>>
    }>

    export interface UseSortByState<D extends object> {
      sortBy: Array<SortingRule<D>>
    }

    export type UseSortByColumnOptions<
      D extends object,
      P extends Plugins
    > = Partial<{
      disableSorting: boolean
      sortDescFirst: boolean
      sortInverted: boolean
      sortType: SortByFn<D, P> | DefaultSortTypes | string
    }>

    export interface UseSortByInstanceProps<
      D extends object,
      P extends Plugins
    > {
      rows: Array<Row<D, P>>
      preSortedRows: Array<Row<D, P>>
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
  }

  export interface UseSortByHooks<D extends object, P extends Plugins> {
    getSortByToggleProps: Array<
      (column: Column<D, P>, instance: TableInstance<D, P>) => object
    >
  }

  export type SortByFn<D extends object, P extends Plugins> = (
    rowA: Row<D, P>,
    rowB: Row<D, P>,
    columnId: IdType<D>
  ) => 0 | 1 | -1

  export type DefaultSortTypes = 'alphanumeric' | 'datetime' | 'basic'

  export interface SortingRule<D> {
    id: IdType<D>
    desc?: boolean
  }

  /* #endregion */

  /* #region useAbsoluteLayout */
  export interface useAbsoluteLayout<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
  }

  export const useAbsoluteLayout: useAbsoluteLayout<D, P>

  export namespace useAbsoluteLayout {
    const pluginName = 'useAbsoluteLayout'
  }
  /* #endregion */

  /* #region useBlockLayout */
  export interface useBlockLayout<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
  }

  export const useBlockLayout: useBlockLayout<D, P>

  export namespace useBlockLayout {
    const pluginName = 'useBlockLayout'
  }
  /* #endregion */

  /* #region useResizeColumns */
  export interface useResizeColumns<D extends object, P extends Plugins>
    extends PluginConfig {
    (hooks: Hooks<D, P>): void
    column?: useResizeColumns.UseResizeColumnsOptions<D>
    columnInstance?: useResizeColumns.UseResizeColumnsColumnOptions<D>
    headerGroup?: useResizeColumns.UseResizeColumnsHeaderProps<D>
  }

  export const useResizeColumns: useResizeColumns<D, P>

  export namespace useResizeColumns {
    const pluginName = 'useResizeColumns'

    export interface UseResizeColumnsOptions<D extends object> {
      disableResizing?: boolean
    }

    export interface UseResizeColumnsColumnOptions<D extends object> {
      disableResizing?: boolean
    }

    export interface UseResizeColumnsHeaderProps<D extends object> {
      getResizerProps: (props?: object) => object
      canResize: boolean
      isResizing: boolean
    }
  }
  /* #endregion */

  // Additional API
  export const actions: Record<string, string>

  export function addActions(...actions: string[]): void

  export const defaultState: Record<string, any>

  // Helpers
  export type StringKey<D> = Extract<keyof D, string>
  export type IdType<D> = StringKey<D> | string
  export type CellValue = any

  export type Renderer<Props> = ComponentType<Props> | ReactNode

  export interface PluginHook<D extends object, P extends Plugins> {
    (hooks: Hooks<D, P>): void

    pluginName: string
  }

  export type SetState<D extends object, P extends Plugins> = (
    updater: (old: TableState<D, P>) => TableState<D, P>,
    type: keyof typeof actions
  ) => void
}
