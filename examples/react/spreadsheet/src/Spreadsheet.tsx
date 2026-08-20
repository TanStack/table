import React from 'react'
import { useCreateAtom } from '@tanstack/react-store'
import {
  constructFilterFn,
  createColumnHelper,
  filterFn_includesString,
  useTable,
} from '@tanstack/react-table'
import { SpreadsheetGrid } from './SpreadsheetGrid'
import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_ROW_COUNT,
  STRESS_COLUMN_COUNT,
  STRESS_ROW_COUNT,
  formatCellValue,
  makeBlankSpreadsheetData,
  makeSpreadsheetData,
} from './spreadsheetModel'
import { spreadsheetFeatures } from './spreadsheetTable'
import { useGridInteractions } from './useGridInteractions'
import { useSpreadsheetHistory } from './useSpreadsheetHistory'
import type { CellSelectionState } from '@tanstack/react-table'
import type { SpreadsheetGridHandle } from './SpreadsheetGrid'
import type {
  SpreadsheetColumnMeta,
  SpreadsheetData,
  SpreadsheetRow,
} from './spreadsheetModel'

interface WorkbookSheet {
  id: string
  name: string
  data: SpreadsheetData
}

const columnHelper = createColumnHelper<
  typeof spreadsheetFeatures,
  SpreadsheetRow
>()

/**
 * An Excel-style merged cell region, anchored by ids rather than indexes so it
 * survives sorting: members that get sorted apart simply stop rendering as one
 * cell until they are adjacent again. The first row and column ids are the
 * anchor, whose value the merged cell displays. Underlying values of covered
 * cells are preserved, so unmerging restores them.
 */
export interface CellMerge {
  columnIds: Array<string>
  rowIds: Array<string>
}

type MergeLookup = Map<string, Map<string, CellMerge>>

function buildMergeLookup(merges: Array<CellMerge>): MergeLookup {
  const lookup: MergeLookup = new Map()
  for (const merge of merges) {
    for (const rowId of merge.rowIds) {
      let byColumn = lookup.get(rowId)
      if (!byColumn) lookup.set(rowId, (byColumn = new Map()))
      for (const columnId of merge.columnIds) {
        byColumn.set(columnId, merge)
      }
    }
  }
  return lookup
}

const fieldAwareIncludesStringFilter = constructFilterFn({
  ...filterFn_includesString,
  filter: (dataValue, filterValue, row, columnId, addMeta) =>
    row.original.kind === 'field-header' ||
    filterFn_includesString.filter(
      dataValue,
      filterValue,
      row,
      columnId,
      addMeta,
    ),
})

