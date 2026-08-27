import type {
  Atom,
  AtomOptions,
  ReadonlyAtom,
  Subscription,
} from '@tanstack/store'

export interface TableAtomOptions<T> extends AtomOptions<T> {
  /**
   * A debug name for the atom, useful for debugging.
   */
  debugName: string
}

/**
 * Framework reactivity bindings used by table-core.
 *
 * Adapters (React, Solid, Vue, etc.) provide concrete implementations so
 * core features can create derived/writable atoms and integrate with their
 * scheduling primitives.
 */
export interface TableReactivityBindings {
  createOptionsStore: boolean
  /**
   * Opt-in to the memoized-API write-epoch fast path. Only set this after
   * verifying that every state/options write path in the binding advances
   * `table._epoch` before the next memoized read: writes through the
   * patched base atoms/optionsStore qualify automatically, but bindings
   * that stage state in framework reactivity (live options getters,
   * post-render option-sync effects) can let reads observe new state before
   * the epoch moves, which would serve stale memo results. Bindings without
   * this flag keep the plain per-call dependency check.
   */
  supportsWriteEpoch?: boolean
  wrapExternalAtoms: boolean
  /**
   * Invalidates readonly atoms whose compute reads non-reactive inputs (plain
   * options). Render-phase adapters call this after publishing captured
   * controlled state from a host commit, including when no base atom changed,
   * so controlled ownership changes still reach subscribers.
   */
  commit?: () => void
  addSubscription: (subscription: Subscription) => void
  /**
   * Creates a writable atom with an initial value.
   */
  createWritableAtom: <T>(
    initialValue: T,
    options?: TableAtomOptions<T>,
  ) => Atom<T>
  /**
   * Creates a readonly/derived atom from a compute function.
   */
  createReadonlyAtom: <T>(
    fn: () => T,
    options?: TableAtomOptions<T>,
  ) => ReadonlyAtom<T>
  /**
   * Evaluates a function without tracking reactive dependencies.
   */
  untrack: <T>(fn: () => T) => T
  /**
   * Batches reactive updates to avoid intermediate recomputation.
   */
  batch: (fn: () => void) => void
  /**
   * Schedules a function to run. This is used to defer updates after the current call stack (render, etc.) has finished
   */
  schedule: (fn: () => void) => void
  /**
   * Unmounts the table, performing any necessary cleanup. This is called when the table is destroyed or unmounted in the framework adapter.
   */
  unmount?: () => void
}
