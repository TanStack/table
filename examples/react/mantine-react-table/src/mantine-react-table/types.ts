import type {
  Dispatch,
  HTMLProps,
  MutableRefObject,
  ReactNode,
  RefObject,
  SetStateAction,
} from 'react'

import type {
  AccessorFn,
  AggregationFn,
  Cell,
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  columnResizingState as ColumnResizingState,
  ColumnSizingState,
  ColumnVisibilityState,
  DeepKeys,
  DeepValue,
  ExpandedState,
  FilterFn,
  GroupingState,
  Header,
  HeaderGroup,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortFn,
  SortingState,
  StockFeatures,
  Table,
  TableOptions,
  TableState,
  Updater,
} from '@tanstack/react-table'
import type {
  VirtualItem,
  Virtualizer,
  VirtualizerOptions,
} from '@tanstack/react-virtual'

import type {
  ActionIconProps,
  AlertProps,
  AutocompleteProps,
  BadgeProps,
  BoxProps,
  CheckboxProps,
  HighlightProps,
  LoadingOverlayProps,
  ModalProps,
  MultiSelectProps,
  PaginationProps,
  PaperProps,
  ProgressProps,
  RadioProps,
  RangeSliderProps,
  SelectProps,
  SkeletonProps,
  SwitchProps,
  TableProps,
  TableTbodyProps,
  TableTdProps,
  TableTfootProps,
  TableThProps,
  TableTheadProps,
  TableTrProps,
  TextInputProps,
  UnstyledButtonProps,
} from '@mantine/core'
import type { DateInputProps } from '@mantine/dates'

import type { MRT_AggregationFns } from './fns/aggregationFns'
import type { MRT_FilterFns } from './fns/filterFns'
import type { MRT_SortFns } from './fns/sortingFns'
import type { MRT_Icons } from './icons'

export type { MRT_Icons }

export type LiteralUnion<T extends U, U = string> =
  | (Record<never, never> & U)
  | T

export type Prettify<T> = { [K in keyof T]: T[K] } & unknown

export type Xor<A, B> =
  | Prettify<{ [k in keyof A]?: never } & B>
  | Prettify<{ [k in keyof B]?: never } & A>

export type HTMLPropsRef<T extends HTMLElement> = {
  ref?: MutableRefObject<null | T> | null
} & Omit<
  HTMLProps<T>,
  'color' | 'data' | 'label' | 'ref' | 'size' | 'style' | 'type'
>

export type MantineShade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type MRT_PaginationProps = {
  rowsPerPageOptions?: Array<string>
  showRowsPerPage?: boolean
} & Partial<PaginationProps>

export type MRT_DensityState = 'lg' | 'md' | 'sm' | 'xl' | 'xs'

export type MRT_ColumnFilterFnsState = Record<string, MRT_FilterOption>

export type MRT_RowData = Record<string, any>

export type MRT_CellValue = unknown

export type MRT_ColumnFiltersState = ColumnFiltersState
export type MRT_ColumnOrderState = ColumnOrderState
export type MRT_ColumnPinningState = ColumnPinningState
export type MRT_ColumnResizingState = ColumnResizingState
export type MRT_ColumnSizingState = ColumnSizingState
export type MRT_ColumnVisibilityState = ColumnVisibilityState
export type MRT_ExpandedState = ExpandedState
export type MRT_GroupingState = GroupingState
export type MRT_PaginationState = PaginationState
export type MRT_RowSelectionState = RowSelectionState
export type MRT_SortingState = SortingState
export type MRT_Updater<T> = Updater<T>
export type MRT_VirtualItem = VirtualItem

export type MRT_VirtualizerOptions<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
> = VirtualizerOptions<TScrollElement, TItemElement>

export type MRT_ColumnVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
> = {
  virtualColumns: Array<MRT_VirtualItem>
  virtualPaddingLeft?: number
  virtualPaddingRight?: number
} & Virtualizer<TScrollElement, TItemElement>

export type MRT_RowVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
> = {
  virtualRows: Array<MRT_VirtualItem>
} & Virtualizer<TScrollElement, TItemElement>

export type MRT_ColumnHelper<TData extends MRT_RowData> = {
  /**
   * Creates a data column definition with either an `accessorKey` (string) or
   * an `accessorFn` (function) to extract the cell value. Returns the
   * appropriate column-def variant so the column shape is preserved.
   * @example
   * ```ts
   * helper.accessor('firstName', { cell: (info) => info.getValue() })
   * helper.accessor((row) => row.lastName, { id: 'lastName' })
   * ```
   */
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? MRT_DisplayColumnDef<TData, TValue>
      : MRT_IdentifiedColumnDef<TData, TValue>,
  ) => TAccessor extends AccessorFn<TData>
    ? MRT_AccessorFnColumnDef<TData, TValue>
    : MRT_AccessorKeyColumnDef<TData, TValue>
  /**
   * Wraps an array of column definitions to preserve each column's individual
   * `TValue` type. Uses variadic tuple types to infer element types before
   * checking constraints, preventing type widening.
   * @example
   * ```ts
   * helper.columns([
   *   helper.accessor('firstName', {}),
   *   helper.accessor('age', {}),
   * ])
   * ```
   */
  columns: <TColumns extends ReadonlyArray<MRT_ColumnDef<TData, any>>>(
    columns: [...TColumns],
  ) => Array<MRT_ColumnDef<TData, any>> & [...TColumns]
  /**
   * Creates a display column definition for non-data columns like row actions
   * or row numbers.
   */
  display: (
    column: MRT_DisplayColumnDef<TData>,
  ) => MRT_DisplayColumnDef<TData, unknown>
  /**
   * Creates a group column definition that contains nested child columns.
   */
  group: (
    column: MRT_GroupColumnDef<TData, unknown>,
  ) => MRT_GroupColumnDef<TData, unknown>
}

