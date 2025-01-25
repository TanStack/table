import {
  generateTestTableFromData,
  generateTestTableWithData,
  generateTestTableWithDataAndState,
  generateTestTableWithStateFromData,
} from './generateTestTable'
import type { Row, TableFeatures, TableOptions } from '../../src'
import type { Person } from '../fixtures/data/types'

export function generateTestRowsWithData<TFeatures extends TableFeatures>(
  lengths: Array<number> | number = 10,
  options?: Omit<
    TableOptions<TFeatures, Person>,
    'data' | 'columns' | '_features'
  > & {
    _features?: TFeatures
  },
): Array<Row<TFeatures, Person>> {
  const testTable = generateTestTableWithData(lengths, options)
  return testTable.getRowModel().rows
}

export function generateTestRowsFromData<TFeatures extends TableFeatures>(
  data: Array<Person>,
  options?: Omit<TableOptions<TFeatures, Person>, 'data' | 'columns'> & {
    _features?: TFeatures
  },
): Array<Row<TFeatures, Person>> {
  const testTable = generateTestTableFromData(data, options)
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
): Array<Row<TFeatures, Person>> {
  const testTable = generateTestTableWithDataAndState(lengths, options)
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
): Array<Row<TFeatures, Person>> {
  const testTable = generateTestTableWithStateFromData(data, options)
  return testTable.getRowModel().rows
}
