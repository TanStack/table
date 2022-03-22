import React, { MouseEvent, TouchEvent } from 'react'
import {
  Getter,
  OnChangeFn,
  PropGetterValue,
  ReactTable,
  Row,
  RowModel,
  Updater,
} from '../types'
import { functionalUpdate, makeStateUpdater, memo, propGetter } from '../utils'

export type RowSelectionState = Record<string, boolean>

export type RowSelectionTableState = {
  rowSelection: RowSelectionState
}

export type RowSelectionOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  autoResetRowSelection?: boolean
  enableRowSelection?:
    | boolean
    | ((
        row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
      ) => boolean)
  enableMultiRowSelection?:
    | boolean
    | ((
        row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
      ) => boolean)
  enableSubRowSelection?:
    | boolean
    | ((
        row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
      ) => boolean)
  // enableGroupingRowSelection?:
  //   | boolean
  //   | ((
  //       row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  //     ) => boolean)
  // isAdditiveSelectEvent?: (e: MouseEvent | TouchEvent) => boolean
  // isInclusiveSelectEvent?: (e: MouseEvent | TouchEvent) => boolean
  // selectRowsFn?: (
  //   instance: ReactTable<
  //     TData,
  //     TValue,
  //     TFilterFns,
  //     TSortingFns,
  //     TAggregationFns
  //   >,
  //   rowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  // ) => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
}

type ToggleRowSelectedProps = {
  onChange?: (e: MouseEvent | TouchEvent) => void
  checked?: boolean
  title?: string
  indeterminate?: boolean
}

