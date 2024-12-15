import type { Cell_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { Cell_Cell } from '../core/cells/coreCellsFeature.types'

export interface Cell_Plugins {}

export interface Cell_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Cell_Cell<TFeatures, TData, TValue>,
    Cell_Plugins {}

export type Cell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell_Cell<TFeatures, TData, TValue> &
  UnionToIntersection<
    'columnGroupingFeature' extends keyof TFeatures
      ? Cell_ColumnGrouping
      : never
  >

// export type Cell<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
//   TValue extends CellData = CellData,
// > = Cell_Core<TFeatures, TData, TValue> & ExtractFeatureTypes<TFeatures, 'Cell'>
