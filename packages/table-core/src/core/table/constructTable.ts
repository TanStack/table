import { isDev } from '../../utils'
import type { Fns } from '../../types/Fns'
import type { Table_CoreProperties } from './Tables.types'
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
    initialState = feature.getInitialState?.(initialState) ?? initialState
  })
  return structuredClone(initialState) as TableState<TFeatures>
}

export function constructTable<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  options: TableOptions<TFeatures, TFns, TData>,
): Table<TFeatures, TFns, TData> {
  if (isDev && (options.debugAll || options.debugTable)) {
    console.info('Constructing Table Instance...')
  }

  const { _features = {} as TFeatures, _fns = {} as TFns } = options

  const featuresList: Array<TableFeature> = Object.values(_features)

  const table = {} as unknown as Table<TFeatures, TFns, TData>

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table))
  }, {}) as TableOptions<TFeatures, TFns, TData>

  const initialState = getInitialTableState(_features, options.initialState)

  const coreInstance: Table_CoreProperties<TFeatures, TFns, TData> = {
    _features, // features get stored here immediately
    _fns, // processing functions get stored here
    _rowModels: {}, // row models get cached here later
    options: {
      ...defaultOptions,
      ...options,
    },
    initialState,
  }

  Object.assign(table, coreInstance)

  const queued: Array<() => void> = []
  let queuedTimeout = false

  table._queue = (cb) => {
    queued.push(cb)

    if (!queuedTimeout) {
      queuedTimeout = true

      // Schedule a microtask to run the queued callbacks after
      // the current call stack (render, etc) has finished.
      Promise.resolve()
        .then(() => {
          while (queued.length) {
            queued.shift()!()
          }
          queuedTimeout = false
        })
        .catch((error) =>
          setTimeout(() => {
            throw error
          }),
        )
    }
  }

  for (const feature of featuresList) {
    feature.constructTable?.(table)
  }

  return table
}
