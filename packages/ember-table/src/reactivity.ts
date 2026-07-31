import type { Subscription } from '@tanstack/store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

import { untrack } from '@glimmer/validator'
import { computed, signal } from './signal.ts'

export function emberReactivity(): TableReactivityBindings {
  const subscriptions = new Set<Subscription>()

  return {
    wrapExternalAtoms: true,

    // timing is not important, but the main thing is that the work does *not*
    // happen during the render phase.
    schedule: (fn) => queueMicrotask(() => fn()),
    batch: (fn) => fn(),
    untrack,
    // @cached
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      const compare = options?.compare ?? Object.is
      let hasStableValue = false
      let stableValue: T

      return computed(() => {
        const nextValue = fn()
        if (!hasStableValue || !compare(stableValue, nextValue)) {
          stableValue = nextValue
          hasStableValue = true
        }
        return stableValue
      })
    },
    // @tracked
    createWritableAtom: <T>(value: T, options?: TableAtomOptions<T>) => {
      return signal(value, options)
    },
    // Not for the ember integration, but for the tanstack inspector
    addSubscription: (subscription) => {
      subscriptions.add(subscription)
    },
    unmount: () => {
      subscriptions.forEach((s) => s.unsubscribe())
      subscriptions.clear()
    },
  }
}
