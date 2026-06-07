import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type {
  ExtractFeatureMapTypes,
  ExtractFeatureTypes,
  TableFeatures,
} from './TableFeatures'
import type { CellContext } from '../core/cells/coreCellsFeature.types'
import type { HeaderContext } from '../core/headers/coreHeadersFeature.types'
import type { ColumnDef_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { ColumnDef_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { ColumnDef_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { ColumnDef_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { ColumnDef_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { ColumnDef_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { ColumnDef_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { ColumnDef_RowSorting } from '../features/row-sorting/rowSortingFeature.types'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface ColumnDef_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {}

export interface ColumnMeta<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {}

/**
 * Reads a cell value from an original row object.
 *
 * The row index is provided for accessors that need stable position-aware
 * derived values.
 */
export type AccessorFn<
  TData extends RowData,
  TValue extends CellData = CellData,
> = (originalRow: TData, index: number) => TValue

/**
 * A renderable column template value.
 *
 * Strings render directly; functions receive the relevant cell/header context
 * and can return framework-specific render output.
 */
export type ColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

export type StringOrTemplateHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = string | ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>

export interface StringHeaderIdentifier {
  /**
   * Header text used both for rendering and as a fallback column id.
   */
  header: string
  /**
   * Optional explicit id that overrides the header-derived id.
   */
  id?: string
}

export interface IdIdentifier<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * Explicit stable column id.
   */
  id: string
  /**
   * Header text or template used to render this column's header.
   */
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>
}
type ColumnIdentifiers<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = IdIdentifier<TFeatures, TData, TValue> | StringHeaderIdentifier

interface ColumnDefBase_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * Produces the values used by faceting/grouping for this column.
   *
   * When omitted, the normal accessor value is wrapped in a single-item array.
   */
  getUniqueValues?: AccessorFn<TData, Array<unknown>>
  /**
   * Footer template rendered with header context.
   */
  footer?: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>
  /**
   * Cell template rendered with cell context.
   */
  cell?: ColumnDefTemplate<CellContext<TFeatures, TData, TValue>>
  /**
   * User-defined metadata available on the resolved column definition.
   */
  meta?: ColumnMeta<TFeatures, TData, TValue>
}

export interface ColumnDef_FeatureMap<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  columnVisibilityFeature: ColumnDef_ColumnVisibility
  columnPinningFeature: ColumnDef_ColumnPinning
  columnFilteringFeature: ColumnDef_ColumnFiltering<TFeatures, TData>
  globalFilteringFeature: ColumnDef_GlobalFiltering
  rowSortingFeature: ColumnDef_RowSorting<TFeatures, TData>
  columnGroupingFeature: ColumnDef_ColumnGrouping<TFeatures, TData, TValue>
  columnSizingFeature: ColumnDef_ColumnSizing
  columnResizingFeature: ColumnDef_ColumnResizing
}

export type ColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase_Core<TFeatures, TData, TValue> &
  ExtractFeatureMapTypes<
    TFeatures,
    ColumnDef_FeatureMap<TFeatures, TData, TValue>
  > &
  ExtractFeatureTypes<'ColumnDef', TFeatures> &
  ColumnDef_Plugins<TFeatures, TData, TValue>

export type ColumnDefBase_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase_Core<TFeatures, TData, TValue> &
  Partial<
    ColumnDef_ColumnVisibility &
      ColumnDef_ColumnPinning &
      ColumnDef_ColumnFiltering<TFeatures, TData> &
      ColumnDef_GlobalFiltering &
      ColumnDef_RowSorting<TFeatures, TData> &
      ColumnDef_ColumnGrouping<TFeatures, TData, TValue> &
      ColumnDef_ColumnSizing &
      ColumnDef_ColumnResizing
  >

export type IdentifiedColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  id?: string
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>
}

export type DisplayColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>
type GroupColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  columns?: ReadonlyArray<ColumnDef<TFeatures, TData, unknown>>
}

export type GroupColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = GroupColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

export type AccessorFnColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  accessorFn: AccessorFn<TData, TValue>
}

export type AccessorFnColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = AccessorFnColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

export type AccessorKeyColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  id?: string
  accessorKey: (string & {}) | keyof TData
}

export type AccessorKeyColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = AccessorKeyColumnDefBase<TFeatures, TData, TValue> &
  Partial<ColumnIdentifiers<TFeatures, TData, TValue>>

export type AccessorColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | AccessorKeyColumnDef<TFeatures, TData, TValue>
  | AccessorFnColumnDef<TFeatures, TData, TValue>

export type ColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | DisplayColumnDef<TFeatures, TData, TValue>
  | GroupColumnDef<TFeatures, TData, TValue>
  | AccessorColumnDef<TFeatures, TData, TValue>

export type ColumnDefResolved<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Partial<UnionToIntersection<ColumnDef<TFeatures, TData, TValue>>> & {
  accessorKey?: string
}
