import { TableFeature } from '../core/table'
import { OnChangeFn, Table, Row, RowModel, Updater, RowData } from '../types'
import { makeStateUpdater, memo } from '../utils'

export type RowPickingState = Record<string, boolean>

export interface RowPickingTableState {
  rowPicking: RowPickingState
}

export interface RowPickingOptions<TData extends RowData> {
  enableRowPicking?: boolean | ((row: Row<TData>) => boolean)
  enableMultiRowPicking?: boolean | ((row: Row<TData>) => boolean)
  enableSubRowPicking?: boolean | ((row: Row<TData>) => boolean)
  onRowPickingChange?: OnChangeFn<RowPickingState>
}

export interface RowPickingRow {
  getIsPicked: () => boolean
  getIsSomePicked: () => boolean
  getIsAllSubRowsPicked: () => boolean
  getCanPick: () => boolean
  getCanMultiSelect: () => boolean
  getCanPickSubRows: () => boolean
  togglePicked: (value?: boolean) => void
  getTogglePickedHandler: () => (event: unknown) => void
}

export interface RowPickingInstance<TData extends RowData> {
  getToggleAllRowsPickedHandler: () => (event: unknown) => void
  getToggleAllPageRowsPickedHandler: () => (event: unknown) => void
  setRowPicking: (updater: Updater<RowPickingState>) => void
  resetRowPicking: (defaultState?: boolean) => void
  getIsAllRowsPicked: () => boolean
  getIsAllPageRowsPicked: () => boolean
  getIsSomeRowsPicked: () => boolean
  getIsSomePageRowsPicked: () => boolean
  toggleAllRowsPicked: (value?: boolean) => void
  toggleAllPageRowsPicked: (value?: boolean) => void
  getPrePickedRowModel: () => RowModel<TData>
  getPickedRowModel: () => RowModel<TData>
  getFilteredPickedRowModel: () => RowModel<TData>
  getGroupedPickedRowModel: () => RowModel<TData>
}

//

