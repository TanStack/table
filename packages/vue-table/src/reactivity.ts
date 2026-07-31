import { computed, shallowRef, watch } from 'vue'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type {
  Atom,
  Observer,
  ReadonlyAtom,
  Subscription,
} from '@tanstack/store'
import type { ComputedRef, ShallowRef } from 'vue'

function observerToCallback<T>(
  observerOrNext: Observer<T> | ((value: T) => void),
): (value: T) => void {
  return typeof observerOrNext === 'function'
    ? observerOrNext
    : (value) => observerOrNext.next?.(value)
}

function refToReadonlyAtom<T>(
  source: ComputedRef<T> | ShallowRef<T>,
): ReadonlyAtom<T> {
  return Object.assign(source, {
    get: () => source.value,
    subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
      const stop = watch(source, observerToCallback(observerOrNext), {
        flush: 'sync',
      })
      return { unsubscribe: stop }
    }) as ReadonlyAtom<T>['subscribe'],
  })
}

function refToWritableAtom<T>(source: ShallowRef<T>): Atom<T> {
  return Object.assign(source, {
    set: (updater: T | ((prevVal: T) => T)) => {
      source.value =
        typeof updater === 'function'
          ? (updater as (prevVal: T) => T)(source.value)
          : updater
    },
    get: () => source.value,
    subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
      const stop = watch(source, observerToCallback(observerOrNext), {
        flush: 'sync',
      })
      return { unsubscribe: stop }
    }) as Atom<T>['subscribe'],
  })
}

/**
 * Creates the table-core reactivity bindings used by the Vue adapter.
 *
 * Table state and option atoms bridge table-core reads into Vue computed refs.
 */
export function vueReactivity(): TableReactivityBindings {
  const subscriptions = new Set<Subscription>()

  return {
    wrapExternalAtoms: true,
    addSubscription: (subscription) => {
      subscriptions.add(subscription)
    },
    unmount: () => {
      subscriptions.forEach((s) => s.unsubscribe())
      subscriptions.clear()
    },
    schedule: (fn) => queueMicrotask(() => fn()),
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      const compare = options?.compare ?? Object.is
      let hasStableValue = false
      let stableValue: T

      return refToReadonlyAtom(
        computed(() => {
          const nextValue = fn()
          if (!hasStableValue || !compare(stableValue, nextValue)) {
            stableValue = nextValue
            hasStableValue = true
          }
          return stableValue
        }),
      )
    },
    createWritableAtom: <T>(
      value: T,
      _options?: TableAtomOptions<T>,
    ): Atom<T> => {
      return refToWritableAtom(shallowRef(value) as ShallowRef<T>)
    },
    untrack: (fn) => fn(),
    batch: (fn) => fn(),
  }
}
