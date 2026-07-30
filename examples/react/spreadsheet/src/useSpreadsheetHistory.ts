import React from 'react'
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

type HistoryAction =
  | { type: 'execute'; command: SpreadsheetCommand }
  | { type: 'reset'; rows: Array<SpreadsheetRow> }
  | { type: 'undo' }
  | { type: 'redo' }

const HISTORY_LIMIT = 100

export function useSpreadsheetHistory(
  initialRows: Array<SpreadsheetRow>,
  columnIndexById: ReadonlyMap<string, number>,
) {
  const reducer = React.useCallback(
    (state: HistoryState, action: HistoryAction): HistoryState => {
      const rowIndexById = new Map(
        state.rows.map((row, index) => [row.id, index]),
      )

      if (action.type === 'reset') {
        return { rows: action.rows, past: [], future: [] }
      }

      if (action.type === 'execute') {
        if (!action.command.patches.length) return state
        return {
          rows: applyPatches(
            state.rows,
            action.command.patches,
            'after',
            rowIndexById,
            columnIndexById,
          ),
          past: [...state.past, action.command].slice(-HISTORY_LIMIT),
          future: [],
        }
      }

      if (action.type === 'undo') {
        const command = state.past.at(-1)
        if (!command) return state
        return {
          rows: applyPatches(
            state.rows,
            command.patches,
            'before',
            rowIndexById,
            columnIndexById,
          ),
          past: state.past.slice(0, -1),
          future: [command, ...state.future],
        }
      }

      const command = state.future.at(0)
      if (!command) return state
      return {
        rows: applyPatches(
          state.rows,
          command.patches,
          'after',
          rowIndexById,
          columnIndexById,
        ),
        past: [...state.past, command].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
      }
    },
    [columnIndexById],
  )

  const [state, dispatch] = React.useReducer(reducer, {
    rows: initialRows,
    past: [],
    future: [],
  })

  const execute = React.useCallback(
    (label: string, patches: Array<CellPatch>) => {
      dispatch({ type: 'execute', command: { label, patches } })
    },
    [],
  )

  const reset = React.useCallback((rows: Array<SpreadsheetRow>) => {
    dispatch({ type: 'reset', rows })
  }, [])

  return {
    rows: state.rows,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    lastCommand: state.past[state.past.length - 1]?.label,
    execute,
    reset,
    undo: React.useCallback(() => dispatch({ type: 'undo' }), []),
    redo: React.useCallback(() => dispatch({ type: 'redo' }), []),
  }
}

function applyPatches(
  rows: Array<SpreadsheetRow>,
  patches: Array<CellPatch>,
  value: 'before' | 'after',
  rowIndexById: ReadonlyMap<string, number>,
  columnIndexById: ReadonlyMap<string, number>,
) {
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
