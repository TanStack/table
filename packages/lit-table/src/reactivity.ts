import { batch, createAtom } from '@tanstack/lit-store'
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
