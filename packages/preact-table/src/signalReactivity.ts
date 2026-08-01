import { batch, computed, effect, signal, untracked } from '@preact/signals'
import type { Signal } from '@preact/signals'
import type {
  Atom,
  Observer,
  ReadonlyAtom,
  Subscription,
} from '@tanstack/preact-store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from '@tanstack/table-core/reactivity'

export type PreactSignalReactivityBindings = TableReactivityBindings

function makeSubscribe<T>(
  read: () => T,
  cleanups: Set<() => void>,
): Atom<T>['subscribe'] {
  return ((observerOrNext: Observer<T> | ((value: T) => void)) => {
    const observer =
      typeof observerOrNext === 'function'
        ? { next: observerOrNext }
        : observerOrNext
    // The effect's initial run only establishes dependency tracking; store
    // subscriptions notify on change, not on subscribe.
    let initialRun = true
    const dispose = effect(() => {
      const value = read()
      if (initialRun) {
        initialRun = false
        return
      }
      observer.next?.(value)
    })
    cleanups.add(dispose)
    return {
      unsubscribe: () => {
        cleanups.delete(dispose)
        dispose()
      },
    }
  }) as Atom<T>['subscribe']
}

/**
 * Wraps a Preact signal in the TanStack Store `Atom` interface so it can be
 * passed to the table's `atoms` option as external state.
 *
 * @example
 * ```tsx
 * const sorting = signal<SortingState>([])
 *
 * const table = useSignalTable({
 *   features,
 *   columns,
 *   data,
 *   atoms: { sorting: signalAtom(sorting) },
 * })
 * ```
 */
export function signalAtom<T>(sig: Signal<T>): Atom<T> {
  const cleanups = new Set<() => void>()
  return {
    get: () => sig.value,
    set: (updater: T | ((prevVal: T) => T)) => {
      sig.value =
        typeof updater === 'function'
          ? (updater as (prevVal: T) => T)(sig.peek())
          : updater
    },
    subscribe: makeSubscribe(() => sig.value, cleanups),
  }
}

/**
 * Creates the table-core reactivity bindings used by `useSignalTable`.
 *
 * Unlike `renderReactivity` (which stores state in TanStack Store atoms and
 * synchronizes through Preact's render/commit cycle), these bindings back
 * every table atom with a native Preact signal. Because `@preact/signals`
 * auto-subscribes any component that reads a signal during render, table API
 * calls made in render (e.g. `table.getRowModel()`) subscribe that component
 * to exactly the state they read — no selectors needed.
 *
 * Mirrors the Solid adapter's bindings: options live in a writable atom so
 * option-dependent derivations invalidate reactively, and external store
 * atoms are wrapped into signals so their reads participate in signal
 * dependency tracking.
 */
export function signalReactivity(): PreactSignalReactivityBindings {
  const cleanups = new Set<() => void>()

  return {
    createOptionsStore: true,
    wrapExternalAtoms: true,
    addSubscription: (subscription: Subscription) => {
      cleanups.add(() => subscription.unsubscribe())
    },
    unmount: () => {
      cleanups.forEach((cleanup) => cleanup())
      cleanups.clear()
    },
    schedule: (fn) => queueMicrotask(() => fn()),
    batch,
    untrack: untracked,
    createReadonlyAtom: <T>(
      fn: () => T,
      options?: TableAtomOptions<T>,
    ): ReadonlyAtom<T> => {
      const compare = options?.compare
      // Computeds only skip downstream propagation on `===`; re-returning the
      // previous value when the comparator matches keeps snapshots
      // referentially stable so custom equality still short-circuits.
      let previous: T
      let hasPrevious = false
      const sig = computed(() => {
        const next = fn()
        if (
          hasPrevious &&
          (compare ? compare(previous, next) : Object.is(previous, next))
        ) {
          return previous
        }
        previous = next
        hasPrevious = true
        return next
      })
      return {
        get: () => sig.value,
        subscribe: makeSubscribe(() => sig.value, cleanups),
      }
    },
    createWritableAtom: <T>(
      initialValue: T,
      options?: TableAtomOptions<T>,
    ): Atom<T> => {
      const compare = options?.compare
      const sig = signal(initialValue)
      return {
        get: () => sig.value,
        set: (updater: T | ((prevVal: T) => T)) => {
          const next =
            typeof updater === 'function'
              ? (updater as (prevVal: T) => T)(sig.peek())
              : updater
          if (compare?.(sig.peek(), next)) return
          sig.value = next
        },
        subscribe: makeSubscribe(() => sig.value, cleanups),
      }
    },
  }
}
