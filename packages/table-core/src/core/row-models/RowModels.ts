import { table_getCoreRowModel, table_getRowModel } from './RowModels.utils'
import type { RowData, Table, TableFeature } from '../../types'

export const RowModels: TableFeature = {
  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.getCoreRowModel = () => table_getCoreRowModel(table)

    table.getRowModel = () => table_getRowModel(table)
  },
}
