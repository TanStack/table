'use client'
import { constructTableHelper } from '@tanstack/table-core'
import { useTable } from './useTable'
import type { ReactTable } from './useTable'
import type {
  RowData,
  TableFeatures,
  TableHelperOptions,
  TableHelper_Core,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type ReactTableHelper<TFeatures extends TableFeatures> = Omit<
  TableHelper_Core<TFeatures>,
  'tableCreator'
> & {
  useTable: <TData extends RowData, TSelected = {}>(
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ) => ReactTable<TFeatures, TData, TSelected>
}

export function createTableHelper<TFeatures extends TableFeatures>(
  tableHelperOptions: TableHelperOptions<TFeatures>,
): ReactTableHelper<TFeatures> {
  const tableHelper = constructTableHelper(useTable as any, tableHelperOptions)
  return {
    ...tableHelper,
    useTable: <TData extends RowData, TSelected = {}>(
      tableOptions: Omit<
        TableOptions<TFeatures, TData>,
        '_features' | '_rowModels'
      >,
      selector?: (state: TableState<TFeatures>) => TSelected,
    ) => {
      return useTable<TFeatures, TData, TSelected>(
        { ...tableHelper.options, ...tableOptions } as TableOptions<
          TFeatures,
          TData
        >,
        selector,
      )
    },
  }
}
