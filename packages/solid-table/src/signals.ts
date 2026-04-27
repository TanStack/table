import {
  createMemo,
  createSignal,
  observable,
  runWithOwner,
  untrack,
} from 'solid-js'
import type { Accessor, Owner, Setter } from 'solid-js'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/solid-store'

function signalToReadonlyAtom<T>(
  signal: Accessor<T>,
  owner: Owner,
): ReadonlyAtom<T> {
  return Object.assign(signal, {
    get: () => signal(),
    subscribe: (observer: Observer<T>) => {
      return runWithOwner(owner, () => observable(signal))!.subscribe(observer)
    },
  })
}

function signalToWritableAtom<T>(
  signalTuple: [Accessor<T>, Setter<T>],
  owner: Owner,
): Atom<T> {
  const [signal, setSignal] = signalTuple
  return Object.assign(signal, {
    set: (updater: T | ((prevVal: T) => T)) => {
      typeof updater === 'function'
        ? setSignal(updater as unknown as (prev: T) => T)
        : setSignal(updater as Exclude<T, Function>)
    },
    get: () => signal(),
    subscribe: (observer: Observer<T>) => {
      return runWithOwner(owner, () => observable(signal))!.subscribe(observer)
    },
  })
}

export function solidReactivity(owner: Owner): TableReactivityBindings {
  return {
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      const signal = createMemo(() => fn(), {
        equals: options?.compare,
        name: options?.debugName,
      })
      return signalToReadonlyAtom(signal, owner)
    },
    createWritableAtom: <T>(
      value: T,
      options?: TableAtomOptions<T>,
    ): Atom<T> => {
      const writableSignal = createSignal(value, {
        equals: options?.compare,
        name: options?.debugName,
      })
      return signalToWritableAtom(writableSignal, owner)
    },
    untrack: untrack,
  }
}
