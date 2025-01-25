import type { Cell_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { Cell_Cell } from '../core/cells/coreCellsFeature.types'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface Cell_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {}

export interface Cell_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Cell_Cell<TFeatures, TData, TValue> {}

export type Cell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell_Cell<TFeatures, TData, TValue> &
  UnionToIntersection<
    'columnGroupingFeature' extends keyof TFeatures
      ? Cell_ColumnGrouping
      : never
  > &
  ExtractFeatureTypes<'Cell', TFeatures> &
  Cell_Plugins<TFeatures, TData, TValue>

// export type Cell<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
//   TValue extends CellData = CellData,
// > = Cell_Core<TFeatures, TData, TValue> &
//   ExtractFeatureTypes<TFeatures, 'Cell'> &
//   Cell_Plugins<TFeatures, TData, TValue>
