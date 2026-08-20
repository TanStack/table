import { coreFeatures } from '../../src'
import { storeReactivityBindings } from '../../src/store-reactivity-bindings'
import type {
  CoreFeatures,
  TableFeatures,
  ValidateFeatureSlots,
} from '../../src'

/**
 * `tableFeatures` for tests: injects the core features plus the store
 * reactivity bindings that `constructTable` requires, so each test file only
 * declares the features, row model factories, and fn registries it tests.
 */
export function testFeatures<TFeatures extends TableFeatures>(
  features: TFeatures & ValidateFeatureSlots<TFeatures>,
): CoreFeatures & TFeatures {
  return {
    ...coreFeatures,
    coreReactivityFeature: storeReactivityBindings(),
    ...features,
  }
}
