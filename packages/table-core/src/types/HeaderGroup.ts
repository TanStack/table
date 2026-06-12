import type { HeaderGroup_Header } from '../core/headers/coreHeadersFeature.types'
import type { TableFeatures } from './TableFeatures'
import type { RowData } from './type-utils'

export interface HeaderGroup_Core<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> extends HeaderGroup_Header<TFeatures, TData> {}

export type HeaderGroup<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = HeaderGroup_Core<TFeatures, TData>
