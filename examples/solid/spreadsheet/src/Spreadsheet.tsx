import { createEffect, createMemo, createSignal } from 'solid-js'
import {
  constructFilterFn,
  createColumnHelper,
  createTable,
  filterFn_includesString,
} from '@tanstack/solid-table'
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
import { createGridInteractions } from './createGridInteractions'
import { createSpreadsheetHistory } from './createSpreadsheetHistory'
import type { CellSelectionState } from '@tanstack/solid-table'
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
  let seed = 7
  const [spreadsheetData, setSpreadsheetData] = createSignal<SpreadsheetData>(
    makeSpreadsheetData(DEFAULT_ROW_COUNT, DEFAULT_COLUMN_COUNT, seed),
  )
  const [sheets, setSheets] = createSignal<Array<WorkbookSheet>>([
    { id: 'sheet-1', name: 'Sheet1', data: spreadsheetData() },
  ])
  const [activeSheetId, setActiveSheetId] = createSignal('sheet-1')
  const [frozenRowCount, setFrozenRowCount] = createSignal(1)
  const [frozenColumnCount, setFrozenColumnCount] = createSignal(1)
  const [zoom, setZoom] = createSignal(100)
  const [ribbonTab, setRibbonTab] = createSignal<'home' | 'data' | 'view'>(
    'home',
  )

  const columnIndexById = createMemo(
    () =>
      new Map(
        spreadsheetData().columns.map((column) => [column.id, column.index]),
      ),
  )
  const history = createSpreadsheetHistory(
    spreadsheetData().rows,
    columnIndexById,
  )

  const columns = createMemo(() =>
    columnHelper.columns(
      spreadsheetData().columns.map((column) =>
        columnHelper.accessor((row) => row.cells[column.index] as unknown, {
          id: column.id,
          header: column.label,
          size: getInitialColumnSize(column),
          minSize: 72,
          filterFn: fieldAwareIncludesStringFilter,
          sortFn:
            column.initialType === 'number' || column.initialType === 'boolean'
              ? 'basic'
              : column.initialType === 'date'
                ? 'alphanumeric'
                : 'text',
          meta: column,
        }),
      ),
    ),
  )

  const table = createTable({
    key: 'spreadsheet',
    features: spreadsheetFeatures,
    get columns() {
      return columns()
    },
    get data() {
      return history.rows()
    },
    getRowId: (row) => row.id,
    enableCellSelection: true,
    autoResetCellSelection: false,
    columnResizeMode: 'onChange',
    keepPinnedRows: false,
  })

  createEffect(() => {
    const desiredTop = table
      .getRowModel()
      .rows.slice(0, frozenRowCount())
      .map((row) => row.id)
    const current = table.atoms.rowPinning.get()

    if (!arraysEqual(current.top, desiredTop) || current.bottom.length > 0) {
      table.setRowPinning({ top: desiredTop, bottom: [] })
    }
  })

  createEffect(() => {
    const desiredStart = table
      .getAllLeafColumns()
      .slice(0, frozenColumnCount())
      .map((column) => column.id)
    const current = table.atoms.columnPinning.get()

    if (!arraysEqual(current.start, desiredStart) || current.end.length > 0) {
      table.setColumnPinning({ start: desiredStart, end: [] })
    }
  })

  let gridRef: SpreadsheetGridHandle | undefined
  const scrollToCell = useCallback(
    (rowId: string, columnId: string) => gridRef?.scrollToCell(rowId, columnId),
    [],
  )
  const interactions = createGridInteractions({
    table,
    rows: history.rows,
    columns: () => spreadsheetData().columns,
    execute: history.execute,
    undo: history.undo,
    redo: history.redo,
    scrollToCell,
  })

  const resetTableView = useCallback(() => {
    table.resetSorting(true)
    table.resetColumnFilters(true)
    table.resetColumnSizing(true)
    table.resetCellSelection(true)
  }, [table])

  const loadDataset = useCallback(
    (rowCount: number, columnCount: number) => {
      seed++
      const next = makeSpreadsheetData(rowCount, columnCount, seed)
      setSpreadsheetData(next)
      history.reset(next.rows)
      resetTableView()
      setFrozenRowCount(1)
      setFrozenColumnCount(1)
    },
    [history, resetTableView],
  )

  const persistActiveSheet = useCallback(
    (currentSheets: Array<WorkbookSheet>) =>
      currentSheets.map((sheet) =>
        sheet.id === activeSheetId()
          ? {
              ...sheet,
              data: { ...spreadsheetData(), rows: history.rows() },
            }
          : sheet,
      ),
    [activeSheetId(), history.rows(), spreadsheetData()],
  )

  const switchSheet = useCallback(
    (sheetId: string) => {
      if (sheetId === activeSheetId()) return
      const target = sheets().find((sheet) => sheet.id === sheetId)
      if (!target) return

      setSheets(persistActiveSheet)
      setActiveSheetId(target.id)
      setSpreadsheetData(target.data)
      history.reset(target.data.rows)
      resetTableView()
    },
    [activeSheetId(), history, persistActiveSheet, resetTableView, sheets()],
  )

  const addSheet = useCallback(() => {
    seed++
    const number = sheets().length + 1
    const data = makeBlankSpreadsheetData(
      DEFAULT_ROW_COUNT,
      DEFAULT_COLUMN_COUNT,
      seed,
    )
    const sheet = {
      id: `sheet-${number}`,
      name: `Sheet${number}`,
      data,
    }

    setSheets((current) => [...persistActiveSheet(current), sheet])
    setActiveSheetId(sheet.id)
    setSpreadsheetData(data)
    history.reset(data.rows)
    resetTableView()
    setFrozenRowCount(1)
    setFrozenColumnCount(1)
  }, [history, persistActiveSheet, resetTableView, sheets().length])

  const activeSheetIndex = createMemo(() =>
    sheets().findIndex((sheet) => sheet.id === activeSheetId()),
  )

  return (
    <main class="spreadsheet-app">
      <div class="excel-chrome">
        <header class="excel-titlebar">
          <div class="quick-access" aria-label="Quick access">
            <button
              type="button"
              disabled={!history.canUndo()}
              onClick={history.undo}
              title="Undo (Ctrl/Cmd+Z)"
              aria-label="Undo"
            >
              ↶
            </button>
            <button
              type="button"
              disabled={!history.canRedo()}
              onClick={history.redo}
              title="Redo (Ctrl/Cmd+Y)"
              aria-label="Redo"
            >
              ↷
            </button>
          </div>
          <div class="excel-document-title">
            <span class="excel-logo" aria-hidden="true">
              X
            </span>
            <div>
              <h1>TanStack Sheet</h1>
              <p>Spreadsheet example</p>
            </div>
          </div>
          <div class="titlebar-actions" aria-hidden="true">
            <span>—</span>
            <span>□</span>
            <span>×</span>
          </div>
        </header>

        <div class="ribbon-tab-row" role="tablist" aria-label="Ribbon">
          <span class="file-tab">File</span>
          {(['home', 'data', 'view'] as const).map((tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={ribbonTab() === tab}
              class={ribbonTab() === tab ? 'ribbon-tab-active' : undefined}
              onClick={() => setRibbonTab(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div
          class="spreadsheet-ribbon"
          role="toolbar"
          aria-label={`${ribbonTab()} tools`}
        >
          {ribbonTab() === 'home' ? (
            <>
              <div class="ribbon-group">
                <div class="ribbon-buttons">
                  <button
                    type="button"
                    class="ribbon-large-button"
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
              <div class="ribbon-group">
                <div class="ribbon-buttons">
                  <button type="button" onClick={interactions.clearSelection}>
                    ⌫ Clear contents
                  </button>
                  <button
                    type="button"
                    disabled={!table.atoms.columnFilters.get().length}
                    onClick={() => table.resetColumnFilters(true)}
                  >
                    ◌ Clear filters
                  </button>
                </div>
                <small>Editing</small>
              </div>
              <div class="ribbon-group">
                <div class="ribbon-buttons">
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
                  <span class="dataset-size" aria-live="polite">
                    {history.rows().length.toLocaleString()} ×{' '}
                    {spreadsheetData().columns.length.toLocaleString()}
                  </span>
                </div>
                <small>Workbook</small>
              </div>
            </>
          ) : ribbonTab() === 'data' ? (
            <>
              <div class="ribbon-group">
                <div class="ribbon-buttons">
                  <button type="button" disabled>
                    A→Z Sort
                  </button>
                  <button type="button" disabled>
                    Z→A Sort
                  </button>
                  <button
                    type="button"
                    disabled={!table.atoms.columnFilters.get().length}
                    onClick={() => table.resetColumnFilters(true)}
                  >
                    Clear filters
                  </button>
                </div>
                <small>Sort &amp; Filter · use column menus</small>
              </div>
              <div class="ribbon-group ribbon-note">
                Right-click a cell or open a column menu to sort and filter.
              </div>
            </>
          ) : (
            <>
              <div class="ribbon-group">
                <div class="ribbon-buttons ribbon-selects">
                  <label>
                    Freeze rows
                    <select
                      aria-label="Freeze rows"
                      value={frozenRowCount()}
                      onChange={(event) =>
                        setFrozenRowCount(Number(event.currentTarget.value))
                      }
                    >
                      {[0, 1, 2, 3].map((count) => (
                        <option value={count}>{count}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Freeze columns
                    <select
                      aria-label="Freeze columns"
                      value={frozenColumnCount()}
                      onChange={(event) =>
                        setFrozenColumnCount(Number(event.currentTarget.value))
                      }
                    >
                      {[0, 1, 2, 3].map((count) => (
                        <option value={count}>{count}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <small>Window</small>
              </div>
              <div class="ribbon-group ribbon-note">
                Frozen rows and columns stay anchored while the grid
                virtualizes.
              </div>
            </>
          )}
        </div>
      </div>

      <table.Subscribe>
        {(atoms) => {
          const active = () => atoms.cellSelection.get().at(-1)
          const activeValue = () => {
            const current = active()
            return current
              ? formatCellValue(
                  interactions.getValue(
                    current.anchorRowId,
                    current.anchorColumnId,
                  ),
                )
              : ''
          }
          return (
            <SpreadsheetFormulaBar
              active={active}
              initialValue={activeValue}
              interactions={interactions}
            />
          )
        }}
      </table.Subscribe>

      <SpreadsheetGrid
        onReady={(handle) => (gridRef = handle)}
        table={table}
        interactions={interactions}
        zoom={zoom()}
      />

      <footer class="spreadsheet-footer">
        <div class="sheet-controls">
          <div class="sheet-navigation">
            <button
              type="button"
              aria-label="Previous sheet"
              disabled={activeSheetIndex() <= 0}
              onClick={() => {
                const previous = sheets().at(activeSheetIndex() - 1)
                if (previous) switchSheet(previous.id)
              }}
            >
              ◀
            </button>
            <button
              type="button"
              aria-label="Next sheet"
              disabled={
                activeSheetIndex() < 0 ||
                activeSheetIndex() >= sheets().length - 1
              }
              onClick={() => {
                const next = sheets().at(activeSheetIndex() + 1)
                if (next) switchSheet(next.id)
              }}
            >
              ▶
            </button>
          </div>
          <button
            type="button"
            class="add-sheet"
            aria-label="Add sheet"
            onClick={addSheet}
          >
            +
          </button>
          <div class="sheet-tabs" role="tablist" aria-label="Sheets">
            {sheets().map((sheet) => (
              <button
                type="button"
                role="tab"
                class={
                  sheet.id === activeSheetId()
                    ? 'sheet-tab sheet-tab-active'
                    : 'sheet-tab'
                }
                aria-selected={sheet.id === activeSheetId()}
                onClick={() => switchSheet(sheet.id)}
              >
                {sheet.name}
              </button>
            ))}
          </div>
          <span class="status-ready">Ready</span>
        </div>
        <table.Subscribe>
          {(atoms) => {
            const summary = () => {
              void atoms.cellSelection.get()
              return interactions.getSelectionSummary()
            }
            return (
              <div class="selection-summary" aria-live="polite">
                <span>{summary().count.toLocaleString()} selected</span>
                {summary().numericCount ? (
                  <>
                    <span>
                      Count: {summary().numericCount.toLocaleString()}
                    </span>
                    <span>Sum: {formatNumber(summary().sum)}</span>
                    <span>Average: {formatNumber(summary().average)}</span>
                  </>
                ) : null}
              </div>
            )
          }}
        </table.Subscribe>
        <div class="zoom-control">
          <button
            type="button"
            aria-label="Zoom out"
            disabled={zoom() <= 25}
            onClick={() => setZoom((current) => Math.max(25, current - 10))}
          >
            −
          </button>
          <input
            type="range"
            min="25"
            max="200"
            value={zoom()}
            onInput={(event) => setZoom(Number(event.currentTarget.value))}
            aria-label="Zoom"
          />
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoom() >= 200}
            onClick={() => setZoom((current) => Math.min(200, current + 10))}
          >
            +
          </button>
          <output>{zoom()}%</output>
        </div>
      </footer>
    </main>
  )
}

function SpreadsheetFormulaBar(props: {
  active: () => CellSelectionState[number] | undefined
  initialValue: () => string
  interactions: ReturnType<typeof createGridInteractions>
}) {
  const [draft, setDraft] = createSignal(props.initialValue())
  createEffect(() => setDraft(props.initialValue()))

  const commit = useCallback(
    (move?: 'up' | 'down' | 'left' | 'right') => {
      const active = props.active()
      if (!active) return
      props.interactions.commitCellValue(
        active.anchorRowId,
        active.anchorColumnId,
        draft(),
        move,
      )
    },
    [props.active, draft, props.interactions],
  )

  return (
    <div class="value-bar">
      <output aria-label="Active range">
        {props.interactions.getRangeLabel() || '—'}
      </output>
      <span class="value-bar-icon" aria-hidden="true">
        fx
      </span>
      <input
        aria-label="Cell value"
        value={draft()}
        disabled={!props.active()}
        onInput={(event) => setDraft(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            setDraft(props.initialValue())
            props.interactions.cancelEditing()
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

function useCallback<TArgs extends Array<unknown>, TResult>(
  callback: (...args: TArgs) => TResult,
  _dependencies?: Array<unknown>,
): (...args: TArgs) => TResult {
  return callback
}
