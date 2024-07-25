import { createColumnHelper } from './columnHelper'
import type { ColumnHelper } from './columnHelper'
import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Table } from '../types/Table'
import type { TableOptions } from '../types/TableOptions'

/**
 * Options for creating a table helper to share common options across multiple tables
 * Columns, data, and state are excluded from this type and reserved for only the `useTable`/`createTable` functions
 */
export type TableHelperOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<TableOptions<TFeatures, TData>, 'columns' | 'data' | 'state'> & {
  _features: TFeatures
  TData: TData //provide a cast for the TData type
}

/**
 * Internal type that each adapter package will build off of to create a table helper
 */
export type TableHelper_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  columnHelper: ColumnHelper<TFeatures, TData>
  features: TFeatures
  options: Omit<TableOptions<TFeatures, TData>, 'columns' | 'data' | 'state'>
  tableCreator: (
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
  ) => Table<TFeatures, TData>
}

/**
 * Internal function to create a table helper that each adapter package will use to create their own table helper
 */
export function _createTableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableCreator: (
    tableOptions: TableOptions<TFeatures, TData>,
  ) => Table<TFeatures, TData>,
  tableHelperOptions: TableHelperOptions<TFeatures, TData>,
): TableHelper_Core<TFeatures, TData> {
  return {
    columnHelper: createColumnHelper<TFeatures, TData>(),
    features: tableHelperOptions._features as TFeatures,
    options: tableHelperOptions,
    tableCreator: (tableOptions) =>
      tableCreator({ ...tableHelperOptions, ...(tableOptions as any) }),
  }
}

//test

// // eslint-disable-next-line import/first, import/order
// import { _createTable } from '../core/table/createTable'

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const tableHelper = _createTableHelper(_createTable, {
//   _features: { RowSelection: {} },
//   _rowModels: {},
//   TData: {} as Person,
// })

// const columns = [
//   tableHelper.columnHelper.accessor('firstName', { header: 'First Name' }),
//   tableHelper.columnHelper.accessor('lastName', { header: 'Last Name' }),
//   tableHelper.columnHelper.accessor('age', { header: 'Age' }),
//   tableHelper.columnHelper.display({ header: 'Actions', id: 'actions' }),
// ]

// const data: Array<Person> = []

// tableHelper.tableCreator({
//   columns,
//   data,
// })