export type RowSelectionRow = {
  getIsSelected: () => boolean
  getIsSomeSelected: () => boolean
  getCanSelect: () => boolean
  getCanMultiSelect: () => boolean
  toggleSelected: (value?: boolean) => void
  getToggleSelectedProps: <TGetter extends Getter<ToggleRowSelectedProps>>(
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleRowSelectedProps, TGetter>
}

export type RowSelectionInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  _notifyRowSelectionReset: () => void
  getToggleRowSelectedProps: <TGetter extends Getter<ToggleRowSelectedProps>>(
    rowId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleRowSelectedProps, TGetter>
  getToggleAllRowsSelectedProps: <
    TGetter extends Getter<ToggleRowSelectedProps>
  >(
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleRowSelectedProps, TGetter>
  getToggleAllPageRowsSelectedProps: <
    TGetter extends Getter<ToggleRowSelectedProps>
  >(
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleRowSelectedProps, TGetter>
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  resetRowSelection: () => void
  toggleRowSelected: (rowId: string, value?: boolean) => void
  getRowCanSelect: (rowId: string) => boolean
  getRowCanSelectSubRows: (rowId: string) => boolean
  getRowCanMultiSelect: (rowId: string) => boolean
  // getGroupingRowCanSelect: (rowId: string) => boolean
  getRowIsSelected: (rowId: string) => boolean
  getRowIsSomeSelected: (rowId: string) => boolean
  getIsAllRowsSelected: () => boolean
  getIsAllPageRowsSelected: () => boolean
  getIsSomeRowsSelected: () => boolean
  getIsSomePageRowsSelected: () => boolean
  toggleAllRowsSelected: (value: boolean) => void
  toggleAllPageRowsSelected: (value: boolean) => void
  getSelectedRowModel: () => RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
  getSelectedRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getSelectedFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getSelectedRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
  getFilteredSelectedRowModel: () => RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
  getFilteredSelectedRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getFilteredSelectedFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getFilteredSelectedRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
  getGroupedSelectedRowModel: () => RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
  getGroupedSelectedRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getGroupedSelectedFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getGroupedSelectedRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
}

//

export function getInitialState(): RowSelectionTableState {
  return {
    rowSelection: {},
  }
}

export function getDefaultOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): RowSelectionOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> {
  return {
    onRowSelectionChange: makeStateUpdater('rowSelection', instance),
    autoResetRowSelection: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSubRowSelection: true,
    // enableGroupingRowSelection: false,
    // isAdditiveSelectEvent: (e: MouseEvent | TouchEvent) => !!e.metaKey,
    // isInclusiveSelectEvent: (e: MouseEvent | TouchEvent) => !!e.shiftKey,
  }
}

export function getInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): RowSelectionInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> {
  let registered = false

  // const pageRows = instance.getPageRows()

  return {
    _notifyRowSelectionReset: () => {
      if (!registered) {
        registered = true
        return
      }

      if (instance.options.autoResetAll === false) {
        return
      }

      if (
        instance.options.autoResetAll === true ||
        instance.options.autoResetRowSelection
      ) {
        instance.resetRowSelection()
      }
    },
    setRowSelection: updater =>
      instance.options.onRowSelectionChange?.(
        updater,
        functionalUpdate(updater, instance.getState().rowSelection)
      ),
    resetRowSelection: () =>
      instance.setRowSelection(getInitialState().rowSelection ?? {}),
    toggleAllRowsSelected: value => {
      instance.setRowSelection(old => {
        value =
          typeof value !== 'undefined'
            ? value
            : !instance.getIsAllRowsSelected()

        // Only remove/add the rows that are visible on the screen
        //  Leave all the other rows that are selected alone.
        const rowSelection = Object.assign({}, old)

        const preGroupedFlatRows = instance.getPreGroupedFlatRows()

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

        instance.getRows().forEach(row => {
          mutateRowIsSelected(rowSelection, row.id, value, instance)
        })

        return rowSelection
      }),
    toggleRowSelected: (rowId, value) => {
      const row = instance.getRow(rowId)
      const isSelected = row.getIsSelected()

      instance.setRowSelection(old => {
        value = typeof value !== 'undefined' ? value : !isSelected

        if (isSelected === value) {
          return old
        }

        const selectedRowIds = { ...old }

        mutateRowIsSelected(selectedRowIds, rowId, value, instance)

        return selectedRowIds
      })
    },
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

        if (process.env.NODE_ENV !== 'production' && instance.options.debug)
          console.info('Selecting...')

        return selectRowsFn(instance, rowModel)
      },
      {
        key: 'getSelectedRowModel',
        debug: instance.options.debug,
        onChange: () => instance._notifyExpandedReset(),
      }
    ),
    getSelectedRows: () => instance.getSelectedRowModel().rows,
    getSelectedFlatRows: () => instance.getSelectedRowModel().flatRows,
    getSelectedRowsById: () => instance.getSelectedRowModel().rowsById,

    getFilteredSelectedRowModel: memo(
      () => [
        instance.getState().rowSelection,
        instance.getGlobalFilteredRowModel(),
      ],
      (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {},
          }
        }

        if (process.env.NODE_ENV !== 'production' && instance.options.debug)
          console.info('Selecting...')

        return selectRowsFn(instance, rowModel)
      },
      {
        key: 'getFilteredSelectedRowModel',
        debug: instance.options.debug,
        onChange: () => instance._notifyExpandedReset(),
      }
    ),
    getFilteredSelectedRows: () => instance.getFilteredSelectedRowModel().rows,
    getFilteredSelectedFlatRows: () =>
      instance.getFilteredSelectedRowModel().flatRows,
    getFilteredSelectedRowsById: () =>
      instance.getFilteredSelectedRowModel().rowsById,

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

        if (process.env.NODE_ENV !== 'production' && instance.options.debug)
          console.info('Selecting...')

        return selectRowsFn(instance, rowModel)
      },
      {
        key: 'getGroupedSelectedRowModel',
        debug: instance.options.debug,
        onChange: () => instance._notifyExpandedReset(),
      }
    ),
    getGroupedSelectedRows: () => instance.getGroupedSelectedRowModel().rows,
    getGroupedSelectedFlatRows: () =>
      instance.getGroupedSelectedRowModel().flatRows,
    getGroupedSelectedRowsById: () =>
      instance.getGroupedSelectedRowModel().rowsById,

    ///

    getRowIsSelected: rowId => {
      const { rowSelection } = instance.getState()
      const row = instance.getRow(rowId)

      if (!row) {
        throw new Error()
      }

      return isRowSelected(row, rowSelection, instance) === true
    },

    getRowIsSomeSelected: rowId => {
      const { rowSelection } = instance.getState()
      const row = instance.getRow(rowId)

      if (!row) {
        throw new Error()
      }

      return isRowSelected(row, rowSelection, instance) === 'some'
    },

    getRowCanSelect: rowId => {
      const row = instance.getRow(rowId)

      if (!row) {
        throw new Error()
      }

      if (typeof instance.options.enableRowSelection === 'function') {
        return instance.options.enableRowSelection(row)
      }

      return instance.options.enableRowSelection ?? true
    },

    getRowCanSelectSubRows: rowId => {
      const row = instance.getRow(rowId)

      if (!row) {
        throw new Error()
      }

      if (typeof instance.options.enableSubRowSelection === 'function') {
        return instance.options.enableSubRowSelection(row)
      }

      return instance.options.enableSubRowSelection ?? true
    },

    getRowCanMultiSelect: rowId => {
      const row = instance.getRow(rowId)

      if (!row) {
        throw new Error()
      }

      if (typeof instance.options.enableMultiRowSelection === 'function') {
        return instance.options.enableMultiRowSelection(row)
      }

      return instance.options.enableMultiRowSelection ?? true
    },

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
      const preFilteredFlatRows = instance.getPreGlobalFilteredFlatRows()
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
      const paginationFlatRows = instance.getPaginationFlatRows()
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
      const paginationFlatRows = instance.getPaginationFlatRows()
      return instance.getIsAllPageRowsSelected()
        ? false
        : !!paginationFlatRows?.length
    },

    getToggleRowSelectedProps: (rowId, userProps) => {
      const row = instance.getRow(rowId)

      const isSelected = row.getIsSelected()
      const isSomeSelected = row.getIsSomeSelected()
      const canSelect = row.getCanSelect()

      const initialProps: ToggleRowSelectedProps = {
        onChange: canSelect
          ? (e: MouseEvent | TouchEvent) => {
              row.toggleSelected((e.target as HTMLInputElement).checked)
            }
          : undefined,
        checked: isSelected,
        title: 'Toggle Row Selected',
        indeterminate: isSomeSelected,
        // onChange: forInput
        //   ? (e: Event) => e.stopPropagation()
        //   : (e: Event) => {
        //       if (instance.options.isAdditiveSelectEvent(e)) {
        //         row.toggleSelected()
        //       } else if (instance.options.isInclusiveSelectEvent(e)) {
        //         instance.addRowSelectionRange(row.id)
        //       } else {
        //         instance.setRowSelection({})
        //         row.toggleSelected()
        //       }

        //       if (props.onClick) props.onClick(e)
        //     },
      }

      return propGetter(initialProps, userProps)
    },

    getToggleAllRowsSelectedProps: userProps => {
      const isSomeRowsSelected = instance.getIsSomeRowsSelected()
      const isAllRowsSelected = instance.getIsAllRowsSelected()

      const initialProps: ToggleRowSelectedProps = {
        onChange: (e: MouseEvent | TouchEvent) => {
          instance.toggleAllRowsSelected((e.target as HTMLInputElement).checked)
        },
        checked: isAllRowsSelected,
        title: 'Toggle All Rows Selected',
        indeterminate: isSomeRowsSelected,
      }

      return propGetter(initialProps, userProps)
    },

    getToggleAllPageRowsSelectedProps: userProps => {
      const isSomePageRowsSelected = instance.getIsSomePageRowsSelected()
      const isAllPageRowsSelected = instance.getIsAllPageRowsSelected()

      const initialProps: ToggleRowSelectedProps = {
        onChange: (e: MouseEvent | TouchEvent) => {
          instance.toggleAllPageRowsSelected(
            (e.target as HTMLInputElement).checked
          )
        },
        checked: isAllPageRowsSelected,
        title: 'Toggle All Current Page Rows Selected',
        indeterminate: isSomePageRowsSelected,
      }

      return propGetter(initialProps, userProps)
    },
  }
}

