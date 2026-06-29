import {
  createMemo,
  createSignal,
  observable,
  runWithOwner,
  untrack,
} from 'solid-js'
import { batch } from '@tanstack/store'
import type {
  Atom,
  Observer,
  ReadonlyAtom,
  Subscription,
} from '@tanstack/store'
import type { Accessor, Owner, Setter } from 'solid-js'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

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

/**
 * Creates the table-core reactivity bindings used by the Solid adapter.
 *
 * Table state atoms are backed by TanStack Store atoms. The options store stays
 * framework-native because row-model APIs read `table.options` directly during
 * render. Readonly table atoms bridge Store dependency tracking into Solid memos.
 */
export function solidReactivity(owner: Owner): TableReactivityBindings {
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
    batch: batch,
  }
}
