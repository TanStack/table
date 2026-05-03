import type { Atom, AtomOptions, ReadonlyAtom } from '@tanstack/store'

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
}
