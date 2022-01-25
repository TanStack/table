import React, { MouseEvent, TouchEvent } from 'react'

import { useLazyMemo, useMountedLayoutEffect, makeStateUpdater } from '../utils'

import {
  withRowSelection as name,
  withColumnVisibility,
  withColumnFilters,
  withGlobalFilter,
  withGrouping,
  withSorting,
  withExpanding,
  withPagination,
} from '../Constants'
import {
  ReduceRow,
  Row,
  RowId,
  Column,
  TableState,
  MakeInstance,
  GetLeafColumns,
  GetDefaultOptions,
} from '../types'

const getDefaultOptions: GetDefaultOptions = options => {
  return {
    onRowSelectionChange: React.useCallback(
      makeStateUpdater('rowSelection'),
      []
    ),
    selectSubRows: true,
    selectGroupingRows: false,
    manualRowSelectedKey: 'isSelected',
    isAdditiveSelectEvent: (e: MouseEvent | TouchEvent) => !!e.metaKey,
    isInclusiveSelectEvent: (e: MouseEvent | TouchEvent) => !!e.shiftKey,
    ...options,
    initialState: {
      rowSelection: {},
      ...options.initialState,
    },
  }
}

const extendInstance: MakeInstance = instance => {
  const rowSelectionResetDeps = [instance.options.data]
  React.useMemo(() => {
    if (instance.options.autoResetRowSelection) {
      instance.state.rowSelection =
        instance.options.initialState?.rowSelection ?? {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, rowSelectionResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetRowSelection) {
      instance.resetRowSelection?.()
    }
  }, rowSelectionResetDeps)

  instance.setRowSelection = React.useCallback(
    updater => instance.options.onRowSelectionChange?.(updater, instance),
    [instance]
  )

  instance.resetRowSelection = React.useCallback(
    () =>
      instance.setRowSelection?.(
        instance.options.initialState?.rowSelection ?? {}
      ),
    [instance]
  )

  instance.toggleAllRowsSelected = React.useCallback(
    value =>
      instance.setRowSelection?.(old => {
        const {
          getIsAllRowsSelected,
          rowsById,
          nonGroupedRowsById = rowsById,
        } = instance

        value = typeof value !== 'undefined' ? value : !getIsAllRowsSelected?.()

        // Only remove/add the rows that are visible on the screen
        //  Leave all the other rows that are selected alone.
        const rowSelection = Object.assign({}, old)

        if (value) {
          Object.keys(nonGroupedRowsById).forEach(rowId => {
            rowSelection[rowId] = true
          })
        } else {
          Object.keys(nonGroupedRowsById).forEach(rowId => {
            delete rowSelection[rowId]
          })
        }

        return rowSelection
      }),
    [instance]
  )

  instance.toggleAllPageRowsSelected = React.useCallback(
    value =>
      instance.setRowSelection?.(old => {
        const {
          options: { selectSubRows },
          getIsAllPageRowsSelected,
          rowsById,
          getPageRows,
        } = instance

        const selectAll =
          typeof value !== 'undefined' ? value : !getIsAllPageRowsSelected?.()

        const rowSelection: TableState['rowSelection'] = { ...old }

        const handleRowById = (id: RowId) => {
          const row = rowsById[id]

          if (!row.getIsGrouped?.()) {
            if (selectAll) {
              rowSelection[id] = true
            } else {
              delete rowSelection[id]
            }
          }

          if (selectSubRows && row.subRows) {
            row.subRows.forEach(subRow => handleRowById(subRow.id))
          }
        }

        getPageRows?.().forEach(row => handleRowById(row.id))

        return rowSelection
      }),
    [instance]
  )

  instance.toggleRowSelected = React.useCallback(
    (id, value) =>
      instance.setRowSelection?.(old => {
        const {
          rowsById,
          options: { selectSubRows, selectGroupingRows },
        } = instance

        // Join the ids of deep rows
        // to make a key, then manage all of the keys
        // in a flat object
        const row = rowsById[id]
        const isSelected = row.getIsSelected?.()
        value = typeof value !== 'undefined' ? value : !isSelected

        if (isSelected === value) {
          return old
        }

        const selectedRowIds = { ...old }

        selectRowById(selectedRowIds, id, value, {
          rowsById,
          selectGroupingRows: selectGroupingRows!,
          selectSubRows: selectSubRows!,
        })

        return selectedRowIds
      }),
    [instance]
  )

  instance.addRowSelectionRange = React.useCallback(
    rowId => {
      const {
        rows,
        rowsById,
        options: { selectGroupingRows, selectSubRows },
      } = instance

      const findSelectedRow = (rows: Row[]) => {
        let found
        rows.find(d => {
          if (d.getIsSelected?.()) {
            found = d
            return true
          }
          const subFound = findSelectedRow(d.subRows || [])
          if (subFound) {
            found = subFound
            return true
          }
          return false
        })
        return found
      }

      const firstRow = findSelectedRow(rows) || rows[0]
      const lastRow = rowsById[rowId]

      let include = false
      const selectedRowIds = {}

      const addRow = (row: Row) => {
        selectRowById(selectedRowIds, row.id, true, {
          rowsById,
          selectGroupingRows: selectGroupingRows!,
          selectSubRows: selectSubRows!,
        })
      }

      instance.rows.forEach(row => {
        const isFirstRow = row.id === firstRow.id
        const isLastRow = row.id === lastRow.id

        if (isFirstRow || isLastRow) {
          if (!include) {
            include = true
          } else if (include) {
            addRow(row)
            include = false
          }
        }

        if (include) {
          addRow(row)
        }
      })

      instance.setRowSelection?.(selectedRowIds)
    },
    [instance]
  )

  instance.getSelectedFlatRows = React.useCallback(() => {
    return instance.flatRows.filter(
      row => !row.getIsGrouped?.() && row.getIsSelected?.()
    )
  }, [instance])

  instance.getIsAllRowsSelected = useLazyMemo(() => {
    let isAllRowsSelected = Boolean(
      Object.keys(instance.nonGroupedRowsById).length &&
        Object.keys(instance.state.rowSelection ?? {}).length
    )

    if (isAllRowsSelected) {
      if (
        Object.keys(instance.nonGroupedRowsById).some(
          id => !instance.state.rowSelection?.[id]
        )
      ) {
        isAllRowsSelected = false
      }
    }

    return isAllRowsSelected
  }, [instance.nonGroupedRowsById, instance.state.rowSelection])

  const pageRows = instance.getPageRows?.()

  instance.getIsAllPageRowsSelected = useLazyMemo(() => {
    let isAllPageRowsSelected = instance.getIsAllPageRowsSelected?.() ?? false

    if (!isAllPageRowsSelected) {
      if (pageRows?.length && pageRows.some(row => !row.getIsSelected?.())) {
        isAllPageRowsSelected = false
      }
    }

    return isAllPageRowsSelected
  }, [instance, instance.state.rowSelection])

  instance.getIsSomeRowsSelected = useLazyMemo(() => {
    return (
      !instance.getIsAllRowsSelected?.() &&
      Object.keys(instance.state.rowSelection ?? {}).length
    )
  }, [instance.nonGroupedRowsById, instance.state.rowSelection])

  instance.getIsSomePageRowsSelected = useLazyMemo(() => {
    return instance.getIsAllPageRowsSelected?.()
      ? false
      : pageRows?.length
      ? pageRows.reduce(
          (count, row) => count + (row.getIsSelected?.() ?? 0 ? 1 : 0),
          0
        )
      : false
  }, [pageRows, instance.state.rowSelection])

  instance.getToggleAllRowsSelectedProps = props => {
    const isSomeRowsSelected = instance.getIsSomeRowsSelected?.()
    const isAllRowsSelected = instance.getIsAllRowsSelected?.()

    return {
      onChange: (e: MouseEvent | TouchEvent) => {
        instance.toggleAllRowsSelected?.((e.target as HTMLInputElement).checked)
      },
      checked: isAllRowsSelected,
      title: 'Toggle All Rows Selected',
      indeterminate: isSomeRowsSelected,
      ...props,
    }
  }

  instance.getToggleAllPageRowsSelectedProps = props => {
    const isSomePageRowsSelected = instance.getIsSomePageRowsSelected?.()
    const isAllPageRowsSelected = instance.getIsAllPageRowsSelected?.()

    return {
      onChange: (e: MouseEvent | TouchEvent) => {
        instance.toggleAllPageRowsSelected?.(
          (e.target as HTMLInputElement).checked
        )
      },
      checked: isAllPageRowsSelected,
      title: 'Toggle All Current Page Rows Selected',
      indeterminate: isSomePageRowsSelected,
      ...props,
    }
  }

  return instance
}

const getLeafColumns: GetLeafColumns = orderedColumns => {
  return React.useMemo(() => {
    return [
      orderedColumns.find(d => d.isRowSelectionColumn),
      ...orderedColumns.filter(d => d && !d.isRowSelectionColumn),
    ].filter(Boolean) as Column[]
  }, [orderedColumns])
}

const reduceRow: ReduceRow = (row, { instance }) => {
  row.getIsSelected = () =>
    instance.options.selectSubRows
      ? getRowIsSelected(
          row,
          instance.state.rowSelection ?? {},
          instance.options?.manualRowSelectedKey
        )
      : !!instance.state.rowSelection?.[row.id]

  row.getIsSomeSelected = () => row.getIsSelected?.() === null

  row.toggleSelected = value => instance.toggleRowSelected?.(row.id, value)

  row.getToggleRowSelectedProps = ({ forInput = false, ...props } = {}) => {
    const checked = row.getIsSelected?.()

    return {
      onChange: (e: Event) =>
        row.toggleSelected?.((e.target as HTMLInputElement).checked),
      checked,
      title: 'Toggle Row Selected',
      indeterminate: row.getIsSomeSelected?.(),
      ...props,
      onClick: forInput
        ? (e: Event) => e.stopPropagation()
        : (e: Event) => {
            if (instance.options.isAdditiveSelectEvent?.(e)) {
              row.toggleSelected?.()
            } else if (instance.options.isInclusiveSelectEvent?.(e)) {
              instance.addRowSelectionRange?.(row.id)
            } else {
              instance.setRowSelection?.({})
              row.toggleSelected?.()
            }

            if (props.onClick) props.onClick(e)
          },
    }
  }

  return row
}

const selectRowById = (
  selectedRowIds: Record<RowId, boolean>,
  id: RowId,
  value: boolean,
  {
    rowsById,
    selectGroupingRows,
    selectSubRows,
  }: {
    rowsById: Record<RowId, Row>
    selectGroupingRows: boolean
    selectSubRows: boolean
  }
) => {
  const row = rowsById[id]

  if (!row.getIsGrouped?.() || (row.getIsGrouped?.() && selectGroupingRows)) {
    if (value) {
      selectedRowIds[id] = true
    } else {
      delete selectedRowIds[id]
    }
  }

  if (selectSubRows && row.subRows) {
    row.subRows.forEach(row =>
      selectRowById(selectedRowIds, row.id, value, {
        rowsById,
        selectGroupingRows,
        selectSubRows,
      })
    )
  }
}

export function getRowIsSelected(
  row: Row,
  selection: Record<RowId, boolean>,
  manualRowSelectedKey?: string
) {
  if (
    selection[row.id] ||
    (manualRowSelectedKey && row.original[manualRowSelectedKey])
  ) {
    return true
  }

  if (row.subRows && row.subRows.length) {
    let allChildrenSelected = true
    let someSelected = false

    row.subRows.forEach((subRow: Row) => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return
      }

      if (getRowIsSelected(subRow, selection, manualRowSelectedKey)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    })
    return allChildrenSelected ? true : someSelected ? 'some' : false
  }

  return false
}

export const withRowSelection = {
  name,
  after: [
    withColumnVisibility,
    withColumnFilters,
    withGlobalFilter,
    withGrouping,
    withSorting,
    withExpanding,
    withPagination,
  ],
  plugs: {
    getDefaultOptions,
    extendInstance,
    getLeafColumns,
    reduceRow,
  },
}
