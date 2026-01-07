import { createColumnHelper } from './columnHelper'
import type { ColumnHelper } from './columnHelper'
import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Table } from '../types/Table'
import type { TableOptions } from '../types/TableOptions'

/**
 * Options for creating a table helper to share common options across multiple tables
 * coreColumnsFeature, data, and state are excluded from this type and reserved for only the `useTable`/`createTable` functions
 */
export type TableHelperOptions<TFeatures extends TableFeatures> = Omit<
  TableOptions<TFeatures, any>,
  'columns' | 'data' | 'store' | 'state' | 'initialState'
> & {
  _features: TFeatures
}

/**
 * Internal type that each adapter package will build off of to create a table helper
 */
export type TableHelper_Core<TFeatures extends TableFeatures> = {
  createColumnHelper: <TData extends RowData>() => ColumnHelper<
    TFeatures,
    TData
  >
  features: TFeatures
  options: Omit<
    TableOptions<TFeatures, any>,
    'columns' | 'data' | 'store' | 'state' | 'initialState'
  >
  tableCreator: <TData extends RowData>(
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: any,
  ) => Table<TFeatures, TData>
}

/**
 * Internal function to create a table helper that each adapter package will use to create their own table helper
 */
export function constructTableHelper<TFeatures extends TableFeatures>(
  tableCreator: <TData extends RowData>(
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: any,
  ) => Table<TFeatures, TData>,
  tableHelperOptions: TableHelperOptions<TFeatures>,
): TableHelper_Core<TFeatures> {
  return {
    createColumnHelper,
    features: tableHelperOptions._features,
    options: tableHelperOptions,
    tableCreator: (tableOptions, selector) =>
      tableCreator({ ...tableHelperOptions, ...tableOptions }, selector),
  }
}
