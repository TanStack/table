import type { TableFeatures } from '../types/TableFeatures'

export function tableFeatures<TFeatures extends TableFeatures>(
  features: TFeatures,
): TableFeatures {
  return features
}

//test

// const features = tableFeatures({
//   RowPinning: {},
// });
