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
 * Creates reactivity bindings for render-phase adapters (React, Preact, Lit):
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
 * dependencies plus a commit version, so subscribers are invalidated by
 * actual reactive writes and by the adapter's post-commit publication.
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
    // Options are plain data re-synchronized through `table_setOptions`
    // during render (which bumps the epoch before any read of the new
    // render), and all state writes flow through the patched base atoms, so
    // the memo epoch fast path is safe for render-phase adapters.
    supportsWriteEpoch: true,
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

type SelectionSource<T> = {
  get: () => T
  subscribe: (listener: (value: T) => void) => { unsubscribe: () => void }
}

export interface RenderPhaseSource<T> extends SelectionSource<T> {
  /**
   * Records the snapshot observed by a render that actually committed.
   */
  markCommitted: (snapshot: T) => void
}

/**
 * Creates a render-phase source with an explicit commit baseline.
 *
 * Render-phase adapters publish controlled state after the host framework
 * commits so isolated subscribers update, but the component that owns the
 * table already rendered that exact snapshot — forwarding the notification to
 * its root subscription would produce a redundant render. Unlike a last-read
 * filter, speculative reads do not change notification behavior: only
 * `markCommitted()` advances the baseline.
 */
export function createRenderPhaseSource<T>(
  source: SelectionSource<T>,
  compare: (committed: T, published: T) => boolean = Object.is,
): RenderPhaseSource<T> {
  let hasCommittedSnapshot = false
  let committedSnapshot: T

  return {
    get: source.get,
    markCommitted: (snapshot) => {
      committedSnapshot = snapshot
      hasCommittedSnapshot = true
    },
    subscribe: (listener) =>
      source.subscribe((value) => {
        if (!hasCommittedSnapshot || !compare(committedSnapshot, value)) {
          listener(value)
        }
      }),
  }
}
