import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { Row_Row } from '../core/rows/coreRowsFeature.types'
import type { Row_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { Row_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Row_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Row_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { Row_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { Row_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { Row_RowSelection } from '../features/row-selection/rowSelectionFeature.types'

export interface Row_Plugins {}

export interface Row_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Row_Row<TFeatures, TData>,
    Row_Plugins {}

export type Row<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Row_Core<TFeatures, TData> &
  Row_Plugins &
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
  >
