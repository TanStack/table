import { isDev } from '../../utils'
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
  TData extends RowData,
>(options: TableOptions<TFeatures, TData>): Table<TFeatures, TData> {
  if (isDev && (options.debugAll || options.debugTable)) {
    console.info('Constructing Table Instance...')
  }

  const { _features } = options

  const featuresList: Array<TableFeature> = Object.values(_features)

  const table = {} as unknown as Table<TFeatures, TData>

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions?.(table))
  }, {}) as TableOptions<TFeatures, TData>

  const initialState = getInitialTableState(_features, options.initialState)

  const coreInstance: Table_CoreProperties<TFeatures, TData> = {
    _features,
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
