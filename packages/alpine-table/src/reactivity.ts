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
    // All state/options writes flow through the table's patched
    // atoms/optionsStore, so the memo epoch fast path is safe here.
    supportsWriteEpoch: true,
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
