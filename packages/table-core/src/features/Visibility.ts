import { TableFeature } from '../core/table'
import {
  Cell,
  Column,
  OnChangeFn,
  TableGenerics,
  Table,
  Updater,
  Row,
  RowData,
} from '../types'
import { makeStateUpdater, memo } from '../utils'

export type VisibilityState = Record<string, boolean>

export type VisibilityTableState = {
  columnVisibility: VisibilityState
}

export type VisibilityOptions = {
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  enableHiding?: boolean
}

export type VisibilityDefaultOptions = {
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
}

export type VisibilityInstance<TData extends RowData> = {
  getVisibleFlatColumns: () => Column<TData>[]
  getVisibleLeafColumns: () => Column<TData>[]
  getLeftVisibleLeafColumns: () => Column<TData>[]
  getRightVisibleLeafColumns: () => Column<TData>[]
  getCenterVisibleLeafColumns: () => Column<TData>[]
  setColumnVisibility: (updater: Updater<VisibilityState>) => void
  resetColumnVisibility: (defaultState?: boolean) => void
  toggleAllColumnsVisible: (value?: boolean) => void
  getIsAllColumnsVisible: () => boolean
  getIsSomeColumnsVisible: () => boolean
  getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void
}

export type VisibilityColumnDef = {
  enableHiding?: boolean
}

export type VisibilityRow<TData extends RowData> = {
  _getAllVisibleCells: () => Cell<TData>[]
  getVisibleCells: () => Cell<TData>[]
}

export type VisibilityColumn = {
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

  createColumn: <TData extends RowData>(
    column: Column<TData>,
    table: Table<TData>
  ): VisibilityColumn => {
    return {
      toggleVisibility: value => {
        if (column.getCanHide()) {
          table.setColumnVisibility(old => ({
            ...old,
            [column.id]: value ?? !column.getIsVisible(),
          }))
        }
      },
      getIsVisible: () => {
        return table.getState().columnVisibility?.[column.id] ?? true
      },

      getCanHide: () => {
        return (
          (column.columnDef.enableHiding ?? true) &&
          (table.options.enableHiding ?? true)
        )
      },
      getToggleVisibilityHandler: () => {
        return (e: unknown) => {
          column.toggleVisibility?.(
            ((e as MouseEvent).target as HTMLInputElement).checked
          )
        }
      },
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): VisibilityRow<TData> => {
    return {
      _getAllVisibleCells: memo(
        () => [row.getAllCells(), table.getState().columnVisibility],
        cells => {
          return cells.filter(cell => cell.column.getIsVisible())
        },
        {
          key:
            process.env.NODE_ENV === 'production' && 'row._getAllVisibleCells',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),
      getVisibleCells: memo(
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
      ),
    }
  },

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): VisibilityInstance<TData> => {
    const makeVisibleColumnsMethod = (
      key: string,
      getColumns: () => Column<TData>[]
    ): (() => Column<TData>[]) => {
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

    return {
      getVisibleFlatColumns: makeVisibleColumnsMethod(
        'getVisibleFlatColumns',
        () => table.getAllFlatColumns()
      ),
      getVisibleLeafColumns: makeVisibleColumnsMethod(
        'getVisibleLeafColumns',
        () => table.getAllLeafColumns()
      ),
      getLeftVisibleLeafColumns: makeVisibleColumnsMethod(
        'getLeftVisibleLeafColumns',
        () => table.getLeftLeafColumns()
      ),
      getRightVisibleLeafColumns: makeVisibleColumnsMethod(
        'getRightVisibleLeafColumns',
        () => table.getRightLeafColumns()
      ),
      getCenterVisibleLeafColumns: makeVisibleColumnsMethod(
        'getCenterVisibleLeafColumns',
        () => table.getCenterLeafColumns()
      ),

      setColumnVisibility: updater =>
        table.options.onColumnVisibilityChange?.(updater),

      resetColumnVisibility: defaultState => {
        table.setColumnVisibility(
          defaultState ? {} : table.initialState.columnVisibility ?? {}
        )
      },

      toggleAllColumnsVisible: value => {
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
      },

      getIsAllColumnsVisible: () =>
        !table.getAllLeafColumns().some(column => !column.getIsVisible?.()),

      getIsSomeColumnsVisible: () =>
        table.getAllLeafColumns().some(column => column.getIsVisible?.()),

      getToggleAllColumnsVisibilityHandler: () => {
        return (e: unknown) => {
          table.toggleAllColumnsVisible(
            ((e as MouseEvent).target as HTMLInputElement)?.checked
          )
        }
      },
    }
  },
}
