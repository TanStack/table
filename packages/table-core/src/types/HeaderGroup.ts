import type { Fns } from './Fns'
import type { HeaderGroup_Header } from '../core/headers/Headers.types'
import type { TableFeatures } from './TableFeatures'
import type { RowData } from './type-utils'

export interface HeaderGroup_Core<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> extends HeaderGroup_Header<TFeatures, TFns, TData> {}

export interface HeaderGroup<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> extends HeaderGroup_Core<TFeatures, TFns, TData> {}
