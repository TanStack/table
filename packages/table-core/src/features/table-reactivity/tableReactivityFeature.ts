import type { ReadonlyStore, Store } from '@tanstack/store'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

interface TableReactivityFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export function constructReactivityFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(bindings: {
  stateNotifier?: () => unknown
  optionsNotifier?: () => unknown
}): TableFeature<TableReactivityFeatureConstructors<TFeatures, TData>> {
  return {
    constructTableAPIs: (table) => {
      table.store = bindStore(table.store, bindings.stateNotifier)
      table.optionsStore = bindStore(
        table.optionsStore,
        bindings.optionsNotifier,
      )
      // Also wrap per-slice atoms so that feature code reading
      // `table.atoms.<slice>.get()` (or the writable `table.baseAtoms` variant)
      // registers a framework reactivity dep, the same way
      // `table.store.state` does above.
      table.atoms = bindAtoms(table.atoms, bindings.stateNotifier)
      table.baseAtoms = bindAtoms(table.baseAtoms, bindings.stateNotifier)
    },
  }
}

const bindStore = <T extends Store<any> | ReadonlyStore<any>>(
  store: T,
  notifier?: () => unknown,
): T => {
  const stateDescriptor = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(store),
    'state',
  )!

  Object.defineProperty(store, 'state', {
    configurable: true,
    enumerable: true,
    get() {
      notifier?.()
      return stateDescriptor.get!.call(store)
    },
  })

  return store
}

// Wraps an atoms/baseAtoms map so that `.get()` on any individual atom
// calls the framework notifier first — matching how `bindStore` wraps
// `store.state`. The proxy also transparently forwards missing slices
// (atoms for features not registered on this table) as `undefined`.
const bindAtoms = <T extends object>(atoms: T, notifier?: () => unknown): T => {
  if (!notifier) return atoms
  // Cache wrapped atoms so referential identity is stable per slice.
  const wrappedCache = new Map<PropertyKey, any>()
  return new Proxy(atoms, {
    get(target, prop, receiver) {
      const atom = Reflect.get(target, prop, receiver) as unknown
      if (!atom || typeof prop !== 'string' || !isAtomLike(atom)) {
        return atom
      }
      if (wrappedCache.has(prop)) return wrappedCache.get(prop)
      const originalGet = atom.get.bind(atom)
      const wrapped = new Proxy(atom, {
        get(atomTarget, atomProp, atomReceiver) {
          if (atomProp === 'get') {
            return () => {
              notifier()
              return originalGet()
            }
          }
          return Reflect.get(atomTarget, atomProp, atomReceiver)
        },
      })
      wrappedCache.set(prop, wrapped)
      return wrapped
    },
  })
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
