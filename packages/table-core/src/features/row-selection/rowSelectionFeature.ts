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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   Row_RowSelection,
//   TableOptions_RowSelection,
//   TableState_RowSelection,
//   Table_RowSelection,
// } from './rowSelectionFeature.types'

interface RowSelectionFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Row: Row_RowSelection
  // Table: Table_RowSelection<TFeatures, TData>
  // TableOptions: TableOptions_RowSelection<TFeatures, TData>
  // TableState: TableState_RowSelection
}

export function constructRowSelectionFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<RowSelectionFeatureConstructors<TFeatures, TData>> {
  return {
    getInitialState: (initialState) => {
      return {
        rowSelection: getDefaultRowSelectionState(),
        ...initialState,
      }
    },

    getDefaultTableOptions: (table) => {
      return {
        onRowSelectionChange: makeStateUpdater('rowSelection', table),
        enableRowSelection: true,
        enableMultiRowSelection: true,
        enableSubRowSelection: true,
      }
    },

    constructRowAPIs: (row) => {
      assignAPIs('rowSelectionFeature', row, [
        {
          fn: (value, opts) => row_toggleSelected(row, value, opts),
          fnName: 'row_toggleSelected',
        },
        {
          fn: () => row_getIsSelected(row),
          fnName: 'row_getIsSelected',
        },
        {
          fn: () => row_getIsSomeSelected(row),
          fnName: 'row_getIsSomeSelected',
        },
        {
          fn: () => row_getIsAllSubRowsSelected(row),
          fnName: 'row_getIsAllSubRowsSelected',
        },
        {
          fn: () => row_getCanSelect(row),
          fnName: 'row_getCanSelect',
        },
        {
          fn: () => row_getCanSelectSubRows(row),
          fnName: 'row_getCanSelectSubRows',
        },
        {
          fn: () => row_getCanMultiSelect(row),
          fnName: 'row_getCanMultiSelect',
        },
        {
          fn: () => row_getToggleSelectedHandler(row),
          fnName: 'row_getToggleSelectedHandler',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('rowSelectionFeature', table, [
        {
          fn: (updater) => table_setRowSelection(table, updater),
          fnName: 'table_setRowSelection',
        },
        {
          fn: (defaultState) => table_resetRowSelection(table, defaultState),
          fnName: 'table_resetRowSelection',
        },
        {
          fn: (value) => table_toggleAllRowsSelected(table, value),
          fnName: 'table_toggleAllRowsSelected',
        },
        {
          fn: (value) => table_toggleAllPageRowsSelected(table, value),
          fnName: 'table_toggleAllPageRowsSelected',
        },
        {
          fn: () => table_getPreSelectedRowModel(table),
          fnName: 'table_getPreSelectedRowModel',
        },
        {
          fn: () => table_getSelectedRowModel(table),
          fnName: 'table_getSelectedRowModel',
          memoDeps: () => [
            table.options.state?.rowSelection,
            table.getCoreRowModel(),
          ],
        },
        {
          fn: () => table_getFilteredSelectedRowModel(table),
          fnName: 'table_getFilteredSelectedRowModel',
          memoDeps: () => [
            table.options.state?.rowSelection,
            table.getFilteredRowModel(),
          ],
        },
        {
          fn: () => table_getGroupedSelectedRowModel(table),
          fnName: 'table_getGroupedSelectedRowModel',
          memoDeps: () => [
            table.options.state?.rowSelection,
            table.getSortedRowModel(),
          ],
        },
        {
          fn: () => table_getIsAllRowsSelected(table),
          fnName: 'table_getIsAllRowsSelected',
        },
        {
          fn: () => table_getIsAllPageRowsSelected(table),
          fnName: 'table_getIsAllPageRowsSelected',
        },
        {
          fn: () => table_getIsSomeRowsSelected(table),
          fnName: 'table_getIsSomeRowsSelected',
        },
        {
          fn: () => table_getIsSomePageRowsSelected(table),
          fnName: 'table_getIsSomePageRowsSelected',
        },
        {
          fn: () => table_getToggleAllRowsSelectedHandler(table),
          fnName: 'table_getToggleAllRowsSelectedHandler',
        },
        {
          fn: () => table_getToggleAllPageRowsSelectedHandler(table),
          fnName: 'table_getToggleAllPageRowsSelectedHandler',
        },
      ])
    },
  }
}

/**
 * The Row Selection feature adds row selection state and APIs to the table and row objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection)
 * [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
 */
export const rowSelectionFeature = constructRowSelectionFeature()
