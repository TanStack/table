import { batch, createAtom } from '@tanstack/store'
import type { TableReactivityBindings } from './core/reactivity/coreReactivityFeature.types'

/**
 * TanStack Store–based reactivity for vanilla / non-framework use of `constructTable`,
 * with `createOptionsStore: true` so `table.optionsStore` is available for subscriptions.
 *
 * @example
 * ```ts
 * import { constructTable, tableFeatures } from '@tanstack/table-core'
 * import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
 *
 * const table = constructTable({
 *   features: tableFeatures({ coreReactivityFeature: storeReactivityBindings() }),
 *   // ...
 * })
 * ```
 */
export function storeReactivityBindings(): TableReactivityBindings {
  return {
    createOptionsStore: true,
    wrapExternalAtoms: false,
    addSubscription: () => {
      throw new Error(
        'Feature not supported in current reactivity implementation',
      )
    },
    unmount: () => {
      throw new Error(
        'Feature not supported in current reactivity implementation',
      )
    },
    batch,
    schedule: (fn) => queueMicrotask(fn),
    untrack: (fn) => fn(),
    createReadonlyAtom: (fn, options) => {
      return createAtom(() => fn(), {
        compare: options?.compare,
      })
    },
    createWritableAtom: (value, options) => {
      return createAtom(value, {
        compare: options?.compare,
      })
    },
  }
}
