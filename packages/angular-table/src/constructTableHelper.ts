import { createColumnHelper } from '@tanstack/table-core'
import type {
  ColumnHelper,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'
import type { Signal } from '@angular/core'

/**
 * Options for creating a table helper to share common options across multiple tables
 * coreColumnsFeature, data, and state are excluded from this type and reserved for only the `useTable`/`createTable` functions
 */
export type TableHelperOptions<
  TFeatures extends TableFeatures,
  TDataList extends Array<RowData> = Array<any>,
> = Omit<
  TableOptions<TFeatures, NoInfer<TDataList>>,
  'columns' | 'data' | 'state'
> & {
  _features: TFeatures
  TData?: TDataList[number] // provide a cast for the TData type
}

/**
 * Internal type that each adapter package will build off of to create a table helper
 */
export type TableHelper_Core<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
> = {
  columnHelper: ColumnHelper<TFeatures, TData>
  createColumnHelper: () => ColumnHelper<TFeatures, TData>
  features: TFeatures
  options: Omit<
    TableOptions<TFeatures, Array<TData>>,
    'columns' | 'data' | 'state'
  >
  tableCreator: (
    tableOptions: () => Omit<
      TableOptions<TFeatures, Array<TData>>,
      '_features' | '_rowModels'
    >,
  ) => Table<TFeatures, TData>
}

/**
 * Internal function to create a table helper that each adapter package will use to create their own table helper
 */
export function constructTableHelper<
  TFeatures extends TableFeatures,
  TDataList extends Array<RowData> = Array<any>,
>(
  tableCreator: (
    tableOptions: () => TableOptions<TFeatures, TDataList>,
  ) => Table<TFeatures, TDataList[number]> &
    Signal<Table<TFeatures, TDataList[number]>>,
  tableHelperOptions: TableHelperOptions<TFeatures, TDataList>,
): TableHelper_Core<TFeatures, TDataList[number]> {
  const { TData: _TData, ..._tableHelperOptions } = tableHelperOptions
  return {
    columnHelper: createColumnHelper<TFeatures, TDataList[number]>(),
    createColumnHelper,
    features: tableHelperOptions._features,
    options: _tableHelperOptions as any,
    tableCreator: (tableOptions) =>
      // @ts-expect-error Fix this
      tableCreator(() => ({
        ...tableHelperOptions,
        ...tableOptions(),
      })),
  }
}

// test

// // eslint-disable-next-line import/first, import/order
// import { constructTable } from '../core/table/constructTable'
// // eslint-disable-next-line import/first, import/order
// import { type ColumnDef } from '../types/ColumnDef'

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const tableHelper = constructTableHelper(constructTable, {
//   _features: { rowSelectionFeature: {} },
//   _rowModels: {},
//   TData: {} as Person,
// })

// const columns = [
//   tableHelper.columnHelper.accessor('firstName', {
//     header: 'First Name',
//     cell: (info) => info.getValue(),
//   }),
//   tableHelper.columnHelper.accessor('lastName', { header: 'Last Name' }),
//   tableHelper.columnHelper.accessor('age', { header: 'Age' }),
//   tableHelper.columnHelper.display({ header: 'Actions', id: 'actions' }),
// ] as Array<ColumnDef<typeof tableHelper.features, Person, unknown>>

// const data: Array<Person> = []

// tableHelper.tableCreator({
//   columns,
//   data,
// })
