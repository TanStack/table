import { TableFeature } from '../core/table'
import {
  OnChangeFn,
  TableGenerics,
  Table,
  Row,
  RowModel,
  Updater,
  RowData,
} from '../types'
import { makeStateUpdater, memo } from '../utils'

export type RowSelectionState = Record<string, boolean>

export type RowSelectionTableState = {
  rowSelection: RowSelectionState
}

export type RowSelectionOptions<TData extends RowData> = {
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean)
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  // enableGroupingRowSelection?:
  //   | boolean
  //   | ((
  //       row: Row<TData>
  //     ) => boolean)
  // isAdditiveSelectEvent?: (e: unknown) => boolean
  // isInclusiveSelectEvent?: (e: unknown) => boolean
  // selectRowsFn?: (
  //   table: Table<TData>,
  //   rowModel: RowModel<TData>
  // ) => RowModel<TData>
}

export type RowSelectionRow = {
  getIsSelected: () => boolean
  getIsSomeSelected: () => boolean
  getIsAllSubRowsSelected: () => boolean
  getCanSelect: () => boolean
  getCanMultiSelect: () => boolean
  getCanSelectSubRows: () => boolean
  toggleSelected: (value?: boolean) => void
  getToggleSelectedHandler: () => (event: unknown) => void
}

export type RowSelectionInstance<TData extends RowData> = {
  getToggleAllRowsSelectedHandler: () => (event: unknown) => void
  getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  resetRowSelection: (defaultState?: boolean) => void
  getIsAllRowsSelected: () => boolean
  getIsAllPageRowsSelected: () => boolean
  getIsSomeRowsSelected: () => boolean
  getIsSomePageRowsSelected: () => boolean
  toggleAllRowsSelected: (value?: boolean) => void
  toggleAllPageRowsSelected: (value?: boolean) => void
  getPreSelectedRowModel: () => RowModel<TData>
  getSelectedRowModel: () => RowModel<TData>
  getFilteredSelectedRowModel: () => RowModel<TData>
  getGroupedSelectedRowModel: () => RowModel<TData>
}

//

