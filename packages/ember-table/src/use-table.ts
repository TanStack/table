import { constructTable } from '@tanstack/table-core'
import { registerDestructor } from '@ember/destroyable'
import { untrack } from '@glimmer/validator'
import { emberReactivity } from './reactivity.ts'
import { computed, subscribeNoEffect } from './signal.ts'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Atom, ReadonlyAtom, ReadonlyStore } from '@tanstack/store'

// Internal table slots used by the per-slice state wiring below.
// `Table_Internal` is not exported from the table-core build, so the shape is
// declared structurally here.
interface TableInternals {
  baseAtoms: Record<
    string,
    {
      get(): unknown
      set(value: unknown): void
    }
  >
  atoms: Record<string, unknown>
}

const staticOptionKeys = new Set<PropertyKey>([
  'atoms',
  'features',
  'initialState',
  'mergeOptions',
])

/**
 * Creates an Ember-reactive table.
 *
 * Pass the containing component (or another Ember destroyable) as the first
 * argument to tie external-atom subscriptions to its lifecycle. The one-arg
 * form remains available for standalone tables that do not have an Ember
 * owner.
 */
export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  owner: object,
  getOptions: () => TableOptions<TFeatures, TData>,
): Table<TFeatures, TData>
export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(getOptions: () => TableOptions<TFeatures, TData>): Table<TFeatures, TData>
export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  ownerOrGetOptions: object | (() => TableOptions<TFeatures, TData>),
  maybeGetOptions?: () => TableOptions<TFeatures, TData>,
): Table<TFeatures, TData> {
  const hasOwner = maybeGetOptions !== undefined
  const owner = hasOwner ? ownerOrGetOptions : undefined
  const getOptions = (
    hasOwner ? maybeGetOptions : ownerOrGetOptions
  ) as () => TableOptions<TFeatures, TData>
  const reactivity = emberReactivity()

  // Creates reactive read only signal for options
  const userOptions = computed(getOptions)

  // Untracked to prevent possible "set on same computation as read" errors in Ember.
  const initialOptions = untrack(() => userOptions.get())
  const imperativeOptionKeys = new Set<PropertyKey>()

  const mergeOptions = (
    defaultOptions: TableOptions<TFeatures, TData>,
    newOptions: Partial<TableOptions<TFeatures, TData>>,
  ) => {
    for (const key of Reflect.ownKeys(newOptions)) {
      if (staticOptionKeys.has(key)) {
        continue
      }

      const currentHasKey = Reflect.has(defaultOptions, key)
      const nextValue = Reflect.get(newOptions, key, newOptions) as unknown
      const currentValue = currentHasKey
        ? (Reflect.get(
            defaultOptions,
            key,
            defaultOptions,
          ) as unknown)
        : undefined

      if (!currentHasKey || !Object.is(currentValue, nextValue)) {
        imperativeOptionKeys.add(key)
      }
    }

    return {
      ...defaultOptions,
      ...newOptions,
    }
  }

  const table = constructTable<TFeatures, TData>({
    ...initialOptions,
    features: {
      coreReactivityFeature: reactivity,
      ...initialOptions.features,
    },
    mergeOptions,
  }) as Table<TFeatures, TData> & TableInternals

  // Keep Ember-specific getter tracking in the adapter. Core option atoms only
  // store resolved values; these wrappers read the latest tracked user option
  // until an imperative setOptions/optionAtoms write takes ownership.
  for (const key of Reflect.ownKeys(table.optionAtoms)) {
    if (key === 'snapshotVersion' || staticOptionKeys.has(key)) {
      continue
    }

    const coreAtom = table.optionAtoms[
      key as keyof typeof table.optionAtoms
    ] as Atom<unknown>
    const trackedAtom = {
      get: () => {
        if (imperativeOptionKeys.has(key)) {
          return coreAtom.get()
        }

        const currentOptions = userOptions.get()
        return Reflect.has(currentOptions, key)
          ? Reflect.get(currentOptions, key, currentOptions)
          : coreAtom.get()
      },
      subscribe: coreAtom.subscribe.bind(coreAtom),
      set: coreAtom.set.bind(coreAtom),
    }

    Object.defineProperty(table.optionAtoms, key, {
      configurable: true,
      enumerable: true,
      value: trackedAtom,
      writable: false,
    })
  }

  const atoms: Record<string, ReadonlyAtom<unknown>> = table.atoms
  const stateKeys = Object.keys(table.baseAtoms)

  const stateProxy: TableState<TFeatures> = new Proxy(
    {},
    {
      get: (_target, key) =>
        typeof key === 'string' ? atoms[key]?.get() : undefined,
      has: (_target, key) => typeof key === 'string' && stateKeys.includes(key),
      ownKeys: () => stateKeys,
      getOwnPropertyDescriptor: (_target, key) =>
        typeof key === 'string' && stateKeys.includes(key)
          ? {
              enumerable: true,
              configurable: true,
              value: atoms[key]!.get(),
            }
          : undefined,
    },
  ) as TableState<TFeatures>

  /**
   * Store is reasigned to point to proxy object to allow individual state slices to be independently reactive.
   *
   * Type cast is needed because we are setting during construction
   * Table store is readonly after first initialization.
   */
  ;(
    table as { store: Omit<ReadonlyStore<TableState<TFeatures>>, 'atom'> }
  ).store = {
    get: () => stateProxy,
    get state() {
      return stateProxy
    },
    subscribe: subscribeNoEffect,
  }

  if (owner) {
    registerDestructor(owner, () => reactivity.unmount?.())
  }

  return table
}