export function createRow<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): RowSelectionRow {
  return {
    getIsSelected: () => instance.getRowIsSelected(row.id),
    getIsSomeSelected: () => instance.getRowIsSomeSelected(row.id),
    toggleSelected: value => instance.toggleRowSelected(row.id, value),
    getToggleSelectedProps: userProps =>
      instance.getToggleRowSelectedProps(row.id, userProps),
    getCanMultiSelect: () => instance.getRowCanMultiSelect(row.id),
    getCanSelect: () => instance.getRowCanSelect(row.id),
  }
}

const mutateRowIsSelected = <
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  selectedRowIds: Record<string, boolean>,
  id: string,
  value: boolean,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
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

  if (row.subRows?.length && instance.getRowCanSelectSubRows(row.id)) {
    row.subRows.forEach(row =>
      mutateRowIsSelected(selectedRowIds, row.id, value, instance)
    )
  }
}

export function selectRowsFn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  const rowSelection = instance.getState().rowSelection

  const newSelectedFlatRows: Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[] = []
  const newSelectedRowsById: Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  > = {}

  // Filters top level and nested rows
  const recurseRows = (
    rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
    depth = 0
  ) => {
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
      .filter(Boolean) as Row<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
  }

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById,
  }
}

export function isRowSelected<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  selection: Record<string, boolean>,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
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
