import { computed, shallowRef, watch } from 'vue'
import { batch } from '@tanstack/store'
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
 * Table state atoms are backed by TanStack Store atoms. The options store stays
 * framework-native because row-model APIs read `table.options` directly during
 * render. Readonly table atoms bridge Store dependency tracking into Vue computed
 * refs.
 */
export function vueReactivity(): TableReactivityBindings {
  const subscriptions = new Set<Subscription>()

  return {
    createOptionsStore: true,
    wrapExternalAtoms: true,
    addSubscription: (subscription) => {
      subscriptions.add(subscription)
    },
    unmount: () => {
      subscriptions.forEach((s) => s.unsubscribe())
      subscriptions.clear()
    },
    schedule: (fn) => queueMicrotask(() => fn()),
    createReadonlyAtom: <T>(fn: () => T, _options?: TableAtomOptions<T>) => {
      return refToReadonlyAtom(computed(() => fn()))
    },
    createWritableAtom: <T>(
      value: T,
      _options?: TableAtomOptions<T>,
    ): Atom<T> => {
      return refToWritableAtom(shallowRef(value) as ShallowRef<T>)
    },
    untrack: (fn) => fn(),
    batch,
  }
}
