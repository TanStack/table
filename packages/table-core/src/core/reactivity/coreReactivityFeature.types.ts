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
