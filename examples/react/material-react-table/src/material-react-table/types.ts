import type {
  AccessorFn,
  AggregationFnDef,
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
  PaginationState,
  ReactTable,
  Row,
  RowModel,
  RowSelectionState,
  SortFn,
  SortingState,
  StockFeatures,
  TableOptions,
  TableState,
  Updater,
} from '@tanstack/react-table'
import type { MRT_Features } from './features/mrtFeatures'
import type {
  VirtualItem,
  Virtualizer,
  VirtualizerOptions,
} from '@tanstack/react-virtual'
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

export type MRT_RowModel<TData extends MRT_RowData> = RowModel<
  MRT_Features,
  TData
>

// ---------------------------------------------------------------------------
// Core-backed instance / options / state / column / row / cell / header types.
//
// These were hand-maintained `Omit`-and-retype wrappers over the v9 core types.
// Now that every MRT state slice, API, option, and column-def field is declared
// on the v9 feature maps (see `./features/*`), the core types instantiated with
// `MRT_Features` already carry the full MRT surface, so these collapse to thin
// definitions. The `MRT_*` names are kept as the stable seam components import.
// ---------------------------------------------------------------------------

export type MRT_TableInstance<TData extends MRT_RowData> = Omit<
  ReactTable<MRT_Features, TData>,
  'options' | 'state'
> & {
  // `options` is narrowed to the resolved/stateful shape (icons, localization,
  // mrtTheme guaranteed present; `state` populated) that MRT's hook produces.
  options: MRT_StatefulTableOptions<TData>
  state: MRT_TableState<TData>
}

export type MRT_DefinedTableOptions<TData extends MRT_RowData> =
  MRT_TableOptions<TData> & {
    // `features` is optional on the user-facing `MRT_TableOptions` (the hook
    // injects `mrtFeatures`), but required once resolved so the stateful options
    // stay assignable to core `TableOptions<MRT_Features>`.
    features: MRT_Features
    icons: MRT_Icons
    localization: MRT_Localization
    mrtTheme: Required<MRT_Theme>
  }

export type MRT_StatefulTableOptions<TData extends MRT_RowData> =
  MRT_DefinedTableOptions<TData> & {
    state: MRT_TableState<TData>
  }

// State slices are non-generic on the feature map; the `TData` param is kept for
// call-site arity (`MRT_TableState<Person>`) via a no-op conditional.
export type MRT_TableState<TData extends MRT_RowData> = TData extends any
  ? TableState<MRT_Features>
  : never

export type MRT_ColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = ColumnDef<MRT_Features, TData, TValue>

export type MRT_DisplayColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = MRT_ColumnDef<TData, TValue>

export type MRT_IdentifiedColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = MRT_DisplayColumnDef<TData, TValue>

export type MRT_AccessorFnColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = MRT_DisplayColumnDef<TData, TValue> & {
  accessorFn: (originalRow: TData) => TValue
}

export type MRT_AccessorKeyColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = MRT_DisplayColumnDef<TData, TValue> & {
  accessorKey: DeepKeys<TData> | (string & {})
}

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
> = MRT_ColumnDef<TData, TValue> & {
  _filterFn: MRT_FilterOption
  defaultDisplayColumn: Partial<MRT_ColumnDef<TData, TValue>>
  id: string
}

export type MRT_Column<TData extends MRT_RowData, TValue = unknown> = Column<
  MRT_Features,
  TData,
  TValue
>

export type MRT_Header<TData extends MRT_RowData> = Header<
  MRT_Features,
  TData,
  unknown
>

export type MRT_HeaderGroup<TData extends MRT_RowData> = HeaderGroup<
  MRT_Features,
  TData
>

export type MRT_Row<TData extends MRT_RowData> = Row<MRT_Features, TData>

export type MRT_Cell<TData extends MRT_RowData, TValue = unknown> = Cell<
  MRT_Features,
  TData,
  TValue
>

export type MRT_AggregationOption = string & keyof typeof MRT_AggregationFns

export type MRT_AggregationFn<TData extends MRT_RowData> =
  | AggregationFnDef<StockFeatures, TData, any, any>
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
 * `columns` and `data` are the only required table options; MRT's ~170 other
 * options now live on `TableOptions<MRT_Features, TData>` via the feature maps
 * (`./features/mrtConfigFeature.ts` plus the stateful `mrt*Feature` files), so
 * this is a thin alias.
 *
 * @link https://www.material-react-table.com/docs/api/table-options
 */
export type MRT_TableOptions<TData extends MRT_RowData> = Omit<
  TableOptions<MRT_Features, TData>,
  'features'
> & { features?: MRT_Features }
