import { rankGlobalFuzzy } from '../fns/sortingFns'
import { parseFromValuesOrFunc } from './utils'
import type { ChangeEvent, MouseEvent } from 'react'

import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../types'

export const getMRT_Rows = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
  all?: boolean,
): Array<MRT_Row<TData>> => {
  const {
    getCenterRows,
    getPrePaginatedRowModel,
    getRowModel,
    state,
    getTopRows,
    options: {
      createDisplayMode,
      enablePagination,
      enableRowPinning,
      manualPagination,
      positionCreatingRow,
      rowPinningDisplayMode,
    },
  } = table
  const { creatingRow, pagination } = state

  const isRankingRows = getIsRankingRows(table)

  let rows: Array<MRT_Row<TData>> = []
  if (!isRankingRows) {
    rows =
      !enableRowPinning || rowPinningDisplayMode?.includes('sticky')
        ? all
          ? getPrePaginatedRowModel().rows
          : getRowModel().rows
        : getCenterRows()
  } else {
    // fuzzy ranking adjustments
    rows = getPrePaginatedRowModel().rows.sort((a, b) => rankGlobalFuzzy(a, b))
    if (enablePagination && !manualPagination && !all) {
      const start = pagination.pageIndex * pagination.pageSize
      rows = rows.slice(start, start + pagination.pageSize)
    }
    if (enableRowPinning && !rowPinningDisplayMode?.includes('sticky')) {
      // "re-center-ize" the rows (no top or bottom pinned rows unless sticky)
      rows = rows.filter((row) => !row.getIsPinned())
    }
  }
  // row pinning adjustments
  if (enableRowPinning && rowPinningDisplayMode?.includes('sticky')) {
    const centerPinnedRowIds = rows
      .filter((row) => row.getIsPinned())
      .map((r) => r.id)

    rows = [
      ...getTopRows().filter((row) => !centerPinnedRowIds.includes(row.id)),
      ...rows,
    ]
  }
  // blank inserted creating row adjustments
  if (
    positionCreatingRow !== undefined &&
    creatingRow &&
    createDisplayMode === 'row'
  ) {
    const creatingRowIndex = !isNaN(+positionCreatingRow)
      ? +positionCreatingRow
      : positionCreatingRow === 'top'
        ? 0
        : rows.length
    rows = [
      ...rows.slice(0, creatingRowIndex),
      creatingRow,
      ...rows.slice(creatingRowIndex),
    ]
  }

  return rows
}

export const getCanRankRows = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
) => {
  const {
    state,
    options: {
      enableGlobalFilterRankedResults,
      manualExpanding,
      manualFiltering,
      manualGrouping,
      manualSorting,
    },
  } = table
  const { expanded, globalFilterFn } = state

  return (
    !manualExpanding &&
    !manualFiltering &&
    !manualGrouping &&
    !manualSorting &&
    enableGlobalFilterRankedResults &&
    globalFilterFn === 'fuzzy' &&
    expanded !== true &&
    !Object.values(expanded).some(Boolean)
  )
}

export const getIsRankingRows = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
) => {
  const { globalFilter, sorting } = table.state

  return (
    getCanRankRows(table) &&
    globalFilter &&
    !Object.values(sorting).some(Boolean)
  )
}

export const getIsRowSelected = <TData extends MRT_RowData>({
  row,
  table,
}: {
  row: MRT_Row<TData>
  table: MRT_TableInstance<TData>
}) => {
  const {
    options: { enableRowSelection },
  } = table

  return (
    row.getIsSelected() ||
    (parseFromValuesOrFunc(enableRowSelection, row) &&
      row.getCanSelectSubRows() &&
      row.getIsAllSubRowsSelected())
  )
}

export const getMRT_RowSelectionHandler =
  <TData extends MRT_RowData>({
    renderedRowIndex = 0,
    row,
    table,
  }: {
    renderedRowIndex?: number
    row: MRT_Row<TData>
    table: MRT_TableInstance<TData>
  }) =>
  (
    event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLTableRowElement>,
    value?: boolean,
  ) => {
    const {
      state,
      options: {
        enableBatchRowSelection,
        enableMultiRowSelection,
        enableRowPinning,
        manualPagination,
        rowPinningDisplayMode,
      },
      refs: { lastSelectedRowId: lastSelectedRowId },
    } = table
    const {
      pagination: { pageIndex, pageSize },
    } = state

    const paginationOffset = manualPagination ? 0 : pageSize * pageIndex

    const wasCurrentRowChecked = getIsRowSelected({ row, table })

    // toggle selection of this row
    row.toggleSelected(value ?? !wasCurrentRowChecked)

    const changedRowIds = new Set<string>([row.id])

    // if shift key is pressed, select all rows between last selected and this one
    if (
      enableBatchRowSelection &&
      enableMultiRowSelection &&
      (event as any).nativeEvent.shiftKey &&
      lastSelectedRowId.current !== null
    ) {
      const rows = getMRT_Rows(table, true)

      const lastIndex = rows.findIndex(
        (r) => r.id === lastSelectedRowId.current,
      )

      if (lastIndex !== -1) {
        const isLastIndexChecked = getIsRowSelected({
          row: rows?.[lastIndex],
          table,
        })

        const currentIndex = renderedRowIndex + paginationOffset
        const [start, end] =
          lastIndex < currentIndex
            ? [lastIndex, currentIndex]
            : [currentIndex, lastIndex]

        // toggle selection of all rows between last selected and this one
        // but only if the last selected row is not the same as the current one
        if (wasCurrentRowChecked !== isLastIndexChecked) {
          for (let i = start; i <= end; i++) {
            rows[i].toggleSelected(!wasCurrentRowChecked)
            changedRowIds.add(rows[i].id)
          }
        }
      }
    }

    // record the last selected row id
    lastSelectedRowId.current = row.id

    // if all sub rows were selected, unselect them
    if (row.getCanSelectSubRows() && row.getIsAllSubRowsSelected()) {
      row.subRows?.forEach((r) => r.toggleSelected(false))
    }

    if (enableRowPinning && rowPinningDisplayMode?.includes('select')) {
      changedRowIds.forEach((rowId) => {
        const rowToTogglePin = table.getRow(rowId)
        rowToTogglePin.pin(
          !wasCurrentRowChecked // was not previously pinned or selected
            ? rowPinningDisplayMode?.includes('bottom')
              ? 'bottom'
              : 'top'
            : false,
        )
      })
    }
  }

export const getMRT_SelectAllHandler =
  <TData extends MRT_RowData>({ table }: { table: MRT_TableInstance<TData> }) =>
  (
    event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>,
    value?: boolean,
    forceAll?: boolean,
  ) => {
    const {
      options: { enableRowPinning, rowPinningDisplayMode, selectAllMode },
      refs: { lastSelectedRowId },
    } = table

    if (selectAllMode === 'all' || forceAll) {
      table.toggleAllRowsSelected(value ?? (event as any).target.checked)
    } else {
      table.toggleAllPageRowsSelected(value ?? (event as any).target.checked)
    }
    if (enableRowPinning && rowPinningDisplayMode?.includes('select')) {
      table.setRowPinning({ bottom: [], top: [] })
    }
    lastSelectedRowId.current = null
  }
