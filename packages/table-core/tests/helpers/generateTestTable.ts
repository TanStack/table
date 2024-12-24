import { constructTable, coreFeatures } from '../../src'
import { generateTestColumnDefs } from '../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../fixtures/data/generateTestData'
import type { Row, TableFeatures, TableOptions, TableState } from '../../src'
import type { Person } from '../fixtures/data/types'

export function generateTestTableWithData<TFeatures extends TableFeatures>(
  lengths: Array<number> | number = 10,
  options?: Omit<TableOptions<TFeatures, Person>, 'data' | 'columns'>,
) {
  const lengthsArray = Array.isArray(lengths) ? lengths : [lengths]
  const data = generateTestData(...lengthsArray)
  const columns = generateTestColumnDefs<TFeatures>(data)

  return constructTable<TFeatures, Person>({
    data,
    columns,
    getSubRows: (row: Row<TFeatures, Person>) => row.subRows,
    ...options,
    _features: {
      ...coreFeatures,
      ...options?._features,
    },
  } as any)
}

export function generateTestTableFromData<TFeatures extends TableFeatures>(
  data: Array<Person>,
  options?: Omit<TableOptions<TFeatures, Person>, 'data' | 'columns'>,
) {
  const columns = generateTestColumnDefs<TFeatures>(data)
  return constructTable({
    data,
    columns,
    ...options,
    _features: {
      ...coreFeatures,
      ...options?._features,
    },
  } as any)
}

export function generateTestTableWithDataAndState<
  TFeatures extends TableFeatures,
>(
  lengths: Array<number> | number = 10,
  options?: Omit<
    TableOptions<TFeatures, Person>,
    'data' | 'columns' | 'onStateChange'
  >,
) {
  const lengthsArray = Array.isArray(lengths) ? lengths : [lengths]
  const data = generateTestData(...lengthsArray)
  const columns = generateTestColumnDefs<TFeatures>(data)
  let state = { ...options?.initialState } as TableState<TFeatures>

  const table = generateTestTableWithData(lengths, {
    data,
    columns,
    ...options,
    _features: {
      ...options?._features,
    },
    state,
    onStateChange: (updater: any) => {
      if (typeof updater === 'function') {
        state = updater(state)
      } else {
        state = updater
      }

      table.options.state = state
    },
  } as any)

  return table
}

export function generateTestTableWithStateFromData<
  TFeatures extends TableFeatures,
>(
  data: Array<Person>,
  options?: Omit<
    TableOptions<TFeatures, Person>,
    'data' | 'columns' | 'onStateChange'
  >,
) {
  const columns = generateTestColumnDefs<TFeatures>(data)
  let state = { ...options?.initialState } as TableState<TFeatures>

  const table = generateTestTableFromData(data, {
    columns,
    ...options,
    _features: {
      ...options?._features,
    },
    state,
    onStateChange: (updater: any) => {
      if (typeof updater === 'function') {
        state = updater(state)
      } else {
        state = updater
      }
    },
  } as any)

  return table
}
