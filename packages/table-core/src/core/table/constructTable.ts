import { shallow } from '@tanstack/store'
import { coreFeatures } from '../coreFeatures'
import { cloneState, hasOwn } from '../../utils'
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

  // pre-compute the init functions to make the other constructors faster
  const table = {
    _cellInstanceInitFns: [],
    _columnInstanceInitFns: [],
    _features: { ...coreFeatures, ...features },
    _headerGroupInstanceInitFns: [],
    _headerInstanceInitFns: [],
    _reactivity,
    _rowInstanceInitFns: [],
    _rowModelFns: { aggregationFns, filterFns, sortFns },
    _rowModels: {},
    atoms: {},
    baseAtoms: {},
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
    ;(table.atoms as any)[key] = _reactivity.createReadonlyAtom(
      () => {
        const options = table.options
        const externalAtoms = options.atoms
        const externalAtom = externalAtoms?.[key]
        // Always touch the reactive owner so controlled state still has an
        // invalidation source when it is published after a framework commit.
        const reactiveState = externalAtom
          ? externalAtom.get()
          : // @ts-ignore - looping through stateKeys so we know the key is defined
            table.baseAtoms[key].get()

        if (externalAtom) {
          return reactiveState
        }

        const controlledState = options.state as
          | Record<string, unknown>
          | undefined

        return controlledState && hasOwn(controlledState, key)
          ? controlledState[key]
          : reactiveState
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
          // @ts-ignore - looping through stateKeys so we know the key is defined
          ;(snapshot as Record<string, unknown>)[key] = table.atoms[key].get()
        }
        return snapshot
      },
      {
        compare: shallow,
        debugName: 'table/store',
      },
    ),
  )

  for (let i = 0; i < featuresList.length; i++) {
    const feature = featuresList[i]!
    feature.initTableInstanceData?.(table)
    if (feature.initCellInstanceData) {
      table._cellInstanceInitFns.push(
        feature.initCellInstanceData.bind(feature),
      )
    }
    if (feature.initColumnInstanceData) {
      table._columnInstanceInitFns.push(
        feature.initColumnInstanceData.bind(feature),
      )
    }
    if (feature.initHeaderGroupInstanceData) {
      table._headerGroupInstanceInitFns.push(
        feature.initHeaderGroupInstanceData.bind(feature),
      )
    }
    if (feature.initHeaderInstanceData) {
      table._headerInstanceInitFns.push(
        feature.initHeaderInstanceData.bind(feature),
      )
    }
    if (feature.initRowInstanceData) {
      table._rowInstanceInitFns.push(feature.initRowInstanceData.bind(feature))
    }
    feature.constructTableAPIs?.(table)
  }

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

  return table as unknown as Table<TFeatures, TData>
}
