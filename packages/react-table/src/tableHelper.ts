import { _createTableHelper } from '@tanstack/table-core'
import { useTable } from './useTable'
import type {
  RowData,
  Table,
  TableFeatures,
  TableHelperOptions,
  TableOptions,
  _TableHelper,
} from '@tanstack/table-core'

export type TableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<_TableHelper<TFeatures, TData>, '_createTable'> & {
  useTable: (
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
  ) => Table<TFeatures, TData>
}

export function createTableHelper<TFeatures extends TableFeatures>(
  tableHelperOptions: TableHelperOptions<TFeatures, any>,
): TableHelper<TFeatures, any>

export function createTableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({
  TData,
  ...tableHelperOptions
}: TableHelperOptions<TFeatures, TData>): TableHelper<TFeatures, TData> {
  const tableHelper = _createTableHelper(useTable, tableHelperOptions)
  return {
    ...tableHelper,
    useTable: tableHelper.tableCreator,
  }
}

//test

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const tableHelper = createTableHelper({
//   TData: {} as Person,
//   features: { RowSelection: {} },
// })

// const columns = tableHelper.columnHelper.columns([
//   tableHelper.columnHelper.accessor('firstName', { header: 'First Name' }),
//   tableHelper.columnHelper.accessor('lastName', { header: 'Last Name' }),
//   tableHelper.columnHelper.accessor('age', { header: 'Age' }),
//   tableHelper.columnHelper.display({ header: 'Actions', id: 'actions' }),
// ])

// const data: Array<Person> = []

// tableHelper.useTable({
//   columns,
//   data,
// })
