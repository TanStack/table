import { constructTableHelper } from './constructTableHelper'
import { injectTable } from './injectTable'
import type { TableHelperOptions } from './constructTableHelper'
import type { Signal } from '@angular/core'
import type {
  RowData,
  Table,
  TableFeatures,
  TableHelper_Core,
  TableOptions,
} from '@tanstack/table-core'

export type TableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
> = Omit<TableHelper_Core<TFeatures, TData>, 'tableCreator'> & {
  injectTable: <TInferData extends TData>(
    tableOptions: () => Omit<
      TableOptions<TFeatures, TInferData>,
      '_features' | '_rowModels'
    >,
  ) => Table<TFeatures, TInferData>
}

export function createTableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  tableHelperOptions: TableHelperOptions<TFeatures, TData>,
): TableHelper<TFeatures, TData> {
  const tableHelper = constructTableHelper(
    injectTable as unknown as (
      tableOptions: () => TableOptions<TFeatures, TData>,
    ) => Table<TFeatures, TData> & Signal<Table<TFeatures, TData>>,
    tableHelperOptions,
  )
  return {
    ...tableHelper,
    injectTable: tableHelper.tableCreator,
  } as any
}

// test

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const tableHelper = createTableHelper({
//   _features: { rowSelectionFeature: {} },
//   TData: {} as Person,
// })

// const columns = [
//   tableHelper.columnHelper.accessor('firstName', { header: 'First Name' }),
//   tableHelper.columnHelper.accessor('lastName', { header: 'Last Name' }),
//   tableHelper.columnHelper.accessor('age', { header: 'Age' }),
//   tableHelper.columnHelper.display({ header: 'Actions', id: 'actions' }),
// ] as Array<ColumnDef<typeof tableHelper.features, Person, unknown>>

// const data: Array<Person> = []

// tableHelper.createTable({
//   columns,
//   data,
// })
