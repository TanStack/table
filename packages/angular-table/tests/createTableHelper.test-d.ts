import { expectTypeOf, test } from 'vitest'
import {
  createPaginatedRowModel,
  createTableHelper,
  stockFeatures,
} from '../src'
import type { TableHelper } from '../src/createTableHelper'
import type { ColumnDef, StockFeatures, Table } from '../src'

test('infer data type from TData', () => {
  type TestDataType = { firstName: string; lastName: string; age: number }

  const tableHelper = createTableHelper({
    _features: stockFeatures,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel(),
    },
    TData: {} as TestDataType,
  })

  expectTypeOf<typeof tableHelper>().toEqualTypeOf<
    TableHelper<Required<StockFeatures>, TestDataType>
  >()

  expectTypeOf<(typeof tableHelper)['features']>().toEqualTypeOf<
    Required<StockFeatures>
  >()

  const columns = [
    tableHelper.columnHelper.accessor('firstName', { header: 'First Name' }),
    tableHelper.columnHelper.accessor('lastName', { header: 'Last Name' }),
    tableHelper.columnHelper.accessor('age', { header: 'Age' }),
    tableHelper.columnHelper.display({ header: 'Actions', id: 'actions' }),
  ] as const

  expectTypeOf<typeof columns>().toMatchTypeOf<
    ReadonlyArray<ColumnDef<typeof tableHelper.features, TestDataType, any>>
  >()
})

test('infer data type given by injectTable', () => {
  type TestDataType = { firstName: string; lastName: string }

  const tableHelper = createTableHelper({
    _features: stockFeatures,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel(),
    },
  })

  expectTypeOf<typeof tableHelper>().toEqualTypeOf<
    TableHelper<Required<StockFeatures>, any>
  >()

  const injectTable = tableHelper.injectTable
  const table = injectTable(() => ({
    data: [] as Array<TestDataType>,
    columns: [],
  }))

  expectTypeOf<typeof table>().toEqualTypeOf<
    Table<Required<StockFeatures>, TestDataType>
  >()
})
