import { getMemoOptions, makeStateUpdater, memo } from '../../utils'

import { Column, RowData, Table, TableFeature } from '../../types'

import { column_getVisibleLeafColumns } from '../..'
import {
  ColumnOrderDefaultOptions,
  ColumnOrderTableState,
} from './ColumnOrdering.types'
import {
  column_getIndex,
  column_getIsFirstColumn,
  column_getIsLastColumn,
  table_getOrderColumnsFn,
  table_resetColumnOrder,
  table_setColumnOrder,
} from './ColumnOrdering.utils'

export const ColumnOrdering: TableFeature = {
  _getInitialState: (state): ColumnOrderTableState => {
    return {
      columnOrder: [],
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnOrderDefaultOptions => {
    return {
      onColumnOrderChange: makeStateUpdater('columnOrder', table),
    }
  },

  _createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): void => {
    column.getIndex = memo(
      position => [column_getVisibleLeafColumns(table, position)],
      columns => column_getIndex(columns, column),
      getMemoOptions(table.options, 'debugColumns', 'getIndex')
    )

    column.getIsFirstColumn = position =>
      column_getIsFirstColumn(column, table, position)

    column.getIsLastColumn = position =>
      column_getIsLastColumn(column, table, position)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnOrder = updater => table_setColumnOrder(table, updater)

    table.resetColumnOrder = defaultState =>
      table_resetColumnOrder(table, defaultState)

    table._getOrderColumnsFn = memo(
      () => [
        table.getState().columnOrder,
        table.getState().grouping,
        table.options.groupedColumnMode,
      ],
      (columnOrder, grouping, groupedColumnMode) =>
        table_getOrderColumnsFn<TData>(
          columnOrder,
          grouping,
          groupedColumnMode
        ),
      getMemoOptions(table.options, 'debugTable', '_getOrderColumnsFn')
    )
  },
}
