import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import {
  row_getCanMultiSelect,
  row_getCanSelect,
  row_getCanSelectSubRows,
  row_getIsAllSubRowsSelected,
  row_getIsSelected,
  row_getIsSomeSelected,
  row_getToggleSelectedHandler,
  row_toggleSelected,
  table_getFilteredSelectedRowModel,
  table_getGroupedSelectedRowModel,
  table_getIsAllPageRowsSelected,
  table_getIsAllRowsSelected,
  table_getIsSomePageRowsSelected,
  table_getIsSomeRowsSelected,
  table_getPreSelectedRowModel,
  table_getSelectedRowModel,
  table_getToggleAllPageRowsSelectedHandler,
  table_getToggleAllRowsSelectedHandler,
  table_resetRowSelection,
  table_setRowSelection,
  table_toggleAllPageRowsSelected,
  table_toggleAllRowsSelected,
} from './RowSelection.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  Row_RowSelection,
  TableOptions_RowSelection,
  TableState_RowSelection,
  Table_RowSelection,
} from './RowSelection.types'

/**
 * The Row Selection feature adds row selection state and APIs to the table and row objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
 
 */
export const RowSelection: TableFeature = {
  _getInitialState: (state): TableState_RowSelection => {
    return {
      rowSelection: {},
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_RowSelection<TFeatures, TData>>,
  ): TableOptions_RowSelection<TFeatures, TData> => {
    return {
      onRowSelectionChange: makeStateUpdater('rowSelection', table),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true,
      // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
    }
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_RowSelection>,
    table: Table<TFeatures, TData> &
      Partial<Table_RowSelection<TFeatures, TData>>,
  ): void => {
    row.toggleSelected = (value, opts) =>
      row_toggleSelected(row, table, value, opts)

    row.getIsSelected = () => row_getIsSelected(row, table)

    row.getIsSomeSelected = () => row_getIsSomeSelected(row, table)

    row.getIsAllSubRowsSelected = () => row_getIsAllSubRowsSelected(row, table)

    row.getCanSelect = () => row_getCanSelect(row, table)

    row.getCanSelectSubRows = () => row_getCanSelectSubRows(row, table)

    row.getCanMultiSelect = () => row_getCanMultiSelect(row, table)

    row.getToggleSelectedHandler = () =>
      row_getToggleSelectedHandler(row, table)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_RowSelection<TFeatures, TData>>,
  ): void => {
    table.setRowSelection = (updater) => table_setRowSelection(table, updater)

    table.resetRowSelection = (defaultState) =>
      table_resetRowSelection(table, defaultState)

    table.toggleAllRowsSelected = (value) =>
      table_toggleAllRowsSelected(table, value)

    table.toggleAllPageRowsSelected = (value) =>
      table_toggleAllPageRowsSelected(table, value)

    table.getPreSelectedRowModel = () => table_getPreSelectedRowModel(table)

    table.getSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getCoreRowModel()],
      () => table_getSelectedRowModel(table),
      getMemoOptions(table.options, 'debugTable', 'getSelectedRowModel'),
    )

    table.getFilteredSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getFilteredRowModel()],
      () => table_getFilteredSelectedRowModel(table),
      getMemoOptions(
        table.options,
        'debugTable',
        'getFilteredSelectedRowModel',
      ),
    )

    table.getGroupedSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getSortedRowModel()],
      () => table_getGroupedSelectedRowModel(table),
      getMemoOptions(table.options, 'debugTable', 'getGroupedSelectedRowModel'),
    )

    table.getIsAllRowsSelected = () => table_getIsAllRowsSelected(table)

    table.getIsAllPageRowsSelected = () => table_getIsAllPageRowsSelected(table)

    table.getIsSomeRowsSelected = () => table_getIsSomeRowsSelected(table)

    table.getIsSomePageRowsSelected = () =>
      table_getIsSomePageRowsSelected(table)

    table.getToggleAllRowsSelectedHandler = () =>
      table_getToggleAllRowsSelectedHandler(table)

    table.getToggleAllPageRowsSelectedHandler = () =>
      table_getToggleAllPageRowsSelectedHandler(table)
  },
}
