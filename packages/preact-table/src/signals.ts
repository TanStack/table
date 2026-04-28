import { batch, computed, signal, untracked } from '@preact/signals'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/preact-store'

function observerToCallback<T>(
  observerOrNext: Observer<T> | ((value: T) => void),
): (value: T) => void {
  return typeof observerOrNext === 'function'
    ? observerOrNext
    : (value) => observerOrNext.next?.(value)
}

function signalToReadonlyAtom<T>(source: {
  value: T
  subscribe: (observer: (value: T) => void) => () => void
}): ReadonlyAtom<T> {
  return Object.assign(source, {
    get: () => source.value,
    subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
      const unsubscribe = source.subscribe(observerToCallback(observerOrNext))
      return { unsubscribe }
    }) as ReadonlyAtom<T>['subscribe'],
  })
}

function signalToWritableAtom<T>(source: {
  value: T
  subscribe: (observer: (value: T) => void) => () => void
}): Atom<T> {
  return Object.assign(source, {
    set: (updater: T | ((prevVal: T) => T)) => {
      source.value =
        typeof updater === 'function'
          ? (updater as (prevVal: T) => T)(source.value)
          : updater
    },
    get: () => source.value,
    subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
      const unsubscribe = source.subscribe(observerToCallback(observerOrNext))
      return { unsubscribe }
    }) as Atom<T>['subscribe'],
  })
}

export function preactReactivity(): TableReactivityBindings {
  return {
    createReadonlyAtom: <T>(fn: () => T, _options?: TableAtomOptions<T>) => {
      return signalToReadonlyAtom(computed(fn))
    },
    createWritableAtom: <T>(
      value: T,
      _options?: TableAtomOptions<T>,
    ): Atom<T> => {
      return signalToWritableAtom(signal(value))
    },
    untrack: untracked,
    batch: batch,
  }
}
