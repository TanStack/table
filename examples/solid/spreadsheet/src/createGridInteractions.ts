import { createMemo, createSignal } from 'solid-js'
import {
  buildFillPatches,
  cellValuesEqual,
  formatCellValue,
  parseInputValue,
  parseTsv,
  serializeTsv,
} from './spreadsheetModel'
import type {
  CellSelectionBounds,
  CellSelectionDirection,
  CellSelectionRangeOperation,
  CellSelectionState,
} from '@tanstack/solid-table'
import type {
  CellPatch,
  CellValue,
  FillPreview,
  GridBounds,
  SpreadsheetColumnMeta,
  SpreadsheetRow,
} from './spreadsheetModel'
import type { SpreadsheetTable } from './spreadsheetTable'

export interface EditingCell {
  rowId: string
  columnId: string
  draft: string
}

interface GridInteractionOptions {
  table: SpreadsheetTable
  rows: () => Array<SpreadsheetRow>
  columns: () => Array<SpreadsheetColumnMeta>
  execute: (label: string, patches: Array<CellPatch>) => void
  undo: () => void
  redo: () => void
  scrollToCell: (rowId: string, columnId: string) => void
}

export function createGridInteractions(options: GridInteractionOptions) {
  const { table, execute, undo, redo, scrollToCell } = options
  const [editing, setEditing] = createSignal<EditingCell | null>(null)

  const rowById = createMemo(
    () => new Map(options.rows().map((row) => [row.id, row])),
  )
  const columnIndexById = createMemo(
    () => new Map(options.columns().map((column) => [column.id, column.index])),
  )

  const getValue = useCallback(
    (rowId: string, columnId: string): CellValue => {
      const row = rowById().get(rowId)
      const columnIndex = columnIndexById().get(columnId)
      if (!row || columnIndex == null) return null
      return row.cells[columnIndex] ?? null
    },
    [columnIndexById, rowById],
  )

  const getDisplayRows = useCallback(
    () => table.getRowsInDisplayOrder(),
    [table],
  )
  const getDisplayColumns = useCallback(
    () => [
      ...table.getStartVisibleLeafColumns(),
      ...table.getCenterVisibleLeafColumns(),
      ...table.getEndVisibleLeafColumns(),
    ],
    [table],
  )

  const getActiveRange = useCallback(() => {
    const ranges = table.atoms.cellSelection.get()
    return ranges.at(-1)
  }, [table])

  const scrollToActiveCorner = useCallback(() => {
    requestAnimationFrame(() => {
      const active = getActiveRange()
      if (active) scrollToCell(active.focusRowId, active.focusColumnId)
    })
  }, [getActiveRange, scrollToCell])

  const moveSelection = useCallback(
    (direction: CellSelectionDirection, extend = false) => {
      if (extend) table.extendCellSelection(direction)
      else table.moveCellSelection(direction)
      scrollToActiveCorner()
    },
    [scrollToActiveCorner, table],
  )

  const startEditing = useCallback(
    (rowId: string, columnId: string, replacement?: string) => {
      table.setFocusedCell(rowId, columnId)
      setEditing({
        rowId,
        columnId,
        draft: replacement ?? formatCellValue(getValue(rowId, columnId)),
      })
      scrollToCell(rowId, columnId)
    },
    [getValue, scrollToCell, table],
  )

  const commitCellValue = useCallback(
    (
      rowId: string,
      columnId: string,
      draft: string,
      move?: CellSelectionDirection,
    ) => {
      const before = getValue(rowId, columnId)
      const after = parseInputValue(draft)
      if (!cellValuesEqual(before, after)) {
        execute('Edit cell', [
          {
            rowId,
            columnId,
            before,
            after,
          },
        ])
      }

      table.setFocusedCell(rowId, columnId)
      setEditing(null)
      if (move) {
        table.moveCellSelection(move)
        scrollToActiveCorner()
      }
    },
    [execute, getValue, scrollToActiveCorner, table],
  )

  const commitEditing = useCallback(
    (move?: CellSelectionDirection) => {
      const current = editing()
      if (!current) return
      commitCellValue(current.rowId, current.columnId, current.draft, move)
    },
    [commitCellValue, editing],
  )

  const cancelEditing = useCallback(() => setEditing(null), [])

  const getSelectedBounds = useCallback(
    () => table.getCellSelectionBounds(),
    [table],
  )

  const patchesForBounds = useCallback(
    (
      bounds: ReadonlyArray<CellSelectionBounds>,
      getAfter: (
        rowOffset: number,
        columnOffset: number,
        before: CellValue,
      ) => CellValue,
    ) => {
      const displayRows = getDisplayRows()
      const displayColumns = getDisplayColumns()
      const patchesByCell = new Map<string, CellPatch>()

      for (const bound of bounds) {
        for (
          let rowIndex = bound.minRowIndex;
          rowIndex <= bound.maxRowIndex;
          rowIndex++
        ) {
          const row = displayRows.at(rowIndex)
          if (!row) continue

          for (
            let columnIndex = bound.minColumnIndex;
            columnIndex <= bound.maxColumnIndex;
            columnIndex++
          ) {
            const column = displayColumns.at(columnIndex)
            if (!column) continue

            const before = getValue(row.id, column.id)
            const after = getAfter(
              rowIndex - bound.minRowIndex,
              columnIndex - bound.minColumnIndex,
              before,
            )
            if (cellValuesEqual(before, after)) continue

            patchesByCell.set(`${row.id}\u0000${column.id}`, {
              rowId: row.id,
              columnId: column.id,
              before,
              after,
            })
          }
        }
      }

      return [...patchesByCell.values()]
    },
    [getDisplayColumns, getDisplayRows, getValue],
  )

  const clearSelection = useCallback(() => {
    const patches = patchesForBounds(getSelectedBounds(), () => null)
    execute('Clear cells', patches)
  }, [execute, getSelectedBounds, patchesForBounds])

  const copySelection = useCallback(
    (event: ClipboardEvent) => {
      const text = serializeTsv(table.getSelectedCellRangesData())
      if (!text) return
      event.preventDefault()
      event.clipboardData?.setData('text/plain', text)
    },
    [table],
  )

  const copyToClipboard = useCallback(async () => {
    const text = serializeTsv(table.getSelectedCellRangesData())
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard access can be denied by an embedded docs preview. Keyboard
      // copy remains available through the grid's native copy handler.
    }
  }, [table])

  const cutSelection = useCallback(
    (event: ClipboardEvent) => {
      copySelection(event)
      const patches = patchesForBounds(getSelectedBounds(), () => null)
      execute('Cut cells', patches)
    },
    [copySelection, execute, getSelectedBounds, patchesForBounds],
  )

  const cutToClipboard = useCallback(async () => {
    await copyToClipboard()
    const patches = patchesForBounds(getSelectedBounds(), () => null)
    execute('Cut cells', patches)
  }, [copyToClipboard, execute, getSelectedBounds, patchesForBounds])

  const selectBounds = useCallback(
    (bounds: GridBounds) => {
      const displayRows = getDisplayRows()
      const displayColumns = getDisplayColumns()
      const anchorRow = displayRows.at(bounds.minRowIndex)
      const focusRow = displayRows.at(bounds.maxRowIndex)
      const anchorColumn = displayColumns.at(bounds.minColumnIndex)
      const focusColumn = displayColumns.at(bounds.maxColumnIndex)

      if (!anchorRow || !focusRow || !anchorColumn || !focusColumn) return
      table.selectCellRange({
        anchorRowId: anchorRow.id,
        focusRowId: focusRow.id,
        anchorColumnId: anchorColumn.id,
        focusColumnId: focusColumn.id,
      })
      scrollToCell(focusRow.id, focusColumn.id)
    },
    [getDisplayColumns, getDisplayRows, scrollToCell, table],
  )

  const pasteText = useCallback(
    (text: string) => {
      const active = getActiveRange()
      if (!active) return

      const matrix = parseTsv(text)

      const displayRows = getDisplayRows()
      const displayColumns = getDisplayColumns()
      const rowIndex = displayRows.findIndex(
        (row) => row.id === active.anchorRowId,
      )
      const columnIndex = displayColumns.findIndex(
        (column) => column.id === active.anchorColumnId,
      )
      if (rowIndex < 0 || columnIndex < 0) return

      const activeBound = getSelectedBounds().at(-1)
      const fillActiveRange =
        matrix.length === 1 &&
        matrix[0]?.length === 1 &&
        activeBound != null &&
        (activeBound.maxRowIndex > activeBound.minRowIndex ||
          activeBound.maxColumnIndex > activeBound.minColumnIndex)

      if (fillActiveRange) {
        const after = parseInputValue(matrix[0][0] ?? '')
        const patches = patchesForBounds([activeBound], () => after)
        execute('Paste cells', patches)
        return
      }

      const patches: Array<CellPatch> = []
      let maxRowIndex = rowIndex
      let maxColumnIndex = columnIndex

      matrix.forEach((matrixRow, rowOffset) => {
        const row = displayRows.at(rowIndex + rowOffset)
        if (!row) return
        maxRowIndex = rowIndex + rowOffset

        matrixRow.forEach((text, columnOffset) => {
          const column = displayColumns.at(columnIndex + columnOffset)
          if (!column) return
          maxColumnIndex = Math.max(maxColumnIndex, columnIndex + columnOffset)
          const before = getValue(row.id, column.id)
          const after = parseInputValue(text)
          if (!cellValuesEqual(before, after)) {
            patches.push({
              rowId: row.id,
              columnId: column.id,
              before,
              after,
            })
          }
        })
      })

      execute('Paste cells', patches)
      selectBounds({
        minRowIndex: rowIndex,
        maxRowIndex,
        minColumnIndex: columnIndex,
        maxColumnIndex,
      })
    },
    [
      execute,
      getActiveRange,
      getDisplayColumns,
      getDisplayRows,
      getSelectedBounds,
      getValue,
      patchesForBounds,
      selectBounds,
    ],
  )

  const pasteSelection = useCallback(
    (event: ClipboardEvent) => {
      if (!getActiveRange()) return
      event.preventDefault()
      pasteText(event.clipboardData?.getData('text/plain') ?? '')
    },
    [getActiveRange, pasteText],
  )

  const pasteFromClipboard = useCallback(async () => {
    try {
      pasteText(await navigator.clipboard.readText())
    } catch {
      // Keyboard paste remains available when the Clipboard API is denied.
    }
  }, [pasteText])

  const applyFill = useCallback(
    (source: GridBounds, preview: FillPreview) => {
      const displayRows = getDisplayRows()
      const displayColumns = getDisplayColumns()
      const patches = buildFillPatches({
        source,
        preview,
        rowIds: displayRows.map((row) => row.id),
        columnIds: displayColumns.map((column) => column.id),
        getValue,
      })

      execute('Fill cells', patches)
      selectBounds(preview.expanded)
    },
    [execute, getDisplayColumns, getDisplayRows, getValue, selectBounds],
  )

  const selectColumnRange = useCallback(
    (
      anchorColumnId: string,
      focusColumnId: string,
      baseSelection: CellSelectionState,
      operation: CellSelectionRangeOperation,
    ) => {
      const displayRows = getDisplayRows()
      const displayColumns = getDisplayColumns()
      if (!displayRows.length || !displayColumns.length) return

      table.setCellSelection([
        ...baseSelection,
        {
          anchorRowId: displayRows[0].id,
          focusRowId: displayRows[displayRows.length - 1].id,
          anchorColumnId,
          focusColumnId,
          operation,
        },
      ])
    },
    [getDisplayColumns, getDisplayRows, table],
  )

  const selectRowRange = useCallback(
    (
      anchorRowId: string,
      focusRowId: string,
      baseSelection: CellSelectionState,
      operation: CellSelectionRangeOperation,
    ) => {
      const displayRows = getDisplayRows()
      const displayColumns = getDisplayColumns()
      if (!displayRows.length || !displayColumns.length) return

      table.setCellSelection([
        ...baseSelection,
        {
          anchorRowId,
          focusRowId,
          anchorColumnId: displayColumns[0].id,
          focusColumnId: displayColumns[displayColumns.length - 1].id,
          operation,
        },
      ])
    },
    [getDisplayColumns, getDisplayRows, table],
  )

  const startEditingActive = useCallback(() => {
    const active = getActiveRange()
    if (active) startEditing(active.anchorRowId, active.anchorColumnId)
  }, [getActiveRange, startEditing])

  const handleGridTextEntry = useCallback(
    (event: KeyboardEvent) => {
      if (editing()) return
      const modifier = event.metaKey || event.ctrlKey
      const key = event.key
      if (
        key.length === 1 &&
        !modifier &&
        !event.altKey &&
        !event.isComposing
      ) {
        event.preventDefault()
        const active = getActiveRange()
        if (active) {
          startEditing(active.anchorRowId, active.anchorColumnId, key)
        }
      }
    },
    [editing, getActiveRange, startEditing],
  )

  const handleEditorKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        cancelEditing()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        commitEditing(event.shiftKey ? 'up' : 'down')
      } else if (event.key === 'Tab') {
        event.preventDefault()
        commitEditing(event.shiftKey ? 'left' : 'right')
      }
    },
    [cancelEditing, commitEditing],
  )

  const getRangeLabel = useCallback(() => {
    const bound = getSelectedBounds().at(-1)
    if (!bound) return ''
    const columns = options.columns()
    const start = `${columns[bound.minColumnIndex]?.letter ?? '?'}${
      bound.minRowIndex + 1
    }`
    const end = `${columns[bound.maxColumnIndex]?.letter ?? '?'}${
      bound.maxRowIndex + 1
    }`
    return start === end ? start : `${start}:${end}`
  }, [options.columns, getSelectedBounds])

  const getSelectionSummary = useCallback(() => {
    const count = table.getSelectedCellCount()
    // Materializing the values for a whole 10k × 250 stress grid would turn a
    // cheap selection into millions of allocations just to populate the
    // status bar. Keep exact counts, but only calculate numeric stats for
    // ranges small enough to summarize interactively.
    if (count > 10_000) {
      return {
        count,
        numericCount: 0,
        sum: 0,
        average: 0,
      }
    }

    const values = table
      .getSelectedCellRangesData()
      .flat(2)
      .filter((value): value is number => typeof value === 'number')
    const sum = values.reduce((total, value) => total + value, 0)
    return {
      count,
      numericCount: values.length,
      sum,
      average: values.length ? sum / values.length : 0,
    }
  }, [table])

  return {
    editing,
    setEditingDraft: useCallback(
      (draft: string) =>
        setEditing((current) => (current ? { ...current, draft } : current)),
      [],
    ),
    getValue,
    getActiveRange,
    getSelectedBounds,
    getRangeLabel,
    getSelectionSummary,
    startEditing,
    startEditingActive,
    moveSelection,
    commitCellValue,
    commitEditing,
    cancelEditing,
    clearSelection,
    copySelection,
    copyToClipboard,
    cutSelection,
    cutToClipboard,
    pasteSelection,
    pasteFromClipboard,
    applyFill,
    selectBounds,
    selectColumnRange,
    selectRowRange,
    handleGridTextEntry,
    handleEditorKeyDown,
    undo,
    redo,
  }
}

export type GridInteractions = ReturnType<typeof createGridInteractions>

function useCallback<TArgs extends Array<unknown>, TResult>(
  callback: (...args: TArgs) => TResult,
  _dependencies?: Array<unknown>,
): (...args: TArgs) => TResult {
  return callback
}
