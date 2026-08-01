import type {
  CellPatch,
  SpreadsheetCommand,
  SpreadsheetRow,
} from './spreadsheetModel'

interface HistoryState {
  rows: Array<SpreadsheetRow>
  past: Array<SpreadsheetCommand>
  future: Array<SpreadsheetCommand>
}

const HISTORY_LIMIT = 100

export function createSpreadsheetHistory(
  initialRows: Array<SpreadsheetRow>,
  columnIndexById: () => ReadonlyMap<string, number>,
) {
  let state = $state<HistoryState>({ rows: initialRows, past: [], future: [] })

  const execute = (label: string, patches: Array<CellPatch>) => {
    if (!patches.length) return
    state = {
      rows: applyPatches(state.rows, patches, 'after', columnIndexById()),
      past: [...state.past, { label, patches }].slice(-HISTORY_LIMIT),
      future: [],
    }
  }
  const reset = (rows: Array<SpreadsheetRow>) => {
    state = { rows, past: [], future: [] }
  }
  const undo = () => {
    const command = state.past.at(-1)
    if (!command) return
    state = {
      rows: applyPatches(
        state.rows,
        command.patches,
        'before',
        columnIndexById(),
      ),
      past: state.past.slice(0, -1),
      future: [command, ...state.future],
    }
  }
  const redo = () => {
    const command = state.future.at(0)
    if (!command) return
    state = {
      rows: applyPatches(
        state.rows,
        command.patches,
        'after',
        columnIndexById(),
      ),
      past: [...state.past, command].slice(-HISTORY_LIMIT),
      future: state.future.slice(1),
    }
  }

  return {
    get rows() {
      return state.rows
    },
    get canUndo() {
      return state.past.length > 0
    },
    get canRedo() {
      return state.future.length > 0
    },
    get lastCommand() {
      return state.past.at(-1)?.label
    },
    execute,
    reset,
    undo,
    redo,
  }
}

function applyPatches(
  rows: Array<SpreadsheetRow>,
  patches: Array<CellPatch>,
  value: 'before' | 'after',
  columnIndexById: ReadonlyMap<string, number>,
) {
  const rowIndexById = new Map(rows.map((row, index) => [row.id, index]))
  const nextRows = rows.slice()
  const clonedRows = new Map<number, SpreadsheetRow>()
  for (const patch of patches) {
    const rowIndex = rowIndexById.get(patch.rowId)
    const columnIndex = columnIndexById.get(patch.columnId)
    if (rowIndex == null || columnIndex == null) continue
    let row = clonedRows.get(rowIndex)
    if (!row) {
      const current = rows.at(rowIndex)
      if (!current) continue
      row = { ...current, cells: current.cells.slice() }
      clonedRows.set(rowIndex, row)
      nextRows[rowIndex] = row
    }
    row.cells[columnIndex] = patch[value]
  }
  return nextRows
}
