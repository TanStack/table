import type { Row_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { Row_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Row_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Row_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { RowData, UnionToIntersection } from './type-utils'
import type { Row_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { Row_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { Row_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { Row_Row } from '../core/rows/coreRowsFeature.types'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface Row_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export interface Row_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Row_Row<TFeatures, TData> {}

export type Row<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Row_Core<TFeatures, TData> &
  UnionToIntersection<
    | ('columnFilteringFeature' extends keyof TFeatures
        ? Row_ColumnFiltering<TFeatures, TData>
        : never)
    | ('columnGroupingFeature' extends keyof TFeatures
        ? Row_ColumnGrouping
        : never)
    | ('columnPinningFeature' extends keyof TFeatures
        ? Row_ColumnPinning<TFeatures, TData>
        : never)
    | ('columnVisibilityFeature' extends keyof TFeatures
        ? Row_ColumnVisibility<TFeatures, TData>
        : never)
    | ('rowExpandingFeature' extends keyof TFeatures ? Row_RowExpanding : never)
    | ('rowPinningFeature' extends keyof TFeatures ? Row_RowPinning : never)
    | ('rowSelectionFeature' extends keyof TFeatures ? Row_RowSelection : never)
  > &
  ExtractFeatureTypes<'Row', TFeatures> &
  Row_Plugins<TFeatures, TData>

// export type Row<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
// > = Row_Core<TFeatures, TData> &
//   ExtractFeatureTypes<'Row', TFeatures> &
//   Row_Plugins<TFeatures, TData>
