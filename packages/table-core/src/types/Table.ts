import type { ReadonlyStore } from '@tanstack/store'
import type { Table_ColumnFaceting } from '../features/column-faceting/columnFacetingFeature.types'
import type { Table_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { Table_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { Table_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Table_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Table_ColumnOrdering } from '../features/column-ordering/columnOrderingFeature.types'
import type { Table_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { Table_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { Table_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { Table_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { Table_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { Table_RowPagination } from '../features/row-pagination/rowPaginationFeature.types'
import type { Table_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type { Table_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { Table_RowModels } from '../core/row-models/coreRowModelsFeature.types'
import type { CachedRowModel_All } from './RowModel'
import type { RowModelFns_All } from './RowModelFns'
import type { TableState, TableState_All } from './TableState'
import type { RowData } from './type-utils'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'
import type { Table_Columns } from '../core/columns/coreColumnsFeature.types'
import type { Table_Headers } from '../core/headers/coreHeadersFeature.types'
import type { Table_Rows } from '../core/rows/coreRowsFeature.types'
import type {
  Atoms,
  Atoms_All,
  BaseAtoms,
  BaseAtoms_All,
  ExternalAtoms_All,
  Table_Table,
} from '../core/table/coreTablesFeature.types'
import type { DebugOptions, TableOptions_All } from './TableOptions'

/**
 * The core table object that only includes the core table functionality such as column, header, row, and table APIS.
 * No features are included.
 */
export type Table_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Table<TFeatures, TData> &
  Table_Columns<TFeatures, TData> &
  Table_Rows<TFeatures, TData> &
  Table_RowModels<TFeatures, TData> &
  Table_Headers<TFeatures, TData>

export interface Table_FeatureMap<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  columnFilteringFeature: Table_ColumnFiltering
  columnGroupingFeature: Table_ColumnGrouping<TFeatures, TData>
  columnOrderingFeature: Table_ColumnOrdering<TFeatures, TData>
  columnPinningFeature: Table_ColumnPinning<TFeatures, TData>
  columnResizingFeature: Table_ColumnResizing
  columnSizingFeature: Table_ColumnSizing
  columnVisibilityFeature: Table_ColumnVisibility<TFeatures, TData>
  columnFacetingFeature: Table_ColumnFaceting<TFeatures, TData>
  globalFilteringFeature: Table_GlobalFiltering<TFeatures, TData>
  rowExpandingFeature: Table_RowExpanding<TFeatures, TData>
  rowPaginationFeature: Table_RowPagination<TFeatures, TData>
  rowPinningFeature: Table_RowPinning<TFeatures, TData>
  rowSelectionFeature: Table_RowSelection<TFeatures, TData>
  rowSortingFeature: Table_RowSorting<TFeatures, TData>
}

/**
 * The table object that includes both the core table functionality and the features that are enabled via the `features` table option.
 */
export type Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Core<TFeatures, TData> &
  ExtractFeatureMapTypes<TFeatures, Table_FeatureMap<TFeatures, TData>>

/**
 * `Table_Table` members that `Table_Internal` re-declares with broadened
 * (all-features) types so internal code can read any feature's slots and
 * construction code can assign them.
 */
type Table_InternalBroadenedKeys =
  | '_rowModels'
  | '_rowModelFns'
  | 'options'
  | 'initialState'
  | 'store'

/**
 * Internal broad table shape used by feature implementations.
 *
 * Declared as an interface extending every stock feature's table API (rather
 * than the feature-conditional `Table` intersection) so that the compiler can
 * relate `Table_Internal` instantiations nominally instead of structurally
 * re-expanding the feature-map conditional for every internal call site.
 * Mirrors the `*_All` convention used for options, state, and row models.
 * Type parameters are annotated `in out` (invariant) so the checker can relate
 * instantiations by their type arguments without measuring variance or falling
 * back to member-by-member structural comparison.
 */
export interface Table_Internal<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData = any,
>
  extends
    Omit<Table_Table<TFeatures, TData>, Table_InternalBroadenedKeys>,
    Table_Columns<TFeatures, TData>,
    Table_Rows<TFeatures, TData>,
    Table_RowModels<TFeatures, TData>,
    Table_Headers<TFeatures, TData>,
    Table_ColumnFiltering,
    Table_ColumnGrouping<TFeatures, TData>,
    Table_ColumnOrdering<TFeatures, TData>,
    Table_ColumnPinning<TFeatures, TData>,
    Table_ColumnResizing,
    Table_ColumnSizing,
    Table_ColumnVisibility<TFeatures, TData>,
    Table_ColumnFaceting<TFeatures, TData>,
    Table_GlobalFiltering<TFeatures, TData>,
    Table_RowExpanding<TFeatures, TData>,
    Table_RowPagination<TFeatures, TData>,
    Table_RowPinning<TFeatures, TData>,
    Table_RowSelection<TFeatures, TData>,
    Table_RowSorting<TFeatures, TData> {
  _rowModels: CachedRowModel_All<TFeatures, TData>
  _rowModelFns: RowModelFns_All<TFeatures, TData>
  options: DebugOptions<TableFeatures> &
    TableOptions_All<TFeatures, TData> & {
      state?: TableState_All
      initialState?: TableState_All
      atoms?: ExternalAtoms_All
    }
  initialState: TableState<TFeatures> & TableState_All
  baseAtoms: BaseAtoms<TFeatures> & BaseAtoms_All
  atoms: Atoms<TFeatures> & Atoms_All
  store: ReadonlyStore<TableState<TFeatures>> & ReadonlyStore<TableState_All>
}
