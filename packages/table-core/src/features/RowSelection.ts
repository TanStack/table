import {
  OnChangeFn,
  TableGenerics,
  TableInstance,
  Row,
  RowModel,
  Updater,
  TableFeature,
} from '../types'
import { makeStateUpdater, memo } from '../utils'

export type RowSelectionState = Record<string, boolean>

export type RowSelectionTableState = {
  rowSelection: RowSelectionState
}

export type RowSelectionOptions<TGenerics extends TableGenerics> = {
  enableRowSelection?: boolean | ((row: Row<TGenerics>) => boolean)
  enableMultiRowSelection?: boolean | ((row: Row<TGenerics>) => boolean)
  enableSubRowSelection?: boolean | ((row: Row<TGenerics>) => boolean)
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  // enableGroupingRowSelection?:
  //   | boolean
  //   | ((
  //       row: Row<TGenerics>
  //     ) => boolean)
  // isAdditiveSelectEvent?: (e: unknown) => boolean
  // isInclusiveSelectEvent?: (e: unknown) => boolean
  // selectRowsFn?: (
  //   instance: TableInstance<
  //     TData,
  //     TValue,
  //     TFilterFns,
  //     TSortingFns,
  //     TAggregationFns
  //   >,
  //   rowModel: RowModel<TGenerics>
  // ) => RowModel<TGenerics>
}

export type RowSelectionRow = {
  getIsSelected: () => boolean
  getIsSomeSelected: () => boolean
  getCanSelect: () => boolean
  getCanMultiSelect: () => boolean
  getCanSelectSubRows: () => boolean
  toggleSelected: (value?: boolean) => void
  getToggleSelectedHandler: () => (event: unknown) => void
}

export type RowSelectionInstance<TGenerics extends TableGenerics> = {
  getToggleAllRowsSelectedHandler: () => (event: unknown) => void
  getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  resetRowSelection: (defaultState?: boolean) => void
  getIsAllRowsSelected: () => boolean
  getIsAllPageRowsSelected: () => boolean
  getIsSomeRowsSelected: () => boolean
  getIsSomePageRowsSelected: () => boolean
  toggleAllRowsSelected: (value: boolean) => void
  toggleAllPageRowsSelected: (value: boolean) => void
  getPreSelectedRowModel: () => RowModel<TGenerics>
  getSelectedRowModel: () => RowModel<TGenerics>
  getFilteredSelectedRowModel: () => RowModel<TGenerics>
  getGroupedSelectedRowModel: () => RowModel<TGenerics>
}

//

