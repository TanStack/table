import type { Dispatch, ReactNode, RefObject, SetStateAction } from 'react'
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
import type { AlertProps } from '@mui/material/Alert'
import type { AutocompleteProps } from '@mui/material/Autocomplete'
import type { BoxProps } from '@mui/material/Box'
import type { ButtonProps } from '@mui/material/Button'
import type { CheckboxProps } from '@mui/material/Checkbox'
import type { ChipProps } from '@mui/material/Chip'
import type { CircularProgressProps } from '@mui/material/CircularProgress'
import type { DialogProps } from '@mui/material/Dialog'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { LinearProgressProps } from '@mui/material/LinearProgress'
import type { PaginationProps } from '@mui/material/Pagination'
import type { PaperProps } from '@mui/material/Paper'
import type { RadioProps } from '@mui/material/Radio'
import type { SelectProps } from '@mui/material/Select'
import type { SkeletonProps } from '@mui/material/Skeleton'
import type { SliderProps } from '@mui/material/Slider'
import type { TableProps } from '@mui/material/Table'
import type { TableBodyProps } from '@mui/material/TableBody'
import type { TableCellProps } from '@mui/material/TableCell'
import type { TableContainerProps } from '@mui/material/TableContainer'
import type { TableFooterProps } from '@mui/material/TableFooter'
import type { TableHeadProps } from '@mui/material/TableHead'
import type { TableRowProps } from '@mui/material/TableRow'
import type { TextFieldProps } from '@mui/material/TextField'
import type { Theme } from '@mui/material/styles'
import type {
  DatePickerProps,
  DateTimePickerProps,
  TimePickerProps,
} from '@mui/x-date-pickers'
import type { MRT_AggregationFns } from './fns/aggregationFns'
import type { MRT_FilterFns } from './fns/filterFns'
import type { MRT_SortFns } from './fns/sortingFns'
import type { MRT_Icons } from './icons'

export type { MRT_Icons }
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>)

export type Prettify<T> = { [K in keyof T]: T[K] } & unknown

export type Xor<A, B> =
  | Prettify<A & { [k in keyof B]?: never }>
  | Prettify<B & { [k in keyof A]?: never }>

export type DropdownOption =
  | {
      label?: string
      value: any
    }
  | string

export type MRT_DensityState = 'comfortable' | 'compact' | 'spacious'

export type MRT_ColumnFilterFnsState = Record<string, MRT_FilterOption>

export type MRT_RowData = Record<string, any>

export type MRT_ColumnFiltersState = ColumnFiltersState
export type MRT_ColumnOrderState = ColumnOrderState
export type MRT_ColumnPinningState = ColumnPinningState
export type MRT_ColumnResizingState = ColumnResizingState
export type MRT_ColumnSizingState = ColumnSizingState
export type MRT_ExpandedState = ExpandedState
export type MRT_GroupingState = GroupingState
export type MRT_PaginationState = PaginationState
export type MRT_RowSelectionState = RowSelectionState
export type MRT_SortingState = SortingState
export type MRT_Updater<T> = Updater<T>
export type MRT_VirtualItem = VirtualItem
export type MRT_ColumnVisibilityState = ColumnVisibilityState

export type MRT_VirtualizerOptions<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
> = VirtualizerOptions<TScrollElement, TItemElement>

export type MRT_ColumnVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualColumns: Array<MRT_VirtualItem>
  virtualPaddingLeft?: number
  virtualPaddingRight?: number
}

export type MRT_RowVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualRows: Array<MRT_VirtualItem>
}

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
  // language of the localization as BCP 47 language tag for number formatting
  language: string
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

export interface MRT_Theme {
  baseBackgroundColor: string
  cellNavigationOutlineColor: string
  draggingBorderColor: string
  matchHighlightColor: string
  menuBackgroundColor: string
  pinnedRowBackgroundColor: string
  selectedRowBackgroundColor: string
}

export interface MRT_RowModel<TData extends MRT_RowData> {
  flatRows: Array<MRT_Row<TData>>
  rows: Array<MRT_Row<TData>>
  rowsById: { [key: string]: MRT_Row<TData> }
}

