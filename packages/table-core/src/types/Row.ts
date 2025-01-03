import type { Row_Row } from '../core/rows/coreRowsFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { RowData } from './type-utils'

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
  ExtractFeatureTypes<TFeatures, 'Row'> &
  Row_Plugins<TFeatures, TData>
