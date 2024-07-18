import { makeStateUpdater } from '../../utils'
import {
  column_getAutoFilterFn,
  column_getCanFilter,
  column_getFilterFn,
  column_getFilterIndex,
  column_getFilterValue,
  column_getIsFiltered,
  column_setFilterValue,
  table_getFilteredRowModel,
  table_getPreFilteredRowModel,
  table_resetColumnFilters,
  table_setColumnFilters,
} from './ColumnFiltering.utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type {
  ColumnDef_ColumnFiltering,
  ColumnFiltersState,
  Column_ColumnFiltering,
  Row_ColumnFiltering,
  TableOptions_ColumnFiltering,
  TableState_ColumnFiltering,
  Table_ColumnFiltering,
} from './ColumnFiltering.types'

/**
 * The Column Filtering feature adds column filtering state and APIs to the table, row, and column objects.
 *
 * **Note:** This does not include Global Filtering. The GlobalFiltering feature has been split out into its own standalone feature.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
 */
export const ColumnFiltering: TableFeature = {
  _getDefaultColumnDef: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(): ColumnDef_ColumnFiltering<TFeatures, TData> => {
    return {
      filterFn: 'auto',
    }
  },

  _getInitialState: (state): TableState_ColumnFiltering => {
    return {
      columnFilters: [],
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnFiltering<TFeatures, TData>>,
  ): TableOptions_ColumnFiltering<TFeatures, TData> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
    } as TableOptions_ColumnFiltering<TFeatures, TData>
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> &
      Partial<Column_ColumnFiltering<TFeatures, TData>>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnFiltering<TFeatures, TData>>,
  ): void => {
    column.getAutoFilterFn = () => column_getAutoFilterFn(column, table)

    column.getFilterFn = () => column_getFilterFn(column, table)

    column.getCanFilter = () => column_getCanFilter(column, table)

    column.getIsFiltered = () => column_getIsFiltered(column)

    column.getFilterValue = () => column_getFilterValue(column, table)

    column.getFilterIndex = () => column_getFilterIndex(column, table)

    column.setFilterValue = (value) =>
      column_setFilterValue(column, table, value)
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>,
  ): void => {
    row.columnFilters = {}
    row.columnFiltersMeta = {}
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnFiltering<TFeatures, TData>>,
  ): void => {
    table.setColumnFilters = (updater: Updater<ColumnFiltersState>) =>
      table_setColumnFilters(table, updater)

    table.resetColumnFilters = (defaultState) =>
      table_resetColumnFilters(table, defaultState)

    table.getPreFilteredRowModel = () => table_getPreFilteredRowModel(table)

    table.getFilteredRowModel = () => table_getFilteredRowModel(table)
  },
}
