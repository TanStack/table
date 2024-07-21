import type { TableFeatures } from '../types/TableFeatures'

export function tableFeatures<TFeatures extends TableFeatures>(
  features: TFeatures,
): TFeatures {
  return features
}

//test

// const features = tableFeatures({
//   RowPinning: {},
// });
