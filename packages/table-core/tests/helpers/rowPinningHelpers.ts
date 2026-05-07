import { vi } from 'vitest'
import { getDefaultRowPinningState } from '../../src/features/row-pinning/rowPinningFeature.utils'
import {
  constructTable,
  coreFeatures,
  createColumnHelper,
  rowPinningFeature,
} from '../../src'
import { generateTestData } from '../fixtures/data/generateTestData'
import { storeReactivityBindings } from '../../src/store-reactivity-bindings'
import { generateTestTableWithData } from './generateTestTable'
import type { ColumnDef, RowPinningState, TableOptions } from '../../src'
import type { Person } from '../fixtures/data/types'

// Define feature set with proper typing
const _features = {
  ...coreFeatures,
  rowPinningFeature,
  coreReativityFeature: storeReactivityBindings(),
} as any

type personKeys = keyof Person
type PersonColumn = ColumnDef<typeof _features, Person, any>

function generateColumnDefs(people: Array<Person>): Array<PersonColumn> {
  const columnHelper = createColumnHelper<typeof _features, Person>()
  const person = people[0]

  if (!person) {
    return []
  }

  return Object.keys(person).map((key) => {
    const typedKey = key as personKeys
    return columnHelper.accessor(typedKey, { id: typedKey })
  })
}

export function createTableWithPinningState(
  rowCount = 10,
  pinningState?: RowPinningState,
) {
  const table = generateTestTableWithData(rowCount, {
    initialState: {
      rowPinning: pinningState ?? getDefaultRowPinningState(),
    },
    _features: {
      rowPinning: rowPinningFeature,
    },
  } as any)
  return table
}

export function createTableWithMockOnPinningChange(rowCount = 10): {
  table: ReturnType<typeof generateTestTableWithData>
  onRowPinningChangeMock: ReturnType<typeof vi.fn>
} {
  const onRowPinningChangeMock = vi.fn()
  const table = generateTestTableWithData(rowCount, {
    _features: {
      rowPinning: rowPinningFeature,
    },
  } as any)
  table.options.onRowPinningChange = onRowPinningChangeMock
  return { table, onRowPinningChangeMock }
}

export function createRowPinningTable(
  options?: Omit<
    TableOptions<typeof _features, Person>,
    'data' | 'columns' | '_features'
  >,
  lengths: Array<number> | number = 10,
): any {
  const lengthsArray = Array.isArray(lengths) ? lengths : [lengths]
  const data = generateTestData(...lengthsArray)
  const columns = generateColumnDefs(data)

  const table = constructTable<typeof _features, Person>({
    _features,
    _rowModels: {},
    data,
    columns,
    getSubRows: (row: any) => row.subRows,
    enableRowPinning: true,
    renderFallbackValue: '',
    initialState: {
      rowPinning: {
        top: [],
        bottom: [],
      },
      ...options?.initialState,
    },
    ...options,
  })

  return table
}
