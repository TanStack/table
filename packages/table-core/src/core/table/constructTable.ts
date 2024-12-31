import { isDev } from '../../utils'
import type { RowModelFns } from '../../types/RowModelFns'
import type { CachedRowModels } from '../../types/RowModel'
import type { Table_CoreProperties } from './coreTablesFeature.types'
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
  const { _features = {} as TFeatures } = options

  const featuresList: Array<TableFeature<{}>> = Object.values(_features)

  if (isDev && (options.debugAll || options.debugTable)) {
    console.info(
      'Constructing Table Instance with feature list:',
      Object.keys(_features),
    )
  }

  const table = {} as unknown as Table<TFeatures, TData>

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table as any))
  }, {}) as TableOptions<TFeatures, TData>

  const initialState = getInitialTableState(_features, options.initialState)

  const coreInstance: Table_CoreProperties<TFeatures, TData> = {
    _features, // features get stored here immediately
    _rowModels: {} as CachedRowModels<TFeatures, TData>, // row models get cached here later
    _rowModelFns: {} as RowModelFns<TFeatures, TData>, // row model processing functions get stored here
    options: {
      ...defaultOptions,
      ...options,
    },
    initialState,
  }

  Object.assign(table, coreInstance)

  for (const feature of featuresList) {
    feature.constructTableAPIs?.(table as any)
  }

  return table
}