export const RowSelection: TableFeature = {
  getInitialState: (state): RowSelectionTableState => {
    return {
      rowSelection: {},
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): RowSelectionOptions<TData> => {
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

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): RowSelectionInstance<TData> => {
    return {
      setRowSelection: updater => table.options.onRowSelectionChange?.(updater),
      resetRowSelection: defaultState =>
        table.setRowSelection(
          defaultState ? {} : table.initialState.rowSelection ?? {}
        ),
      toggleAllRowsSelected: value => {
        table.setRowSelection(old => {
          value =
            typeof value !== 'undefined' ? value : !table.getIsAllRowsSelected()

          const rowSelection = { ...old }

          const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows

          // We don't use `mutateRowIsSelected` here for performance reasons.
          // All of the rows are flat already, so it wouldn't be worth it
          if (value) {
            preGroupedFlatRows.forEach(row => {
              rowSelection[row.id] = true
            })
          } else {
            preGroupedFlatRows.forEach(row => {
              delete rowSelection[row.id]
            })
          }

          return rowSelection
        })
      },
      toggleAllPageRowsSelected: value =>
        table.setRowSelection(old => {
          const resolvedValue =
            typeof value !== 'undefined'
              ? value
              : !table.getIsAllPageRowsSelected()

          const rowSelection: RowSelectionState = { ...old }

          table.getRowModel().rows.forEach(row => {
            mutateRowIsSelected(rowSelection, row.id, resolvedValue, table)
          })

          return rowSelection
        }),

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
      getPreSelectedRowModel: () => table.getCoreRowModel(),
      getSelectedRowModel: memo(
        () => [table.getState().rowSelection, table.getCoreRowModel()],
        (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return selectRowsFn(table, rowModel)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getSelectedRowModel',
          debug: () => table.options.debugAll ?? table.options.debugTable,
        }
      ),

      getFilteredSelectedRowModel: memo(
        () => [table.getState().rowSelection, table.getFilteredRowModel()],
        (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return selectRowsFn(table, rowModel)
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getFilteredSelectedRowModel',
          debug: () => table.options.debugAll ?? table.options.debugTable,
        }
      ),

      getGroupedSelectedRowModel: memo(
        () => [table.getState().rowSelection, table.getSortedRowModel()],
        (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return selectRowsFn(table, rowModel)
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getGroupedSelectedRowModel',
          debug: () => table.options.debugAll ?? table.options.debugTable,
        }
      ),

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

      getIsAllRowsSelected: () => {
        const preFilteredFlatRows = table.getPreFilteredRowModel().flatRows
        const { rowSelection } = table.getState()

        let isAllRowsSelected = Boolean(
          preFilteredFlatRows.length && Object.keys(rowSelection).length
        )

        if (isAllRowsSelected) {
          if (preFilteredFlatRows.some(row => !rowSelection[row.id])) {
            isAllRowsSelected = false
          }
        }

        return isAllRowsSelected
      },

      getIsAllPageRowsSelected: () => {
        const paginationFlatRows = table.getPaginationRowModel().flatRows
        const { rowSelection } = table.getState()

        let isAllPageRowsSelected = !!paginationFlatRows.length

        if (
          isAllPageRowsSelected &&
          paginationFlatRows.some(row => !rowSelection[row.id])
        ) {
          isAllPageRowsSelected = false
        }

        return isAllPageRowsSelected
      },

      getIsSomeRowsSelected: () => {
        return (
          !table.getIsAllRowsSelected() &&
          !!Object.keys(table.getState().rowSelection ?? {}).length
        )
      },

      getIsSomePageRowsSelected: () => {
        const paginationFlatRows = table.getPaginationRowModel().flatRows
        return table.getIsAllPageRowsSelected()
          ? false
          : paginationFlatRows.some(
              d => d.getIsSelected() || d.getIsSomeSelected()
            )
      },

      getToggleAllRowsSelectedHandler: () => {
        return (e: unknown) => {
          table.toggleAllRowsSelected(
            ((e as MouseEvent).target as HTMLInputElement).checked
          )
        }
      },

      getToggleAllPageRowsSelectedHandler: () => {
        return (e: unknown) => {
          table.toggleAllPageRowsSelected(
            ((e as MouseEvent).target as HTMLInputElement).checked
          )
        }
      },
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): RowSelectionRow => {
    return {
      toggleSelected: value => {
        const isSelected = row.getIsSelected()

        table.setRowSelection(old => {
          value = typeof value !== 'undefined' ? value : !isSelected

          if (isSelected === value) {
            return old
          }

          const selectedRowIds = { ...old }

          mutateRowIsSelected(selectedRowIds, row.id, value, table)

          return selectedRowIds
        })
      },
      getIsSelected: () => {
        const { rowSelection } = table.getState()
        return isRowSelected(row, rowSelection)
      },

      getIsSomeSelected: () => {
        const { rowSelection } = table.getState()
        return isSubRowSelected(row, rowSelection, table) === 'some'
      },

      getIsAllSubRowsSelected: () => {
        const { rowSelection } = table.getState()
        return isSubRowSelected(row, rowSelection, table) === 'all'
      },

      getCanSelect: () => {
        if (typeof table.options.enableRowSelection === 'function') {
          return table.options.enableRowSelection(row)
        }

        return table.options.enableRowSelection ?? true
      },

      getCanSelectSubRows: () => {
        if (typeof table.options.enableSubRowSelection === 'function') {
          return table.options.enableSubRowSelection(row)
        }

        return table.options.enableSubRowSelection ?? true
      },

      getCanMultiSelect: () => {
        if (typeof table.options.enableMultiRowSelection === 'function') {
          return table.options.enableMultiRowSelection(row)
        }

        return table.options.enableMultiRowSelection ?? true
      },
      getToggleSelectedHandler: () => {
        const canSelect = row.getCanSelect()

        return (e: unknown) => {
          if (!canSelect) return
          row.toggleSelected(
            ((e as MouseEvent).target as HTMLInputElement)?.checked
          )
        }
      },
    }
  },
}

const mutateRowIsSelected = <TData extends RowData>(
  selectedRowIds: Record<string, boolean>,
  id: string,
  value: boolean,
  table: Table<TData>
) => {
  const row = table.getRow(id)

  const isGrouped = row.getIsGrouped()

  // if ( // TODO: enforce grouping row selection rules
  //   !isGrouped ||
  //   (isGrouped && table.options.enableGroupingRowSelection)
  // ) {
  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(selectedRowIds).forEach(key => delete selectedRowIds[key])
    }
    selectedRowIds[id] = true
  } else {
    delete selectedRowIds[id]
  }
  // }

  if (row.subRows?.length && row.getCanSelectSubRows()) {
    row.subRows.forEach(row =>
      mutateRowIsSelected(selectedRowIds, row.id, value, table)
    )
  }
}

export function selectRowsFn<TData extends RowData>(
  table: Table<TData>,
  rowModel: RowModel<TData>
): RowModel<TData> {
  const rowSelection = table.getState().rowSelection

  const newSelectedFlatRows: Row<TData>[] = []
  const newSelectedRowsById: Record<string, Row<TData>> = {}

  // Filters top level and nested rows
  const recurseRows = (rows: Row<TData>[], depth = 0): Row<TData>[] => {
    return rows
      .map(row => {
        const isSelected = isRowSelected(row, rowSelection)

        if (isSelected) {
          newSelectedFlatRows.push(row)
          newSelectedRowsById[row.id] = row
        }

        if (row.subRows?.length) {
          row = {
            ...row,
            subRows: recurseRows(row.subRows, depth + 1),
          }
        }

        if (isSelected) {
          return row
        }
      })
      .filter(Boolean) as Row<TData>[]
  }

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById,
  }
}

export function isRowSelected<TData extends RowData>(
  row: Row<TData>,
  selection: Record<string, boolean>
): boolean {
  return selection[row.id] ?? false
}

export function isSubRowSelected<TData extends RowData>(
  row: Row<TData>,
  selection: Record<string, boolean>,
  table: Table<TData>
): boolean | 'some' | 'all' {
  if (row.subRows && row.subRows.length) {
    let allChildrenSelected = true
    let someSelected = false

    row.subRows.forEach(subRow => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return
      }

      if (isRowSelected(subRow, selection)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    })

    return allChildrenSelected ? 'all' : someSelected ? 'some' : false
  }

  return false
}
