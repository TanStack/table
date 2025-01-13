import type { RowData } from './type-utils'
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
  // UnionToIntersection<
  //   | ('columnFilteringFeature' extends keyof TFeatures
  //       ? Row_ColumnFiltering<TFeatures, TData>
  //       : never)
  //   | ('columnGroupingFeature' extends keyof TFeatures
  //       ? Row_ColumnGrouping
  //       : never)
  //   | ('columnPinningFeature' extends keyof TFeatures
  //       ? Row_ColumnPinning<TFeatures, TData>
  //       : never)
  //   | ('columnVisibilityFeature' extends keyof TFeatures
  //       ? Row_ColumnVisibility<TFeatures, TData>
  //       : never)
  //   | ('rowExpandingFeature' extends keyof TFeatures ? Row_RowExpanding : never)
  //   | ('rowPinningFeature' extends keyof TFeatures ? Row_RowPinning : never)
  //   | ('rowSelectionFeature' extends keyof TFeatures ? Row_RowSelection : never)
  // > &
  ExtractFeatureTypes<'Row', TFeatures> &
  Row_Plugins<TFeatures, TData>
