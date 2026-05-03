import { batch, createAtom } from '@tanstack/store'
import type { TableReactivityBindings } from './coreReactivityFeature.types'

export function constructReactivityBindings(): TableReactivityBindings {
  return {
    batch: batch,
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
