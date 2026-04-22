import { ReadonlyStore, Store } from '@tanstack/store'
import type { Atom, AtomOptions, ReadonlyAtom } from '@tanstack/store'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

interface TableReactivityFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

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
}

export function atomToStore<T>(atom: Atom<T>): Store<T> {
  // TODO: just reuse store class, fix type issue this is just a fast workaround
  const store = new Store<T>({} as T)
  store['atom'] = atom
  return store
}

export function readonlyAtomToStore<T>(
  atom: ReadonlyAtom<T>,
): ReadonlyStore<T> {
  // TODO: just reuse store class, fix type issue this is just a fast workaround
  const store = new ReadonlyStore<T>({} as T)
  store['atom'] = atom
  return store
}

interface AtomLike {
  get: () => unknown
}

function isAtomLike(value: unknown): value is AtomLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { get?: unknown }).get === 'function'
  )
}
