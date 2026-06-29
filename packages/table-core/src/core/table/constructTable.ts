import { coreFeatures } from '../coreFeatures'
import { cloneState } from '../../utils'
import { atomToStore } from '../reactivity/coreReactivityFeature.utils'
import { table_syncExternalStateToBaseAtoms } from './coreTablesFeature.utils'
import type { Atom } from '@tanstack/store'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table, Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState, TableState_All } from '../../types/TableState'

/**
 * Builds the initial table state from registered features and user initial state.
 *
 * Each feature contributes its default state before user-provided `initialState` values are merged in.
 */
export function getInitialTableState<TFeatures extends TableFeatures>(
  features: TFeatures,
  initialState: Partial<TableState<TFeatures>> | undefined = {},
): TableState<TFeatures> {
  Object.values(features).forEach((feature) => {
    initialState = feature.getInitialState?.(initialState) ?? initialState
  })
  return cloneState(initialState) as TableState<TFeatures>
}

/**
 * Constructs a table instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
export function constructTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>): Table<TFeatures, TData> {
  const _reactivity = tableOptions.features.coreReactivityFeature!

  // Strip the non-feature slots: type-only meta slots, row model factories,
  // and row model fn registries all live on the `features` option but are not
  // table features themselves.
  const {
    aggregationFns,
    columnMeta: _columnMeta,
    coreRowModel,
    expandedRowModel,
    facetedMinMaxValues,
    facetedRowModel,
    facetedUniqueValues,
    filterFns,
    filterMeta: _filterMeta,
    filteredRowModel,
    groupedRowModel,
    paginatedRowModel,
    sortFns,
    sortedRowModel,
    tableMeta: _tableMeta,
    ...features
  } = tableOptions.features

  const table = {
    _reactivity,
    _features: { ...coreFeatures, ...features },
    _rowModels: {},
    _rowModelFns: { aggregationFns, filterFns, sortFns },
    baseAtoms: {},
    atoms: {},
  } as unknown as Table_Internal<TFeatures, TData>

  const featuresList: Array<TableFeature> = Object.values(table._features)

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table))
  }, {}) as TableOptions<TFeatures, TData>

  const mergedOptions = { ...defaultOptions, ...tableOptions }

  if (_reactivity.wrapExternalAtoms && mergedOptions.atoms) {
    for (const [atomKey, _atom] of Object.entries(mergedOptions.atoms)) {
      const atom = _atom as Atom<any>
      const wrappedAtom = _reactivity.createWritableAtom(atom.get(), {
        debugName: `externalAtom/${atomKey}`,
      })
      ;(mergedOptions.atoms as any)[atomKey] = wrappedAtom
      // Two-way syncing between the original atom and the wrapped one.
      let syncExternal = false
      const syncAtomToWrappedSub = atom.subscribe((value) => {
        if (syncExternal) return
        wrappedAtom.set(value)
      })
      const syncWrappedToAtomSub = wrappedAtom.subscribe((value) => {
        syncExternal = true
        atom.set(value)
        syncExternal = false
      })
      _reactivity.addSubscription(syncAtomToWrappedSub)
      _reactivity.addSubscription(syncWrappedToAtomSub)
    }
  }

  if (_reactivity.createOptionsStore) {
    // @ts-ignore - direct set
    table.optionsStore = _reactivity.createWritableAtom<
      TableOptions<TFeatures, TData>
    >(mergedOptions, { debugName: 'table/optionsStore' })
    Object.defineProperty(table, 'options', {
      configurable: true,
      enumerable: true,
      get() {
        return table.optionsStore!.get()
      },
      set(value) {
        table.optionsStore!.set(() => value) // or your real update shape
      },
    })
  } else {
    table.options = mergedOptions
  }

  table.initialState = getInitialTableState(
    table._features,
    table.options.initialState,
  )

  const stateKeys = Object.keys(table.initialState) as Array<
    string & keyof TableState_All
  >

  for (let i = 0; i < stateKeys.length; i++) {
    const key = stateKeys[i]!
    table.baseAtoms[key] = _reactivity.createWritableAtom(
      table.initialState[key],
      {
        debugName: `table/baseAtoms/${key}`,
      },
    ) as any

    // create readonly derived atom: on each get(), read either external atom or base atom
    ;(table.atoms as any)[key] = _reactivity.createReadonlyAtom(
      () => {
        const externalAtoms = table.options.atoms as
          | Partial<Record<keyof TableState_All, Atom<unknown>>>
          | undefined
        const externalAtom = externalAtoms?.[key]
        if (externalAtom) {
          return externalAtom.get()
        }
        return table.baseAtoms[key]!.get()
      },
      { debugName: `table/atoms/${key}` },
    )
  }

  table_syncExternalStateToBaseAtoms(table)

  table.store = atomToStore(
    _reactivity.createReadonlyAtom(
      () => {
        const snapshot = {} as TableState<TFeatures> & TableState_All
        for (let i = 0; i < stateKeys.length; i++) {
          const key = stateKeys[i]!
          ;(snapshot as Record<string, unknown>)[key] = table.atoms[key]!.get()
        }
        return snapshot
      },
      { debugName: 'table/store' },
    ),
  )

  if (
    process.env.NODE_ENV === 'development' &&
    (tableOptions.debugAll || tableOptions.debugTable)
  ) {
    const features = Object.keys(table._features)
    const rowModels = Object.entries({
      coreRowModel,
      filteredRowModel,
      groupedRowModel,
      sortedRowModel,
      expandedRowModel,
      paginatedRowModel,
      facetedRowModel,
      facetedMinMaxValues,
      facetedUniqueValues,
    })
      .filter(([, factory]) => factory)
      .map(([key]) => key)
    const states = Object.keys(table.initialState)

    console.log(
      `Constructing Table Instance

  Features:   ${features.join('\n              ')}

  Row Models: ${rowModels.length ? rowModels.join('\n              ') : '(none)'}

  States:     ${states.join('\n              ')}\n`,
      { table },
    )
  }

  for (let i = 0; i < featuresList.length; i++) {
    featuresList[i]!.constructTableAPIs?.(table)
  }

  return table as unknown as Table<TFeatures, TData>
}