export interface MRT_Localization {
  actions: string
  and: string
  cancel: string
  changeFilterMode: string
  changeSearchMode: string
  clearFilter: string
  clearSearch: string
  clearSelection: string
  clearSort: string
  clickToCopy: string
  collapse: string
  collapseAll: string
  columnActions: string
  copiedToClipboard: string
  copy: string
  dropToGroupBy: string
  edit: string
  expand: string
  expandAll: string
  filterArrIncludes: string
  filterArrIncludesAll: string
  filterArrIncludesSome: string
  filterBetween: string
  filterBetweenInclusive: string
  filterByColumn: string
  filterContains: string
  filterEmpty: string
  filterEndsWith: string
  filterEquals: string
  filterEqualsString: string
  filterFuzzy: string
  filterGreaterThan: string
  filterGreaterThanOrEqualTo: string
  filterIncludesString: string
  filterIncludesStringSensitive: string
  filteringByColumn: string
  filterInNumberRange: string
  filterLessThan: string
  filterLessThanOrEqualTo: string
  filterMode: string
  filterNotEmpty: string
  filterNotEquals: string
  filterStartsWith: string
  filterWeakEquals: string
  goToFirstPage: string
  goToLastPage: string
  goToNextPage: string
  goToPreviousPage: string
  grab: string
  groupByColumn: string
  groupedBy: string
  hideAll: string
  hideColumn: string
  max: string
  min: string
  move: string
  noRecordsToDisplay: string
  noResultsFound: string
  of: string
  or: string
  pin: string
  pinToLeft: string
  pinToRight: string
  resetColumnSize: string
  resetOrder: string
  rowActions: string
  rowNumber: string
  rowNumbers: string
  rowsPerPage: string
  save: string
  search: string
  select: string
  selectedCountOfRowCountRowsSelected: string
  showAll: string
  showAllColumns: string
  showHideColumns: string
  showHideFilters: string
  showHideSearch: string
  sortByColumnAsc: string
  sortByColumnDesc: string
  sortedByColumnAsc: string
  sortedByColumnDesc: string
  thenBy: string
  toggleDensity: string
  toggleFullScreen: string
  toggleSelectAll: string
  toggleSelectRow: string
  toggleVisibility: string
  ungroupByColumn: string
  unpin: string
  unpinAll: string
}

export interface MRT_RowModel<TData extends MRT_RowData> {
  flatRows: Array<MRT_Row<TData>>
  rows: Array<MRT_Row<TData>>
  rowsById: { [key: string]: MRT_Row<TData> }
}

