import type { JSX } from 'solid-js'

export type CellDirection = 'up' | 'down' | 'left' | 'right'

interface RowSelectionTable {
  resetRowSelection: (defaultState?: boolean) => void
}

interface SelectableRow {
  getIsSelected: () => boolean
  getToggleSelectedHandler: (options?: {
    selectChildren?: boolean
  }) => (event: unknown) => void
}

interface SelectableGridCell {
  row: SelectableGridRow
  getSelectionStartHandler: (
    contextDocument?: Document,
  ) => (event: unknown) => void
  getSelectionExtendHandler: () => (event: unknown) => void
}

interface SelectableGridRow extends SelectableRow {
  original: { symbol: string }
  getAllCellsByColumnId: () => Record<string, SelectableGridCell>
}

interface TradingGridTable extends RowSelectionTable {
  getRowModel: () => {
    rowsById: Record<string, SelectableGridRow>
  }
}

interface SelectionCellTarget {
  element: HTMLTableCellElement
  cell: SelectableGridCell
}

interface CellNavigationTable {
  extendCellSelection: (direction: CellDirection) => void
  moveCellSelection: (direction: CellDirection) => void
  resetCellSelection: (defaultState?: boolean) => void
  selectAllCells: () => void
}

const keyDirections: Partial<Record<string, CellDirection>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

export function reorderColumnIds(
  columnIds: Array<string>,
  sourceId: string,
  targetId: string,
): Array<string> {
  if (sourceId === targetId || !columnIds.includes(sourceId)) return columnIds

  const withoutSource = columnIds.filter((id) => id !== sourceId)
  const targetIndex = withoutSource.indexOf(targetId)
  if (targetIndex < 0) return columnIds

  return [
    ...withoutSource.slice(0, targetIndex),
    sourceId,
    ...withoutSource.slice(targetIndex),
  ]
}

export function selectRowFromPointer(
  table: RowSelectionTable,
  row: SelectableRow,
  event: MouseEvent,
): void {
  const additive = event.ctrlKey || event.metaKey
  const checked = additive ? !row.getIsSelected() : true

  if (!event.shiftKey && !additive) table.resetRowSelection(true)

  row.getToggleSelectedHandler({ selectChildren: false })({
    target: { checked },
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
  })
}

/**
 * Creates the only pointer listeners used by the table body. Cells expose just
 * identity data; delegated events resolve the current TanStack cell on demand.
 */
export function createTradingGridSelectionHandlers(
  table: TradingGridTable,
  selectSymbol: (symbol: string) => void,
) {
  const runtime = { lastCell: null as HTMLTableCellElement | null }

  return {
    onMouseDown(event) {
      if (event.button !== 0) return

      const target = findCellTarget(table, event.composedPath())
      if (!target) return

      runtime.lastCell = target.element
      selectSymbol(target.cell.row.original.symbol)
      target.cell.getSelectionStartHandler(target.element.ownerDocument)(event)
    },
    onMouseOver(event) {
      if ((event.buttons & 1) === 0) {
        runtime.lastCell = null
        return
      }

      const target = findCellTarget(table, event.composedPath())
      if (!target || target.element === runtime.lastCell) return

      runtime.lastCell = target.element
      target.cell.getSelectionExtendHandler()(event)
    },
    onMouseLeave() {
      runtime.lastCell = null
    },
    onClick(event) {
      const target = findCellTarget(table, event.composedPath())
      if (!target) return
      selectRowFromPointer(table, target.cell.row, event)
    },
  } satisfies Pick<
    JSX.IntrinsicElements['tbody'],
    'onMouseDown' | 'onMouseOver' | 'onMouseLeave' | 'onClick'
  >
}

function findCellTarget(
  table: TradingGridTable,
  path: Array<EventTarget>,
): SelectionCellTarget | null {
  for (const target of path) {
    if (!(target instanceof HTMLTableCellElement)) continue

    const columnId = target.dataset['columnId']
    const rowId =
      target.closest<HTMLTableRowElement>('tr[data-row-id]')?.dataset['rowId']
    if (!columnId || !rowId) return null

    const row = table.getRowModel().rowsById[rowId]
    const cell = row.getAllCellsByColumnId()[columnId]
    return { element: target, cell }
  }

  return null
}

export function handleCellNavigation(
  table: CellNavigationTable,
  event: KeyboardEvent,
): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    table.resetCellSelection(true)
    return
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
    event.preventDefault()
    table.selectAllCells()
    return
  }

  const direction = keyDirections[event.key]
  if (!direction) return

  event.preventDefault()
  if (event.shiftKey) table.extendCellSelection(direction)
  else table.moveCellSelection(direction)
}

export function sortIndicator(direction: false | 'asc' | 'desc'): string {
  if (direction === 'asc') return '↑'
  if (direction === 'desc') return '↓'
  return '↕'
}

export function sortAriaValue(
  direction: false | 'asc' | 'desc',
): 'ascending' | 'descending' | 'none' {
  if (direction === 'asc') return 'ascending'
  if (direction === 'desc') return 'descending'
  return 'none'
}
