import { _createTableFactory } from '@tanstack/table-core'
import { useTable } from './useTable'
import type {
  RowData,
  Table,
  TableFactoryOptions,
  TableFeatures,
  TableOptions,
  _TableFactory,
} from '@tanstack/table-core'

export type TableFactory<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<_TableFactory<TFeatures, TData>, '_createTable'> & {
  useTable: (
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
  ) => Table<TFeatures, TData>
}

export function createTableFactory<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableFactoryOptions: TableFactoryOptions<TFeatures, TData>,
): TableFactory<TFeatures, TData> {
  const factory = _createTableFactory(useTable, tableFactoryOptions)
  return {
    ...factory,
    useTable: factory._createTable,
  }
}

//test

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const tableFactory = createTableFactory({
//   TData: {} as Person,
//   features: { RowSelection: {} },
// })

// const columns = tableFactory.columnHelper.columns([
//   tableFactory.columnHelper.accessor('firstName', { header: 'First Name' }),
//   tableFactory.columnHelper.accessor('lastName', { header: 'Last Name' }),
//   tableFactory.columnHelper.accessor('age', { header: 'Age' }),
//   tableFactory.columnHelper.display({ header: 'Actions', id: 'actions' }),
// ])

// const data: Array<Person> = []

// tableFactory.useTable({
//   columns,
//   data,
// })
