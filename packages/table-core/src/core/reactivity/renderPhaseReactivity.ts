import type { Atom, AtomOptions, ReadonlyAtom } from '@tanstack/store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from './coreReactivityFeature.types'

/**
 * Reactivity bindings for adapters whose options are plain values synchronized
 * during the host framework's render phase, with a guaranteed `commit` hook.
 */
export interface RenderPhaseReactivityBindings extends TableReactivityBindings {
  commit: () => void
}

/**
 * Store primitives supplied by the adapter.
 *
 * They MUST come from the adapter's own store package (e.g.
 * `@tanstack/react-store`) rather than table-core's copy: dependency tracking
 * and batching share module-global state, so atoms created here must live in
 * the same store instance as user-provided external atoms and adapter
 * subscriptions.
 */
export interface RenderPhaseReactivityPrimitives {
  createAtom: {
    <T>(getValue: (prev?: T) => T, options?: AtomOptions<T>): ReadonlyAtom<T>
    <T>(initialValue: T, options?: AtomOptions<T>): Atom<T>
  }
  batch: (fn: () => void) => void
  /**
   * Overrides the deferred-scheduling primitive (defaults to
   * `queueMicrotask`).
   */
  schedule?: (fn: () => void) => void
}

/**
 * Creates reactivity bindings for render-phase adapters (React, Preact):
 * frameworks with plain, non-reactive options that are re-synchronized during
 * component render, where store notifications must not fire until the host
 * commits.
 *
 * Readonly atoms are exposed as live facades. `get()` re-evaluates the
 * resolver against the options of the render in progress — a normal computed
 * cannot know that plain `options.state` changed — and caches the result
 * through the configured comparator so external-store consumers (e.g. React's
 * `useSyncExternalStore`) see referentially stable snapshots. `subscribe()`
 * goes through a hidden computed that tracks the resolver's real atom
 * dependencies plus a commit version, so subscribers are invalidated only by
 * actual reactive writes or by `commit()` after the host framework commits.
 *
 * Sets `deferExternalStateSync`, so `table_setOptions` leaves base-atom
 * publication to the adapter's post-commit
 * `table_syncExternalStateToBaseAtoms` call (which invokes `commit` itself).
 *
 * @example
 * ```ts
 * import { batch, createAtom } from '@tanstack/react-store'
 *
 * export const reactReactivity = () =>
 *   renderPhaseReactivity({ createAtom, batch })
 * ```
 */
export function renderPhaseReactivity(
  primitives: RenderPhaseReactivityPrimitives,
): RenderPhaseReactivityBindings {
  const { createAtom, batch } = primitives
  const commitAtom = createAtom(0)

  return {
    createOptionsStore: false,
    wrapExternalAtoms: false,
    deferExternalStateSync: true,
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
    schedule: primitives.schedule ?? ((fn) => queueMicrotask(fn)),
    batch,
    untrack: (fn) => fn(),
    createReadonlyAtom: <T>(fn: () => T, atomOptions?: TableAtomOptions<T>) => {
      const compare = atomOptions?.compare ?? Object.is
      let hasSnapshot = false
      let snapshot: T

      const getSnapshot = () => {
        const nextSnapshot = fn()

        if (!hasSnapshot || !compare(snapshot, nextSnapshot)) {
          snapshot = nextSnapshot
          hasSnapshot = true
        }

        return snapshot
      }

      const reactiveAtom = createAtom<T>(
        () => {
          commitAtom.get()
          return getSnapshot()
        },
        { compare },
      )

      return {
        get: getSnapshot,
        subscribe: reactiveAtom.subscribe.bind(reactiveAtom),
      }
    },
    createWritableAtom: <T>(value: T, atomOptions?: TableAtomOptions<T>) => {
      return createAtom(value, {
        compare: atomOptions?.compare,
      })
    },
    commit: () => {
      commitAtom.set((version) => version + 1)
    },
  }
}

/**
 * Wraps a store-shaped source so notifications that merely republish the
 * snapshot the consumer has already read through `get()` are dropped.
 *
 * Render-phase adapters publish controlled state after the host framework
 * commits so isolated subscribers update, but the component that owns the
 * table already rendered that exact snapshot — forwarding the notification to
 * its root subscription would make the host re-render it once per controlled
 * update just to find nothing changed. Readonly atoms return referentially
 * stable snapshots while semantically unchanged, so a reference check
 * suffices.
 *
 * Only the returned source is filtered; other subscribers of the underlying
 * store still receive every notification.
 */
export function createCommitFilteredSource<T>(source: {
  get: () => T
  subscribe: (listener: (value: T) => void) => { unsubscribe: () => void }
}): {
  get: () => T
  subscribe: (listener: (value: T) => void) => { unsubscribe: () => void }
} {
  let lastSeenSnapshot: T | undefined

  return {
    get: () => {
      lastSeenSnapshot = source.get()
      return lastSeenSnapshot
    },
    subscribe: (listener) =>
      source.subscribe((value) => {
        if (value !== lastSeenSnapshot) {
          listener(value)
        }
      }),
  }
}
