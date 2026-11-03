import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  runWithOwner,
  untrack,
} from 'solid-js'
import type {
  Atom,
  Observer,
  ReadonlyAtom,
  Subscription,
} from '@tanstack/store'
import type { Accessor, Owner } from 'solid-js'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

/**
 * Subscribes an observer to a Solid accessor. The observer hears each change
 * once it commits, not the value the accessor had when subscribing.
 */
function subscribeToSignal<T>(
  signal: Accessor<T>,
  owner: Owner,
  observer: Observer<T> | ((value: T) => void),
): Subscription {
  const next = (value: T) =>
    typeof observer === 'function' ? observer(value) : observer.next?.(value)
  let dispose!: () => void
  runWithOwner(owner, () =>
    createRoot((d) => {
      dispose = d
      // Like a TanStack Store subscription, report changes only, starting
      // from the value at subscribe time.
      let last = untrack(signal)
      createEffect(signal, (value) => {
        if (value === last) return
        last = value
        next(value)
      })
    }),
  )
  return { unsubscribe: () => dispose() }
}

function signalToReadonlyAtom<T>(
  signal: Accessor<T>,
  owner: Owner,
): ReadonlyAtom<T> {
  return Object.assign(signal, {
    get: () => signal(),
    subscribe: (observer: Observer<T> | ((value: T) => void)) =>
      subscribeToSignal(signal, owner, observer),
  })
}

/**
 * Creates the table-core reactivity bindings used by the Solid adapter.
 *
 * Table state atoms are Solid signals, and derived atoms are Solid memos, so
 * table APIs read inside JSX, memos and effects track exactly what they use.
 *
 * Solid 2 applies writes when it flushes, so a read straight after a write in
 * the same tick sees the committed value. Table-core writes through updater
 * functions, which do see the pending value, so its own updates compose.
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
      // Solid reads a function passed to `createSignal` as a compute
      // function, so a function value is wrapped to stay a plain value.
      const [signal, setSignal] = createSignal<T>(
        (typeof value === 'function' ? () => value : value) as never,
        {
          equals: options?.compare,
          name: options?.debugName,
          // Table-core writes state from inside computations: syncing
          // controlled state and options, and syncing external atoms.
          ownedWrite: true,
        },
      )
      return Object.assign(signalToReadonlyAtom(signal, owner), {
        set: (updater: T | ((prevVal: T) => T)) => {
          setSignal(
            (typeof updater === 'function' ? updater : () => updater) as never,
          )
        },
      })
    },
    untrack,
    // Solid 2 batches every write until the next flush.
    batch: (fn) => fn(),
  }
}
