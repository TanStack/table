import React from 'react'

//

import {
  useGetLatest,
  getFirstDefined,
  getFilterMethod,
  functionalUpdate,
  shouldAutoRemoveFilter,
  findExpandedDepth,
  expandRows,
} from '../utils'

import * as filterTypes from '../filterTypes'

export default function useTableMethods(instance) {
  const getInstance = useGetLatest(instance)

  instance.reset = React.useCallback(() => {
    getInstance().setState(getInstance().getInitialState(), {
      type: 'reset',
    })
  }, [getInstance])

  instance.toggleColumnVisibility = React.useCallback(
    (columnId, value) => {
      value =
        typeof value !== 'undefined'
          ? value
          : !getInstance().getColumnIsVisible(columnId)

      if (!getInstance().getCan)
        getInstance().setState(
          old => ({
            ...old,
            columnVisibility: {
              ...old.columnVisibility,
              [columnId]: value,
            },
          }),
          {
            type: 'toggleColumnVisibility',
            value,
          }
        )
    },
    [getInstance]
  )

  instance.toggleAllColumnsVisible = React.useCallback(
    value => {
      value =
        typeof value !== 'undefined'
          ? value
          : !getInstance().getIsAllColumnsVisible()

      getInstance().setState(
        old => ({
          ...old,
          columnVisibility: getInstance().flatColumns.reduce(
            (obj, column) => ({
              ...obj,
              [column.id]: value,
            }),
            {}
          ),
        }),
        {
          type: 'toggleAllColumnsVisible',
          value,
        }
      )
    },
    [getInstance]
  )

  instance.getColumnIsVisible = React.useCallback(
    columnId => {
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      // TODO: make this look up column groups, too
      if (!column) {
        return true
      }

      return getFirstDefined(
        instance.state.columnVisibility[columnId],
        column.defaultIsVisible,
        true
      )
    },
    [getInstance, instance.state.columnVisibility]
  )

  instance.getColumnCanHide = React.useCallback(
    columnId => {
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disabledHiding ? false : undefined,
        column.disableHiding ? false : undefined,
        column.defaultCanHide,
        true
      )
    },
    [getInstance]
  )

  instance.getColumnCanFilter = React.useCallback(
    columnId => {
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disableFilters ? false : undefined,
        getInstance().options.disableColumnFilters ? false : undefined,
        column.disableAllFilters ? false : undefined,
        column.disableFilter ? false : undefined,
        column.defaultCanFilter,
        column.defaultCanFilterColumn,
        !!column.accessor
      )
    },
    [getInstance]
  )

  instance.getColumnIsFiltered = React.useCallback(
    columnId => getInstance().getColumnFilterIndex(columnId) > -1,
    [getInstance]
  )

  instance.getCanGlobalFilterColumn = React.useCallback(
    columnId => {
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disableFilters ? false : undefined,
        getInstance().options.disableGlobalFilters ? false : undefined,
        column.disableAllFilters ? false : undefined,
        column.disableGlobalFilter ? false : undefined,
        column.defaultCanFilter,
        column.defaultCanGlobalFilter,
        !!column.accessor
      )
    },
    [getInstance]
  )

  instance.getColumnFilterValue = React.useCallback(
    columnId =>
      instance.state.columnFilters.find(d => d.id === columnId)?.value,
    [instance.state.columnFilters]
  )

  instance.getColumnFilterIndex = React.useCallback(
    columnId => instance.state.columnFilters.findIndex(d => d.id === columnId),
    [instance.state.columnFilters]
  )

  instance.setColumnFilterValue = React.useCallback(
    (columnId, value) =>
      getInstance().setState(
        old => {
          const {
            flatColumns,
            options: { filterTypes: userFilterTypes },
          } = getInstance()

          const column = flatColumns.find(d => d.id === columnId)

          if (!column) {
            throw new Error(
              `React-Table: Could not find a column with id: ${columnId}`
            )
          }

          const filterMethod = getFilterMethod(
            column.filterType,
            userFilterTypes || {},
            filterTypes
          )

          const previousfilter = old.columnFilters.find(d => d.id === columnId)

          const newFilter = functionalUpdate(
            value,
            previousfilter && previousfilter.value
          )

          //
          if (
            shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter, column)
          ) {
            return {
              ...old,
              columnFilters: old.columnFilters.filter(d => d.id !== columnId),
            }
          }

          if (previousfilter) {
            return {
              ...old,
              columnFilters: old.columnFilters.map(d => {
                if (d.id === columnId) {
                  return { id: columnId, value: newFilter }
                }
                return d
              }),
            }
          }

          return {
            ...old,
            columnFilters: [
              ...old.columnFilters,
              { id: columnId, value: newFilter },
            ],
          }
        },
        {
          type: 'setColumnFilterValue',
          columnId,
          value,
        }
      ),
    [getInstance]
  )

  instance.setColumnFilters = React.useCallback(
    columnFilters =>
      getInstance().setState(
        old => {
          const {
            flatColumns,
            options: { filterTypes: userFilterTypes },
          } = getInstance()

          return {
            ...old,
            // Filter out undefined values
            columnFilters: functionalUpdate(
              columnFilters,
              old.columnFilters
            ).filter(filter => {
              const column = flatColumns.find(d => d.id === filter.id)
              const filterMethod = getFilterMethod(
                column.filterType,
                userFilterTypes || {},
                filterTypes
              )

              if (
                shouldAutoRemoveFilter(
                  filterMethod.autoRemove,
                  filter.value,
                  column
                )
              ) {
                return false
              }
              return true
            }),
          }
        },
        {
          type: 'setColumnFilters',
        }
      ),
    [getInstance]
  )

  instance.resetColumnFilters = React.useCallback(
    () =>
      getInstance().setState(
        old => ({
          ...old,
          columnFilters: getInstance().getInitialState().columnFilters,
        }),
        {
          type: 'resetColumnFilters',
        }
      ),
    [getInstance]
  )

  instance.setGlobalFilterValue = React.useCallback(
    value =>
      getInstance().setState(
        old => {
          const filterMethod = getFilterMethod(
            getInstance().options.globalFilterType,
            getInstance().options.filterTypes || {},
            filterTypes
          )

          const newFilter = functionalUpdate(value, old.globalFilterValue)

          //
          if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter)) {
            const { globalFilterValue, ...stateWithout } = old
            return stateWithout
          }

          return {
            ...old,
            globalFilterValue: newFilter,
          }
        },
        {
          type: 'setGlobalFilterValue',
          value,
        }
      ),
    [getInstance]
  )

  instance.resetGlobalFilter = React.useCallback(
    () =>
      getInstance().setState(
        old => ({
          ...old,
          globalFilterValue: getInstance().getInitialState().globalFilterValue,
        }),
        {
          type: 'resetGlobalFilter',
        }
      ),
    [getInstance]
  )

  instance.getColumnCanGroup = React.useCallback(
    columnId => {
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disableGrouping ? false : undefined,
        column.disableGrouping ? false : undefined,
        column.defaultCanGrouping,
        !!column.accessor
      )
    },
    [getInstance]
  )

  instance.getColumnIsGrouped = React.useCallback(
    columnId => getInstance().state.grouping.includes(columnId),
    [getInstance]
  )

  instance.getColumnGroupedIndex = React.useCallback(
    columnId => getInstance().state.grouping.indexOf(columnId),
    [getInstance]
  )

  instance.toggleColumnGrouping = React.useCallback(
    (columnId, value) => {
      getInstance().setState(
        old => {
          value =
            typeof value !== 'undefined'
              ? value
              : !old.grouping.includes(columnId)

          if (value) {
            return [
              {
                ...old,
                grouping: [...old.grouping, columnId],
              },
              { value },
            ]
          }

          return [
            {
              ...old,
              grouping: old.grouping.filter(d => d !== columnId),
            },
            {
              value,
            },
          ]
        },
        {
          type: 'toggleColumnGrouping',
          columnId,
        }
      )
    },
    [getInstance]
  )

  instance.resetGrouping = React.useCallback(
    () =>
      getInstance().setState(
        old => {
          return {
            ...old,
            grouping: getInstance().getInitialState().grouping,
          }
        },
        {
          type: 'resetGrouping',
        }
      ),
    [getInstance]
  )

  instance.getIsAllRowsExpanded = React.useCallback(() => {
    let isAllRowsExpanded = Boolean(
      Object.keys(getInstance().rowsById).length &&
        Object.keys(getInstance().state.expanded).length
    )

    if (isAllRowsExpanded) {
      if (
        Object.keys(getInstance().rowsById).some(
          id => !getInstance().state.expanded[id]
        )
      ) {
        isAllRowsExpanded = false
      }
    }

    return isAllRowsExpanded
  }, [getInstance])

  instance.getExpandedDepth = React.useCallback(
    () => findExpandedDepth(getInstance().state.expanded),
    [getInstance]
  )

  instance.toggleRowExpanded = React.useCallback(
    (id, value) => {
      getInstance().setState(
        old => {
          const exists = old.expanded[id]

          value = typeof value !== 'undefined' ? value : !exists

          if (!exists && value) {
            return [
              {
                ...old,
                expanded: {
                  ...old.expanded,
                  [id]: true,
                },
              },
              {
                value,
              },
            ]
          } else if (exists && !value) {
            const { [id]: _, ...rest } = old.expanded
            return [
              {
                ...old,
                expanded: rest,
              },
              {
                value,
              },
            ]
          } else {
            return [old, { value }]
          }
        },
        {
          type: 'toggleRowExpanded',
          id,
        }
      )
    },
    [getInstance]
  )

  instance.toggleAllRowsExpanded = React.useCallback(
    value =>
      getInstance().setState(
        old => {
          const { isAllRowsExpanded, rowsById } = getInstance()

          value = typeof value !== 'undefined' ? value : !isAllRowsExpanded

          if (value) {
            const expanded = {}

            Object.keys(rowsById).forEach(rowId => {
              expanded[rowId] = true
            })

            return [
              {
                ...old,
                expanded,
              },
              {
                value,
              },
            ]
          }

          return [
            {
              ...old,
              expanded: {},
            },
            {
              value,
            },
          ]
        },
        {
          type: 'toggleAllRowsExpanded',
        }
      ),
    [getInstance]
  )

  instance.resetExpanded = React.useCallback(
    () =>
      getInstance().setState(
        old => ({
          ...old,
          expanded: getInstance().getInitialState.expanded,
        }),
        {
          type: 'resetExpanded',
        }
      ),
    [getInstance]
  )

  // Updates sorting based on a columnId, desc flag and multi flag
  instance.toggleColumnSorting = React.useCallback(
    (columnId, desc, multi) =>
      getInstance().setState(
        old => {
          const {
            flatColumns,
            disableMultiSort,
            disableSortRemove,
            disableMultiRemove,
            maxMultiSortColCount = Number.MAX_SAFE_INTEGER,
          } = getInstance()

          const { sorting } = old

          // Find the column for this columnId
          const column = flatColumns.find(d => d.id === columnId)
          const { sortDescFirst } = column

          // Find any existing sorting for this column
          const existingSorting = sorting.find(d => d.id === columnId)
          const existingIndex = sorting.findIndex(d => d.id === columnId)
          const hasDescDefined = typeof desc !== 'undefined' && desc !== null

          let newSorting = []

          // What should we do with this sort action?
          let sortAction

          if (!disableMultiSort && multi) {
            if (existingSorting) {
              sortAction = 'toggle'
            } else {
              sortAction = 'add'
            }
          } else {
            // Normal mode
            if (existingIndex !== sorting.length - 1) {
              sortAction = 'replace'
            } else if (existingSorting) {
              sortAction = 'toggle'
            } else {
              sortAction = 'replace'
            }
          }

          // Handle toggle states that will remove the sorting
          if (
            sortAction === 'toggle' && // Must be toggling
            !disableSortRemove && // If disableSortRemove, disable in general
            !hasDescDefined && // Must not be setting desc
            (multi ? !disableMultiRemove : true) && // If multi, don't allow if disableMultiRemove
            ((existingSorting && // Finally, detect if it should indeed be removed
              existingSorting.desc &&
              !sortDescFirst) ||
              (!existingSorting.desc && sortDescFirst))
          ) {
            sortAction = 'remove'
          }

          if (sortAction === 'replace') {
            newSorting = [
              {
                id: columnId,
                desc: hasDescDefined ? desc : sortDescFirst,
              },
            ]
          } else if (sortAction === 'add') {
            newSorting = [
              ...sorting,
              {
                id: columnId,
                desc: hasDescDefined ? desc : sortDescFirst,
              },
            ]
            // Take latest n columns
            newSorting.splice(0, newSorting.length - maxMultiSortColCount)
          } else if (sortAction === 'toggle') {
            // This flips (or sets) the
            newSorting = sorting.map(d => {
              if (d.id === columnId) {
                return {
                  ...d,
                  desc: hasDescDefined ? desc : !existingSorting.desc,
                }
              }
              return d
            })
          } else if (sortAction === 'remove') {
            newSorting = sorting.filter(d => d.id !== columnId)
          }

          return {
            ...old,
            sorting: newSorting,
          }
        },
        {
          type: 'toggleColumnSorting',
          columnId,
          desc,
          multi,
        }
      ),
    [getInstance]
  )

  instance.setSorting = React.useCallback(
    updater =>
      getInstance().setState(
        old => {
          return {
            ...old,
            sorting: functionalUpdate(updater, old.sorting),
          }
        },
        {
          type: 'setSorting',
        }
      ),
    [getInstance]
  )

  instance.resetSorting = React.useCallback(
    () =>
      getInstance().setState(
        old => {
          return {
            ...old,
            sorting: getInstance().getInitialState().sorting,
          }
        },
        {
          type: 'resetSorting',
        }
      ),
    [getInstance]
  )

  instance.getColumnCanSort = React.useCallback(
    columnId => {
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disableSorting ? false : undefined,
        column.disableSorting ? false : undefined,
        column.defaultCanSort,
        !!column.accessor
      )
    },
    [getInstance]
  )

  instance.getColumnSortedIndex = React.useCallback(
    columnId => getInstance().state.sorting.findIndex(d => d.id === columnId),
    [getInstance]
  )

  instance.getColumnIsSorted = React.useCallback(
    columnId => getInstance().getColumnSortedIndex(columnId) > -1,
    [getInstance]
  )

  instance.getColumnIsSortedDesc = React.useCallback(
    columnId => getInstance().state.sorting.find(d => d.id === columnId)?.desc,
    [getInstance]
  )

  instance.clearSorting = React.useCallback(
    columnId =>
      getInstance().setState(
        old => {
          const { sorting } = old
          const newSorting = sorting.filter(d => d.id !== columnId)

          return {
            ...old,
            sorting: newSorting,
          }
        },
        {
          type: 'clearSorting',
          columnId,
        }
      ),
    [getInstance]
  )

  instance.resetColumnOrder = React.useCallback(
    () =>
      getInstance().setState(
        old => ({
          ...old,
          columnOrder: getInstance().initialState.columnOrder || [],
        }),
        {
          type: 'resetColumnOrder',
        }
      ),
    [getInstance]
  )

  instance.setColumnOrder = React.useCallback(
    columnOrder =>
      getInstance().setState(
        old => ({
          ...old,
          columnOrder: functionalUpdate(columnOrder, old.columnOrder),
        }),
        {
          type: 'setColumnOrder',
        }
      ),
    [getInstance]
  )

  instance.getSelectedFlatRows = React.useCallback(() => {
    const { flatRows } = getInstance()

    return flatRows.filter(row => !row.getIsGrouped() && row.getIsSelected())
  }, [getInstance])

  instance.resetSelectedRows = React.useCallback(
    () =>
      getInstance().setState(
        old => ({
          ...old,
          selection: getInstance().getInitialState().selection || {},
        }),
        {
          type: 'resetSelectedRows',
        }
      ),
    [getInstance]
  )

  instance.toggleAllRowsSelected = React.useCallback(
    value =>
      getInstance().setState(
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
    [getInstance]
  )

  instance.toggleRowSelected = React.useCallback(
    (id, value) =>
      getInstance().setState(
        old => {
          const { rowsById, selectSubRows = true } = getInstance()

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

            if (!row.getIsGrouped()) {
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
    [getInstance]
  )

  instance.resetPage = React.useCallback(
    () =>
      getInstance().setState(
        old => ({
          ...old,
          pageIndex: getInstance().getInitialState().pageIndex,
        }),
        {
          type: 'resetPage',
        }
      ),
    [getInstance]
  )

  instance.resetPageSize = React.useCallback(
    () =>
      getInstance().setState(
        old => ({
          ...old,
          pageIndex: getInstance().getInitialState().pageSize,
        }),
        {
          type: 'resetPageSize',
        }
      ),
    [getInstance]
  )

  instance.getPageCount = React.useCallback(
    () =>
      getInstance().options.manualPagination
        ? getInstance().state.pageCount
        : Math.ceil(getInstance().rows.length / getInstance().state.pageSize),
    [getInstance]
  )

  instance.getPageOptions = React.useCallback(() => {
    const pageCount = getInstance().getPageCount()

    return pageCount > 0
      ? [...new Array(pageCount)].fill(null).map((d, i) => i)
      : []
  }, [getInstance])

  instance.getPageRows = React.useCallback(() => {
    const {
      rows,
      state: { pageIndex, pageSize },
      options: { manualPagination },
    } = getInstance()
    let page

    if (manualPagination) {
      page = rows
    } else {
      const pageStart = pageSize * pageIndex
      const pageEnd = pageStart + pageSize

      page = rows.slice(pageStart, pageEnd)
    }

    if (getInstance().options.paginateExpandedRows) {
      return page
    }

    return expandRows(page, getInstance)
  }, [getInstance])

  instance.getCanPreviousPage = React.useCallback(
    () => getInstance().state.pageIndex > 0,
    [getInstance]
  )

  instance.getCanNextPage = React.useCallback(() => {
    const {
      state: { pageSize, pageIndex },
      getPageRows,
      getPageCount,
    } = getInstance()

    return getPageCount() === -1
      ? getPageRows().length >= pageSize
      : pageIndex < getPageCount() - 1
  }, [getInstance])

  instance.gotoPage = React.useCallback(
    pageIndex => {
      getInstance().setState(
        old => {
          const {
            getPageCount,
            state: { page },
          } = getInstance()
          const newPageIndex = functionalUpdate(pageIndex, old.pageIndex)
          const cannnotPreviousPage = newPageIndex < 0
          const pageCount = getPageCount()
          const cannotNextPage =
            pageCount === -1
              ? page.length < old.pageSize
              : newPageIndex > pageCount - 1

          if (cannnotPreviousPage || cannotNextPage) {
            return old
          }

          return {
            ...old,
            pageIndex: newPageIndex,
          }
        },
        {
          type: 'gotoPage',
        }
      )
    },
    [getInstance]
  )

  instance.previousPage = React.useCallback(() => {
    return getInstance().gotoPage(old => old - 1)
  }, [getInstance])

  instance.nextPage = React.useCallback(() => {
    return getInstance().gotoPage(old => old + 1)
  }, [getInstance])

  instance.setPageSize = React.useCallback(
    pageSize => {
      getInstance().setState(
        old => {
          const topRowIndex = old.pageSize * old.pageIndex
          const pageIndex = Math.floor(topRowIndex / pageSize)

          return {
            ...old,
            pageIndex,
            pageSize,
          }
        },
        {
          type: 'setPageSize',
        }
      )
    },
    [getInstance]
  )
}
