import { batch, createAtom } from '@tanstack/store'
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
    createOptionsStore: true,
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
