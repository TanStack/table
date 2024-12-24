import {
  generateTestTableFromData,
  generateTestTableWithData,
  generateTestTableWithDataAndState,
  generateTestTableWithStateFromData,
} from './generateTestTable'
import type { TableFeatures, TableOptions } from '../../src'
import type { Person } from '../fixtures/data/types'

export function generateTestRowsWithData<TFeatures extends TableFeatures>(
  lengths: Array<number> | number = 10,
  options?: Omit<TableOptions<TFeatures, Person>, 'data' | 'columns'> & {
    _features?: TFeatures
  },
) {
  const testTable = generateTestTableWithData<TFeatures>(lengths, options)
  return testTable.getRowModel().rows
}

export function generateTestRowsFromData<TFeatures extends TableFeatures>(
  data: Array<Person>,
  options?: Omit<TableOptions<TFeatures, Person>, 'data' | 'columns'> & {
    _features?: TFeatures
  },
) {
  const testTable = generateTestTableFromData<TFeatures>(data, options)
  return testTable.getRowModel().rows
}

export function generateTestRowsWithState<TFeatures extends TableFeatures>(
  lengths: Array<number> | number = 10,
  options?: Omit<
    TableOptions<TFeatures, Person>,
    'data' | 'columns' | 'onStateChange'
  > & {
    _features?: TFeatures
  },
) {
  const testTable = generateTestTableWithDataAndState<TFeatures>(
    lengths,
    options,
  )
  return testTable.getRowModel().rows
}

export function generateTestRowsWithStateFromData<
  TFeatures extends TableFeatures,
>(
  data: Array<Person>,
  options?: Omit<
    TableOptions<TFeatures, Person>,
    'data' | 'columns' | 'onStateChange'
  > & {
    _features?: TFeatures
  },
) {
  const testTable = generateTestTableWithStateFromData<TFeatures>(data, options)
  return testTable.getRowModel().rows
}
