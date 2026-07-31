import { untrack } from 'svelte'
import { createSubscriber } from 'svelte/reactivity'
import { batch, createAtom } from '@tanstack/svelte-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/svelte-store'

function observerToCallback<T>(
  observerOrNext: Observer<T> | ((value: T) => void),
): (value: T) => void {
  return typeof observerOrNext === 'function'
    ? observerOrNext
    : (value) => observerOrNext.next?.(value)
}

function createStableReadonlyAtom<T>(
  fn: () => T,
  compare: (previous: T, next: T) => boolean,
): ReadonlyAtom<T> {
  let stableBox: { value: T } | undefined
  const boxedAtom = createAtom(
    () => {
      const nextValue = fn()
      if (!stableBox || !compare(stableBox.value, nextValue)) {
        stableBox = { value: nextValue }
      }
      return stableBox
    },
  )

  return {
    get: () => boxedAtom.get().value,
    subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
      const callback = observerToCallback(observerOrNext)
      return boxedAtom.subscribe((box) => callback(box.value))
    }) as ReadonlyAtom<T>['subscribe'],
  }
}

/**
 * Creates the table-core reactivity bindings used by the Svelte adapter.
 *
 * Table state and option atoms bridge Store dependency tracking into
 * `$derived.by`, so their `.get()` methods participate in Svelte dependency
 * tracking when called in templates, `$derived`, or `$effect`.
 */
export function svelteReactivity(): TableReactivityBindings {
  return {
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
      const storeAtom = createStableReadonlyAtom(
        fn,
        _options?.compare ?? Object.is,
      )
      const trackStore = createSubscriber((update) => {
        const subscription = storeAtom.subscribe(() => {
          update()
        })

        return () => subscription.unsubscribe()
      })

      return {
        get: () => {
          trackStore()
          return storeAtom.get()
        },
        subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
          return storeAtom.subscribe(observerToCallback(observerOrNext))
        }) as ReadonlyAtom<T>['subscribe'],
      }
    },
    createWritableAtom: <T>(
      initialValue: T,
      _options?: TableAtomOptions<T>,
    ): Atom<T> => {
      return createAtom(initialValue, {
        compare: _options?.compare,
      })
    },
    untrack: untrack,
    batch,
  }
}
