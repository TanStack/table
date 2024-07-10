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
import type {
  Row,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '../../types'
import type {
  TableOptions_RowSelection,
  TableState_RowSelection,
} from './RowSelection.types'

export const RowSelection: TableFeature = {
  _getInitialState: (state): TableState_RowSelection => {
    return {
      rowSelection: {},
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
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

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table.setRowSelection = (updater) => table_setRowSelection(table, updater)

    table.resetRowSelection = (defaultState) =>
      table_resetRowSelection(table, defaultState)

    table.toggleAllRowsSelected = (value) =>
      table_toggleAllRowsSelected(table, value)

    table.toggleAllPageRowsSelected = (value) =>
      table_toggleAllPageRowsSelected(table, value)

    // addRowSelectionRange: rowId => {
    //   const {
    //     rows,
    //     rowsById,
    //     options: { selectGroupingRows, selectSubRows },
    //   } = table

    //   const findSelectedRow = (rows: Row[]) => {
    //     let found
    //     rows.find(d => {
    //       if (d.getIsSelected()) {
    //         found = d
    //         return true
    //       }
    //       const subFound = findSelectedRow(d.subRows || [])
    //       if (subFound) {
    //         found = subFound
    //         return true
    //       }
    //       return false
    //     })
    //     return found
    //   }

    //   const firstRow = findSelectedRow(rows) || rows[0]
    //   const lastRow = rowsById[rowId]

    //   let include = false
    //   const selectedRowIds = {}

    //   const addRow = (row: Row) => {
    //     mutateRowIsSelected(selectedRowIds, row.id, true, {
    //       rowsById,
    //       selectGroupingRows: selectGroupingRows!,
    //       selectSubRows: selectSubRows!,
    //     })
    //   }

    //   table.rows.forEach(row => {
    //     const isFirstRow = row.id === firstRow.id
    //     const isLastRow = row.id === lastRow.id

    //     if (isFirstRow || isLastRow) {
    //       if (!include) {
    //         include = true
    //       } else if (include) {
    //         addRow(row)
    //         include = false
    //       }
    //     }

    //     if (include) {
    //       addRow(row)
    //     }
    //   })

    //   table.setRowSelection(selectedRowIds)
    // },
    table.getPreSelectedRowModel = () => table_getPreSelectedRowModel(table)

    table.getSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getCoreRowModel()],
      (rowSelection, rowModel) =>
        table_getSelectedRowModel(table, rowSelection, rowModel),
      getMemoOptions(table.options, 'debugTable', 'getSelectedRowModel'),
    )

    table.getFilteredSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getFilteredRowModel()],
      (rowSelection, rowModel) =>
        table_getFilteredSelectedRowModel(table, rowSelection, rowModel),
      getMemoOptions(
        table.options,
        'debugTable',
        'getFilteredSelectedRowModel',
      ),
    )

    table.getGroupedSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getSortedRowModel()],
      (rowSelection, rowModel) =>
        table_getGroupedSelectedRowModel(table, rowSelection, rowModel),
      getMemoOptions(table.options, 'debugTable', 'getGroupedSelectedRowModel'),
    )

    ///

    // getGroupingRowCanSelect: rowId => {
    //   const row = table.getRow(rowId)

    //   if (!row) {
    //     throw new Error()
    //   }

    //   if (typeof table.options.enableGroupingRowSelection === 'function') {
    //     return table.options.enableGroupingRowSelection(row)
    //   }

    //   return table.options.enableGroupingRowSelection ?? false
    // },

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

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    table: Table<TFeatures, TData>,
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
}
