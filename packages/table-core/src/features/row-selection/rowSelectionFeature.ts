import {
  assignTableAPIs,
  assignPrototypeAPIs,
  makeStateUpdater,
} from '../../utils'
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

    assignRowPrototype: (prototype, table) => {
      assignPrototypeAPIs('rowSelectionFeature', prototype, table, {
        row_toggleSelected: {
          fn: (row, value, opts) => row_toggleSelected(row, value, opts),
        },
        row_getIsSelected: {
          fn: (row) => row_getIsSelected(row),
        },
        row_getIsSomeSelected: {
          fn: (row) => row_getIsSomeSelected(row),
        },
        row_getIsAllSubRowsSelected: {
          fn: (row) => row_getIsAllSubRowsSelected(row),
        },
        row_getCanSelect: {
          fn: (row) => row_getCanSelect(row),
        },
        row_getCanSelectSubRows: {
          fn: (row) => row_getCanSelectSubRows(row),
        },
        row_getCanMultiSelect: {
          fn: (row) => row_getCanMultiSelect(row),
        },
        row_getToggleSelectedHandler: {
          fn: (row) => row_getToggleSelectedHandler(row),
        },
      })
    },

    constructTableAPIs: (table) => {
      assignTableAPIs('rowSelectionFeature', table, {
        table_setRowSelection: {
          fn: (updater) => table_setRowSelection(table, updater),
        },
        table_resetRowSelection: {
          fn: (defaultState) => table_resetRowSelection(table, defaultState),
        },
        table_toggleAllRowsSelected: {
          fn: (value) => table_toggleAllRowsSelected(table, value),
        },
        table_toggleAllPageRowsSelected: {
          fn: (value) => table_toggleAllPageRowsSelected(table, value),
        },
        table_getPreSelectedRowModel: {
          fn: () => table_getPreSelectedRowModel(table),
        },
        table_getSelectedRowModel: {
          fn: () => table_getSelectedRowModel(table),
          memoDeps: () => [
            table.store.state.rowSelection,
            table.getCoreRowModel(),
          ],
        },
        table_getFilteredSelectedRowModel: {
          fn: () => table_getFilteredSelectedRowModel(table),
          memoDeps: () => [
            table.store.state.rowSelection,
            table.getFilteredRowModel(),
          ],
        },
        table_getGroupedSelectedRowModel: {
          fn: () => table_getGroupedSelectedRowModel(table),
          memoDeps: () => [
            table.store.state.rowSelection,
            table.getSortedRowModel(),
          ],
        },
        table_getIsAllRowsSelected: {
          fn: () => table_getIsAllRowsSelected(table),
        },
        table_getIsAllPageRowsSelected: {
          fn: () => table_getIsAllPageRowsSelected(table),
        },
        table_getIsSomeRowsSelected: {
          fn: () => table_getIsSomeRowsSelected(table),
        },
        table_getIsSomePageRowsSelected: {
          fn: () => table_getIsSomePageRowsSelected(table),
        },
        table_getToggleAllRowsSelectedHandler: {
          fn: () => table_getToggleAllRowsSelectedHandler(table),
        },
        table_getToggleAllPageRowsSelectedHandler: {
          fn: () => table_getToggleAllPageRowsSelectedHandler(table),
        },
      })
    },
  }
}

/**
 * The Row Selection feature adds row selection state and APIs to the table and row objects.
 */
export const rowSelectionFeature = constructRowSelectionFeature()
