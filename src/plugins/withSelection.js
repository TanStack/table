import React from 'react'

import {
  useGetLatest,
  useLazyMemo,
  useMountedLayoutEffect,
  getRowIsSelected,
} from '../utils'

export const withSelection = {
  useOptions,
  useInstanceAfterState,
  decorateRow,
}

function useOptions(options) {
  return {
    selectSubRows: true,
    selectGroupingRows: false,
    manualRowSelectedKey: 'isSelected',
    ...options,
    initialState: {
      selection: {},
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const { setState } = instance

  const getInstance = useGetLatest(instance)

  const selectionResetDeps = [instance.options.data]
  React.useMemo(() => {
    if (getInstance().options.autoResetSelection) {
      getInstance().state.selection = getInstance().getInitialState().selection
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, selectionResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetSelection) {
      instance.resetSelection()
    }
  }, selectionResetDeps)

  instance.getSelectedFlatRows = React.useCallback(() => {
    const { flatRows } = getInstance()

    return flatRows.filter(row => !row.getIsGrouped() && row.getIsSelected())
  }, [getInstance])

  instance.resetSelectedRows = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          selection: getInstance().getInitialState().selection || {},
        }),
        {
          type: 'resetSelectedRows',
        }
      ),
    [getInstance, setState]
  )

  instance.toggleAllRowsSelected = React.useCallback(
    value =>
      setState(
        old => {
          const {
            isAllRowsSelected,
            rowsById,
            nonGroupedRowsById = rowsById,
          } = getInstance()

          value = typeof value !== 'undefined' ? value : !isAllRowsSelected

          // Only remove/add the rows that are visible on the screen
          //  Leave all the other rows that are selected alone.
          const selection = Object.assign({}, old.selection)

          if (value) {
            Object.keys(nonGroupedRowsById).forEach(rowId => {
              selection[rowId] = true
            })
          } else {
            Object.keys(nonGroupedRowsById).forEach(rowId => {
              delete selection[rowId]
            })
          }

          return [
            {
              ...old,
              selection,
            },
            {
              value,
            },
          ]
        },
        {
          type: 'toggleAllRowsSelected',
        }
      ),
    [getInstance, setState]
  )

  instance.toggleRowSelected = React.useCallback(
    (id, value) =>
      setState(
        old => {
          const { rowsById, selectSubRows, selectGroupingRows } = getInstance()

          // Join the ids of deep rows
          // to make a key, then manage all of the keys
          // in a flat object
          const row = rowsById[id]
          const isSelected = row.getIsSelected()
          value = typeof value !== 'undefined' ? value : !isSelected

          if (isSelected === value) {
            return old
          }

          const newSelectedRowIds = { ...old.selection }

          const handleRowById = id => {
            const row = rowsById[id]

            if (selectGroupingRows || !row.getIsGrouped()) {
              if (value) {
                newSelectedRowIds[id] = true
              } else {
                delete newSelectedRowIds[id]
              }
            }

            if (selectSubRows && row.subRows) {
              return row.subRows.forEach(row => handleRowById(row.id))
            }
          }

          handleRowById(id)

          return [
            {
              ...old,
              selection: newSelectedRowIds,
            },
            {
              value,
            },
          ]
        },
        {
          type: 'toggleRowSelected',
        }
      ),
    [getInstance, setState]
  )

  instance.getIsAllRowsSelected = useLazyMemo(() => {
    let isAllRowsSelected = Boolean(
      Object.keys(instance.nonGroupedRowsById).length &&
        Object.keys(instance.state.selection).length
    )
    if (isAllRowsSelected) {
      if (
        Object.keys(instance.nonGroupedRowsById).some(
          id => !instance.state.selection[id]
        )
      ) {
        isAllRowsSelected = false
      }
    }

    return isAllRowsSelected
  }, [instance.nonGroupedRowsById, instance.state.selection])

  instance.getToggleAllRowsSelectedProps = props => {
    const allRowsSelected = getInstance().getIsAllRowsSelected()

    return {
      onChange: e => {
        getInstance().toggleAllRowsSelected(e.target.checked)
      },
      style: {
        cursor: 'pointer',
      },
      checked: allRowsSelected,
      title: 'Toggle All Rows Selected',
      indeterminate: Boolean(
        !allRowsSelected && Object.keys(getInstance().state.selection).length
      ),
      ...props,
    }
  }
}

function decorateRow(row, getInstance) {
  row.getIsSelected = () =>
    getInstance().options.selectSubRows
      ? getRowIsSelected(row, getInstance().state.selection)
      : !!getInstance().state.selection[row.id]

  row.getIsSomeSelected = () => row.getIsSelected() === null

  row.toggleRowSelected = set => getInstance().toggleRowSelected(row.id, set)

  row.getToggleRowSelectedProps = props => {
    const {
      options: { manualRowSelectedKey },
    } = getInstance()

    let checked = false

    if (row.original?.[manualRowSelectedKey]) {
      checked = true
    } else {
      checked = row.getIsSelected()
    }

    return {
      onChange: e => {
        row.toggleRowSelected(e.target.checked)
      },
      style: {
        cursor: 'pointer',
      },
      checked,
      title: 'Toggle Row Selected',
      indeterminate: row.getIsSomeSelected(),
      ...props,
    }
  }
}
