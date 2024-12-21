import { constructTable, coreFeatures } from '../../src'
import { makeData } from '../fixtures/data/makeData'
import { generateColumns } from '../fixtures/data/generateColumns'
import type { TableOptions, TableState } from '../../src'
import type { Person } from '../fixtures/data/types'

export function createTestTableWithData(
  lengths: Array<number> | number = 10,
  options?: Omit<TableOptions<any, Person>, 'data' | 'columns'>,
) {
  const lengthsArray = Array.isArray(lengths) ? lengths : [lengths]
  const data = makeData(...lengthsArray)
  const columns = generateColumns(data)

  return constructTable({
    data,
    columns,
    getSubRows: (row) => row.subRows,
    ...options,
    _features: {
      ...options?._features,
      ...coreFeatures,
    },
  })
}

export function createTestTableWithDataAndState(
  lengths: Array<number> | number = 10,
  options?: Omit<
    TableOptions<any, Person>,
    'data' | 'columns' | 'onStateChange'
  >,
) {
  let state = { ...options?.initialState } as TableState<any>

  const table = createTestTableWithData(lengths, {
    ...options,
    _features: {
      ...options?._features,
    },
    state,
    onStateChange: (updater) => {
      if (typeof updater === 'function') {
        state = updater(state)
      } else {
        state = updater
      }

      table.options.state = state
    },
  })

  return table
}
