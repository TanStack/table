import { constructTableHelper } from './constructTableHelper'
import { injectTable } from './injectTable'
import type { AngularTable } from './injectTable'
import type { TableHelperOptions } from './constructTableHelper'
import type {
  RowData,
  TableFeatures,
  TableHelper_Core,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type TableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
> = Omit<TableHelper_Core<TFeatures, TData>, 'tableCreator'> & {
  injectTable: <TInferData extends TData, TSelected = {}>(
    tableOptions: () => Omit<
      TableOptions<TFeatures, TInferData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ) => AngularTable<TFeatures, TInferData, TSelected>
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
      selector?: (state: TableState<TFeatures>) => any,
    ) => AngularTable<TFeatures, TData, any>,
    tableHelperOptions,
  )
  return {
    ...tableHelper,
    injectTable: <TInferData extends TData, TSelected = {}>(
      tableOptions: () => Omit<
        TableOptions<TFeatures, TInferData>,
        '_features' | '_rowModels'
      >,
      selector?: (state: TableState<TFeatures>) => TSelected,
    ) => {
      return injectTable<TFeatures, TInferData, TSelected>(
        () =>
          ({
            ...tableHelper.options,
            ...tableOptions(),
          }) as TableOptions<TFeatures, TInferData>,
        selector,
      )
    },
  } as TableHelper<TFeatures, TData>
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
