import type {
  Atom,
  AtomOptions,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/store'

export interface TableAtomOptions<T> extends AtomOptions<T> {
  debugName: string
}

export interface TableReactivityBindings {
  createWritableAtom: <T>(
    initialValue: T,
    options?: TableAtomOptions<T>,
  ) => Atom<T>
  createReadonlyAtom: <T>(
    fn: () => T,
    options?: TableAtomOptions<T>,
  ) => ReadonlyAtom<T>
  untrack: <T>(fn: () => T) => T
  batch: (fn: () => void) => void
}

export function atomToStore<T>(atom: Atom<T>): Store<T>
export function atomToStore<T>(atom: ReadonlyAtom<T>): ReadonlyStore<T>
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
