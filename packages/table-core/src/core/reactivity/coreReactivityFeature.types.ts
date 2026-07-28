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
  wrapExternalAtoms: boolean
  /**
   * Write-timing strategy. When `true`, `table_setOptions` does NOT mirror
   * `options.state` into the base atoms; the adapter syncs options during its
   * host framework's render phase (where store notifications are illegal or
   * wasteful) and publishes the captured controlled state after the host
   * commits by calling `table_syncExternalStateToBaseAtoms` itself.
   *
   * Leave unset (or `false`) for fine-grained adapters whose `setOptions` runs
   * in a write-safe reactive context (effects, watchers) — eager sync is
   * correct there and keeps same-tick read-after-write consistency.
   */
  deferExternalStateSync?: boolean
  /**
   * Invalidates readonly atoms whose compute reads non-reactive inputs (plain
   * `table.options`). Core calls this at the end of
   * `table_syncExternalStateToBaseAtoms` — including when nothing was
   * published — so resolution changes with no atom write (e.g. a controlled
   * slice released back to internal ownership) still reach subscribers.
   *
   * Required when `deferExternalStateSync` is `true` and `createOptionsStore`
   * is `false`: with plain options and deferred publication there is no other
   * invalidation source. Adapters with a reactive options store never need it.
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
