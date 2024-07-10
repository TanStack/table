import { createColumnHelper } from '@tanstack/table-core'
import { useTable } from './useTable'
import type {
  ColumnHelper,
  RequiredKeys,
  RowData,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'

export function tableFactory<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TOptions extends RequiredKeys<
    Omit<TableOptions<TFeatures, TData>, 'columns' | 'data'>,
    '_features'
  >,
>(
  options: TOptions & { TData: TData },
): {
  columnHelper: ColumnHelper<TFeatures, TData>
  options: TOptions
  useTable: typeof useTable
} {
  return {
    columnHelper: createColumnHelper(),
    options,
    useTable,
  }
}

//test

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const factory = tableFactory({
//   TData: {} as Person,
//   _features: { RowSelection: {} },
// })

// const columns = [
//   factory.columnHelper.accessor('firstName', { header: 'First Name' }),
//   factory.columnHelper.accessor('lastName', { header: 'Last Name' }),
//   factory.columnHelper.accessor('age', { header: 'Age' }),
//   factory.columnHelper.display({ header: 'Actions', id: 'actions' }),
// ]

// const data: Array<Person> = []

// const table = factory.useTable({
//   columns,
//   data,
// })
