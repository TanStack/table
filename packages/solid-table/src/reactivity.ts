import {
  createEffect,
  createMemo,
  createSignal,
  runWithOwner,
  untrack,
} from 'solid-js'
import type { Accessor, Owner, Setter } from 'solid-js'
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

function subscribeSignal<T>(
  signal: Accessor<T>,
  owner: Owner,
  next: (value: T) => void,
  error?: (err: unknown) => void,
  complete?: () => void,
): Subscription {
  let active = true
  runWithOwner(owner, () => {
    let first = true
    createEffect(
      () => signal(),
      (value: T) => {
        if (first) {
          first = false
          return
        }
        if (!active) return
        try {
          next(value)
        } catch (err) {
          error?.(err)
        }
      },
    )
  })
  return {
    unsubscribe: () => {
      if (!active) return
      active = false
      complete?.()
    },
  }
}

function makeSubscribe<T>(
  signal: Accessor<T>,
  owner: Owner,
): Atom<T>['subscribe'] {
  function subscribe(observer: Observer<T>): Subscription
  function subscribe(
    next: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void,
  ): Subscription
  function subscribe(
    observerOrNext: Observer<T> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void,
  ): Subscription {
    if (typeof observerOrNext === 'function') {
      return subscribeSignal(signal, owner, observerOrNext, error, complete)
    }
    return subscribeSignal(
      signal,
      owner,
      (v: T) => observerOrNext.next?.(v),
      (e) => observerOrNext.error?.(e),
      () => observerOrNext.complete?.(),
    )
  }
  return subscribe as Atom<T>['subscribe']
}

function signalToReadonlyAtom<T>(
  signal: Accessor<T>,
  owner: Owner,
): ReadonlyAtom<T> {
  return Object.assign(signal, {
    get: () => signal(),
    subscribe: makeSubscribe(signal, owner),
  }) as unknown as ReadonlyAtom<T>
}

function signalToWritableAtom<T>(
  signalTuple: [Accessor<T>, Setter<T>],
  owner: Owner,
): Atom<T> {
  const [signal, setSignal] = signalTuple
  const set = ((updater: T | ((prevVal: T) => T)) => {
    if (typeof updater === 'function') {
      setSignal(updater as unknown as (prev: T) => T)
    } else {
      setSignal(() => updater)
    }
  }) as Atom<T>['set']
  return Object.assign(signal, {
    set,
    get: () => signal(),
    subscribe: makeSubscribe(signal, owner),
  }) as unknown as Atom<T>
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
      const writableSignal = createSignal<T>(value as Exclude<T, Function>, {
        equals: options?.compare,
        name: options?.debugName,
      })
      return signalToWritableAtom(writableSignal, owner)
    },
    untrack: untrack,
    // Solid v2 auto-batches synchronous writes via microtask scheduling, so
    // the explicit batch wrapper is a no-op invocation of the callback.
    batch: (fn: () => void) => {
      fn()
    },
  }
}
