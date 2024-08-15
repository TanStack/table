import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { _table_getState } from '../../core/table/Tables.utils'
import {
  column_getIndex,
  column_getIsFirstColumn,
  column_getIsLastColumn,
  table_resetColumnOrder,
  table_setColumnOrder,
} from './ColumnOrdering.utils'
import type {
  ColumnOrderDefaultOptions,
  Column_ColumnOrdering,
  TableState_ColumnOrdering,
  Table_ColumnOrdering,
} from './ColumnOrdering.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Column } from '../../types/Column'

/**
 * The Column Ordering feature adds column ordering state and APIs to the table and column objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
 */
export const ColumnOrdering: TableFeature = {
  _getInitialState: (state): TableState_ColumnOrdering => {
    return {
      columnOrder: [],
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnOrdering<TFeatures, TData>>,
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
    column: Column<TFeatures, TData, TValue> & Partial<Column_ColumnOrdering>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnOrdering<TFeatures, TData>>,
  ): void => {
    column.getIndex = memo(
      (position) => [
        position,
        _table_getState(table).columnOrder,
        _table_getState(table).columnPinning,
        _table_getState(table).grouping,
      ],
      (position) => column_getIndex(column, table, position),
      getMemoOptions(table.options, 'debugColumns', 'getIndex'),
    )

    column.getIsFirstColumn = (position) =>
      column_getIsFirstColumn(column, table, position)

    column.getIsLastColumn = (position) =>
      column_getIsLastColumn(column, table, position)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnOrdering<TFeatures, TData>>,
  ): void => {
    table.setColumnOrder = (updater) => table_setColumnOrder(table, updater)

    table.resetColumnOrder = (defaultState) =>
      table_resetColumnOrder(table, defaultState)
  },
}
