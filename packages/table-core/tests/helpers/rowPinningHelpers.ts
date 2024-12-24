import { vi } from 'vitest'
import { getDefaultRowPinningState } from '../../src/features/row-pinning/rowPinningFeature.utils'

import { rowPinningFeature } from '../../src'
import {
  generateTestTableWithData,
  generateTestTableWithDataAndState,
} from './generateTestTable'
import type { RowPinningState, TableOptions } from '../../src'
import type { Person } from '../fixtures/data/types'

export function createTableWithPinningState(
  rowCount = 10,
  pinningState?: RowPinningState,
) {
  const table = generateTestTableWithData(rowCount)
  if (pinningState) {
    table.options.state = {
      rowPinning: pinningState,
    }
  } else {
    table.options.state = {
      rowPinning: getDefaultRowPinningState(),
    }
  }
  return table
}

export function createTableWithMockOnPinningChange(rowCount = 10) {
  const onRowPinningChangeMock = vi.fn()
  const table = generateTestTableWithData(rowCount)
  table.options.onRowPinningChange = onRowPinningChangeMock
  return { table, onRowPinningChangeMock }
}

export function createRowPinningTable(
  options?: Omit<
    TableOptions<any, Person>,
    'data' | 'columns' | 'onStateChange'
  >,
  lengths: Array<number> | number = 10,
) {
  const table = generateTestTableWithDataAndState(lengths, {
    enableRowPinning: true,
    initialState: {
      rowPinning: {
        top: [],
        bottom: [],
      },
    },
    ...options,
    _features: {
      ...options?._features,
      rowPinning: rowPinningFeature,
    },
  })

  return table
}
