import { createMemo, createSignal } from 'solid-js'
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
  const [state, setState] = createSignal<HistoryState>({
    rows: initialRows,
    past: [],
    future: [],
  })

  const execute = (label: string, patches: Array<CellPatch>) => {
    if (!patches.length) return
    setState((current) => ({
      rows: applyPatches(current.rows, patches, 'after', columnIndexById()),
      past: [...current.past, { label, patches }].slice(-HISTORY_LIMIT),
      future: [],
    }))
  }

  const reset = (rows: Array<SpreadsheetRow>) =>
    setState({ rows, past: [], future: [] })

  const undo = () => {
    setState((current) => {
      const command = current.past.at(-1)
      if (!command) return current
      return {
        rows: applyPatches(
          current.rows,
          command.patches,
          'before',
          columnIndexById(),
        ),
        past: current.past.slice(0, -1),
        future: [command, ...current.future],
      }
    })
  }

  const redo = () => {
    setState((current) => {
      const command = current.future.at(0)
      if (!command) return current
      return {
        rows: applyPatches(
          current.rows,
          command.patches,
          'after',
          columnIndexById(),
        ),
        past: [...current.past, command].slice(-HISTORY_LIMIT),
        future: current.future.slice(1),
      }
    })
  }

  return {
    rows: createMemo(() => state().rows),
    canUndo: createMemo(() => state().past.length > 0),
    canRedo: createMemo(() => state().future.length > 0),
    lastCommand: createMemo(() => state().past.at(-1)?.label),
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