export type MRT_TableInstance<TData extends MRT_RowData> = {
  getAllColumns: () => Array<MRT_Column<TData>>
  getAllFlatColumns: () => Array<MRT_Column<TData>>
  getAllLeafColumns: () => Array<MRT_Column<TData>>
  getBottomRows: () => Array<MRT_Row<TData>>
  getCenterLeafColumns: () => Array<MRT_Column<TData>>
  getCenterRows: () => Array<MRT_Row<TData>>
  getColumn: (columnId: string) => MRT_Column<TData>
  getExpandedRowModel: () => MRT_RowModel<TData>
  getFilteredSelectedRowModel: () => MRT_RowModel<TData>
  getFlatHeaders: () => Array<MRT_Header<TData>>
  getHeaderGroups: () => Array<MRT_HeaderGroup<TData>>
  getLeftLeafColumns: () => Array<MRT_Column<TData>>
  getPaginationRowModel: () => MRT_RowModel<TData>
  getPreFilteredRowModel: () => MRT_RowModel<TData>
  getPrePaginatedRowModel: () => MRT_RowModel<TData>
  getRightLeafColumns: () => Array<MRT_Column<TData>>
  getRowModel: () => MRT_RowModel<TData>
  getSelectedRowModel: () => MRT_RowModel<TData>
  getState: () => MRT_TableState<TData>
  getTopRows: () => Array<MRT_Row<TData>>
  options: MRT_StatefulTableOptions<TData>
  refs: {
    bottomToolbarRef: MutableRefObject<HTMLDivElement | null>
    editInputRefs: MutableRefObject<Record<string, HTMLInputElement>>
    filterInputRefs: MutableRefObject<Record<string, HTMLInputElement>>
    lastSelectedRowId: MutableRefObject<null | string>
    searchInputRef: MutableRefObject<HTMLInputElement | null>
    tableContainerRef: MutableRefObject<HTMLDivElement | null>
    tableFooterRef: MutableRefObject<HTMLTableSectionElement | null>
    tableHeadCellRefs: MutableRefObject<Record<string, HTMLTableCellElement>>
    tableHeadRef: MutableRefObject<HTMLTableSectionElement | null>
    tablePaperRef: MutableRefObject<HTMLDivElement | null>
    topToolbarRef: MutableRefObject<HTMLDivElement | null>
  }
  /**
   * The current full table state. Populated by useTable's `state => state` selector
   * and enriched with MRT-only slices that v9's store doesn't track.
   * Use this in place of v8's `table.getState()`.
   */
  state: MRT_TableState<TData>
  /**
   * v9 calls this `setcolumnResizing` (lowercase 'c') on the underlying table —
   * we expose a normal camelCase alias here.
   */
  setColumnResizing: (
    updater: Updater<MRT_TableState<TData>['columnResizing']>,
  ) => void
  setColumnFilterFns: Dispatch<SetStateAction<MRT_ColumnFilterFnsState>>
  setCreatingRow: Dispatch<SetStateAction<MRT_Row<TData> | null | true>>
  setDensity: Dispatch<SetStateAction<MRT_DensityState>>
  setDraggingColumn: Dispatch<SetStateAction<MRT_Column<TData> | null>>
  setDraggingRow: Dispatch<SetStateAction<MRT_Row<TData> | null>>
  setEditingCell: Dispatch<SetStateAction<MRT_Cell<TData> | null>>
  setEditingRow: Dispatch<SetStateAction<MRT_Row<TData> | null>>
  setGlobalFilterFn: Dispatch<SetStateAction<MRT_FilterOption>>
  setHoveredColumn: Dispatch<SetStateAction<null | Partial<MRT_Column<TData>>>>
  setHoveredRow: Dispatch<SetStateAction<null | Partial<MRT_Row<TData>>>>
  setIsFullScreen: Dispatch<SetStateAction<boolean>>
  setShowAlertBanner: Dispatch<SetStateAction<boolean>>
  setShowColumnFilters: Dispatch<SetStateAction<boolean>>
  setShowGlobalFilter: Dispatch<SetStateAction<boolean>>
  setShowToolbarDropZone: Dispatch<SetStateAction<boolean>>
} & Omit<
  Table<StockFeatures, TData>,
  | 'getAllColumns'
  | 'getAllFlatColumns'
  | 'getAllLeafColumns'
  | 'getBottomRows'
  | 'getCenterLeafColumns'
  | 'getCenterRows'
  | 'getColumn'
  | 'getExpandedRowModel'
  | 'getFlatHeaders'
  | 'getHeaderGroups'
  | 'getLeftLeafColumns'
  | 'getPaginationRowModel'
  | 'getPreFilteredRowModel'
  | 'getPrePaginatedRowModel'
  | 'getRightLeafColumns'
  | 'getRowModel'
  | 'getSelectedRowModel'
  | 'getState'
  | 'getTopRows'
  | 'options'
>

export type MRT_DefinedTableOptions<TData extends MRT_RowData> = {
  icons: MRT_Icons
  localization: MRT_Localization
} & Omit<MRT_TableOptions<TData>, 'icons' | 'localization'>

export type MRT_StatefulTableOptions<TData extends MRT_RowData> = {
  state: Pick<
    MRT_TableState<TData>,
    | 'columnFilterFns'
    | 'columnOrder'
    | 'columnResizing'
    | 'creatingRow'
    | 'density'
    | 'draggingColumn'
    | 'draggingRow'
    | 'editingCell'
    | 'editingRow'
    | 'globalFilterFn'
    | 'grouping'
    | 'hoveredColumn'
    | 'hoveredRow'
    | 'isFullScreen'
    | 'pagination'
    | 'showAlertBanner'
    | 'showColumnFilters'
    | 'showGlobalFilter'
    | 'showToolbarDropZone'
  >
} & MRT_DefinedTableOptions<TData>

export type MRT_TableState<TData extends MRT_RowData> = Prettify<
  {
    columnFilterFns: MRT_ColumnFilterFnsState
    creatingRow: MRT_Row<TData> | null
    density: MRT_DensityState
    draggingColumn: MRT_Column<TData> | null
    draggingRow: MRT_Row<TData> | null
    editingCell: MRT_Cell<TData> | null
    editingRow: MRT_Row<TData> | null
    globalFilterFn: MRT_FilterOption
    hoveredColumn: null | Partial<MRT_Column<TData>>
    hoveredRow: null | Partial<MRT_Row<TData>>
    isFullScreen: boolean
    isLoading: boolean
    isSaving: boolean
    showAlertBanner: boolean
    showColumnFilters: boolean
    showGlobalFilter: boolean
    showLoadingOverlay: boolean
    showProgressBars: boolean
    showSkeletons: boolean
    showToolbarDropZone: boolean
  } & TableState<StockFeatures>
>

