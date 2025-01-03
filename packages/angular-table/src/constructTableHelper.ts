import { createColumnHelper } from '@tanstack/table-core'
import type {
  ColumnHelper,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'
import type { Signal } from '@angular/core'

// NOTE: This is a custom fork of the constructTableHelper function from the core package
// It is used to create a table helper that can be used to create tables in Angular
// It is a fork because the core package does not support Angular's reactive system
// So we need to create a custom function to create a table helper that can be used in Angular

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
  options: Omit<TableOptions<TFeatures, TData>, 'columns' | 'data' | 'state'>
  tableCreator: (
    tableOptions: () => Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
  ) => Table<TFeatures, TData>
}

/**
 * Internal function to create a table helper that each adapter package will use to create their own table helper
 */
export function constructTableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  tableCreator: (
    tableOptions: () => TableOptions<TFeatures, TData>,
  ) => Table<TFeatures, TData> & Signal<Table<TFeatures, TData>>,
  tableHelperOptions: TableHelperOptions<TFeatures, Array<TData>>,
): TableHelper_Core<TFeatures, TData> {
  const { TData: _TData, ..._tableHelperOptions } = tableHelperOptions
  return {
    columnHelper: createColumnHelper<TFeatures, TData>(),
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
