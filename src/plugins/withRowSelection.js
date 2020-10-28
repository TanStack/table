import React from 'react'

import {
  useLazyMemo,
  useMountedLayoutEffect,
  getRowIsSelected,
  composeReducer,
  makeStateUpdater,
} from '../utils'

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
    useReduceOptions,
    useInstanceAfterState,
    useReduceLeafColumns,
    decorateRow,
  },
}

function useReduceOptions(options) {
  return {
    onRowSelectionChange: React.useCallback(
      makeStateUpdater('rowSelection'),
      []
    ),
    selectSubRows: true,
    selectGroupingRows: false,
    manualRowSelectedKey: 'isSelected',
    isAdditiveSelectEvent: e => e.metaKey,
    isInclusiveSelectEvent: e => e.shiftKey,
    ...options,
    initialState: {
      rowSelection: {},
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const rowSelectionResetDeps = [instance.options.data]
  React.useMemo(() => {
    if (instance.options.autoResetRowSelection) {
      instance.state.rowSelection = instance.options.initialState.rowSelection
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, rowSelectionResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetRowSelection) {
      instance.resetRowSelection()
    }
  }, rowSelectionResetDeps)

  instance.setRowSelection = React.useCallback(
    updater => instance.options.onRowSelectionChange(updater),
    [instance.options]
  )

  instance.resetRowSelection = React.useCallback(
    () => instance.setRowSelection(instance.options.initialState.rowSelection),
    [instance]
  )

  instance.toggleAllRowsSelected = React.useCallback(
    value =>
      instance.setRowSelection(old => {
        const {
          getIsAllRowsSelected,
          rowsById,
          nonGroupedRowsById = rowsById,
        } = instance

        value = typeof value !== 'undefined' ? value : !getIsAllRowsSelected()

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
      instance.setRowSelection(old => {
        const {
          getIsAllPageRowsSelected,
          rowsById,
          getSubRows,
          page,
          selectSubRows = true,
        } = instance

        const selectAll =
          typeof value !== 'undefined' ? value : !getIsAllPageRowsSelected()

        const rowSelection = { ...old }

        const handleRowById = id => {
          const row = rowsById[id]

          if (!row.isGrouped) {
            if (selectAll) {
              rowSelection[id] = true
            } else {
              delete rowSelection[id]
            }
          }

          if (selectSubRows && getSubRows(row)) {
            return getSubRows(row).forEach(row => handleRowById(row.id))
          }
        }

        page.forEach(row => handleRowById(row.id))

        return rowSelection
      }),
    [instance]
  )

  instance.toggleRowSelected = React.useCallback(
    (id, value) =>
      instance.setRowSelection(
        old => {
          const {
            rowsById,
            options: { selectSubRows, selectGroupingRows },
          } = instance

          // Join the ids of deep rows
          // to make a key, then manage all of the keys
          // in a flat object
          const row = rowsById[id]
          const isSelected = row.getIsSelected()
          value = typeof value !== 'undefined' ? value : !isSelected

          if (isSelected === value) {
            return old
          }

          const selectedRowIds = { ...old }

          selectRowById(selectedRowIds, id, value, {
            rowsById,
            selectGroupingRows,
            selectSubRows,
          })

          return selectedRowIds
        },
        {
          type: 'toggleRowSelected',
        }
      ),
    [instance]
  )

  instance.addRowSelectionRange = React.useCallback(
    rowId => {
      const {
        rows,
        rowsById,
        options: { selectGroupingRows, selectSubRows },
      } = instance

      const findSelectedRow = rows => {
        let found
        rows.find(d => {
          if (d.getIsSelected()) {
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

      const addRow = row => {
        selectRowById(selectedRowIds, row.id, true, {
          rowsById,
          selectGroupingRows,
          selectSubRows,
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

      instance.setRowSelection(selectedRowIds)
    },
    [instance]
  )

  instance.getSelectedFlatRows = React.useCallback(() => {
    return instance.flatRows.filter(
      row => !row.getIsGrouped() && row.getIsSelected()
    )
  }, [instance])

  instance.getIsAllRowsSelected = useLazyMemo(() => {
    let isAllRowsSelected = Boolean(
      Object.keys(instance.nonGroupedRowsById).length &&
        Object.keys(instance.state.rowSelection).length
    )

    if (isAllRowsSelected) {
      if (
        Object.keys(instance.nonGroupedRowsById).some(
          id => !instance.state.rowSelection[id]
        )
      ) {
        isAllRowsSelected = false
      }
    }

    return isAllRowsSelected
  }, [instance.nonGroupedRowsById, instance.state.rowSelection])

  instance.getIsAllPageRowsSelected = useLazyMemo(() => {
    let isAllPageRowsSelected = instance.getIsAllPageRowsSelected()
    if (!isAllPageRowsSelected) {
      if (
        instance.page?.length &&
        instance.page.some(({ id }) => !instance.selectedRowIds[id])
      ) {
        isAllPageRowsSelected = false
      }
    }

    return isAllPageRowsSelected
  }, [instance.page, instance.state.rowSelection])

  instance.getIsSomeRowsSelected = useLazyMemo(() => {
    return (
      !instance.getIsAllRowsSelected() &&
      Object.keys(instance.state.rowSelection).length
    )
  }, [instance.nonGroupedRowsById, instance.state.rowSelection])

  instance.getIsSomePageRowsSelected = useLazyMemo(() => {
    return (
      !instance.getIsPageAllRowsSelected() &&
      instance.page?.length &&
      instance.page.some(({ id }) => instance.selectRowIds[id])
    )
  }, [instance.page, instance.state.rowSelection])

  instance.getToggleAllRowsSelectedProps = props => {
    const isSomeRowsSelected = instance.getIsSomeRowsSelected()
    const isAllRowsSelected = instance.getIsAllRowsSelected()

    return {
      onChange: e => {
        instance.toggleAllRowsSelected(e.target.checked)
      },
      checked: isAllRowsSelected,
      title: 'Toggle All Rows Selected',
      indeterminate: isSomeRowsSelected,
      ...props,
    }
  }

  instance.getToggleAllPageRowsSelectedProps = props => {
    const isSomePageRowsSelected = instance.getIsSomePageRowsSelected()
    const isAllPageRowsSelected = instance.getIsAllPageRowsSelected()

    return {
      onChange: e => {
        instance.toggleAllPageRowsSelected(e.target.checked)
      },
      checked: isAllPageRowsSelected,
      title: 'Toggle All Current Page Rows Selected',
      indeterminate: isSomePageRowsSelected,
      ...props,
    }
  }
}

function useReduceLeafColumns(orderedColumns) {
  return React.useMemo(() => {
    return [
      orderedColumns.find(d => d.isRowSelectionColumn),
      ...orderedColumns.filter(d => d && !d.isRowSelectionColumn),
    ].filter(Boolean)
  }, [orderedColumns])
}

useReduceLeafColumns.after = ['withGrouping', 'withExpanding']

function decorateRow(row, { instance }) {
  row.getIsSelected = () =>
    instance.options.selectSubRows
      ? getRowIsSelected(row, instance.state.rowSelection)
      : !!instance.state.rowSelection[row.id]

  row.getIsSomeSelected = () => row.getIsSelected() === null

  row.toggleSelected = set => instance.toggleRowSelected(row.id, set)

  row.getToggleRowSelectedProps = props => {
    const {
      options: { manualRowSelectedKey },
    } = instance

    let checked = false

    if (row.original?.[manualRowSelectedKey]) {
      checked = true
    } else {
      checked = row.getIsSelected()
    }

    return {
      onClick: e => e.stopPropagation(),
      onChange: e => row.toggleSelected(e.target.checked),
      checked,
      title: 'Toggle Row Selected',
      indeterminate: row.getIsSomeSelected(),
      ...props,
    }
  }

  row.getRowProps = composeReducer(
    row.getRowProps,
    ({ onClick, ...props }) => ({
      ...props,
      onClick: e => {
        if (instance.options.isAdditiveSelectEvent(e)) {
          row.toggleSelected()
        } else if (instance.options.isInclusiveSelectEvent(e)) {
          instance.addRowSelectionRange(row.id)
        } else {
          instance.setRowSelection({})
          row.toggleSelected()
        }

        if (onClick) onClick(e)
      },
    })
  )
}

const selectRowById = (
  selectedRowIds,
  id,
  value,
  { rowsById, selectGroupingRows, selectSubRows }
) => {
  const row = rowsById[id]

  if (!row.getIsGrouped() || (row.getIsGrouped() && selectGroupingRows)) {
    if (value) {
      selectedRowIds[id] = true
    } else {
      delete selectedRowIds[id]
    }
  }

  if (selectSubRows && row.subRows) {
    return row.subRows.forEach(row =>
      selectRowById(selectedRowIds, row.id, value, {
        rowsById,
        selectGroupingRows,
        selectSubRows,
      })
    )
  }
}