export const RowSelection: TableFeature = {
  getInitialState: (state): RowSelectionTableState => {
    return {
      rowSelection: {},
      ...state,
    }
  },

  getDefaultOptions: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): RowSelectionOptions<TGenerics> => {
    return {
      onRowSelectionChange: makeStateUpdater('rowSelection', instance),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true,
      // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
    }
  },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): RowSelectionInstance<TGenerics> => {
    return {
      setRowSelection: updater =>
        instance.options.onRowSelectionChange?.(updater),
      resetRowSelection: defaultState =>
        instance.setRowSelection(
          defaultState ? {} : instance.initialState.rowSelection ?? {}
        ),
      toggleAllRowsSelected: value => {
        instance.setRowSelection(old => {
          value =
            typeof value !== 'undefined'
              ? value
              : !instance.getIsAllRowsSelected()

          const rowSelection = { ...old }

          const preGroupedFlatRows = instance.getPreGroupedRowModel().flatRows

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
        instance.setRowSelection(old => {
          const selectAll =
            typeof value !== 'undefined'
              ? value
              : !instance.getIsAllPageRowsSelected()

          const rowSelection: RowSelectionState = { ...old }

          instance.getRowModel().rows.forEach(row => {
            mutateRowIsSelected(rowSelection, row.id, value, instance)
          })

          return rowSelection
        }),

      // addRowSelectionRange: rowId => {
      //   const {
      //     rows,
      //     rowsById,
      //     options: { selectGroupingRows, selectSubRows },
      //   } = instance

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

      //   instance.rows.forEach(row => {
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

      //   instance.setRowSelection(selectedRowIds)
      // },
      getPreSelectedRowModel: () => instance.getCoreRowModel(),
      getSelectedRowModel: memo(
        () => [instance.getState().rowSelection, instance.getCoreRowModel()],
        (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return selectRowsFn(instance, rowModel)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getSelectedRowModel',
          debug: () => instance.options.debugAll ?? instance.options.debugTable,
        }
      ),

      getFilteredSelectedRowModel: memo(
        () => [
          instance.getState().rowSelection,
          instance.getFilteredRowModel(),
        ],
        (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return selectRowsFn(instance, rowModel)
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getFilteredSelectedRowModel',
          debug: () => instance.options.debugAll ?? instance.options.debugTable,
        }
      ),

      getGroupedSelectedRowModel: memo(
        () => [instance.getState().rowSelection, instance.getGroupedRowModel()],
        (rowSelection, rowModel) => {
          if (!Object.keys(rowSelection).length) {
            return {
              rows: [],
              flatRows: [],
              rowsById: {},
            }
          }

          return selectRowsFn(instance, rowModel)
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getGroupedSelectedRowModel',
          debug: () => instance.options.debugAll ?? instance.options.debugTable,
        }
      ),

      ///

      // getGroupingRowCanSelect: rowId => {
      //   const row = instance.getRow(rowId)

      //   if (!row) {
      //     throw new Error()
      //   }

      //   if (typeof instance.options.enableGroupingRowSelection === 'function') {
      //     return instance.options.enableGroupingRowSelection(row)
      //   }

      //   return instance.options.enableGroupingRowSelection ?? false
      // },

      getIsAllRowsSelected: () => {
        const preFilteredFlatRows = instance.getPreFilteredRowModel().flatRows
        const { rowSelection } = instance.getState()

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
        const paginationFlatRows = instance.getPaginationRowModel().flatRows
        const { rowSelection } = instance.getState()

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
          !instance.getIsAllRowsSelected() &&
          !!Object.keys(instance.getState().rowSelection ?? {}).length
        )
      },

      getIsSomePageRowsSelected: () => {
        const paginationFlatRows = instance.getPaginationRowModel().flatRows
        return instance.getIsAllPageRowsSelected()
          ? false
          : !!paginationFlatRows?.length
      },

      getToggleAllRowsSelectedHandler: () => {
        return (e: unknown) => {
          instance.toggleAllRowsSelected(
            ((e as MouseEvent).target as HTMLInputElement).checked
          )
        }
      },

      getToggleAllPageRowsSelectedHandler: () => {
        return (e: unknown) => {
          instance.toggleAllPageRowsSelected(
            ((e as MouseEvent).target as HTMLInputElement).checked
          )
        }
      },
    }
  },

  createRow: <TGenerics extends TableGenerics>(
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
  ): RowSelectionRow => {
    return {
      toggleSelected: value => {
        const isSelected = row.getIsSelected()

        instance.setRowSelection(old => {
          value = typeof value !== 'undefined' ? value : !isSelected

          if (isSelected === value) {
            return old
          }

          const selectedRowIds = { ...old }

          mutateRowIsSelected(selectedRowIds, row.id, value, instance)

          return selectedRowIds
        })
      },
      getIsSelected: () => {
        const { rowSelection } = instance.getState()
        return isRowSelected(row, rowSelection, instance) === true
      },

      getIsSomeSelected: () => {
        const { rowSelection } = instance.getState()
        return isRowSelected(row, rowSelection, instance) === 'some'
      },

      getCanSelect: () => {
        if (typeof instance.options.enableRowSelection === 'function') {
          return instance.options.enableRowSelection(row)
        }

        return instance.options.enableRowSelection ?? true
      },

      getCanSelectSubRows: () => {
        if (typeof instance.options.enableSubRowSelection === 'function') {
          return instance.options.enableSubRowSelection(row)
        }

        return instance.options.enableSubRowSelection ?? true
      },

      getCanMultiSelect: () => {
        if (typeof instance.options.enableMultiRowSelection === 'function') {
          return instance.options.enableMultiRowSelection(row)
        }

        return instance.options.enableMultiRowSelection ?? true
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

const mutateRowIsSelected = <TGenerics extends TableGenerics>(
  selectedRowIds: Record<string, boolean>,
  id: string,
  value: boolean,
  instance: TableInstance<TGenerics>
) => {
  const row = instance.getRow(id)

  const isGrouped = row.getIsGrouped()

  // if ( // TODO: enforce grouping row selection rules
  //   !isGrouped ||
  //   (isGrouped && instance.options.enableGroupingRowSelection)
  // ) {
  if (value) {
    selectedRowIds[id] = true
  } else {
    delete selectedRowIds[id]
  }
  // }

  if (row.subRows?.length && row.getCanSelectSubRows()) {
    row.subRows.forEach(row =>
      mutateRowIsSelected(selectedRowIds, row.id, value, instance)
    )
  }
}

export function selectRowsFn<TGenerics extends TableGenerics>(
  instance: TableInstance<TGenerics>,
  rowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  const rowSelection = instance.getState().rowSelection

  const newSelectedFlatRows: Row<TGenerics>[] = []
  const newSelectedRowsById: Record<string, Row<TGenerics>> = {}

  // Filters top level and nested rows
  const recurseRows = (rows: Row<TGenerics>[], depth = 0): Row<TGenerics>[] => {
    return rows
      .map(row => {
        const isSelected = isRowSelected(row, rowSelection, instance) === true

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
      .filter(Boolean) as Row<TGenerics>[]
  }

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById,
  }
}

export function isRowSelected<TGenerics extends TableGenerics>(
  row: Row<TGenerics>,
  selection: Record<string, boolean>,
  instance: TableInstance<TGenerics>
): boolean | 'some' {
  if (selection[row.id]) {
    return true
  }

  if (row.subRows && row.subRows.length) {
    let allChildrenSelected = true
    let someSelected = false

    row.subRows.forEach(subRow => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return
      }

      if (isRowSelected(subRow, selection, instance)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    })

    return allChildrenSelected ? true : someSelected ? 'some' : false
  }

  return false
}
