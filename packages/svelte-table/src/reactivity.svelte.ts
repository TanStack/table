import { untrack } from 'svelte'
import { batch, createAtom } from '@tanstack/svelte-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/svelte-store'

const optionsStoreDebugName = 'table/optionsStore'

function observerToCallback<T>(
  observerOrNext: Observer<T> | ((value: T) => void),
): (value: T) => void {
  return typeof observerOrNext === 'function'
    ? observerOrNext
    : (value) => observerOrNext.next?.(value)
}

function subscribeToRune<T>(
  getValue: () => T,
  observerOrNext: Observer<T> | ((value: T) => void),
) {
  const callback = observerToCallback(observerOrNext)
  const unsubscribe = $effect.root(() => {
    $effect(() => {
      const value = getValue()
      untrack(() => callback(value))
    })
  })

  return { unsubscribe }
}

function createRuneWritableAtom<T>(initialValue: T): Atom<T> {
  let value = $state(initialValue)

  return {
    set: (updater: T | ((prevVal: T) => T)) => {
      value =
        typeof updater === 'function'
          ? (updater as (prevVal: T) => T)(value)
          : updater
    },
    get: () => value,
    subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
      return subscribeToRune(() => value, observerOrNext)
    }) as Atom<T>['subscribe'],
  }
}

/**
 * Creates the table-core reactivity bindings used by the Svelte adapter.
 *
 * Table state atoms are backed by TanStack Store atoms. The options store stays
 * framework-native because row-model APIs read `table.options` directly during
 * render. Readonly table atoms bridge Store dependency tracking into `$derived.by`.
 */
export function svelteReactivity(): TableReactivityBindings {
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
      let version = $state(0)

      $effect(() => {
        const subscription = storeAtom.subscribe(() => {
          version += 1
        })

        return () => subscription.unsubscribe()
      })

      const value = $derived.by(() => {
        version
        return storeAtom.get()
      })

      return {
        get: () => {
          const currentValue = storeAtom.get()
          value
          return currentValue
        },
        subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
          return subscribeToRune(() => value, observerOrNext)
        }) as ReadonlyAtom<T>['subscribe'],
      }
    },
    createWritableAtom: <T>(
      initialValue: T,
      _options?: TableAtomOptions<T>,
    ): Atom<T> => {
      if (_options?.debugName === optionsStoreDebugName) {
        return createRuneWritableAtom(initialValue)
      }

      return createAtom(initialValue, {
        compare: _options?.compare,
      })
    },
    untrack: untrack,
    batch,
  }
}