export type MRT_ColumnDef<TData extends MRT_RowData, TValue = unknown> = {
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify a function here to point to the correct property in the data object.
   *
   * @example accessorFn: (row) => row.username
   */
  accessorFn?: (originalRow: TData) => any
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify which key in the row this column should use to access the correct data.
   * Also supports Deep Key Dot Notation.
   *
   * @example accessorKey: 'username' //simple
   * @example accessorKey: 'name.firstName' //deep key dot notation
   */
  accessorKey?: ({} & string) | DeepKeys<TData>
  AggregatedCell?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  aggregationFn?: Array<MRT_AggregationFn<TData>> | MRT_AggregationFn<TData>
  Cell?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    renderedCellValue: number | ReactNode | string
    renderedColumnIndex?: number
    renderedRowIndex?: number
    row: MRT_Row<TData>
    rowRef?: RefObject<HTMLTableRowElement | null>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  /**
   * Specify what type of column this is. Either `data`, `display`, or `group`. Defaults to `data`.
   * Leave this blank if you are just creating a normal data column.
   *
   * @default 'data'
   *
   * @example columnDefType: 'display'
   */
  columnDefType?: 'data' | 'display' | 'group'
  columnFilterModeOptions?: Array<
    LiteralUnion<MRT_FilterOption & string>
  > | null
  columns?: Array<MRT_ColumnDef<TData>>
  Edit?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  editVariant?: 'multi-select' | 'select' | 'text'
  enableCellHoverReveal?: boolean
  enableClickToCopy?: ((cell: MRT_Cell<TData>) => boolean) | boolean
  enableColumnActions?: boolean
  enableColumnDragging?: boolean
  enableColumnFilterModes?: boolean
  enableColumnOrdering?: boolean
  enableEditing?: ((row: MRT_Row<TData>) => boolean) | boolean
  enableFilterMatchHighlighting?: boolean
  Filter?: (props: {
    column: MRT_Column<TData, TValue>
    header: MRT_Header<TData>
    rangeFilterIndex?: number
    table: MRT_TableInstance<TData>
  }) => ReactNode
  filterFn?: MRT_FilterFn<TData>
  filterTooltipValueFn?: MRT_FilterTooltipValueFn
  filterVariant?:
    | 'autocomplete'
    | 'checkbox'
    | 'date'
    | 'date-range'
    | 'multi-select'
    | 'range'
    | 'range-slider'
    | 'select'
    | 'text'
  Footer?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        footer: MRT_Header<TData>
        table: MRT_TableInstance<TData>
      }) => ReactNode)
    | ReactNode
  /**
   * footer must be a string. If you want custom JSX to render the footer, you can also specify a `Footer` option. (Capital F)
   */
  footer?: string
  GroupedCell?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  /**
   * If `layoutMode` is `'grid'` or `'grid-no-grow'`, you can specify the flex grow value for individual columns to still grow and take up remaining space, or set to `false`/0 to not grow.
   */
  grow?: boolean | number
  Header?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        header: MRT_Header<TData>
        table: MRT_TableInstance<TData>
      }) => ReactNode)
    | ReactNode
  /**
   * header must be a string. If you want custom JSX to render the header, you can also specify a `Header` option. (Capital H)
   */
  header: string
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   *
   * If you have also specified an `accessorFn`, MRT still needs to have a valid `id` to be able to identify the column uniquely.
   *
   * `id` defaults to the `accessorKey` or `header` if not specified.
   *
   * @default gets set to the same value as `accessorKey` by default
   */
  id?: LiteralUnion<keyof TData & string>
  mantineColumnActionsButtonProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineColumnDragHandleProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineCopyButtonProps?:
    | ((props: {
        cell: MRT_Cell<TData, TValue>
        column: MRT_Column<TData, TValue>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<UnstyledButtonProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<UnstyledButtonProps>)
  mantineEditSelectProps?:
    | ((props: {
        cell: MRT_Cell<TData, TValue>
        column: MRT_Column<TData, TValue>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
  mantineEditTextInputProps?:
    | ((props: {
        cell: MRT_Cell<TData, TValue>
        column: MRT_Column<TData, TValue>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineFilterAutocompleteProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<AutocompleteProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<AutocompleteProps>)
  mantineFilterCheckboxProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<CheckboxProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<CheckboxProps>)
  mantineFilterDateInputProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>)
  mantineFilterMultiSelectProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<MultiSelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<MultiSelectProps>)
  mantineFilterRangeSliderProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<RangeSliderProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<RangeSliderProps>)
  mantineFilterSelectProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
  mantineFilterTextInputProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineTableBodyCellProps?:
    | ((props: {
        cell: MRT_Cell<TData, TValue>
        column: MRT_Column<TData, TValue>
        renderedRowIndex?: number
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableTdProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableTdProps)
  mantineTableFooterCellProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableThProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableThProps)
  mantineTableHeadCellProps?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableThProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableThProps)
  PlaceholderCell?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderColumnActionsMenuItems?: (props: {
    column: MRT_Column<TData, TValue>
    internalColumnMenuItems: ReactNode
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderColumnFilterModeMenuItems?: (props: {
    column: MRT_Column<TData, TValue>
    internalFilterOptions: Array<MRT_InternalFilterOption>
    onSelectFilterMode: (filterMode: MRT_FilterOption) => void
    table: MRT_TableInstance<TData>
  }) => ReactNode
  sortFn?: MRT_SortFn<TData>
  visibleInShowHideMenu?: boolean
} & Omit<
  ColumnDef<StockFeatures, TData, TValue>,
  | 'accessorKey'
  | 'aggregatedCell'
  | 'aggregationFn'
  | 'cell'
  | 'columns'
  | 'filterFn'
  | 'footer'
  | 'header'
  | 'id'
  | 'sortFn'
>

export type MRT_DisplayColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = Omit<MRT_ColumnDef<TData, TValue>, 'accessorFn' | 'accessorKey'>

/**
 * A data column with an `id` and optional `header`. Used as the input shape
 * for `columnHelper.accessor(key, ...)` — the `id` defaults to the accessor key
 * so it's not required at the call site. Mirrors v9's `IdentifiedColumnDef`.
 */
export type MRT_IdentifiedColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = MRT_DisplayColumnDef<TData, TValue>

/**
 * The result type of `columnHelper.accessor(fn, ...)`. Has a required
 * `accessorFn`. Mirrors v9's `AccessorFnColumnDef`.
 */
export type MRT_AccessorFnColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = MRT_DisplayColumnDef<TData, TValue> & {
  accessorFn: (originalRow: TData) => TValue
}

/**
 * The result type of `columnHelper.accessor(key, ...)`. Has a required
 * `accessorKey`. Mirrors v9's `AccessorKeyColumnDef`.
 */
export type MRT_AccessorKeyColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = MRT_DisplayColumnDef<TData, TValue> & {
  accessorKey: DeepKeys<TData> | (string & {})
}

/**
 * Union of `MRT_AccessorFnColumnDef` and `MRT_AccessorKeyColumnDef`.
 * Mirrors v9's `AccessorColumnDef`.
 */
export type MRT_AccessorColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> =
  | MRT_AccessorFnColumnDef<TData, TValue>
  | MRT_AccessorKeyColumnDef<TData, TValue>

export type MRT_GroupColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = MRT_DisplayColumnDef<TData, TValue> & {
  columns?: ReadonlyArray<MRT_ColumnDef<TData, any>>
}

export type MRT_DefinedColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = {
  _filterFn: MRT_FilterOption
  defaultDisplayColumn: Partial<MRT_ColumnDef<TData, TValue>>
  id: string
} & Omit<MRT_ColumnDef<TData, TValue>, 'defaultDisplayColumn' | 'id'>

export type MRT_Column<TData extends MRT_RowData, TValue = unknown> = {
  columnDef: MRT_DefinedColumnDef<TData, TValue>
  columns?: Array<MRT_Column<TData>>
  filterFn?: MRT_FilterFn<TData>
  footer: string
  header: string
} & Omit<
  Column<StockFeatures, TData, MRT_CellValue>,
  'columnDef' | 'columns' | 'filterFn' | 'footer' | 'header'
>

export type MRT_Header<TData extends MRT_RowData, TValue = unknown> = {
  column: MRT_Column<TData, TValue>
} & Omit<Header<StockFeatures, TData, MRT_CellValue>, 'column'>

export type MRT_HeaderGroup<TData extends MRT_RowData> = {
  headers: Array<MRT_Header<TData>>
} & Omit<HeaderGroup<StockFeatures, TData>, 'headers'>

export type MRT_Row<TData extends MRT_RowData> = {
  _valuesCache: Record<LiteralUnion<DeepKeys<TData> & string>, any>
  getAllCells: () => Array<MRT_Cell<TData>>
  getVisibleCells: () => Array<MRT_Cell<TData>>
  subRows?: Array<MRT_Row<TData>>
} & Omit<
  Row<StockFeatures, TData>,
  '_valuesCache' | 'getAllCells' | 'getVisibleCells' | 'subRows'
>

export type MRT_Cell<TData extends MRT_RowData, TValue = unknown> = {
  column: MRT_Column<TData, TValue>
  row: MRT_Row<TData>
} & Omit<Cell<StockFeatures, TData, TValue>, 'column' | 'row'>

export type MRT_AggregationOption = keyof typeof MRT_AggregationFns & string

export type MRT_AggregationFn<TData extends MRT_RowData> =
  | AggregationFn<StockFeatures, TData>
  | MRT_AggregationOption

export type MRT_SortingOption = LiteralUnion<keyof typeof MRT_SortFns & string>

export type MRT_SortFn<TData extends MRT_RowData> =
  | MRT_SortingOption
  | SortFn<StockFeatures, TData>

export type MRT_FilterOption = LiteralUnion<keyof typeof MRT_FilterFns & string>

export type MRT_FilterFn<TData extends MRT_RowData> =
  | FilterFn<StockFeatures, TData>
  | MRT_FilterOption

export type MRT_FilterTooltipValueFn<TValue = any> = (value: TValue) => string

export type MRT_InternalFilterOption = {
  divider: boolean
  label: string
  option: string
  symbol: string
}

export type MRT_DisplayColumnIds =
  | 'mrt-row-actions'
  | 'mrt-row-drag'
  | 'mrt-row-expand'
  | 'mrt-row-numbers'
  | 'mrt-row-pin'
  | 'mrt-row-select'
  | 'mrt-row-spacer'

export type MRT_CreateTableFeature<
  TData extends MRT_RowData,
  TFeature = any,
> = (table: MRT_TableInstance<TData>) => TFeature

/**
 * `columns` and `data` props are the only required props, but there are over 150 other optional props.
 *
 * See more info on creating columns and data on the official docs site:
 * @link https://www.mantine-react-table.com/docs/getting-started/usage
 *
 * See the full props list on the official docs site:
 * @link https://www.mantine-react-table.com/docs/api/table-options
 */
export type MRT_TableOptions<TData extends MRT_RowData> = {
  /**
   * Custom aggregation functions to apply to the table. These get merged with
   * MRT's built-ins (`mean`, `min`, `max`, etc.) and passed into
   * `createGroupedRowModel(...)`.
   */
  aggregationFns?: Record<string, AggregationFn<StockFeatures, TData>>
  /**
   * Custom filter functions to apply to the table. These get merged with MRT's
   * built-ins (`fuzzy`, `contains`, `between`, etc.) and passed into
   * `createFilteredRowModel(...)`.
   */
  filterFns?: Record<string, FilterFn<StockFeatures, TData>>
  /**
   * Custom sort functions to apply to the table. These get merged with MRT's
   * built-ins (`alphanumeric`, `fuzzy`, etc.) and passed into
   * `createSortedRowModel(...)`.
   */
  sortFns?: Record<string, SortFn<StockFeatures, TData>>
  columnFilterDisplayMode?: 'custom' | 'popover' | 'subheader'
  columnFilterModeOptions?: Array<
    LiteralUnion<MRT_FilterOption & string>
  > | null
  /**
   * The columns to display in the table. `accessorKey`s or `accessorFn`s must match keys in the `data` prop.
   *
   * See more info on creating columns on the official docs site:
   * @link https://www.mantine-react-table.com/docs/guides/data-columns
   * @link https://www.mantine-react-table.com/docs/guides/display-columns
   *
   * See all Columns Options on the official docs site:
   * @link https://www.mantine-react-table.com/docs/api/column-options
   */
  columns: Array<MRT_ColumnDef<TData>>
  columnVirtualizerInstanceRef?: MutableRefObject<null | Virtualizer<
    HTMLDivElement,
    HTMLTableCellElement
  >>
  columnVirtualizerOptions?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>
  createDisplayMode?: 'custom' | 'modal' | 'row'
  /**
   * Pass your data as an array of objects. Objects can theoretically be any shape, but it's best to keep them consistent.
   *
   * See the usage guide for more info on creating columns and data:
   * @link https://www.mantine-react-table.com/docs/getting-started/usage
   */
  data: Array<TData>
  /**
   * Instead of specifying a bunch of the same options for each column, you can just change an option in the `defaultColumn` prop to change a default option for all columns.
   */
  defaultColumn?: Partial<MRT_ColumnDef<TData>>
  /**
   * Change the default options for display columns.
   */
  defaultDisplayColumn?: Partial<MRT_DisplayColumnDef<TData>>
  displayColumnDefOptions?: Partial<{
    [key in MRT_DisplayColumnIds]: Partial<MRT_DisplayColumnDef<TData>>
  }>
  editDisplayMode?: 'cell' | 'custom' | 'modal' | 'row' | 'table'
  enableBatchRowSelection?: boolean
  enableBottomToolbar?: boolean
  enableClickToCopy?: ((cell: MRT_Cell<TData>) => boolean) | boolean
  enableColumnActions?: boolean
  enableColumnDragging?: boolean
  enableColumnFilterModes?: boolean
  enableColumnOrdering?: boolean
  enableColumnVirtualization?: boolean
  enableDensityToggle?: boolean
  enableEditing?: ((row: MRT_Row<TData>) => boolean) | boolean
  enableExpandAll?: boolean
  enableFacetedValues?: boolean
  enableFilterMatchHighlighting?: boolean
  enableFullScreenToggle?: boolean
  enableGlobalFilterModes?: boolean
  enableGlobalFilterRankedResults?: boolean
  enableHeaderActionsHoverReveal?: boolean
  enablePagination?: boolean
  enableRowActions?: boolean
  enableRowDragging?: boolean
  enableRowNumbers?: boolean
  enableRowOrdering?: boolean
  enableRowSelection?: ((row: MRT_Row<TData>) => boolean) | boolean
  enableRowVirtualization?: boolean
  enableSelectAll?: boolean
  enableStickyFooter?: boolean
  enableStickyHeader?: boolean
  enableTableFooter?: boolean
  enableTableHead?: boolean
  enableToolbarInternalActions?: boolean
  enableTopToolbar?: boolean
  expandRowsFn?: (dataRow: TData) => Array<TData>
  getRowId?: (
    originalRow: TData,
    index: number,
    parentRow: MRT_Row<TData>,
  ) => string | undefined
  globalFilterFn?: MRT_FilterOption
  globalFilterModeOptions?: Array<MRT_FilterOption> | null
  icons?: Partial<MRT_Icons>
  initialState?: Partial<MRT_TableState<TData>>
  /**
   * Changes which kind of CSS layout is used to render the table. `semantic` uses default semantic HTML elements, while `grid` adds CSS grid and flexbox styles
   */
  layoutMode?: 'grid' | 'grid-no-grow' | 'semantic'
  /**
   * Pass in either a locale imported from `mantine-react-table/locales/*` or a custom locale object.
   *
   * See the localization (i18n) guide for more info:
   * @link https://www.mantine-react-table.com/docs/guides/localization
   */
  localization?: Partial<MRT_Localization>
  mantineBottomToolbarProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => BoxProps & HTMLPropsRef<HTMLDivElement>)
    | (BoxProps & HTMLPropsRef<HTMLDivElement>)
  mantineColumnActionsButtonProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineColumnDragHandleProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineCopyButtonProps?:
    | ((props: {
        cell: MRT_Cell<TData, MRT_CellValue>
        column: MRT_Column<TData, MRT_CellValue>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<UnstyledButtonProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<UnstyledButtonProps>)
  mantineCreateRowModalProps?:
    | ((props: {
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<ModalProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<ModalProps>)
  mantineDetailPanelProps?:
    | ((props: {
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => BoxProps & HTMLPropsRef<HTMLTableCellElement>)
    | (BoxProps & HTMLPropsRef<HTMLTableCellElement>)
  mantineEditRowModalProps?:
    | ((props: {
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<ModalProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<ModalProps>)
  mantineEditSelectProps?:
    | ((props: {
        cell: MRT_Cell<TData, MRT_CellValue>
        column: MRT_Column<TData, MRT_CellValue>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
  mantineEditTextInputProps?:
    | ((props: {
        cell: MRT_Cell<TData, MRT_CellValue>
        column: MRT_Column<TData, MRT_CellValue>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineExpandAllButtonProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineExpandButtonProps?:
    | ((props: {
        renderedRowIndex?: number
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineFilterAutocompleteProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<AutocompleteProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<AutocompleteProps>)
  mantineFilterCheckboxProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<CheckboxProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<CheckboxProps>)
  mantineFilterDateInputProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>)
  mantineFilterMultiSelectProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<MultiSelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<MultiSelectProps>)
  mantineFilterRangeSliderProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<RangeSliderProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<RangeSliderProps>)
  mantineFilterSelectProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<SelectProps>)
  mantineFilterTextInputProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineHighlightProps?:
    | ((props: {
        cell: MRT_Cell<TData, MRT_CellValue>
        column: MRT_Column<TData, MRT_CellValue>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLSpanElement> & Partial<HighlightProps>)
    | (HTMLPropsRef<HTMLSpanElement> & Partial<HighlightProps>)
  mantineLoadingOverlayProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<LoadingOverlayProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<LoadingOverlayProps>)
  mantinePaginationProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => Partial<HTMLPropsRef<HTMLDivElement> & MRT_PaginationProps>)
    | Partial<HTMLPropsRef<HTMLDivElement> & MRT_PaginationProps>
  mantinePaperProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & PaperProps)
    | (HTMLPropsRef<HTMLDivElement> & PaperProps)
  mantineProgressProps?:
    | ((props: {
        isTopToolbar: boolean
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & ProgressProps)
    | (HTMLPropsRef<HTMLDivElement> & ProgressProps)
  mantineRowDragHandleProps?:
    | ((props: {
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
    | (HTMLPropsRef<HTMLButtonElement> & Partial<ActionIconProps>)
  mantineSearchTextInputProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
    | (HTMLPropsRef<HTMLInputElement> & Partial<TextInputProps>)
  mantineSelectAllCheckboxProps?:
    | ((CheckboxProps | RadioProps | SwitchProps) &
        HTMLPropsRef<HTMLInputElement>)
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => (CheckboxProps | RadioProps | SwitchProps) &
        HTMLPropsRef<HTMLInputElement>)
  mantineSelectCheckboxProps?:
    | ((CheckboxProps | RadioProps | SwitchProps) &
        HTMLPropsRef<HTMLInputElement>)
    | ((props: {
        renderedRowIndex?: number
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => (CheckboxProps | RadioProps | SwitchProps) &
        HTMLPropsRef<HTMLInputElement>)
  mantineSkeletonProps?:
    | ((props: {
        cell: MRT_Cell<TData, MRT_CellValue>
        column: MRT_Column<TData, MRT_CellValue>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & SkeletonProps)
    | (HTMLPropsRef<HTMLDivElement> & SkeletonProps)
  mantineTableBodyCellProps?:
    | ((props: {
        cell: MRT_Cell<TData, MRT_CellValue>
        column: MRT_Column<TData, MRT_CellValue>
        renderedColumnIndex?: number
        renderedRowIndex?: number
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableTdProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableTdProps)
  mantineTableBodyProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableSectionElement> & TableTbodyProps)
    | (HTMLPropsRef<HTMLTableSectionElement> & TableTbodyProps)
  mantineTableBodyRowProps?:
    | ((props: {
        isDetailPanel?: boolean
        renderedRowIndex?: number
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
    | (HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
  mantineTableContainerProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => BoxProps & HTMLPropsRef<HTMLDivElement>)
    | (BoxProps & HTMLPropsRef<HTMLDivElement>)
  mantineTableFooterCellProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableThProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableThProps)
  mantineTableFooterProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableSectionElement> & TableTfootProps)
    | (HTMLPropsRef<HTMLTableSectionElement> & TableTfootProps)
  mantineTableFooterRowProps?:
    | ((props: {
        footerGroup: MRT_HeaderGroup<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
    | (HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
  mantineTableHeadCellProps?:
    | ((props: {
        column: MRT_Column<TData, MRT_CellValue>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableCellElement> & TableThProps)
    | (HTMLPropsRef<HTMLTableCellElement> & TableThProps)
  mantineTableHeadProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableSectionElement> & TableTheadProps)
    | (HTMLPropsRef<HTMLTableSectionElement> & TableTheadProps)
  mantineTableHeadRowProps?:
    | ((props: {
        headerGroup: MRT_HeaderGroup<TData>
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
    | (HTMLPropsRef<HTMLTableRowElement> & TableTrProps)
  mantineTableProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLTableElement> & TableProps)
    | (HTMLPropsRef<HTMLTableElement> & TableProps)
  mantineToolbarAlertBannerBadgeProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<BadgeProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<BadgeProps>)
  mantineToolbarAlertBannerProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => HTMLPropsRef<HTMLDivElement> & Partial<AlertProps>)
    | (HTMLPropsRef<HTMLDivElement> & Partial<AlertProps>)
  mantineTopToolbarProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => BoxProps & HTMLPropsRef<HTMLDivElement>)
    | (BoxProps & HTMLPropsRef<HTMLDivElement>)
  /**
   * Memoize cells, rows, or the entire table body to potentially improve render performance.
   *
   * @warning This will break some dynamic rendering features. See the memoization guide for more info:
   * @link https://www.mantine-react-table.com/docs/guides/memoize-components
   */
  memoMode?: 'cells' | 'rows' | 'table-body'
  onColumnFilterFnsChange?: OnChangeFn<{ [key: string]: MRT_FilterOption }>
  onCreatingRowCancel?: (props: {
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => void
  onCreatingRowChange?: OnChangeFn<MRT_Row<TData> | null>
  onCreatingRowSave?: (props: {
    exitCreatingMode: () => void
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
    values: Record<LiteralUnion<DeepKeys<TData> & string>, any>
  }) => void
  onDensityChange?: OnChangeFn<MRT_DensityState>
  onDraggingColumnChange?: OnChangeFn<MRT_Column<TData> | null>
  onDraggingRowChange?: OnChangeFn<MRT_Row<TData> | null>
  onEditingCellChange?: OnChangeFn<MRT_Cell<TData> | null>
  onEditingRowCancel?: (props: {
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => void
  onEditingRowChange?: OnChangeFn<MRT_Row<TData> | null>
  onEditingRowSave?: (props: {
    exitEditingMode: () => void
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
    values: Record<LiteralUnion<DeepKeys<TData> & string>, any>
  }) => Promise<void> | void
  onGlobalFilterFnChange?: OnChangeFn<MRT_FilterOption>
  onHoveredColumnChange?: OnChangeFn<null | Partial<MRT_Column<TData>>>
  onHoveredRowChange?: OnChangeFn<null | Partial<MRT_Row<TData>>>
  onIsFullScreenChange?: OnChangeFn<boolean>
  onShowAlertBannerChange?: OnChangeFn<boolean>
  onShowColumnFiltersChange?: OnChangeFn<boolean>
  onShowGlobalFilterChange?: OnChangeFn<boolean>
  onShowToolbarDropZoneChange?: OnChangeFn<boolean>
  paginationDisplayMode?: 'custom' | 'default' | 'pages'
  positionActionsColumn?: 'first' | 'last'
  positionCreatingRow?: 'bottom' | 'top' | number
  positionExpandColumn?: 'first' | 'last'
  positionGlobalFilter?: 'left' | 'none' | 'right'
  positionPagination?: 'both' | 'bottom' | 'none' | 'top'
  positionToolbarAlertBanner?: 'bottom' | 'head-overlay' | 'none' | 'top'
  positionToolbarDropZone?: 'both' | 'bottom' | 'none' | 'top'
  renderBottomToolbar?:
    | ((props: { table: MRT_TableInstance<TData> }) => ReactNode)
    | ReactNode
  renderBottomToolbarCustomActions?: (props: {
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderColumnActionsMenuItems?: (props: {
    column: MRT_Column<TData, MRT_CellValue>
    internalColumnMenuItems: ReactNode
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderColumnFilterModeMenuItems?: (props: {
    column: MRT_Column<TData, MRT_CellValue>
    internalFilterOptions: Array<MRT_InternalFilterOption>
    onSelectFilterMode: (filterMode: MRT_FilterOption) => void
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderCreateRowModalContent?: (props: {
    internalEditComponents: Array<ReactNode>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderDetailPanel?: (props: {
    internalEditComponents: Array<ReactNode>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderEditRowModalContent?: (props: {
    internalEditComponents: Array<ReactNode>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderEmptyRowsFallback?: (props: {
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderGlobalFilterModeMenuItems?: (props: {
    internalFilterOptions: Array<MRT_InternalFilterOption>
    onSelectFilterMode: (filterMode: MRT_FilterOption) => void
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderRowActionMenuItems?: (props: {
    renderedRowIndex?: number
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderRowActions?: (props: {
    cell: MRT_Cell<TData, MRT_CellValue>
    renderedRowIndex?: number
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderToolbarAlertBannerContent?: (props: {
    groupedAlert: null | ReactNode
    selectedAlert: null | ReactNode
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderToolbarInternalActions?: (props: {
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderTopToolbar?:
    | ((props: { table: MRT_TableInstance<TData> }) => ReactNode)
    | ReactNode
  renderTopToolbarCustomActions?: (props: {
    table: MRT_TableInstance<TData>
  }) => ReactNode
  rowCount?: number
  rowNumberDisplayMode?: 'original' | 'static'
  rowPinningDisplayMode?:
    | 'bottom'
    | 'select-bottom'
    | 'select-sticky'
    | 'select-top'
    | 'sticky'
    | 'top'
    | 'top-and-bottom'
  rowVirtualizerInstanceRef?: MutableRefObject<null | Virtualizer<
    HTMLDivElement,
    HTMLTableRowElement
  >>
  rowVirtualizerOptions?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>
  selectAllMode?: 'all' | 'page'
  selectDisplayMode?: 'checkbox' | 'radio' | 'switch'
  /**
   * Manage state externally any way you want, then pass it back into MRT.
   */
  state?: Partial<MRT_TableState<TData>>
} & Omit<
  Partial<TableOptions<StockFeatures, TData>>,
  | 'columns'
  | 'data'
  | 'defaultColumn'
  | 'enableRowSelection'
  | 'expandRowsFn'
  | 'getRowId'
  | 'globalFilterFn'
  | 'initialState'
  | 'onStateChange'
  | 'state'
>
