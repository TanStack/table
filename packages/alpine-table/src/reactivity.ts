import { batch, createAtom } from '@tanstack/store'
import { createStableStoreReadonlyAtom } from '@tanstack/table-core/reactivity'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

/**
 * Creates the table-core reactivity bindings used by the Alpine adapter.
 *
 * Alpine uses TanStack Store atoms directly. Table instance reads
 * are then exposed to Alpine through the proxy wrapper in `createTable`.
 */
export function alpineReactivity(): TableReactivityBindings {
  return {
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
    schedule: (fn) => queueMicrotask(() => fn()),
    batch,
    untrack: (fn) => fn(),
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      return createStableStoreReadonlyAtom(
        createAtom,
        fn,
        { compare: options?.compare },
      )
    },
    createWritableAtom: <T>(value: T, options?: TableAtomOptions<T>) => {
      return createAtom(value, {
        compare: options?.compare,
      })
    },
  }
}