export function Spreadsheet() {
  const seedRef = React.useRef(7)
  const [spreadsheetData, setSpreadsheetData] = React.useState<SpreadsheetData>(
    () =>
      makeSpreadsheetData(
        DEFAULT_ROW_COUNT,
        DEFAULT_COLUMN_COUNT,
        seedRef.current,
      ),
  )
  const [sheets, setSheets] = React.useState<Array<WorkbookSheet>>(() => [
    { id: 'sheet-1', name: 'Sheet1', data: spreadsheetData },
  ])
  const [activeSheetId, setActiveSheetId] = React.useState('sheet-1')
  const [frozenRowCount, setFrozenRowCount] = React.useState(1)
  const [frozenColumnCount, setFrozenColumnCount] = React.useState(1)
  const [zoom, setZoom] = React.useState(100)
  const [ribbonTab, setRibbonTab] = React.useState<'home' | 'data' | 'view'>(
    'home',
  )

  const [merges, setMerges] = React.useState<Array<CellMerge>>([])
  const mergeLookup = React.useMemo(() => buildMergeLookup(merges), [merges])

  const columnIndexById = React.useMemo(
    () =>
      new Map(
        spreadsheetData.columns.map((column) => [column.id, column.index]),
      ),
    [spreadsheetData.columns],
  )
  const history = useSpreadsheetHistory(spreadsheetData.rows, columnIndexById)

  // Rebuilding the defs when `merges` changes is deliberate: the span index
  // memoizes on `options.columns` identity, so a new columns array is the
  // supported way to invalidate it from userland state.
  const columns = React.useMemo(
    () =>
      columnHelper.columns(
        spreadsheetData.columns.map((column) =>
          columnHelper.accessor((row) => row.cells[column.index] as unknown, {
            id: column.id,
            header: column.label,
            size: getInitialColumnSize(column),
            minSize: 72,
            filterFn: fieldAwareIncludesStringFilter,
            sortFn:
              column.initialType === 'number' ||
              column.initialType === 'boolean'
                ? 'basic'
                : column.initialType === 'date'
                  ? 'alphanumeric'
                  : 'text',
            meta: column,
            // Explicit Excel-style merges expressed through the value-run
            // hooks: a row joins the anchor's run when both belong to the same
            // stored merge. Frozen rows opt out, since they render in a
            // separate sticky region; frozen columns merge normally and the
            // core clamps any span at the frozen-region boundary.
            spanRows: ({ anchorRow, row, column: spanColumn }) => {
              if (anchorRow.getIsPinned() || row.getIsPinned()) return false
              const merge = mergeLookup.get(anchorRow.id)?.get(spanColumn.id)
              return (
                merge !== undefined &&
                merge.columnIds[0] === spanColumn.id &&
                merge === mergeLookup.get(row.id)?.get(spanColumn.id)
              )
            },
            spanColumns: ({ row, column: spanColumn }) => {
              if (row.getIsPinned()) return 1
              const merge = mergeLookup.get(row.id)?.get(spanColumn.id)
              return merge !== undefined && merge.columnIds[0] === spanColumn.id
                ? merge.columnIds.length
                : 1
            },
          }),
        ),
      ),
    [mergeLookup, spreadsheetData.columns],
  )

  const cellSelectionAtom = useCreateAtom<CellSelectionState>([])
  const table = useTable(
    {
      key: 'spreadsheet',
      features: spreadsheetFeatures,
      columns,
      data: history.rows,
      atoms: {
        cellSelection: cellSelectionAtom,
      },
      getRowId: (row) => row.id,
      enableCellSelection: true,
      autoResetCellSelection: false,
      columnResizeMode: 'onChange',
      keepPinnedRows: false,
    },
    (state) => ({
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnSizing: state.columnSizing,
      columnResizing: state.columnResizing,
      columnPinning: state.columnPinning,
      rowPinning: state.rowPinning,
    }),
  )

  React.useEffect(() => {
    const desiredTop = table
      .getRowModel()
      .rows.slice(0, frozenRowCount)
      .map((row) => row.id)
    const current = table.state.rowPinning

    if (!arraysEqual(current.top, desiredTop) || current.bottom.length > 0) {
      table.setRowPinning({ top: desiredTop, bottom: [] })
    }
  }, [
    frozenRowCount,
    history.rows,
    table,
    table.state.columnFilters,
    table.state.sorting,
  ])

  React.useEffect(() => {
    const desiredStart = table
      .getAllLeafColumns()
      .slice(0, frozenColumnCount)
      .map((column) => column.id)
    const current = table.state.columnPinning

    if (!arraysEqual(current.start, desiredStart) || current.end.length > 0) {
      table.setColumnPinning({ start: desiredStart, end: [] })
    }
  }, [
    frozenColumnCount,
    spreadsheetData.columns,
    table,
    table.state.columnPinning,
  ])

  const gridRef = React.useRef<SpreadsheetGridHandle>(null)
  const scrollToCell = React.useCallback(
    (rowId: string, columnId: string) =>
      gridRef.current?.scrollToCell(rowId, columnId),
    [],
  )
  const interactions = useGridInteractions({
    table,
    rows: history.rows,
    columns: spreadsheetData.columns,
    execute: history.execute,
    undo: history.undo,
    redo: history.redo,
    scrollToCell,
  })

  /**
   * Excel's Merge & Center toggle: when the selection touches any merge, the
   * button unmerges; otherwise a multi-cell rectangular selection merges.
   * Span-aware selection guarantees a touched merge is entirely inside the
   * selection, so intersecting merges can be removed wholesale.
   */
  const getMergeAction = React.useCallback(():
    | { type: 'merge'; merge: CellMerge }
    | { type: 'unmerge'; merges: Array<CellMerge> }
    | null => {
    const bounds = table.getCellSelectionBounds()
    if (bounds.length !== 1) return null

    const rowIds = table.getCellSelectionRowIds()
    const columnIds = table.getCellSelectionColumnIds()

    const intersected = new Set<CellMerge>()
    for (const rowId of rowIds) {
      const byColumn = mergeLookup.get(rowId)
      if (!byColumn) continue
      for (const columnId of columnIds) {
        const merge = byColumn.get(columnId)
        if (merge) intersected.add(merge)
      }
    }
    if (intersected.size) {
      return { type: 'unmerge', merges: [...intersected] }
    }

    // Frozen rows render in a separate sticky region and never merge; drop
    // them from the candidate rectangle. Columns may merge inside the frozen
    // region or inside the scrolling region, but a span cannot cross the
    // boundary between them, so a mixed selection cannot merge.
    const rowsById = table.getRowModel().rowsById
    const mergeRowIds = rowIds.filter(
      (rowId) => rowsById[rowId].getIsPinned() === false,
    )
    const columnRegions = new Set(
      columnIds.map(
        (columnId) => table.getColumn(columnId)?.getIsPinned() || 'center',
      ),
    )
    if (columnRegions.size > 1) return null
    if (mergeRowIds.length * columnIds.length < 2) return null

    return {
      type: 'merge',
      merge: { rowIds: mergeRowIds, columnIds },
    }
  }, [mergeLookup, table])

  const toggleMergeSelection = React.useCallback(() => {
    const action = getMergeAction()
    if (!action) return

    if (action.type === 'unmerge') {
      const removed = new Set(action.merges)
      setMerges((current) => current.filter((merge) => !removed.has(merge)))
      return
    }

    setMerges((current) => [...current, action.merge])
  }, [getMergeAction])

  const resetTableView = React.useCallback(() => {
    table.resetSorting(true)
    table.resetColumnFilters(true)
    table.resetColumnSizing(true)
    table.resetCellSelection(true)
  }, [table])

  const loadDataset = React.useCallback(
    (rowCount: number, columnCount: number) => {
      seedRef.current++
      const next = makeSpreadsheetData(rowCount, columnCount, seedRef.current)
      setSpreadsheetData(next)
      setMerges([])
      history.reset(next.rows)
      resetTableView()
      setFrozenRowCount(1)
      setFrozenColumnCount(1)
    },
    [history, resetTableView],
  )

  const persistActiveSheet = React.useCallback(
    (currentSheets: Array<WorkbookSheet>) =>
      currentSheets.map((sheet) =>
        sheet.id === activeSheetId
          ? {
              ...sheet,
              data: { ...spreadsheetData, rows: history.rows },
            }
          : sheet,
      ),
    [activeSheetId, history.rows, spreadsheetData],
  )

  const switchSheet = React.useCallback(
    (sheetId: string) => {
      if (sheetId === activeSheetId) return
      const target = sheets.find((sheet) => sheet.id === sheetId)
      if (!target) return

      setSheets(persistActiveSheet)
      setActiveSheetId(target.id)
      setSpreadsheetData(target.data)
      setMerges([])
      history.reset(target.data.rows)
      resetTableView()
    },
    [activeSheetId, history, persistActiveSheet, resetTableView, sheets],
  )

  const addSheet = React.useCallback(() => {
    seedRef.current++
    const number = sheets.length + 1
    const data = makeBlankSpreadsheetData(
      DEFAULT_ROW_COUNT,
      DEFAULT_COLUMN_COUNT,
      seedRef.current,
    )
    const sheet = {
      id: `sheet-${number}`,
      name: `Sheet${number}`,
      data,
    }

    setSheets((current) => [...persistActiveSheet(current), sheet])
    setActiveSheetId(sheet.id)
    setSpreadsheetData(data)
    setMerges([])
    history.reset(data.rows)
    resetTableView()
    setFrozenRowCount(1)
    setFrozenColumnCount(1)
  }, [history, persistActiveSheet, resetTableView, sheets.length])

  const activeSheetIndex = sheets.findIndex(
    (sheet) => sheet.id === activeSheetId,
  )

  return (
    <main className="spreadsheet-app">
      <div className="excel-chrome">
        <header className="excel-titlebar">
          <div className="quick-access" aria-label="Quick access">
            <button
              type="button"
              disabled={!history.canUndo}
              onClick={history.undo}
              title="Undo (Ctrl/Cmd+Z)"
              aria-label="Undo"
            >
              ↶
            </button>
            <button
              type="button"
              disabled={!history.canRedo}
              onClick={history.redo}
              title="Redo (Ctrl/Cmd+Y)"
              aria-label="Redo"
            >
              ↷
            </button>
          </div>
          <div className="excel-document-title">
            <span className="excel-logo" aria-hidden="true">
              X
            </span>
            <div>
              <h1>TanStack Sheet</h1>
              <p>Spreadsheet example</p>
            </div>
          </div>
          <div className="titlebar-actions" aria-hidden="true">
            <span>—</span>
            <span>□</span>
            <span>×</span>
          </div>
        </header>

        <div className="ribbon-tab-row" role="tablist" aria-label="Ribbon">
          <span className="file-tab">File</span>
          {(['home', 'data', 'view'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={ribbonTab === tab}
              className={ribbonTab === tab ? 'ribbon-tab-active' : undefined}
              onClick={() => setRibbonTab(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div
          className="spreadsheet-ribbon"
          role="toolbar"
          aria-label={`${ribbonTab} tools`}
        >
          {ribbonTab === 'home' ? (
            <>
              <div className="ribbon-group">
                <div className="ribbon-buttons">
                  <button
                    type="button"
                    className="ribbon-large-button"
                    onClick={() => void interactions.pasteFromClipboard()}
                  >
                    <span>▤</span> Paste
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={() => void interactions.cutToClipboard()}
                    >
                      ✂ Cut
                    </button>
                    <button
                      type="button"
                      onClick={() => void interactions.copyToClipboard()}
                    >
                      ▣ Copy
                    </button>
                  </div>
                </div>
                <small>Clipboard</small>
              </div>
              <div className="ribbon-group">
                <div className="ribbon-buttons">
                  <table.Subscribe source={table.atoms.cellSelection}>
                    {() => {
                      const action = getMergeAction()
                      return (
                        <button
                          type="button"
                          disabled={!action}
                          aria-pressed={action?.type === 'unmerge'}
                          title="Merge or unmerge the selected cells (Ctrl/Cmd+M)"
                          onClick={toggleMergeSelection}
                        >
                          ⧉{' '}
                          {action?.type === 'unmerge'
                            ? 'Unmerge cells'
                            : 'Merge & center'}
                        </button>
                      )
                    }}
                  </table.Subscribe>
                </div>
                <small>Alignment</small>
              </div>
              <div className="ribbon-group">
                <div className="ribbon-buttons">
                  <button type="button" onClick={interactions.clearSelection}>
                    ⌫ Clear contents
                  </button>
                  <button
                    type="button"
                    disabled={!table.state.columnFilters.length}
                    onClick={() => table.resetColumnFilters(true)}
                  >
                    ◌ Clear filters
                  </button>
                </div>
                <small>Editing</small>
              </div>
              <div className="ribbon-group">
                <div className="ribbon-buttons">
                  <button
                    type="button"
                    onClick={() =>
                      loadDataset(DEFAULT_ROW_COUNT, DEFAULT_COLUMN_COUNT)
                    }
                  >
                    Default data
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      loadDataset(STRESS_ROW_COUNT, STRESS_COLUMN_COUNT)
                    }
                  >
                    Stress data
                  </button>
                  <span className="dataset-size" aria-live="polite">
                    {history.rows.length.toLocaleString()} ×{' '}
                    {spreadsheetData.columns.length.toLocaleString()}
                  </span>
                </div>
                <small>Workbook</small>
              </div>
            </>
          ) : ribbonTab === 'data' ? (
            <>
              <div className="ribbon-group">
                <div className="ribbon-buttons">
                  <button type="button" disabled>
                    A→Z Sort
                  </button>
                  <button type="button" disabled>
                    Z→A Sort
                  </button>
                  <button
                    type="button"
                    disabled={!table.state.columnFilters.length}
                    onClick={() => table.resetColumnFilters(true)}
                  >
                    Clear filters
                  </button>
                </div>
                <small>Sort &amp; Filter · use column menus</small>
              </div>
              <div className="ribbon-group ribbon-note">
                Right-click a cell or open a column menu to sort and filter.
              </div>
            </>
          ) : (
            <>
              <div className="ribbon-group">
                <div className="ribbon-buttons ribbon-selects">
                  <label>
                    Freeze rows
                    <select
                      aria-label="Freeze rows"
                      value={frozenRowCount}
                      onChange={(event) =>
                        setFrozenRowCount(Number(event.target.value))
                      }
                    >
                      {[0, 1, 2, 3].map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Freeze columns
                    <select
                      aria-label="Freeze columns"
                      value={frozenColumnCount}
                      onChange={(event) =>
                        setFrozenColumnCount(Number(event.target.value))
                      }
                    >
                      {[0, 1, 2, 3].map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <small>Window</small>
              </div>
              <div className="ribbon-group ribbon-note">
                Frozen rows and columns stay anchored while the grid
                virtualizes.
              </div>
            </>
          )}
        </div>
      </div>

      <table.Subscribe source={table.atoms.cellSelection}>
        {() => {
          const active = interactions.getActiveRange()
          const activeValue = active
            ? formatCellValue(
                interactions.getValue(
                  active.anchorRowId,
                  active.anchorColumnId,
                ),
              )
            : ''
          return (
            <SpreadsheetFormulaBar
              key={
                active
                  ? `${active.anchorRowId}:${active.anchorColumnId}:${activeValue}`
                  : 'no-active-cell'
              }
              active={active}
              initialValue={activeValue}
              interactions={interactions}
            />
          )
        }}
      </table.Subscribe>

      <SpreadsheetGrid
        ref={gridRef}
        table={table}
        interactions={interactions}
        zoom={zoom}
        onToggleMerge={toggleMergeSelection}
      />

      <footer className="spreadsheet-footer">
        <div className="sheet-controls">
          <div className="sheet-navigation">
            <button
              type="button"
              aria-label="Previous sheet"
              disabled={activeSheetIndex <= 0}
              onClick={() => {
                const previous = sheets.at(activeSheetIndex - 1)
                if (previous) switchSheet(previous.id)
              }}
            >
              ◀
            </button>
            <button
              type="button"
              aria-label="Next sheet"
              disabled={
                activeSheetIndex < 0 || activeSheetIndex >= sheets.length - 1
              }
              onClick={() => {
                const next = sheets.at(activeSheetIndex + 1)
                if (next) switchSheet(next.id)
              }}
            >
              ▶
            </button>
          </div>
          <button
            type="button"
            className="add-sheet"
            aria-label="Add sheet"
            onClick={addSheet}
          >
            +
          </button>
          <div className="sheet-tabs" role="tablist" aria-label="Sheets">
            {sheets.map((sheet) => (
              <button
                key={sheet.id}
                type="button"
                role="tab"
                className={
                  sheet.id === activeSheetId
                    ? 'sheet-tab sheet-tab-active'
                    : 'sheet-tab'
                }
                aria-selected={sheet.id === activeSheetId}
                onClick={() => switchSheet(sheet.id)}
              >
                {sheet.name}
              </button>
            ))}
          </div>
          <span className="status-ready">Ready</span>
        </div>
        <table.Subscribe source={table.atoms.cellSelection}>
          {() => {
            const summary = interactions.getSelectionSummary()
            return (
              <div className="selection-summary" aria-live="polite">
                <span>{summary.count.toLocaleString()} selected</span>
                {summary.numericCount ? (
                  <>
                    <span>Count: {summary.numericCount.toLocaleString()}</span>
                    <span>Sum: {formatNumber(summary.sum)}</span>
                    <span>Average: {formatNumber(summary.average)}</span>
                  </>
                ) : null}
              </div>
            )
          }}
        </table.Subscribe>
        <div className="zoom-control">
          <button
            type="button"
            aria-label="Zoom out"
            disabled={zoom <= 25}
            onClick={() => setZoom((current) => Math.max(25, current - 10))}
          >
            −
          </button>
          <input
            type="range"
            min="25"
            max="200"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            aria-label="Zoom"
          />
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoom >= 200}
            onClick={() => setZoom((current) => Math.min(200, current + 10))}
          >
            +
          </button>
          <output>{zoom}%</output>
        </div>
      </footer>
    </main>
  )
}

function SpreadsheetFormulaBar({
  active,
  initialValue,
  interactions,
}: {
  active: CellSelectionState[number] | undefined
  initialValue: string
  interactions: ReturnType<typeof useGridInteractions>
}) {
  const [draft, setDraft] = React.useState(initialValue)

  const commit = React.useCallback(
    (move?: 'up' | 'down' | 'left' | 'right') => {
      if (!active) return
      interactions.commitCellValue(
        active.anchorRowId,
        active.anchorColumnId,
        draft,
        move,
      )
    },
    [active, draft, interactions],
  )

  return (
    <div className="value-bar">
      <output aria-label="Active range">
        {interactions.getRangeLabel() || '—'}
      </output>
      <span className="value-bar-icon" aria-hidden="true">
        fx
      </span>
      <input
        aria-label="Cell value"
        value={draft}
        disabled={!active}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            setDraft(initialValue)
            interactions.cancelEditing()
          } else if (event.key === 'Enter') {
            event.preventDefault()
            commit(event.shiftKey ? 'up' : 'down')
          } else if (event.key === 'Tab') {
            event.preventDefault()
            commit(event.shiftKey ? 'left' : 'right')
          }
        }}
        onBlur={() => commit()}
      />
    </div>
  )
}

function getInitialColumnSize(column: SpreadsheetColumnMeta) {
  if (column.initialType === 'boolean') return 92
  if (column.initialType === 'number') return 112
  if (column.initialType === 'date') return 124
  if (column.label === 'Notes') return 190
  return 144
}

function arraysEqual(
  left: ReadonlyArray<string>,
  right: ReadonlyArray<string>,
) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(value)
}
