import type { Column_Column } from '../core/columns/coreColumnsFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { RowData } from './type-utils'
import type { ColumnDefBase_All } from './ColumnDef'

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
  ExtractFeatureTypes<TFeatures, 'Column'> &
  Column_Plugins<TFeatures, TData, TValue>

export type Column_Internal<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = Column<TFeatures, TData, TValue> & {
  columnDef: ColumnDefBase_All<TFeatures, TData, TValue>
}
