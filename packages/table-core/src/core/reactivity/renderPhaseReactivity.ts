import { createStableStoreReadonlyAtom } from './createStableStoreReadonlyAtom'
import type { Atom, AtomOptions, Observer, ReadonlyAtom } from '@tanstack/store'
import type {
  TableAtomOptions,
  TableReactivityBindings,
} from './coreReactivityFeature.types'

/**
 * Reactivity bindings for adapters whose options are plain values synchronized
 * during the host framework's render phase, with a guaranteed `commit` hook.
 */
export interface RenderPhaseReactivityBindings extends TableReactivityBindings {
  stage: () => number
  getStageToken: () => number
  commit: (token?: number) => void
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
 * Regular readonly atoms are exposed as live facades. `get()` re-evaluates the
 * resolver against the options of the render in progress and caches the result
 * through the configured comparator. Memo-mode atoms use a native computed for
 * cached table APIs. A materially changed staged options source rotates those
 * computeds without notifying subscribers; `subscribe()` observes the current
 * computed only after the matching host commit.
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
  let stagedVersion = 0
  let committedVersion = 0
  const publishStagedAtoms = new Set<() => void>()

  return {
    wrapExternalAtoms: false,
    stage: () => ++stagedVersion,
    getStageToken: () => stagedVersion,
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

      if (atomOptions?.mode === 'memo') {
        let memoVersion = -1
        let memoAtom: ReadonlyAtom<T> | undefined

        const createMemoAtom = () =>
          createStableStoreReadonlyAtom(createAtom, fn, { compare })

        const getMemoAtom = () => {
          if (!memoAtom || memoVersion !== stagedVersion) {
            memoVersion = stagedVersion
            memoAtom = createMemoAtom()
          }

          return memoAtom
        }

        const readMemo = () => getMemoAtom().get()

        // Staging rotates the memo used by render reads without publishing
        // during render. Subscribers observe it only after the host commit.
        const reactiveAtom = createStableStoreReadonlyAtom(
          createAtom,
          () => {
            commitAtom.get()
            return readMemo()
          },
          { compare },
        )

        return {
          get: readMemo,
          subscribe: reactiveAtom.subscribe.bind(reactiveAtom),
        }
      }

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

      const reactiveAtom = createStableStoreReadonlyAtom(
        createAtom,
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
      if (atomOptions?.mode === 'staged') {
        const compare = atomOptions.compare ?? Object.is
        const publishedVersion = createAtom(0)
        let currentValue = value
        let dirty = false

        const publish = () => {
          if (!dirty) {
            return
          }

          dirty = false
          publishedVersion.set((version) => version + 1)
        }

        publishStagedAtoms.add(publish)

        return {
          get: () => {
            // The value itself is live for the render in progress. Reactive
            // consumers only depend on the version published by commit().
            publishedVersion.get()
            return currentValue
          },
          set: (updater: T | ((previous: T) => T)) => {
            const nextValue =
              typeof updater === 'function'
                ? (updater as (previous: T) => T)(currentValue)
                : updater

            if (!compare(currentValue, nextValue)) {
              currentValue = nextValue
              dirty = true
            }
          },
          subscribe: ((observer: Observer<T> | ((value: T) => void)) => {
            let previous = currentValue
            return publishedVersion.subscribe(() => {
              const nextValue = currentValue
              if (!compare(previous, nextValue)) {
                previous = nextValue
                if (typeof observer === 'function') {
                  observer(nextValue)
                } else {
                  observer.next?.(nextValue)
                }
              }
            })
          }) as Atom<T>['subscribe'],
        }
      }

      return createAtom(value, {
        compare: atomOptions?.compare,
      })
    },
    commit: (token = stagedVersion) => {
      // Publish only the newest staged render. Older effects and commits for a
      // token that was superseded by an abandoned render must not publish the
      // newer staged values under the wrong token.
      if (token !== stagedVersion || token <= committedVersion) {
        return
      }

      committedVersion = token
      batch(() => {
        for (const publish of publishStagedAtoms) {
          publish()
        }
        commitAtom.set(() => token)
      })
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
