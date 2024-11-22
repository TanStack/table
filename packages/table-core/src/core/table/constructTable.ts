import { isDev } from '../../utils'
import type { CachedRowModels } from '../../types/RowModel'
import type { Table_CoreProperties } from './tablesFeature.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState } from '../../types/TableState'

export function getInitialTableState<TFeatures extends TableFeatures>(
  features: TableFeatures,
  initialState: Partial<TableState<TFeatures>> | undefined = {},
): TableState<TFeatures> {
  Object.values(features).forEach((feature) => {
    initialState =
      feature.getInitialState?.(initialState as TableState<TFeatures>) ??
      initialState
  })
  return structuredClone(initialState) as TableState<TFeatures>
}

export function constructTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptions<TFeatures, TData>): Table<TFeatures, TData> {
  if (isDev && (options.debugAll || options.debugTable)) {
    console.info('Constructing Table Instance...')
  }

  const { _features = {} as TFeatures, _rowModelFns = {} } = options

  const featuresList: Array<TableFeature> = Object.values(_features)

  const table = {} as unknown as Table<TFeatures, TData>

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table))
  }, {}) as TableOptions<TFeatures, TData>

  const initialState = getInitialTableState(_features, options.initialState)

  const coreInstance: Table_CoreProperties<TFeatures, TData> = {
    _features, // features get stored here immediately
    _rowModels: {} as CachedRowModels<TFeatures, TData>, // row models get cached here later
    _rowModelFns, // row model processing functions get stored here
    options: {
      ...defaultOptions,
      ...options,
    },
    initialState,
  }

  Object.assign(table, coreInstance)

  for (const feature of featuresList) {
    feature.constructTableAPIs?.(table)
  }

  return table
}
