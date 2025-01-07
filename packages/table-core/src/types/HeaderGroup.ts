import type { HeaderGroup_Header } from '../core/headers/coreHeadersFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { RowData } from './type-utils'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface HeaderGroup_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export interface HeaderGroup_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends HeaderGroup_Header<TFeatures, TData> {}

export type HeaderGroup<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = HeaderGroup_Core<TFeatures, TData> &
  ExtractFeatureTypes<'HeaderGroup', TFeatures> &
  HeaderGroup_Plugins<TFeatures, TData>
