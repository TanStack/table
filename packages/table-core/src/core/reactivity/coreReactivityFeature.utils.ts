import type { Atom, ReadonlyAtom, ReadonlyStore, Store } from '@tanstack/store'

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
