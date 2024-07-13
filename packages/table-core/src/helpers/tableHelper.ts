import { createColumnHelper } from './columnHelper'
import type { ColumnHelper } from './columnHelper'
import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { RowModelOptions } from '../types/RowModel'
import type { Table } from '../types/Table'
import type { TableOptions } from '../types/TableOptions'

export type TableHelperOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<
  TableOptions<TFeatures, TData>,
  '_features' | '_rowModels' | 'columns' | 'data' | 'state'
> & {
  TData?: TData
  features: TFeatures
  rowModels?: RowModelOptions<TFeatures, TData>
}

export type _TableHelper<
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

export function _createTableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableCreator: (
    tableOptions: TableOptions<TFeatures, TData>,
  ) => Table<TFeatures, TData>,
  {
    TData: _TData,
    features,
    rowModels,
    ...tableHelperOptions
  }: TableHelperOptions<TFeatures, TData>,
): _TableHelper<TFeatures, TData> {
  const _tableOptions = {
    _features: features,
    _rowModels: rowModels,
    ...tableHelperOptions,
  }
  return {
    columnHelper: createColumnHelper<TFeatures, TData>(),
    features,
    options: _tableOptions,
    tableCreator: (tableOptions) =>
      tableCreator({ ..._tableOptions, ...tableOptions }),
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

// tableHelper.tableCreator({
//   columns,
//   data,
// })
