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
const features = {
  ...coreFeatures,
  rowPinningFeature,
  coreReactivityFeature: storeReactivityBindings(),
} as any

type personKeys = keyof Person
type PersonColumn = ColumnDef<typeof features, Person, any>

function generateColumnDefs(people: Array<Person>): Array<PersonColumn> {
  const columnHelper = createColumnHelper<typeof features, Person>()
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
    features: {
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
    features: {
      rowPinning: rowPinningFeature,
    },
  } as any)
  table.options.onRowPinningChange = onRowPinningChangeMock
  return { table, onRowPinningChangeMock }
}

export function createRowPinningTable(
  options?: Omit<
    TableOptions<typeof features, Person>,
    'data' | 'columns' | 'features'
  >,
  lengths: Array<number> | number = 10,
): any {
  const lengthsArray = Array.isArray(lengths) ? lengths : [lengths]
  const data = generateTestData(...lengthsArray)
  const columns = generateColumnDefs(data)

  const table = constructTable<typeof features, Person>({
    features,
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
