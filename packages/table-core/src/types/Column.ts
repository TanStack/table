import type { Column_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { Column_ColumnFaceting } from '../features/column-faceting/columnFacetingFeature.types'
import type { Column_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { Column_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Column_ColumnOrdering } from '../features/column-ordering/columnOrderingFeature.types'
import type { Column_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { Column_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Column_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { Column_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { Column_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { ColumnDefBase_All } from './ColumnDef'
import type { RowData, UnionToIntersection } from './type-utils'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { Column_Column } from '../core/columns/coreColumnsFeature.types'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface Column_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> {}

export interface Column_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> extends Column_Column<TFeatures, TData, TValue> {}

export type Column<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = Column_Core<TFeatures, TData, TValue> &
  UnionToIntersection<
    | ('columnFacetingFeature' extends keyof TFeatures
        ? Column_ColumnFaceting<TFeatures, TData>
        : never)
    | ('columnFilteringFeature' extends keyof TFeatures
        ? Column_ColumnFiltering<TFeatures, TData>
        : never)
    | ('columnGroupingFeature' extends keyof TFeatures
        ? Column_ColumnGrouping<TFeatures, TData>
        : never)
    | ('columnOrderingFeature' extends keyof TFeatures
        ? Column_ColumnOrdering
        : never)
    | ('columnPinningFeature' extends keyof TFeatures
        ? Column_ColumnPinning
        : never)
    | ('columnResizingFeature' extends keyof TFeatures
        ? Column_ColumnResizing
        : never)
    | ('columnSizingFeature' extends keyof TFeatures
        ? Column_ColumnSizing
        : never)
    | ('columnVisibilityFeature' extends keyof TFeatures
        ? Column_ColumnVisibility
        : never)
    | ('globalFilteringFeature' extends keyof TFeatures
        ? Column_GlobalFiltering
        : never)
    | ('rowSortingFeature' extends keyof TFeatures
        ? Column_RowSorting<TFeatures, TData>
        : never)
  > &
  ExtractFeatureTypes<'Column', TFeatures> &
  Column_Plugins<TFeatures, TData, TValue>

// export type Column<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
//   TValue = unknown,
// > = Column_Core<TFeatures, TData, TValue> &
//   ExtractFeatureTypes<'Column', TFeatures> &
//   Column_Plugins<TFeatures, TData, TValue>

export type Column_Internal<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = Column<TFeatures, TData, TValue> & {
  columnDef: ColumnDefBase_All<TFeatures, TData, TValue>
}
