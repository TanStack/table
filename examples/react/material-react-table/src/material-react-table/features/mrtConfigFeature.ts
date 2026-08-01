import type { ReactNode, RefObject } from 'react'
import type {
  Cell,
  CellData,
  Column,
  DeepKeys,
  Header,
  HeaderGroup,
  Row,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '@tanstack/react-table'
import type { VirtualizerOptions } from '@tanstack/react-virtual'
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
import type {
  DropdownOption,
  LiteralUnion,
  MRT_ColumnVirtualizer,
  MRT_DisplayColumnDef,
  MRT_DisplayColumnIds,
  MRT_FilterOption,
  MRT_Icons,
  MRT_InternalFilterOption,
  MRT_Localization,
  MRT_RowVirtualizer,
  MRT_Theme,
} from '../types'

/**
 * A runtime no-op feature whose sole purpose is to move Material React Table's
 * option and column-def types onto v9's feature-map declaration-merging system.
 *
 * Rather than hand-writing `MRT_TableOptions` / `MRT_ColumnDef` wrapper
 * interfaces, the members below are merged into `TableOptions<MRT_Features, ...>`
 * and `ColumnDef<MRT_Features, ...>` via `TableOptions_FeatureMap` /
 * `ColumnDef_FeatureMap`. Core-owned options and members already declared by
 * sibling MRT features (the `onXChange` handlers, etc.) are intentionally left
 * out so the intersection stays conflict-free.
 */
export const mrtConfigFeature: TableFeature = {}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtConfigFeature: TableFeature
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtConfigFeature: MRT_TableOptions_Config<TFeatures, TData>
  }
  interface ColumnDef_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData,
  > {
    mrtConfigFeature: MRT_ColumnDef_Config<TFeatures, TData, TValue>
  }
}

