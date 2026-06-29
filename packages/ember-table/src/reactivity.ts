import { batch, createAtom } from '@tanstack/store'
import type { Subscription } from '@tanstack/store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

export function emberReactivity(): TableReactivityBindings {
  const subscriptions = new Set<Subscription>()

  return {
    createOptionsStore: true,
    wrapExternalAtoms: false,
    addSubscription: (subscription) => {
      subscriptions.add(subscription)
    },
    unmount: () => {
      subscriptions.forEach((s) => s.unsubscribe())
      subscriptions.clear()
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
