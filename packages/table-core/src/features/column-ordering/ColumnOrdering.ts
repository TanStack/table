import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { column_getVisibleLeafColumns } from '../column-visibility/ColumnVisibility.utils'
import {
  column_getIndex,
  column_getIsFirstColumn,
  column_getIsLastColumn,
  table_getOrderColumnsFn,
  table_resetColumnOrder,
  table_setColumnOrder,
} from './ColumnOrdering.utils'
import type {
  ColumnOrderDefaultOptions,
  TableState_ColumnOrdering,
  Table_ColumnOrdering,
} from './ColumnOrdering.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Column } from '../../types/Column'

export const ColumnOrdering: TableFeature = {
  _getInitialState: (state): TableState_ColumnOrdering => {
    return {
      columnOrder: [],
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
  ): ColumnOrderDefaultOptions => {
    return {
      onColumnOrderChange: makeStateUpdater('columnOrder', table),
    }
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    column.getIndex = memo(
      (position) => [column_getVisibleLeafColumns(table, position)],
      (columns) => column_getIndex(columns, column as any), //TODO: fix this
      getMemoOptions(table.options, 'debugColumns', 'getIndex'),
    )

    column.getIsFirstColumn = (position) =>
      column_getIsFirstColumn(column, table, position)

    column.getIsLastColumn = (position) =>
      column_getIsLastColumn(column, table, position)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> & Table_ColumnOrdering<TFeatures, TData>,
  ): void => {
    table.setColumnOrder = (updater) => table_setColumnOrder(table, updater)

    table.resetColumnOrder = (defaultState) =>
      table_resetColumnOrder(table, defaultState)

    table._getOrderColumnsFn = memo(
      () => [
        table.getState().columnOrder,
        table.getState().grouping,
        table.options.groupedColumnMode,
      ],
      () => table_getOrderColumnsFn<TFeatures, TData>(table),
      getMemoOptions(table.options, 'debugTable', '_getOrderColumnsFn'),
    )
  },
}