export interface MRT_TableOptions_Config<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  columnFilterDisplayMode?: 'custom' | 'popover' | 'subheader'
  columnFilterModeOptions?: Array<
    LiteralUnion<string & MRT_FilterOption>
  > | null
  columnVirtualizerInstanceRef?: RefObject<MRT_ColumnVirtualizer | null>
  columnVirtualizerOptions?:
    | ((props: {
        table: Table<TFeatures, TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>
  createDisplayMode?: 'custom' | 'modal' | 'row'
  defaultDisplayColumn?: Partial<MRT_DisplayColumnDef<TData>>
  displayColumnDefOptions?: Partial<{
    [key in MRT_DisplayColumnIds]: Partial<MRT_DisplayColumnDef<TData>>
  }>
  editDisplayMode?: 'cell' | 'custom' | 'modal' | 'row' | 'table'
  enableBatchRowSelection?: boolean
  enableBottomToolbar?: boolean
  enableCellActions?:
    ((cell: Cell<TFeatures, TData, unknown>) => boolean) | boolean
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: Cell<TFeatures, TData, unknown>) => 'context-menu' | boolean)
    | boolean
  enableColumnActions?: boolean
  enableColumnDragging?: boolean
  enableColumnFilterModes?: boolean
  enableColumnOrdering?: boolean
  enableColumnVirtualization?: boolean
  enableDensityToggle?: boolean
  enableEditing?: ((row: Row<TFeatures, TData>) => boolean) | boolean
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
  enableRowVirtualization?: boolean
  enableSelectAll?: boolean
  enableStickyFooter?: boolean
  enableStickyHeader?: boolean
  enableTableFooter?: boolean
  enableTableHead?: boolean
  enableToolbarInternalActions?: boolean
  enableTopToolbar?: boolean
  globalFilterModeOptions?: Array<MRT_FilterOption> | null
  icons?: Partial<MRT_Icons>
  id?: string
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
    ((props: { table: Table<TFeatures, TData> }) => BoxProps) | BoxProps
  muiCircularProgressProps?:
    | ((props: {
        table: Table<TFeatures, TData>
      }) => CircularProgressProps & { Component?: ReactNode })
    | (CircularProgressProps & { Component?: ReactNode })
  muiColumnActionsButtonProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiColumnDragHandleProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiCopyButtonProps?:
    | ((props: {
        cell: Cell<TFeatures, TData, unknown>
        column: Column<TFeatures, TData, unknown>
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => ButtonProps)
    | ButtonProps
  muiCreateRowModalProps?:
    | ((props: {
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => DialogProps)
    | DialogProps
  muiDetailPanelProps?:
    | ((props: {
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => TableCellProps)
    | TableCellProps
  muiEditRowDialogProps?:
    | ((props: {
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => DialogProps)
    | DialogProps
  muiEditTextFieldProps?:
    | ((props: {
        cell: Cell<TFeatures, TData, unknown>
        column: Column<TFeatures, TData, unknown>
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => TextFieldProps)
    | TextFieldProps
  muiExpandAllButtonProps?:
    | ((props: { table: Table<TFeatures, TData> }) => IconButtonProps)
    | IconButtonProps
  muiExpandButtonProps?:
    | ((props: {
        row: Row<TFeatures, TData>
        staticRowIndex?: number
        table: Table<TFeatures, TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiFilterAutocompleteProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => AutocompleteProps<any, any, any, any>)
    | AutocompleteProps<any, any, any, any>
  muiFilterCheckboxProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => CheckboxProps)
    | CheckboxProps
  muiFilterDatePickerProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        rangeFilterIndex?: number
        table: Table<TFeatures, TData>
      }) => DatePickerProps)
    | DatePickerProps
  muiFilterDateTimePickerProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        rangeFilterIndex?: number
        table: Table<TFeatures, TData>
      }) => DateTimePickerProps)
    | DateTimePickerProps
  muiFilterSliderProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => SliderProps)
    | SliderProps
  muiFilterTextFieldProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        rangeFilterIndex?: number
        table: Table<TFeatures, TData>
      }) => TextFieldProps)
    | TextFieldProps
  muiFilterTimePickerProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        rangeFilterIndex?: number
        table: Table<TFeatures, TData>
      }) => TimePickerProps)
    | TimePickerProps
  muiLinearProgressProps?:
    | ((props: {
        isTopToolbar: boolean
        table: Table<TFeatures, TData>
      }) => LinearProgressProps)
    | LinearProgressProps
  muiPaginationProps?:
    | ((props: { table: Table<TFeatures, TData> }) => Partial<
        PaginationProps & {
          SelectProps?: Partial<SelectProps>
          disabled?: boolean
          rowsPerPageOptions?:
            Array<{ label: string; value: number }> | Array<number>
          showRowsPerPage?: boolean
        }
      >)
    | Partial<
        PaginationProps & {
          SelectProps?: Partial<SelectProps>
          disabled?: boolean
          rowsPerPageOptions?:
            Array<{ label: string; value: number }> | Array<number>
          showRowsPerPage?: boolean
        }
      >
  muiRowDragHandleProps?:
    | ((props: {
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiSearchTextFieldProps?:
    | ((props: { table: Table<TFeatures, TData> }) => TextFieldProps)
    | TextFieldProps
  muiSelectAllCheckboxProps?:
    | ((props: { table: Table<TFeatures, TData> }) => CheckboxProps)
    | CheckboxProps
  muiSelectCheckboxProps?:
    | ((props: {
        row: Row<TFeatures, TData>
        staticRowIndex?: number
        table: Table<TFeatures, TData>
      }) => CheckboxProps | RadioProps)
    | (CheckboxProps | RadioProps)
  muiSkeletonProps?:
    | ((props: {
        cell: Cell<TFeatures, TData, unknown>
        column: Column<TFeatures, TData, unknown>
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => SkeletonProps)
    | SkeletonProps
  muiTableBodyCellProps?:
    | ((props: {
        cell: Cell<TFeatures, TData, unknown>
        column: Column<TFeatures, TData, unknown>
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableBodyProps?:
    | ((props: { table: Table<TFeatures, TData> }) => TableBodyProps)
    | TableBodyProps
  muiTableBodyRowProps?:
    | ((props: {
        isDetailPanel?: boolean
        row: Row<TFeatures, TData>
        staticRowIndex: number
        table: Table<TFeatures, TData>
      }) => TableRowProps)
    | TableRowProps
  muiTableContainerProps?:
    | ((props: { table: Table<TFeatures, TData> }) => TableContainerProps)
    | TableContainerProps
  muiTableFooterCellProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableFooterProps?:
    | ((props: { table: Table<TFeatures, TData> }) => TableFooterProps)
    | TableFooterProps
  muiTableFooterRowProps?:
    | ((props: {
        footerGroup: HeaderGroup<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => TableRowProps)
    | TableRowProps
  muiTableHeadCellProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableHeadProps?:
    | ((props: { table: Table<TFeatures, TData> }) => TableHeadProps)
    | TableHeadProps
  muiTableHeadRowProps?:
    | ((props: {
        headerGroup: HeaderGroup<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => TableRowProps)
    | TableRowProps
  muiTablePaperProps?:
    ((props: { table: Table<TFeatures, TData> }) => PaperProps) | PaperProps
  muiTableProps?:
    ((props: { table: Table<TFeatures, TData> }) => TableProps) | TableProps
  muiToolbarAlertBannerChipProps?:
    ((props: { table: Table<TFeatures, TData> }) => ChipProps) | ChipProps
  muiToolbarAlertBannerProps?:
    ((props: { table: Table<TFeatures, TData> }) => AlertProps) | AlertProps
  muiTopToolbarProps?:
    ((props: { table: Table<TFeatures, TData> }) => BoxProps) | BoxProps
  onCreatingRowCancel?: (props: {
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
  }) => void
  onCreatingRowSave?: (props: {
    exitCreatingMode: () => void
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>
  }) => Promise<void> | void
  onEditingRowCancel?: (props: {
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
  }) => void
  onEditingRowSave?: (props: {
    exitEditingMode: () => void
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>
  }) => Promise<void> | void
  paginationDisplayMode?: 'custom' | 'default' | 'pages'
  positionActionsColumn?: 'first' | 'last'
  positionCreatingRow?: 'bottom' | 'top' | number
  positionExpandColumn?: 'first' | 'last'
  positionGlobalFilter?: 'left' | 'none' | 'right'
  positionPagination?: 'both' | 'bottom' | 'none' | 'top'
  positionToolbarAlertBanner?: 'bottom' | 'head-overlay' | 'none' | 'top'
  positionToolbarDropZone?: 'both' | 'bottom' | 'none' | 'top'
  renderBottomToolbar?:
    ((props: { table: Table<TFeatures, TData> }) => ReactNode) | ReactNode
  renderBottomToolbarCustomActions?: (props: {
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderCaption?:
    ((props: { table: Table<TFeatures, TData> }) => ReactNode) | ReactNode
  renderCellActionMenuItems?: (props: {
    cell: Cell<TFeatures, TData, unknown>
    closeMenu: () => void
    column: Column<TFeatures, TData, unknown>
    internalMenuItems: Array<ReactNode>
    row: Row<TFeatures, TData>
    staticColumnIndex?: number
    staticRowIndex?: number
    table: Table<TFeatures, TData>
  }) => Array<ReactNode>
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void
    column: Column<TFeatures, TData, unknown>
    internalColumnMenuItems: Array<ReactNode>
    table: Table<TFeatures, TData>
  }) => Array<ReactNode>
  renderColumnFilterModeMenuItems?: (props: {
    column: Column<TFeatures, TData, unknown>
    internalFilterOptions: Array<MRT_InternalFilterOption>
    onSelectFilterMode: (filterMode: MRT_FilterOption) => void
    table: Table<TFeatures, TData>
  }) => Array<ReactNode>
  renderCreateRowDialogContent?: (props: {
    internalEditComponents: Array<ReactNode>
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderDetailPanel?: (props: {
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderEditRowDialogContent?: (props: {
    internalEditComponents: Array<ReactNode>
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderEmptyRowsFallback?: (props: {
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderGlobalFilterModeMenuItems?: (props: {
    internalFilterOptions: Array<MRT_InternalFilterOption>
    onSelectFilterMode: (filterMode: MRT_FilterOption) => void
    table: Table<TFeatures, TData>
  }) => Array<ReactNode>
  renderRowActionMenuItems?: (props: {
    closeMenu: () => void
    row: Row<TFeatures, TData>
    staticRowIndex?: number
    table: Table<TFeatures, TData>
  }) => Array<ReactNode> | undefined
  renderRowActions?: (props: {
    cell: Cell<TFeatures, TData, unknown>
    row: Row<TFeatures, TData>
    staticRowIndex?: number
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderToolbarAlertBannerContent?: (props: {
    groupedAlert: ReactNode | null
    selectedAlert: ReactNode | null
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderToolbarInternalActions?: (props: {
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderTopToolbar?:
    ((props: { table: Table<TFeatures, TData> }) => ReactNode) | ReactNode
  renderTopToolbarCustomActions?: (props: {
    table: Table<TFeatures, TData>
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
        table: Table<TFeatures, TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>
  selectAllMode?: 'all' | 'page'
}

export interface MRT_ColumnDef_Config<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  /**
   * The resolved filter-fn name for this column, written onto the column def by
   * `prepareColumns` at construction. Optional here (present only after
   * resolution); `MRT_DefinedColumnDef` narrows it to required.
   */
  _filterFn?: MRT_FilterOption
  AggregatedCell?: (props: {
    cell: Cell<TFeatures, TData, TValue>
    column: Column<TFeatures, TData, TValue>
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
    staticColumnIndex?: number
    staticRowIndex?: number
  }) => ReactNode
  Cell?: (props: {
    cell: Cell<TFeatures, TData, TValue>
    column: Column<TFeatures, TData, TValue>
    renderedCellValue: ReactNode
    row: Row<TFeatures, TData>
    rowRef?: RefObject<HTMLTableRowElement | null>
    staticColumnIndex?: number
    staticRowIndex?: number
    table: Table<TFeatures, TData>
  }) => ReactNode
  /**
   * MRT does not render core's lowercase `cell` template; use the capital
   * `Cell` slot instead. Narrowed to `never` so passing it is a type error.
   */
  cell?: never
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
  Edit?: (props: {
    cell: Cell<TFeatures, TData, TValue>
    column: Column<TFeatures, TData, TValue>
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
  }) => ReactNode
  editSelectOptions?:
    | ((props: {
        cell: Cell<TFeatures, TData, TValue>
        column: Column<TFeatures, TData, unknown>
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => Array<DropdownOption>)
    | Array<DropdownOption>
  editVariant?: 'select' | 'text'
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: Cell<TFeatures, TData, unknown>) => 'context-menu' | boolean)
    | boolean
  enableColumnActions?: boolean
  enableColumnDragging?: boolean
  enableColumnFilterModes?: boolean
  enableColumnOrdering?: boolean
  enableEditing?: ((row: Row<TFeatures, TData>) => boolean) | boolean
  enableFilterMatchHighlighting?: boolean
  Filter?: (props: {
    column: Column<TFeatures, TData, TValue>
    header: Header<TFeatures, TData, unknown>
    rangeFilterIndex?: number
    table: Table<TFeatures, TData>
  }) => ReactNode
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
  Footer?:
    | ((props: {
        column: Column<TFeatures, TData, TValue>
        footer: Header<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => ReactNode)
    | ReactNode
  /**
   * MRT narrows core's `footer` template to a plain string; use the capital
   * `Footer` slot for custom markup.
   */
  footer?: string
  GroupedCell?: (props: {
    cell: Cell<TFeatures, TData, TValue>
    column: Column<TFeatures, TData, TValue>
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
    staticColumnIndex?: number
    staticRowIndex?: number
  }) => ReactNode
  /**
   * If `layoutMode` is `'grid'` or `'grid-no-grow'`, you can specify the flex grow value for individual columns to still grow and take up remaining space, or set to `false`/0 to not grow.
   */
  grow?: boolean | number
  Header?:
    | ((props: {
        column: Column<TFeatures, TData, TValue>
        header: Header<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => ReactNode)
    | ReactNode
  /**
   * MRT narrows core's `header` template to a required plain string: it renders
   * as text in menus, filter labels, tooltips, and the alert banner. Use the
   * capital `Header` slot for custom header markup.
   */
  header: string
  muiColumnActionsButtonProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiColumnDragHandleProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => IconButtonProps)
    | IconButtonProps
  muiCopyButtonProps?:
    | ((props: {
        cell: Cell<TFeatures, TData, TValue>
        column: Column<TFeatures, TData, unknown>
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => ButtonProps)
    | ButtonProps
  muiEditTextFieldProps?:
    | ((props: {
        cell: Cell<TFeatures, TData, TValue>
        column: Column<TFeatures, TData, unknown>
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => TextFieldProps)
    | TextFieldProps
  muiFilterAutocompleteProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => AutocompleteProps<any, any, any, any>)
    | AutocompleteProps<any, any, any, any>
  muiFilterCheckboxProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => CheckboxProps)
    | CheckboxProps
  muiFilterDatePickerProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        rangeFilterIndex?: number
        table: Table<TFeatures, TData>
      }) => DatePickerProps)
    | DatePickerProps
  muiFilterDateTimePickerProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        rangeFilterIndex?: number
        table: Table<TFeatures, TData>
      }) => DateTimePickerProps)
    | DateTimePickerProps
  muiFilterSliderProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => SliderProps)
    | SliderProps
  muiFilterTextFieldProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        rangeFilterIndex?: number
        table: Table<TFeatures, TData>
      }) => TextFieldProps)
    | TextFieldProps
  muiFilterTimePickerProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        rangeFilterIndex?: number
        table: Table<TFeatures, TData>
      }) => TimePickerProps)
    | TimePickerProps
  muiTableBodyCellProps?:
    | ((props: {
        cell: Cell<TFeatures, TData, TValue>
        column: Column<TFeatures, TData, unknown>
        row: Row<TFeatures, TData>
        table: Table<TFeatures, TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableFooterCellProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => TableCellProps)
    | TableCellProps
  muiTableHeadCellProps?:
    | ((props: {
        column: Column<TFeatures, TData, unknown>
        table: Table<TFeatures, TData>
      }) => TableCellProps)
    | TableCellProps
  PlaceholderCell?: (props: {
    cell: Cell<TFeatures, TData, TValue>
    column: Column<TFeatures, TData, TValue>
    row: Row<TFeatures, TData>
    table: Table<TFeatures, TData>
  }) => ReactNode
  renderCellActionMenuItems?: (props: {
    cell: Cell<TFeatures, TData, unknown>
    closeMenu: () => void
    column: Column<TFeatures, TData, unknown>
    internalMenuItems: Array<ReactNode>
    row: Row<TFeatures, TData>
    staticColumnIndex?: number
    staticRowIndex?: number
    table: Table<TFeatures, TData>
  }) => Array<ReactNode>
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void
    column: Column<TFeatures, TData, unknown>
    internalColumnMenuItems: Array<ReactNode>
    table: Table<TFeatures, TData>
  }) => Array<ReactNode>
  renderColumnFilterModeMenuItems?: (props: {
    column: Column<TFeatures, TData, unknown>
    internalFilterOptions: Array<MRT_InternalFilterOption>
    onSelectFilterMode: (filterMode: MRT_FilterOption) => void
    table: Table<TFeatures, TData>
  }) => Array<ReactNode>
  visibleInShowHideMenu?: boolean
}
