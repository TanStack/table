import { RowData, Table, TableFeature } from '../../types'
import {
  table_getCoreRowModel,
  table_getRowModel,
  table_getState,
  table_reset,
  table_setOptions,
  table_setState,
} from './Tables.utils'

export const Tables: TableFeature = {
  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.reset = () => table_reset(table)

    table.setOptions = (updater) => table_setOptions(table, updater)

    table.getState = () => table_getState(table)

    table.setState = (updater) => table_setState(table, updater)

    table.getCoreRowModel = () => table_getCoreRowModel(table)

    table.getRowModel = () => table_getRowModel(table)
  },
}
