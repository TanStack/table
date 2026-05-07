import { batch, createAtom } from '@tanstack/store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

export function litReactivity(): TableReactivityBindings {
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
