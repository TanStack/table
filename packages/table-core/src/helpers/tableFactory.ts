import { createColumnHelper } from './columnHelper'
import type { ColumnHelper } from './columnHelper'
import type {
  RowData,
  RowModelOptions,
  Table,
  TableFeatures,
  TableOptions,
} from '../types'

export type TableFactoryOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<
  TableOptions<TFeatures, TData>,
  '_features' | '_rowModels' | 'columns' | 'data' | 'state'
> & {
  TData: TData
  features: TFeatures
  rowModels?: RowModelOptions<TFeatures, TData>
}

export type _TableFactory<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  columnHelper: ColumnHelper<TFeatures, TData>
  options: Omit<TableOptions<TFeatures, TData>, 'columns' | 'data' | 'state'>
  _createTable: (
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
  ) => Table<TFeatures, TData>
}

export function _createTableFactory<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  _createTable: (
    tableOptions: TableOptions<TFeatures, TData>,
  ) => Table<TFeatures, TData>,
  {
    TData: _TData,
    features,
    rowModels,
    ...tableFactoryOptions
  }: TableFactoryOptions<TFeatures, TData>,
): _TableFactory<TFeatures, TData> {
  const _tableOptions = {
    _features: features,
    _rowModels: rowModels,
    ...tableFactoryOptions,
  }
  return {
    columnHelper: createColumnHelper(),
    options: _tableOptions,
    _createTable: (tableOptions) =>
      _createTable({ ..._tableOptions, ...tableOptions }),
  }
}

//test

//// eslint-disable-next-line import/first, import/order
// import { _createTable } from '../core/table/createTable'

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const tableFactory = _createTableFactory(_createTable, {
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

// tableFactory._createTable({
//   columns,
//   data,
// })
