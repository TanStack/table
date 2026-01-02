import { Store } from '@tanstack/store'
import { isDev } from '../../utils'
import { coreFeatures } from '../coreFeatures'
import type { RowModelFns } from '../../types/RowModelFns'
import type { CachedRowModels } from '../../types/RowModel'
import type { Table_CoreProperties } from './coreTablesFeature.types'
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
  return new Store(getInitialTableState(features, initialState))
}

export function constructTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptions<TFeatures, TData>): Table<TFeatures, TData> {
  const _features = { ...coreFeatures, ...options._features }
  const featuresList: Array<TableFeature<{}>> = Object.values(_features)

  if (isDev && (options.debugAll || options.debugTable)) {
    console.info(
      'Constructing Table Instance with feature list:',
      Object.keys(_features),
    )
  }

  const table = {} as Table_Internal<TFeatures, TData>

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table))
  }, {}) as TableOptions<TFeatures, TData>

  const initialState = getInitialTableState(_features, options.initialState)

  const store = options.store ?? new Store(initialState)

  const coreInstance: Table_CoreProperties<TFeatures, TData> = {
    _features, // features get stored here immediately
    _rowModels: {} as CachedRowModels<TFeatures, TData>, // row models get cached here later
    _rowModelFns: {} as RowModelFns<TFeatures, TData>, // row model processing functions get stored here
    options: {
      ...defaultOptions,
      ...options,
    },
    initialState,
    store,
  }

  Object.assign(table, coreInstance)

  for (const feature of featuresList) {
    feature.constructTableAPIs?.(table)
  }

  return table
}
