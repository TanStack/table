import { batch, createAtom } from '@tanstack/store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

/**
 * Creates the table-core reactivity bindings used by the Lit adapter.
 *
 * Lit uses TanStack Store atoms directly. `TableController` subscribes to the
 * resulting table store and options store to request host updates.
 */
export function litReactivity(): TableReactivityBindings {
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
    schedule: (fn) => queueMicrotask(() => fn()),
    batch,
    untrack: (fn) => fn(),
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      return createAtom(() => fn(), {
        compare: options?.compare,
      })
    },
    createWritableAtom: <T>(value: T, options?: TableAtomOptions<T>) => {
      return createAtom(value, {
        compare: options?.compare,
      })
    },
  }
}
