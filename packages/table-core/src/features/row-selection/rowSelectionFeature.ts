import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  getDefaultRowSelectionState,
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
} from './rowSelectionFeature.utils'
import type { Table_Internal } from '../../types/Table'
import type { TableState_All } from '../../types/TableState'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type {
  Row_RowSelection,
  TableOptions_RowSelection,
} from './rowSelectionFeature.types'

/**
 * The Row Selection feature adds row selection state and APIs to the table and row objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection)
 * [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
 
 */
export const rowSelectionFeature: TableFeature = {
  getInitialState: (
    initialState: Partial<TableState_All>,
  ): Partial<TableState_All> => {
    return {
      rowSelection: getDefaultRowSelectionState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
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

  constructRowAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_RowSelection>,
  ): void => {
    assignAPIs(row, [
      {
        fn: (value, opts) => row_toggleSelected(row, value, opts),
      },
      {
        fn: () => row_getIsSelected(row),
      },
      {
        fn: () => row_getIsSomeSelected(row),
      },
      {
        fn: () => row_getIsAllSubRowsSelected(row),
      },
      {
        fn: () => row_getCanSelect(row),
      },
      {
        fn: () => row_getCanSelectSubRows(row),
      },
      {
        fn: () => row_getCanMultiSelect(row),
      },
      {
        fn: () => row_getToggleSelectedHandler(row),
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ): void => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setRowSelection(table, updater),
      },
      {
        fn: (defaultState) => table_resetRowSelection(table, defaultState),
      },
      {
        fn: (value) => table_toggleAllRowsSelected(table, value),
      },
      {
        fn: (value) => table_toggleAllPageRowsSelected(table, value),
      },
      {
        fn: () => table_getPreSelectedRowModel(table),
      },
      {
        fn: () => table_getSelectedRowModel(table),
        memoDeps: () => [
          table.options.state?.rowSelection,
          table.getCoreRowModel(),
        ],
      },
      {
        fn: () => table_getFilteredSelectedRowModel(table),
        memoDeps: () => [
          table.options.state?.rowSelection,
          table.getFilteredRowModel(),
        ],
      },
      {
        fn: () => table_getGroupedSelectedRowModel(table),
        memoDeps: () => [
          table.options.state?.rowSelection,
          table.getSortedRowModel(),
        ],
      },
      {
        fn: () => table_getIsAllRowsSelected(table),
      },
      {
        fn: () => table_getIsAllPageRowsSelected(table),
      },
      {
        fn: () => table_getIsSomeRowsSelected(table),
      },
      {
        fn: () => table_getIsSomePageRowsSelected(table),
      },
      {
        fn: () => table_getToggleAllRowsSelectedHandler(table),
      },
      {
        fn: () => table_getToggleAllPageRowsSelectedHandler(table),
      },
    ])
  },
}
