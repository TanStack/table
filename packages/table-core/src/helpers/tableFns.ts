import type { Fns } from '../types/Fns'
import type { TableFeatures } from '../types/TableFeatures'

export function tableFns<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, any>,
>(_features: TFeatures, fns: TFns): TFns {
  return fns
}

// test

// const _features = tableFeatures({
//   RowSorting: {},
// })

// const _fns = tableFns(_features, {
//   sortingFns: sortingFns,
// })
