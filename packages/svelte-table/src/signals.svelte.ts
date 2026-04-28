import { flushSync, untrack } from 'svelte'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/svelte-store'

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
      callback(getValue())
    })
  })

  return { unsubscribe }
}

export function svelteReactivity(): TableReactivityBindings {
  return {
    createReadonlyAtom: <T>(fn: () => T, _options?: TableAtomOptions<T>) => {
      const value = $derived.by(fn)

      return {
        get: () => value,
        subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
          return subscribeToRune(() => value, observerOrNext)
        }) as ReadonlyAtom<T>['subscribe'],
      }
    },
    createWritableAtom: <T>(
      initialValue: T,
      _options?: TableAtomOptions<T>,
    ): Atom<T> => {
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
    },
    untrack: untrack,
    batch: (fn) => flushSync(fn),
  }
}