export type MRT_TableInstance<TData extends MRT_RowData> = Omit<
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
  | 'getFooterGroups'
  | 'getHeaderGroups'
  | 'getLeafHeaders'
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
> & {
  getAllColumns: () => Array<MRT_Column<TData>>
  getAllFlatColumns: () => Array<MRT_Column<TData>>
  getAllLeafColumns: () => Array<MRT_Column<TData>>
  getBottomRows: () => Array<MRT_Row<TData>>
  getCenterLeafColumns: () => Array<MRT_Column<TData>>
  getCenterRows: () => Array<MRT_Row<TData>>
  getColumn: (columnId: string) => MRT_Column<TData>
  getExpandedRowModel: () => MRT_RowModel<TData>
  getFlatHeaders: () => Array<MRT_Header<TData>>
  getFooterGroups: () => Array<MRT_HeaderGroup<TData>>
  getHeaderGroups: () => Array<MRT_HeaderGroup<TData>>
  getLeafHeaders: () => Array<MRT_Header<TData>>
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
  /**
   * The current full table state. Populated by useTable's `state => state` selector.
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
  refs: {
    actionCellRef: RefObject<HTMLTableCellElement | null>
    bottomToolbarRef: RefObject<HTMLDivElement | null>
    editInputRefs: RefObject<Record<string, HTMLInputElement> | null>
    filterInputRefs: RefObject<Record<string, HTMLInputElement> | null>
    lastSelectedRowId: RefObject<null | string>
    searchInputRef: RefObject<HTMLInputElement | null>
    tableContainerRef: RefObject<HTMLDivElement | null>
    tableFooterRef: RefObject<HTMLTableSectionElement | null>
    tableHeadCellRefs: RefObject<Record<string, HTMLTableCellElement> | null>
    tableHeadRef: RefObject<HTMLTableSectionElement | null>
    tablePaperRef: RefObject<HTMLDivElement | null>
    topToolbarRef: RefObject<HTMLDivElement | null>
  }
  setActionCell: Dispatch<SetStateAction<MRT_Cell<TData> | null>>
  setColumnFilterFns: Dispatch<SetStateAction<MRT_ColumnFilterFnsState>>
  setCreatingRow: Dispatch<SetStateAction<MRT_Row<TData> | null | true>>
  setDensity: Dispatch<SetStateAction<MRT_DensityState>>
  setDraggingColumn: Dispatch<SetStateAction<MRT_Column<TData> | null>>
  setDraggingRow: Dispatch<SetStateAction<MRT_Row<TData> | null>>
  setEditingCell: Dispatch<SetStateAction<MRT_Cell<TData> | null>>
  setEditingRow: Dispatch<SetStateAction<MRT_Row<TData> | null>>
  setGlobalFilterFn: Dispatch<SetStateAction<MRT_FilterOption>>
  setHoveredColumn: Dispatch<SetStateAction<Partial<MRT_Column<TData>> | null>>
  setHoveredRow: Dispatch<SetStateAction<Partial<MRT_Row<TData>> | null>>
  setIsFullScreen: Dispatch<SetStateAction<boolean>>
  setShowAlertBanner: Dispatch<SetStateAction<boolean>>
  setShowColumnFilters: Dispatch<SetStateAction<boolean>>
  setShowGlobalFilter: Dispatch<SetStateAction<boolean>>
  setShowToolbarDropZone: Dispatch<SetStateAction<boolean>>
}

export type MRT_DefinedTableOptions<TData extends MRT_RowData> = Omit<
  MRT_TableOptions<TData>,
  'icons' | 'localization' | 'mrtTheme'
> & {
  icons: MRT_Icons
  localization: MRT_Localization
  mrtTheme: Required<MRT_Theme>
}

export type MRT_StatefulTableOptions<TData extends MRT_RowData> =
  MRT_DefinedTableOptions<TData> & {
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
  }

export interface MRT_TableState<
  TData extends MRT_RowData,
> extends TableState<StockFeatures> {
  actionCell?: MRT_Cell<TData> | null
  columnFilterFns: MRT_ColumnFilterFnsState
  creatingRow: MRT_Row<TData> | null
  density: MRT_DensityState
  draggingColumn: MRT_Column<TData> | null
  draggingRow: MRT_Row<TData> | null
  editingCell: MRT_Cell<TData> | null
  editingRow: MRT_Row<TData> | null
  globalFilterFn: MRT_FilterOption
  hoveredColumn: Partial<MRT_Column<TData>> | null
  hoveredRow: Partial<MRT_Row<TData>> | null
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
}

export interface MRT_ColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> extends Omit<
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
> {
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify a function here to point to the correct property in the data object.
   *
   * @example accessorFn: (row) => row.username
   */
  accessorFn?: (originalRow: TData) => TValue
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify which key in the row this column should use to access the correct data.
   * Also supports Deep Key Dot Notation.
   *
   * @example accessorKey: 'username' //simple
   * @example accessorKey: 'name.firstName' //deep key dot notation
   */
  accessorKey?: DeepKeys<TData> | (string & {})
  AggregatedCell?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
    staticColumnIndex?: number
    staticRowIndex?: number
  }) => ReactNode
  aggregationFn?: Array<MRT_AggregationFn<TData>> | MRT_AggregationFn<TData>
  Cell?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    renderedCellValue: ReactNode
    row: MRT_Row<TData>
    rowRef?: RefObject<HTMLTableRowElement | null>
    staticColumnIndex?: number
    staticRowIndex?: number
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
    LiteralUnion<string & MRT_FilterOption>
  > | null
  columns?: Array<MRT_ColumnDef<TData, TValue>>
  Edit?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  editSelectOptions?:
    | ((props: {
        cell: MRT_Cell<TData, TValue>
        column: MRT_Column<TData>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => Array<DropdownOption>)
    | Array<DropdownOption>
  editVariant?: 'select' | 'text'
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: MRT_Cell<TData>) => 'context-menu' | boolean)
    | boolean
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
  filterSelectOptions?: Array<DropdownOption>
  filterVariant?:
    | 'autocomplete'
    | 'checkbox'
    | 'date'
    | 'date-range'
    | 'datetime'
    | 'datetime-range'
    | 'multi-select'
    | 'range'
    | 'range-slider'
    | 'select'
    | 'text'
    | 'time'
    | 'time-range'
  /**
   * footer must be a string. If you want custom JSX to render the footer, you can also specify a `Footer` option. (Capital F)
   */
  footer?: string
  Footer?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        footer: MRT_Header<TData>
        table: MRT_TableInstance<TData>
      }) => ReactNode)
    | ReactNode
  GroupedCell?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
    staticColumnIndex?: number
    staticRowIndex?: number
  }) => ReactNode
  /**
   * If `layoutMode` is `'grid'` or `'grid-no-grow'`, you can specify the flex grow value for individual columns to still grow and take up remaining space, or set to `false`/0 to not grow.
   */
  grow?: boolean | number
  /**
   * header must be a string. If you want custom JSX to render the header, you can also specify a `Header` option. (Capital H)
   */
  header: string
  Header?:
    | ((props: {
        column: MRT_Column<TData, TValue>
        header: MRT_Header<TData>
        table: MRT_TableInstance<TData>
      }) => ReactNode)
    | ReactNode
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   *
   * If you have also specified an `accessorFn`, MRT still needs to have a valid `id` to be able to identify the column uniquely.
   *
   * `id` defaults to the `accessorKey` or `header` if not specified.
   *
   * @default gets set to the same value as `accessorKey` by default
   */
  id?: LiteralUnion<string & keyof TData>
  muiColumnActionsButtonProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiColumnDragHandleProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiCopyButtonProps?:
    | ((props: {
        cell: MRT_Cell<TData, TValue>
        column: MRT_Column<TData>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => ButtonProps)
    | ButtonProps
  muiEditTextFieldProps?:
    | ((props: {
        cell: MRT_Cell<TData, TValue>
        column: MRT_Column<TData>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => TextFieldProps)
    | TextFieldProps
  muiFilterAutocompleteProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => AutocompleteProps<any, any, any, any>)
    | AutocompleteProps<any, any, any, any>
  muiFilterCheckboxProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => CheckboxProps)
    | CheckboxProps
  muiFilterDatePickerProps?:
    | ((props: {
        column: MRT_Column<TData>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => DatePickerProps)
    | DatePickerProps
  muiFilterDateTimePickerProps?:
    | ((props: {
        column: MRT_Column<TData>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => DateTimePickerProps)
    | DateTimePickerProps
  muiFilterSliderProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => SliderProps)
    | SliderProps
  muiFilterTextFieldProps?:
    | ((props: {
        column: MRT_Column<TData>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => TextFieldProps)
    | TextFieldProps
  muiFilterTimePickerProps?:
    | ((props: {
        column: MRT_Column<TData>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => TimePickerProps)
    | TimePickerProps
  muiTableBodyCellProps?:
    | ((props: {
        cell: MRT_Cell<TData, TValue>
        column: MRT_Column<TData>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableFooterCellProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableHeadCellProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => TableCellProps)
    | TableCellProps
  PlaceholderCell?: (props: {
    cell: MRT_Cell<TData, TValue>
    column: MRT_Column<TData, TValue>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderCellActionMenuItems?: (props: {
    cell: MRT_Cell<TData>
    closeMenu: () => void
    column: MRT_Column<TData>
    internalMenuItems: Array<ReactNode>
    row: MRT_Row<TData>
    staticColumnIndex?: number
    staticRowIndex?: number
    table: MRT_TableInstance<TData>
  }) => Array<ReactNode>
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void
    column: MRT_Column<TData>
    internalColumnMenuItems: Array<ReactNode>
    table: MRT_TableInstance<TData>
  }) => Array<ReactNode>
  renderColumnFilterModeMenuItems?: (props: {
    column: MRT_Column<TData>
    internalFilterOptions: Array<MRT_InternalFilterOption>
    onSelectFilterMode: (filterMode: MRT_FilterOption) => void
    table: MRT_TableInstance<TData>
  }) => Array<ReactNode>
  sortFn?: MRT_SortFn<TData>
  visibleInShowHideMenu?: boolean
}

export type MRT_DisplayColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = Omit<MRT_ColumnDef<TData, TValue>, 'accessorFn' | 'accessorKey'>

/**
 * A data column with an `id` and an optional `header`. Used as the input shape
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
 * Union of `MRT_AccessorFnColumnDef` and `MRT_AccessorKeyColumnDef`. Mirrors
 * v9's `AccessorColumnDef`.
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
> = Omit<MRT_ColumnDef<TData, TValue>, 'defaultDisplayColumn' | 'id'> & {
  _filterFn: MRT_FilterOption
  defaultDisplayColumn: Partial<MRT_ColumnDef<TData, TValue>>
  id: string
}

export type MRT_Column<TData extends MRT_RowData, TValue = unknown> = Omit<
  Column<StockFeatures, TData, TValue>,
  'columnDef' | 'columns' | 'filterFn' | 'footer' | 'header'
> & {
  columnDef: MRT_DefinedColumnDef<TData, TValue>
  columns?: Array<MRT_Column<TData, TValue>>
  filterFn?: MRT_FilterFn<TData>
  footer: string
  header: string
}

export type MRT_Header<TData extends MRT_RowData> = Omit<
  Header<StockFeatures, TData, unknown>,
  'column'
> & {
  column: MRT_Column<TData>
}

export type MRT_HeaderGroup<TData extends MRT_RowData> = Omit<
  HeaderGroup<StockFeatures, TData>,
  'headers'
> & {
  headers: Array<MRT_Header<TData>>
}

export type MRT_Row<TData extends MRT_RowData> = Omit<
  Row<StockFeatures, TData>,
  | '_valuesCache'
  | 'getAllCells'
  | 'getParentRow'
  | 'getParentRows'
  | 'getRow'
  | 'getVisibleCells'
  | 'subRows'
> & {
  _valuesCache: Record<LiteralUnion<string & DeepKeys<TData>>, any>
  getAllCells: () => Array<MRT_Cell<TData>>
  getParentRow: () => MRT_Row<TData> | null
  getParentRows: () => Array<MRT_Row<TData>>
  getRow: () => MRT_Row<TData>
  getVisibleCells: () => Array<MRT_Cell<TData>>
  subRows?: Array<MRT_Row<TData>>
}

export type MRT_Cell<TData extends MRT_RowData, TValue = unknown> = Omit<
  Cell<StockFeatures, TData, TValue>,
  'column' | 'row'
> & {
  column: MRT_Column<TData, TValue>
  row: MRT_Row<TData>
}

export type MRT_AggregationOption = string & keyof typeof MRT_AggregationFns

export type MRT_AggregationFn<TData extends MRT_RowData> =
  | AggregationFn<StockFeatures, TData>
  | MRT_AggregationOption

export type MRT_SortingOption = LiteralUnion<string & keyof typeof MRT_SortFns>

export type MRT_SortFn<TData extends MRT_RowData> =
  | MRT_SortingOption
  | SortFn<StockFeatures, TData>

export type MRT_FilterOption = LiteralUnion<string & keyof typeof MRT_FilterFns>

export type MRT_FilterFn<TData extends MRT_RowData> =
  | FilterFn<StockFeatures, TData>
  | MRT_FilterOption

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

/**
 * `columns` and `data` props are the only required props, but there are over 170 other optional props.
 *
 * See more info on creating columns and data on the official docs site:
 * @link https://www.material-react-table.com/docs/getting-started/usage
 *
 * See the full props list on the official docs site:
 * @link https://www.material-react-table.com/docs/api/props
 */
export interface MRT_TableOptions<TData extends MRT_RowData> extends Omit<
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
> {
  /**
   * Custom aggregation functions to apply to the table. These get merged with MRT's
   * built-ins (`mean`, `min`, `max`, etc.) and passed into `createGroupedRowModel(...)`.
   * @link https://www.material-react-table.com/docs/api/table-options#aggregationFns
   */
  aggregationFns?: Record<string, AggregationFn<StockFeatures, TData>>
  /**
   * Custom filter functions to apply to the table. These get merged with MRT's
   * built-ins (`fuzzy`, `contains`, `between`, etc.) and passed into
   * `createFilteredRowModel(...)`.
   * @link https://www.material-react-table.com/docs/api/table-options#filterFns
   */
  filterFns?: Record<string, FilterFn<StockFeatures, TData>>
  /**
   * Custom sort functions to apply to the table. These get merged with MRT's
   * built-ins (`alphanumeric`, `fuzzy`, etc.) and passed into
   * `createSortedRowModel(...)`.
   * @link https://www.material-react-table.com/docs/api/table-options#sortFns
   */
  sortFns?: Record<string, SortFn<StockFeatures, TData>>
  columnFilterDisplayMode?: 'custom' | 'popover' | 'subheader'
  columnFilterModeOptions?: Array<
    LiteralUnion<string & MRT_FilterOption>
  > | null
  /**
   * The columns to display in the table. `accessorKey`s or `accessorFn`s must match keys in the `data` table option.
   *
   * See more info on creating columns on the official docs site:
   * @link https://www.material-react-table.com/docs/guides/data-columns
   * @link https://www.material-react-table.com/docs/guides/display-columns
   *
   * See all Columns Options on the official docs site:
   * @link https://www.material-react-table.com/docs/api/column-options
   */
  columns: Array<MRT_ColumnDef<TData, any>>
  columnVirtualizerInstanceRef?: RefObject<MRT_ColumnVirtualizer | null>
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
   * @link https://www.material-react-table.com/docs/getting-started/usage
   */
  data: Array<TData>
  /**
   * Instead of specifying a bunch of the same options for each column, you can just change an option in the `defaultColumn` table option to change a default option for all columns.
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
  enableCellActions?: ((cell: MRT_Cell<TData>) => boolean) | boolean
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: MRT_Cell<TData>) => 'context-menu' | boolean)
    | boolean
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
  enableKeyboardShortcuts?: boolean
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
  ) => string
  globalFilterFn?: MRT_FilterOption
  globalFilterModeOptions?: Array<MRT_FilterOption> | null
  icons?: Partial<MRT_Icons>
  id?: string
  initialState?: Partial<MRT_TableState<TData>>
  /**
   * Changes which kind of CSS layout is used to render the table. `semantic` uses default semantic HTML elements, while `grid` adds CSS grid and flexbox styles
   */
  layoutMode?: 'grid' | 'grid-no-grow' | 'semantic'
  /**
   * Pass in either a locale imported from `material-react-table/locales/*` or a custom locale object.
   *
   * See the localization (i18n) guide for more info:
   * @link https://www.material-react-table.com/docs/guides/localization
   */
  localization?: Partial<MRT_Localization>
  /**
   * Memoize cells, rows, or the entire table body to potentially improve render performance.
   *
   * @warning This will break some dynamic rendering features. See the memoization guide for more info:
   * @link https://www.material-react-table.com/docs/guides/memoize-components
   */
  memoMode?: 'cells' | 'rows' | 'table-body'
  mrtTheme?: ((theme: Theme) => Partial<MRT_Theme>) | Partial<MRT_Theme>
  muiBottomToolbarProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => BoxProps)
    | BoxProps
  muiCircularProgressProps?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => CircularProgressProps & { Component?: ReactNode })
    | (CircularProgressProps & { Component?: ReactNode })
  muiColumnActionsButtonProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiColumnDragHandleProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiCopyButtonProps?:
    | ((props: {
        cell: MRT_Cell<TData>
        column: MRT_Column<TData>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => ButtonProps)
    | ButtonProps
  muiCreateRowModalProps?:
    | ((props: {
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => DialogProps)
    | DialogProps
  muiDetailPanelProps?:
    | ((props: {
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => TableCellProps)
    | TableCellProps
  muiEditRowDialogProps?:
    | ((props: {
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => DialogProps)
    | DialogProps
  muiEditTextFieldProps?:
    | ((props: {
        cell: MRT_Cell<TData>
        column: MRT_Column<TData>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => TextFieldProps)
    | TextFieldProps
  muiExpandAllButtonProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => IconButtonProps)
    | IconButtonProps
  muiExpandButtonProps?:
    | ((props: {
        row: MRT_Row<TData>
        staticRowIndex?: number
        table: MRT_TableInstance<TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiFilterAutocompleteProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => AutocompleteProps<any, any, any, any>)
    | AutocompleteProps<any, any, any, any>
  muiFilterCheckboxProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => CheckboxProps)
    | CheckboxProps
  muiFilterDatePickerProps?:
    | ((props: {
        column: MRT_Column<TData>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => DatePickerProps)
    | DatePickerProps
  muiFilterDateTimePickerProps?:
    | ((props: {
        column: MRT_Column<TData>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => DateTimePickerProps)
    | DateTimePickerProps
  muiFilterSliderProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => SliderProps)
    | SliderProps
  muiFilterTextFieldProps?:
    | ((props: {
        column: MRT_Column<TData>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => TextFieldProps)
    | TextFieldProps
  muiFilterTimePickerProps?:
    | ((props: {
        column: MRT_Column<TData>
        rangeFilterIndex?: number
        table: MRT_TableInstance<TData>
      }) => TimePickerProps)
    | TimePickerProps
  muiLinearProgressProps?:
    | ((props: {
        isTopToolbar: boolean
        table: MRT_TableInstance<TData>
      }) => LinearProgressProps)
    | LinearProgressProps
  muiPaginationProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => Partial<
        PaginationProps & {
          SelectProps?: Partial<SelectProps>
          disabled?: boolean
          rowsPerPageOptions?:
            | Array<{ label: string; value: number }>
            | Array<number>
          showRowsPerPage?: boolean
        }
      >)
    | Partial<
        PaginationProps & {
          SelectProps?: Partial<SelectProps>
          disabled?: boolean
          rowsPerPageOptions?:
            | Array<{ label: string; value: number }>
            | Array<number>
          showRowsPerPage?: boolean
        }
      >
  muiRowDragHandleProps?:
    | ((props: {
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiSearchTextFieldProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => TextFieldProps)
    | TextFieldProps
  muiSelectAllCheckboxProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => CheckboxProps)
    | CheckboxProps
  muiSelectCheckboxProps?:
    | ((props: {
        row: MRT_Row<TData>
        staticRowIndex?: number
        table: MRT_TableInstance<TData>
      }) => CheckboxProps | RadioProps)
    | (CheckboxProps | RadioProps)
  muiSkeletonProps?:
    | ((props: {
        cell: MRT_Cell<TData>
        column: MRT_Column<TData>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => SkeletonProps)
    | SkeletonProps
  muiTableBodyCellProps?:
    | ((props: {
        cell: MRT_Cell<TData>
        column: MRT_Column<TData>
        row: MRT_Row<TData>
        table: MRT_TableInstance<TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableBodyProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => TableBodyProps)
    | TableBodyProps
  muiTableBodyRowProps?:
    | ((props: {
        isDetailPanel?: boolean
        row: MRT_Row<TData>
        staticRowIndex: number
        table: MRT_TableInstance<TData>
      }) => TableRowProps)
    | TableRowProps
  muiTableContainerProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => TableContainerProps)
    | TableContainerProps
  muiTableFooterCellProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableFooterProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => TableFooterProps)
    | TableFooterProps
  muiTableFooterRowProps?:
    | ((props: {
        footerGroup: MRT_HeaderGroup<TData>
        table: MRT_TableInstance<TData>
      }) => TableRowProps)
    | TableRowProps
  muiTableHeadCellProps?:
    | ((props: {
        column: MRT_Column<TData>
        table: MRT_TableInstance<TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableHeadProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => TableHeadProps)
    | TableHeadProps
  muiTableHeadRowProps?:
    | ((props: {
        headerGroup: MRT_HeaderGroup<TData>
        table: MRT_TableInstance<TData>
      }) => TableRowProps)
    | TableRowProps
  muiTablePaperProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => PaperProps)
    | PaperProps
  muiTableProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => TableProps)
    | TableProps
  muiToolbarAlertBannerChipProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => ChipProps)
    | ChipProps
  muiToolbarAlertBannerProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => AlertProps)
    | AlertProps
  muiTopToolbarProps?:
    | ((props: { table: MRT_TableInstance<TData> }) => BoxProps)
    | BoxProps
  onActionCellChange?: OnChangeFn<MRT_Cell<TData> | null>
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
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>
  }) => Promise<void> | void
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
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>
  }) => Promise<void> | void
  onGlobalFilterFnChange?: OnChangeFn<MRT_FilterOption>
  onHoveredColumnChange?: OnChangeFn<Partial<MRT_Column<TData>> | null>
  onHoveredRowChange?: OnChangeFn<Partial<MRT_Row<TData>> | null>
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
  renderCaption?:
    | ((props: { table: MRT_TableInstance<TData> }) => ReactNode)
    | ReactNode
  renderCellActionMenuItems?: (props: {
    cell: MRT_Cell<TData>
    closeMenu: () => void
    column: MRT_Column<TData>
    internalMenuItems: Array<ReactNode>
    row: MRT_Row<TData>
    staticColumnIndex?: number
    staticRowIndex?: number
    table: MRT_TableInstance<TData>
  }) => Array<ReactNode>
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void
    column: MRT_Column<TData>
    internalColumnMenuItems: Array<ReactNode>
    table: MRT_TableInstance<TData>
  }) => Array<ReactNode>
  renderColumnFilterModeMenuItems?: (props: {
    column: MRT_Column<TData>
    internalFilterOptions: Array<MRT_InternalFilterOption>
    onSelectFilterMode: (filterMode: MRT_FilterOption) => void
    table: MRT_TableInstance<TData>
  }) => Array<ReactNode>
  renderCreateRowDialogContent?: (props: {
    internalEditComponents: Array<ReactNode>
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderDetailPanel?: (props: {
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderEditRowDialogContent?: (props: {
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
  }) => Array<ReactNode>
  renderRowActionMenuItems?: (props: {
    closeMenu: () => void
    row: MRT_Row<TData>
    staticRowIndex?: number
    table: MRT_TableInstance<TData>
  }) => Array<ReactNode> | undefined
  renderRowActions?: (props: {
    cell: MRT_Cell<TData>
    row: MRT_Row<TData>
    staticRowIndex?: number
    table: MRT_TableInstance<TData>
  }) => ReactNode
  renderToolbarAlertBannerContent?: (props: {
    groupedAlert: ReactNode | null
    selectedAlert: ReactNode | null
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
  rowNumberDisplayMode?: 'original' | 'static'
  rowPinningDisplayMode?:
    | 'bottom'
    | 'select-bottom'
    | 'select-sticky'
    | 'select-top'
    | 'sticky'
    | 'top'
    | 'top-and-bottom'
  rowVirtualizerInstanceRef?: RefObject<MRT_RowVirtualizer | null>
  rowVirtualizerOptions?:
    | ((props: {
        table: MRT_TableInstance<TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>
  selectAllMode?: 'all' | 'page'
  /**
   * Manage state externally any way you want, then pass it back into MRT.
   */
  state?: Partial<MRT_TableState<TData>>
}
