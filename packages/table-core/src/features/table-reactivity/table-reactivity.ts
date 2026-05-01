import type {
  Atom,
  AtomOptions,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
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

/**
 * Converts a writable atom to the store-compatible shape expected by core.
 */
export function atomToStore<T>(atom: Atom<T>): Store<T>
/**
 * Converts a readonly atom to a readonly store-compatible shape.
 */
export function atomToStore<T>(atom: ReadonlyAtom<T>): ReadonlyStore<T>
/**
 * Bridges atom instances to the `Store`/`ReadonlyStore` API by exposing
 * a `state` getter backed by `atom.get()`, and wiring `setState` for
 * writable atoms.
 */
export function atomToStore<T>(
  atom: Atom<T> | ReadonlyAtom<T>,
): Store<T> | ReadonlyStore<T> {
  const store: Store<T> = atom as Store<T>
  Object.defineProperty(atom, 'state', {
    get() {
      return atom.get()
    },
  })
  if ('set' in atom) {
    store.setState = atom.set.bind(atom)
  }
  return store
}
