import { constructTableHelper } from '@tanstack/table-core'
import { useTable } from './useTable'
import type { Fns } from '../../table-core/dist/esm/types/Fns'
import type {
  RowData,
  Table,
  TableFeatures,
  TableHelperOptions,
  TableHelper_Core,
  TableOptions,
} from '@tanstack/table-core'

export type TableHelper<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = Omit<TableHelper_Core<TFeatures, TFns, TData>, 'tableCreator'> & {
  useTable: (
    tableOptions: Omit<
      TableOptions<TFeatures, TFns, TData>,
      '_features' | '_rowModels'
    >,
  ) => Table<TFeatures, TFns, TData>
}

export function createTableHelper<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  tableHelperOptions: TableHelperOptions<TFeatures, TFns, TData>,
): TableHelper<TFeatures, TFns, TData> {
  const tableHelper = constructTableHelper(useTable, tableHelperOptions)
  return {
    ...tableHelper,
    useTable: tableHelper.tableCreator,
  } as any
}

// test

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const tableHelper = createTableHelper({
//   _features: { RowSelection: {} },
//   TData: {} as Person,
// })

// const columns = [
//   tableHelper.columnHelper.accessor('firstName', { header: 'First Name' }),
//   tableHelper.columnHelper.accessor('lastName', { header: 'Last Name' }),
//   tableHelper.columnHelper.accessor('age', { header: 'Age' }),
//   tableHelper.columnHelper.display({ header: 'Actions', id: 'actions' }),
// ] as Array<ColumnDef<typeof tableHelper.features, Person, unknown>>

// const data: Array<Person> = []

// tableHelper.useTable({
//   columns,
//   data,
// })
