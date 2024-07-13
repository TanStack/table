import {
  table_getCoreRowModel,
  table_getRowModel,
  table_getState,
  table_reset,
  table_setOptions,
  table_setState,
} from './Tables.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

export const Tables: TableFeature = {
  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table.getCoreRowModel = () => table_getCoreRowModel(table)

    table.getRowModel = () => table_getRowModel(table)

    table.getState = () => table_getState(table)

    table.reset = () => table_reset(table)

    table.setOptions = (updater) => table_setOptions(table, updater)

    table.setState = (updater) => table_setState(table, updater)
  },
}
