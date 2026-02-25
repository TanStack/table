import { constructTableHelper } from '@tanstack/table-core'
import { createTable } from './createTable'
import type { SolidTable } from './createTable'
import type {
  RowData,
  TableFeatures,
  TableHelperOptions,
  TableHelper_Core,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type TableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
> = Omit<TableHelper_Core<TFeatures>, 'tableCreator'> & {
  createTable: <TSelected = {}>(
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ) => SolidTable<TFeatures, TData, TSelected>
}

export function createTableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  tableHelperOptions: TableHelperOptions<TFeatures>,
): TableHelper<TFeatures, TData> {
  const tableHelper = constructTableHelper(
    createTable as any,
    tableHelperOptions,
  )
  return {
    ...tableHelper,
    createTable: <TSelected = {}>(
      tableOptions: Omit<
        TableOptions<TFeatures, TData>,
        '_features' | '_rowModels'
      >,
      selector?: (state: TableState<TFeatures>) => TSelected,
    ) => {
      return createTable<TFeatures, TData, TSelected>(
        { ...tableHelper.options, ...tableOptions } as TableOptions<
          TFeatures,
          TData
        >,
        selector,
      )
    },
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
