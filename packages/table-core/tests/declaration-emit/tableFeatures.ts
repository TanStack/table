import {
  columnOrderingFeature,
  columnPinningFeature,
  tableFeatures,
} from '../../src'

export const sharedTableFeatures = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
})
