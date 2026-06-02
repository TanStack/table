import {
  computed,
  getCurrentScope,
  onScopeDispose,
  shallowRef,
  watch,
} from 'vue'
import { batch, createAtom } from '@tanstack/vue-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/vue-store'
import type { ComputedRef, ShallowRef } from 'vue'

const optionsStoreDebugName = 'table/optionsStore'

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
    createReadonlyAtom: <T>(fn: () => T, _options?: TableAtomOptions<T>) => {
      const storeAtom = createAtom(() => fn(), {
        compare: _options?.compare,
      })
      const version = shallowRef(0)
      const subscription = storeAtom.subscribe(() => {
        version.value += 1
      })
      if (getCurrentScope()) {
        onScopeDispose(() => subscription.unsubscribe())
      }

      return refToReadonlyAtom(
        computed(() => {
          version.value
          return storeAtom.get()
        }),
      )
    },
    createWritableAtom: <T>(
      value: T,
      _options?: TableAtomOptions<T>,
    ): Atom<T> => {
      if (_options?.debugName === optionsStoreDebugName) {
        return refToWritableAtom(shallowRef(value) as ShallowRef<T>)
      }

      return createAtom(value, {
        compare: _options?.compare,
      })
    },
    untrack: (fn) => fn(),
    batch,
  }
}
