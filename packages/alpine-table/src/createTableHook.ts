import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { createTable } from './createTable'
import type { AlpineTable } from './createTable'
import type {
  RowData,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type CreateTableHookOptions<TFeatures extends TableFeatures> = Omit<
  TableOptions<TFeatures, any>,
  'columns' | 'data' | 'state'
>

export type AppAlpineTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = AlpineTable<TFeatures, TData>

export type AppColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = ReturnType<typeof coreCreateColumnHelper<TFeatures, TData>>

export function createTableHook<TFeatures extends TableFeatures>({
  ...defaultTableOptions
}: CreateTableHookOptions<TFeatures>) {
  function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<
    TFeatures,
    TData
  > {
    return coreCreateColumnHelper<TFeatures, TData>()
  }

  function createAppTable<TData extends RowData>(
    tableOptions: Omit<TableOptions<TFeatures, TData>, 'features'>,
    selector?: (state: TableState<TFeatures>) => unknown,
  ): AppAlpineTable<TFeatures, TData> {
    // Merge default options with provided options (provided takes precedence)
    const mergedOptions = {
      ...defaultTableOptions,
      ...tableOptions,
    } as TableOptions<TFeatures, TData>

    return createTable<TFeatures, TData>(mergedOptions, selector)
  }

  return {
    appFeatures: defaultTableOptions.features as TFeatures,
    createAppColumnHelper,
    createAppTable,
  }
}
