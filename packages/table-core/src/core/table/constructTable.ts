import { createAtom, createStore } from '@tanstack/store'
import { coreFeatures } from '../coreFeatures'
import { cloneState } from '../../utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table, Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState } from '../../types/TableState'

export function getInitialTableState<TFeatures extends TableFeatures>(
  features: TFeatures,
  initialState: Partial<TableState<TFeatures>> | undefined = {},
): TableState<TFeatures> {
  Object.values(features).forEach((feature) => {
    initialState =
      feature.getInitialState?.(initialState as TableState<TFeatures>) ??
      initialState
  })
  return cloneState(initialState) as TableState<TFeatures>
}

export function constructTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>): Table<TFeatures, TData> {
  const table = {
    _features: { ...coreFeatures, ...tableOptions._features },
    _rowModels: {},
    _rowModelFns: {},
    get options() {
      return this.optionsStore.state
    },
    set options(value) {
      this.optionsStore.setState(() => value)
    },
    baseAtoms: {},
    atoms: {},
  } as Table_Internal<TFeatures, TData>

  const featuresList: Array<TableFeature<{}>> = Object.values(table._features)

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table))
  }, {}) as TableOptions<TFeatures, TData>

  table.optionsStore = createStore({
    ...defaultOptions,
    ...tableOptions,
  })

  table.initialState = getInitialTableState(
    table._features,
    table.options.initialState,
  )

  const stateKeys = Object.keys(table.initialState) as Array<
    string & keyof TableState<TFeatures>
  >

  for (const key of stateKeys) {
    // create writable base atom
    table.baseAtoms[key] = createAtom(table.initialState[key]) as any

    // create readonly derived atom: on each get(), read current options (state, then external atom, then base)
    ;(table.atoms as any)[key] = createAtom(() => {
      // Reading optionsStore.state keeps this reactive to setOptions
      const opts = table.optionsStore.state
      const state = opts.state
      if (key in (state ?? {})) {
        return state![key]
      }
      const externalAtom = opts.atoms?.[key]
      if (externalAtom) {
        return externalAtom.get()
      }
      return table.baseAtoms[key].get()
    })
  }

  table.store = createStore(() => {
    const snapshot = {} as TableState<TFeatures>
    for (const key of stateKeys) {
      snapshot[key] = table.atoms[key].get()
    }
    return snapshot
  }) as typeof table.store

  if (
    process.env.NODE_ENV === 'development' &&
    (tableOptions.debugAll || tableOptions.debugTable)
  ) {
    const features = Object.keys(table._features)
    const rowModels = Object.keys(table.options._rowModels || {})
    const states = Object.keys(table.initialState)

    console.log(
      `Constructing Table Instance

  Features:   ${features.join('\n              ')}

  Row Models: ${rowModels.length ? rowModels.join('\n              ') : '(none)'}

  States:     ${states.join('\n              ')}`,
    )
  }

  for (const feature of featuresList) {
    feature.constructTableAPIs?.(table)
  }

  return table
}
