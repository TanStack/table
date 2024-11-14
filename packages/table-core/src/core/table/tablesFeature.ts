import { assignAPIs } from '../../utils'
import {
  table_getState,
  table_reset,
  table_setOptions,
  table_setState,
} from './tablesFeature.utils'
import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'

export const tablesFeature: TableFeature = {
  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ): void => {
    assignAPIs(table, [
      {
        fn: () => table_getState(table),
      },
      {
        fn: () => table_reset(table),
      },
      {
        fn: (updater) => table_setOptions(table, updater),
      },
      {
        fn: (updater) => table_setState(table, updater),
      },
    ])
  },
}
