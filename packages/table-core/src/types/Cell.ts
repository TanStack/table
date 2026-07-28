import type { Cell_CellSelection } from '../features/cell-selection/cellSelectionFeature.types'
import type { Cell_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Cell_RowAggregation } from '../features/row-aggregation/rowAggregationFeature.types'
import type { CellData, RowData } from './type-utils'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'
import type { Cell_Cell } from '../core/cells/coreCellsFeature.types'

export interface Cell_Core<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> extends Cell_Cell<TFeatures, TData, TValue> {}

export interface Cell_FeatureMap {
  cellSelectionFeature: Cell_CellSelection
  columnGroupingFeature: Cell_ColumnGrouping
  rowAggregationFeature: Cell_RowAggregation
}

export type Cell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell_Core<TFeatures, TData, TValue> &
  ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap>
