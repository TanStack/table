import { TableFeature } from '../core/table'
import {
  Cell,
  Column,
  OnChangeFn,
  Table,
  Updater,
  Row,
  RowData,
} from '../types'
import { makeStateUpdater, memo } from '../utils'

export type VisibilityState = Record<string, boolean>

export interface VisibilityTableState {
  columnVisibility: VisibilityState
}

export interface VisibilityOptions {
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  enableHiding?: boolean
}

export interface VisibilityDefaultOptions {
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
}

export interface VisibilityInstance<TData extends RowData> {
  getVisibleFlatColumns: () => Column<TData, unknown>[]
  getVisibleLeafColumns: () => Column<TData, unknown>[]
  getLeftVisibleLeafColumns: () => Column<TData, unknown>[]
  getRightVisibleLeafColumns: () => Column<TData, unknown>[]
  getCenterVisibleLeafColumns: () => Column<TData, unknown>[]
  setColumnVisibility: (updater: Updater<VisibilityState>) => void
  resetColumnVisibility: (defaultState?: boolean) => void
  toggleAllColumnsVisible: (value?: boolean) => void
  getIsAllColumnsVisible: () => boolean
  getIsSomeColumnsVisible: () => boolean
  getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void
}

export interface VisibilityColumnDef {
  enableHiding?: boolean
}

export interface VisibilityRow<TData extends RowData> {
  _getAllVisibleCells: () => Cell<TData, unknown>[]
  getVisibleCells: () => Cell<TData, unknown>[]
}

export interface VisibilityColumn {
  getCanHide: () => boolean
  getIsVisible: () => boolean
  toggleVisibility: (value?: boolean) => void
  getToggleVisibilityHandler: () => (event: unknown) => void
}

//

export const Visibility: TableFeature = {
  getInitialState: (state): VisibilityTableState => {
    return {
      columnVisibility: {},
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): VisibilityDefaultOptions => {
    return {
      onColumnVisibilityChange: makeStateUpdater('columnVisibility', table),
    }
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.toggleVisibility = value => {
      if (column.getCanHide()) {
        table.setColumnVisibility(old => ({
          ...old,
          [column.id]: value ?? !column.getIsVisible(),
        }))
      }
    }
    column.getIsVisible = () => {
      return table.getState().columnVisibility?.[column.id] ?? true
    }

    column.getCanHide = () => {
      return (
        (column.columnDef.enableHiding ?? true) &&
        (table.options.enableHiding ?? true)
      )
    }
    column.getToggleVisibilityHandler = () => {
      return (e: unknown) => {
        column.toggleVisibility?.(
          ((e as MouseEvent).target as HTMLInputElement).checked
        )
      }
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row._getAllVisibleCells = memo(
      () => [row.getAllCells(), table.getState().columnVisibility],
      cells => {
        return cells.filter(cell => cell.column.getIsVisible())
      },
      {
        key: process.env.NODE_ENV === 'production' && 'row._getAllVisibleCells',
        debug: () => table.options.debugAll ?? table.options.debugRows,
      }
    )
    row.getVisibleCells = memo(
      () => [
        row.getLeftVisibleCells(),
        row.getCenterVisibleCells(),
        row.getRightVisibleCells(),
      ],
      (left, center, right) => [...left, ...center, ...right],
      {
        key: process.env.NODE_ENV === 'development' && 'row.getVisibleCells',
        debug: () => table.options.debugAll ?? table.options.debugRows,
      }
    )
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    const makeVisibleColumnsMethod = (
      key: string,
      getColumns: () => Column<TData, unknown>[]
    ): (() => Column<TData, unknown>[]) => {
      return memo(
        () => [
          getColumns(),
          getColumns()
            .filter(d => d.getIsVisible())
            .map(d => d.id)
            .join('_'),
        ],
        columns => {
          return columns.filter(d => d.getIsVisible?.())
        },
        {
          key,
          debug: () => table.options.debugAll ?? table.options.debugColumns,
        }
      )
    }

    table.getVisibleFlatColumns = makeVisibleColumnsMethod(
      'getVisibleFlatColumns',
      () => table.getAllFlatColumns()
    )
    table.getVisibleLeafColumns = makeVisibleColumnsMethod(
      'getVisibleLeafColumns',
      () => table.getAllLeafColumns()
    )
    table.getLeftVisibleLeafColumns = makeVisibleColumnsMethod(
      'getLeftVisibleLeafColumns',
      () => table.getLeftLeafColumns()
    )
    table.getRightVisibleLeafColumns = makeVisibleColumnsMethod(
      'getRightVisibleLeafColumns',
      () => table.getRightLeafColumns()
    )
    table.getCenterVisibleLeafColumns = makeVisibleColumnsMethod(
      'getCenterVisibleLeafColumns',
      () => table.getCenterLeafColumns()
    )

    table.setColumnVisibility = updater =>
      table.options.onColumnVisibilityChange?.(updater)

    table.resetColumnVisibility = defaultState => {
      table.setColumnVisibility(
        defaultState ? {} : table.initialState.columnVisibility ?? {}
      )
    }

    table.toggleAllColumnsVisible = value => {
      value = value ?? !table.getIsAllColumnsVisible()

      table.setColumnVisibility(
        table.getAllLeafColumns().reduce(
          (obj, column) => ({
            ...obj,
            [column.id]: !value ? !column.getCanHide?.() : value,
          }),
          {}
        )
      )
    }

    table.getIsAllColumnsVisible = () =>
      !table.getAllLeafColumns().some(column => !column.getIsVisible?.())

    table.getIsSomeColumnsVisible = () =>
      table.getAllLeafColumns().some(column => column.getIsVisible?.())

    table.getToggleAllColumnsVisibilityHandler = () => {
      return (e: unknown) => {
        table.toggleAllColumnsVisible(
          ((e as MouseEvent).target as HTMLInputElement)?.checked
        )
      }
    }
  },
}
