import { createStore } from '@tanstack/store'
import { coreFeatures } from '../coreFeatures'
import type { Store } from '@tanstack/store'
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
  return structuredClone(initialState) as TableState<TFeatures>
}

export function createTableStore<TFeatures extends TableFeatures>(
  features: TFeatures,
  initialState: Partial<TableState<TFeatures>> | undefined = {},
): Store<TableState<TFeatures>> {
  return createStore(getInitialTableState(features, initialState))
}

export function constructTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>): Table<TFeatures, TData> {
  const table = {
    _features: { ...coreFeatures, ...tableOptions._features },
    _rowModels: {},
    _rowModelFns: {},
  } as Table_Internal<TFeatures, TData>

  const featuresList: Array<TableFeature<{}>> = Object.values(table._features)

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table))
  }, {}) as TableOptions<TFeatures, TData>

  table.baseOptionsStore = createStore({
    ...defaultOptions,
    ...tableOptions,
  })

  Object.defineProperty(table, 'options', {
    enumerable: true,
    configurable: true,
    get() {
      return table.baseOptionsStore.state
    },
  })

  table.initialState = getInitialTableState(
    table._features,
    table.options.initialState,
  )

  table.baseStore = table.options.store ?? createStore(table.initialState)

  table.store = createStore(() => {
    const state = table.baseStore.state
    return {
      ...state,
      ...(table.options.state ?? {}),
    }
  })

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
