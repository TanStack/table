import {
  createMemo,
  createSignal,
  observable,
  onCleanup,
  runWithOwner,
  untrack,
} from 'solid-js'
import { batch, createAtom } from '@tanstack/solid-store'
import type { Accessor, Owner, Setter } from 'solid-js'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'
import type { Atom, Observer, ReadonlyAtom } from '@tanstack/solid-store'

const optionsStoreDebugName = 'table/optionsStore'

function signalToReadonlyAtom<T>(
  signal: Accessor<T>,
  getSource: () => T,
  owner: Owner,
): ReadonlyAtom<T> {
  return Object.assign(signal, {
    get: () => {
      const value = getSource()
      signal()
      return value
    },
    subscribe: (observer: Observer<T>) => {
      return runWithOwner(owner, () => observable(signal))!.subscribe(observer)
    },
  })
}

function signalToWritableAtom<T>(
  signal: Accessor<T>,
  setSignal: Setter<T>,
  owner: Owner,
): Atom<T> {
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
  return {
    createOptionsStore: true,
    schedule: (fn) => queueMicrotask(() => fn()),
    createReadonlyAtom: <T>(fn: () => T, options?: TableAtomOptions<T>) => {
      const storeAtom = createAtom(() => fn(), {
        compare: options?.compare,
      })
      const [version, setVersion] = createSignal(0, { equals: false })
      runWithOwner(owner, () => {
        const subscription = storeAtom.subscribe(() => {
          setVersion((value) => value + 1)
        })
        onCleanup(() => subscription.unsubscribe())
      })

      const signal = createMemo(
        () => {
          version()
          return storeAtom.get()
        },
        undefined,
        {
          equals: options?.compare,
          name: options?.debugName,
        },
      )
      return signalToReadonlyAtom(signal, () => storeAtom.get(), owner)
    },
    createWritableAtom: <T>(
      value: T,
      options?: TableAtomOptions<T>,
    ): Atom<T> => {
      if (options?.debugName === optionsStoreDebugName) {
        const [signal, setSignal] = createSignal(value, {
          equals: options.compare,
          name: options.debugName,
        })
        return signalToWritableAtom(signal, setSignal, owner)
      }

      return createAtom(value, {
        compare: options?.compare,
      })
    },
    untrack: untrack,
    batch: batch,
  }
}
