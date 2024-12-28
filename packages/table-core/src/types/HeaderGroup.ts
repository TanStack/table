import type { HeaderGroup_Header } from '../core/headers/coreHeadersFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { RowData } from './type-utils'

export interface HeaderGroup_Plugins {}

export interface HeaderGroup_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends HeaderGroup_Header<TFeatures, TData>,
    HeaderGroup_Plugins {}

// export interface HeaderGroup<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
// > extends HeaderGroup_Core<TFeatures, TData> {}

export type HeaderGroup<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = HeaderGroup_Core<TFeatures, TData> &
  ExtractFeatureTypes<TFeatures, 'HeaderGroup'>
