import type { CellData, RowData } from './type-utils'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { Header_Header } from '../core/headers/coreHeadersFeature.types'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface Header_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {}

export interface Header_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Header_Header<TFeatures, TData, TValue> {}

export type Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Header_Core<TFeatures, TData, TValue> &
  ExtractFeatureTypes<TFeatures, 'Header'> &
  Header_Plugins<TFeatures, TData, TValue>