export const RowPicking: TableFeature = {
  getInitialState: (state): RowPickingTableState => {
    return {
      rowPicking: {},
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): RowPickingOptions<TData> => {
    return {
      onRowPickingChange: makeStateUpdater('rowPicking', table),
      enableRowPicking: true,
      enableMultiRowPicking: true,
      enableSubRowPicking: true,
      // enableGroupingRowPicking: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
    }
  },

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): RowPickingInstance<TData> => {
    return {
      setRowPicking: updater => table.options.onRowPickingChange?.(updater),
      resetRowPicking: defaultState =>
        table.setRowPicking(
          defaultState ? {} : table.initialState.rowPicking ?? {}
        ),
      toggleAllRowsPicked: value => {
        table.setRowPicking(old => {
          value =
            typeof value !== 'undefined' ? value : !table.getIsAllRowsPicked()

          const rowPicking = { ...old }

          const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows

          // We don't use `mutateRowIsPicked` here for performance reasons.
          // All of the rows are flat already, so it wouldn't be worth it
          if (value) {
            preGroupedFlatRows.forEach(row => {
              if (!row.getCanPick()) {
                return
              }
              rowPicking[row.id] = true
            })
          } else {
            preGroupedFlatRows.forEach(row => {
              delete rowPicking[row.id]
            })
          }

          return rowPicking
        })
      },
      toggleAllPageRowsPicked: value =>
        table.setRowPicking(old => {
          const resolvedValue =
            typeof value !== 'undefined'
              ? value
              : !table.getIsAllPageRowsPicked()

          const rowPicking: RowPickingState = { ...old }

          table.getRowModel().rows.forEach(row => {
            mutateRowIsPicked(rowPicking, row.id, resolvedValue, table)
          })

          return rowPicking
        }),

      getPrePickedRowModel: () => table.getCoreRowModel(),
      getPickedRowModel: memo(
        () => [table.getState().rowPicking, table.getCoreRowModel()],
        (rowPicking, rowModel) => {
          if (!Object.keys(rowPicking).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return pickRowsFn(table, rowModel)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getPickedRowModel',
          debug: () => table.options.debugAll ?? table.options.debugTable,
        }
      ),

      getFilteredPickedRowModel: memo(
        () => [table.getState().rowPicking, table.getFilteredRowModel()],
        (rowPicking, rowModel) => {
          if (!Object.keys(rowPicking).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return pickRowsFn(table, rowModel)
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getFilteredPickedRowModel',
          debug: () => table.options.debugAll ?? table.options.debugTable,
        }
      ),

      getGroupedPickedRowModel: memo(
        () => [table.getState().rowPicking, table.getSortedRowModel()],
        (rowPicking, rowModel) => {
          if (!Object.keys(rowPicking).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return pickRowsFn(table, rowModel)
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getGroupedPickedRowModel',
          debug: () => table.options.debugAll ?? table.options.debugTable,
        }
      ),

      ///

      // getGroupingRowCanSelect: rowId => {
      //   const row = table.getRow(rowId)

      //   if (!row) {
      //     throw new Error()
      //   }

      //   if (typeof table.options.enableGroupingRowPicking === 'function') {
      //     return table.options.enableGroupingRowPicking(row)
      //   }

      //   return table.options.enableGroupingRowPicking ?? false
      // },

      getIsAllRowsPicked: () => {
        const preGroupedFlatRows = table.getFilteredRowModel().flatRows
        const { rowPicking } = table.getState()

        let isAllRowsPicked = Boolean(
          preGroupedFlatRows.length && Object.keys(rowPicking).length
        )

        if (isAllRowsPicked) {
          if (
            preGroupedFlatRows.some(
              row => row.getCanPick() && !rowPicking[row.id]
            )
          ) {
            isAllRowsPicked = false
          }
        }

        return isAllRowsPicked
      },

      getIsAllPageRowsPicked: () => {
        const paginationFlatRows = table
          .getPaginationRowModel()
          .flatRows.filter(row => row.getCanPick())
        const { rowPicking } = table.getState()

        let isAllPageRowsPicked = !!paginationFlatRows.length

        if (
          isAllPageRowsPicked &&
          paginationFlatRows.some(row => !rowPicking[row.id])
        ) {
          isAllPageRowsPicked = false
        }

        return isAllPageRowsPicked
      },

      getIsSomeRowsPicked: () => {
        const totalPicked = Object.keys(
          table.getState().rowPicking ?? {}
        ).length
        return (
          totalPicked > 0 &&
          totalPicked < table.getFilteredRowModel().flatRows.length
        )
      },

      getIsSomePageRowsPicked: () => {
        const paginationFlatRows = table.getPaginationRowModel().flatRows
        return table.getIsAllPageRowsPicked()
          ? false
          : paginationFlatRows
              .filter(row => row.getCanPick())
              .some(d => d.getIsPicked() || d.getIsSomePicked())
      },

      getToggleAllRowsPickedHandler: () => {
        return (e: unknown) => {
          table.toggleAllRowsPicked(
            ((e as MouseEvent).target as HTMLInputElement).checked
          )
        }
      },

      getToggleAllPageRowsPickedHandler: () => {
        return (e: unknown) => {
          table.toggleAllPageRowsPicked(
            ((e as MouseEvent).target as HTMLInputElement).checked
          )
        }
      },
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): RowPickingRow => {
    return {
      togglePicked: value => {
        const isPicked = row.getIsPicked()

        table.setRowPicking(old => {
          value = typeof value !== 'undefined' ? value : !isPicked

          if (isPicked === value) {
            return old
          }

          const pickedRowIds = { ...old }

          mutateRowIsPicked(pickedRowIds, row.id, value, table)

          return pickedRowIds
        })
      },
      getIsPicked: () => {
        const { rowPicking } = table.getState()
        return isRowPicked(row, rowPicking)
      },

      getIsSomePicked: () => {
        const { rowPicking } = table.getState()
        return isSubRowPicked(row, rowPicking, table) === 'some'
      },

      getIsAllSubRowsPicked: () => {
        const { rowPicking } = table.getState()
        return isSubRowPicked(row, rowPicking, table) === 'all'
      },

      getCanPick: () => {
        if (typeof table.options.enableRowPicking === 'function') {
          return table.options.enableRowPicking(row)
        }

        return table.options.enableRowPicking ?? true
      },

      getCanPickSubRows: () => {
        if (typeof table.options.enableSubRowPicking === 'function') {
          return table.options.enableSubRowPicking(row)
        }

        return table.options.enableSubRowPicking ?? true
      },

      getCanMultiSelect: () => {
        if (typeof table.options.enableMultiRowPicking === 'function') {
          return table.options.enableMultiRowPicking(row)
        }

        return table.options.enableMultiRowPicking ?? true
      },
      getTogglePickedHandler: () => {
        const canPick = row.getCanPick()

        return (e: unknown) => {
          if (!canPick) return
          row.togglePicked(
            ((e as MouseEvent).target as HTMLInputElement)?.checked
          )
        }
      },
    }
  },
}

const mutateRowIsPicked = <TData extends RowData>(
  pickedRowIds: Record<string, boolean>,
  id: string,
  value: boolean,
  table: Table<TData>
) => {
  const row = table.getRow(id)

  // const isGrouped = row.getIsGrouped()

  // if ( // TODO: enforce grouping row selection rules
  //   !isGrouped ||
  //   (isGrouped && table.options.enableGroupingRowPicking)
  // ) {
  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(pickedRowIds).forEach(key => delete pickedRowIds[key])
    }
    if (row.getCanPick()) {
      pickedRowIds[id] = true
    }
  } else {
    delete pickedRowIds[id]
  }
  // }

  if (row.subRows?.length && row.getCanPickSubRows()) {
    row.subRows.forEach(row =>
      mutateRowIsPicked(pickedRowIds, row.id, value, table)
    )
  }
}

export function pickRowsFn<TData extends RowData>(
  table: Table<TData>,
  rowModel: RowModel<TData>
): RowModel<TData> {
  const rowPicking = table.getState().rowPicking

  const newPickedFlatRows: Row<TData>[] = []
  const newPickedRowsById: Record<string, Row<TData>> = {}

  // Filters top level and nested rows
  const recurseRows = (rows: Row<TData>[], depth = 0): Row<TData>[] => {
    return rows
      .map(row => {
        const isPicked = isRowPicked(row, rowPicking)

        if (isPicked) {
          newPickedFlatRows.push(row)
          newPickedRowsById[row.id] = row
        }

        if (row.subRows?.length) {
          row = {
            ...row,
            subRows: recurseRows(row.subRows, depth + 1),
          }
        }

        if (isPicked) {
          return row
        }
      })
      .filter(Boolean) as Row<TData>[]
  }

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newPickedFlatRows,
    rowsById: newPickedRowsById,
  }
}

export function isRowPicked<TData extends RowData>(
  row: Row<TData>,
  selection: Record<string, boolean>
): boolean {
  return selection[row.id] ?? false
}

export function isSubRowPicked<TData extends RowData>(
  row: Row<TData>,
  selection: Record<string, boolean>,
  table: Table<TData>
): boolean | 'some' | 'all' {
  if (row.subRows && row.subRows.length) {
    let allChildrenPicked = true
    let somePicked = false

    row.subRows.forEach(subRow => {
      // Bail out early if we know both of these
      if (somePicked && !allChildrenPicked) {
        return
      }

      if (isRowPicked(subRow, selection)) {
        somePicked = true
      } else {
        allChildrenPicked = false
      }
    })

    return allChildrenPicked ? 'all' : somePicked ? 'some' : false
  }

  return false
}
