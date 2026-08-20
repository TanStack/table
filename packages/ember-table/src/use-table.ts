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

// Internal table slots used by the pull-based options/state wiring below.
// `Table_Internal` is not exported from the table-core build, so the shape is
// declared structurally here.
interface TableInternals<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  optionsStore?: {
    get(): TableOptions<TFeatures, TData>
    set(value: () => TableOptions<TFeatures, TData>): void
  }
  baseAtoms: Record<
    string,
    {
      get(): unknown
      set(value: unknown): void
    }
  >
  atoms: Record<string, unknown>
}

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

  const table = constructTable<TFeatures, TData>({
    ...initialOptions,
    features: {
      coreReactivityFeature: reactivity,
      ...initialOptions.features,
    },
    mergeOptions: (
      defaultOptions: TableOptions<TFeatures, TData>,
      newOptions: Partial<TableOptions<TFeatures, TData>>,
    ) => ({
      ...defaultOptions,
      ...newOptions,
    }),
  }) as Table<TFeatures, TData> & TableInternals<TFeatures, TData>

  const optionsStore = table.optionsStore!

  const liveOptions = computed(() => {
    const stored = optionsStore.get()
    return {
      ...stored,
      ...userOptions.get(),
      // stored options carry construct-time normalization (the reactivity
      // feature, wrapped external atoms) that must win over the raw user
      // options.
      features: stored.features,
      atoms: stored.atoms,
    }
  })

  const getLiveOptions = () => liveOptions.get()

  /**
   * This is to get around core table not using lazy access so we need to re-wrap
   *
   * Similar to other reactive signal frameworks (solid, angular, svelte)
   */
  Object.defineProperty(table, 'options', {
    configurable: true,
    enumerable: true,
    get: getLiveOptions,
    set: (value: TableOptions<TFeatures, TData>) => {
      optionsStore.set(() => value)
    },
  })

  const atoms: Record<string, ReadonlyAtom<unknown>> = table.atoms
  const stateKeys = Object.keys(table.baseAtoms)

  for (const key of stateKeys) {
    const baseAtom = (table.baseAtoms as Record<string, ReadonlyAtom<unknown>>)[
      key
    ]!

    /**
     * Original atoms could cause effects for top level properties
     *
     * Core table should migrate to pure derived data which would boost render
     * performance for both signal and non-signal frameworks.
     */
    atoms[key] = reactivity.createReadonlyAtom(
      () => {
        const externalAtom = (
          table.options.atoms as Record<string, Atom<unknown>> | undefined
        )?.[key]
        if (externalAtom) {
          return externalAtom.get()
        }
        const stateSlice = (
          table.options.state as Record<string, unknown> | undefined
        )?.[key]
        if (stateSlice !== undefined) {
          return stateSlice
        }
        return baseAtom.get()
      },
      { debugName: `table/atoms/${key}` },
    )
  }

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
   * Store is reassigned to point to proxy object to allow individual state slices to be independently reactive.
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
