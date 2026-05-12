import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { createTable } from './createTable'
import type { AlpineTable } from './createTable'
import type {
  RowData,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type CreateTableHookOptions<
  TFeatures extends TableFeatures,
> = Omit<
  TableOptions<TFeatures, any>,
  'columns' | 'data' | 'store' | 'state' | 'initialState'
>

export type AppAlpineTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
> = AlpineTable<TFeatures, TData, TSelected>

export type AppColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData
> = ReturnType<typeof coreCreateColumnHelper<TFeatures, TData>>

export function createTableHook<
  TFeatures extends TableFeatures,
>({
  ...defaultTableOptions
}: CreateTableHookOptions<
  TFeatures
>) {

  function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<
    TFeatures,
    TData
  > {
    return coreCreateColumnHelper<TFeatures, TData>()
  }

  function createAppTable<TData extends RowData, TSelected = {}>(
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ): AppAlpineTable<
    TFeatures,
    TData,
    TSelected
  > {
    // Merge default options with provided options (provided takes precedence)
    const mergedOptions = {
      ...defaultTableOptions,
      ...tableOptions,
    } as TableOptions<TFeatures, TData>

    return createTable<TFeatures, TData, TSelected>(mergedOptions, selector)
  }

  return {
    appFeatures: defaultTableOptions._features as TFeatures,
    createAppColumnHelper,
    createAppTable,
  }
}
