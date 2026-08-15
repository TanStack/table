import { signal } from '@angular/core'

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

interface CellNavigationTable {
  extendCellSelection: (direction: CellDirection) => void
  moveCellSelection: (direction: CellDirection) => void
  resetCellSelection: (defaultState?: boolean) => void
  selectAllCells: () => void
}

export interface ColumnOrderTable {
  getVisibleLeafColumns: () => Array<{ id: string }>
  setColumnOrder: (columnIds: Array<string>) => void
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

export class TradingTableInteractionController {
  readonly draggedColumnId = signal<string | null>(null)
  readonly dropTargetColumnId = signal<string | null>(null)

  startColumnDrag(event: DragEvent, columnId: string): void {
    this.draggedColumnId.set(columnId)
    event.dataTransfer?.setData('text/plain', columnId)
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  }

  dragOverColumn(event: DragEvent, targetId: string): void {
    event.preventDefault()
    if (targetId === this.draggedColumnId()) {
      this.dropTargetColumnId.set(null)
      return
    }
    this.dropTargetColumnId.set(targetId)
  }

  dropColumn(
    table: ColumnOrderTable,
    event: DragEvent,
    targetId: string,
  ): void {
    event.preventDefault()
    const sourceId =
      event.dataTransfer?.getData('text/plain') || this.draggedColumnId()
    if (!sourceId) {
      this.clearColumnDrag()
      return
    }

    table.setColumnOrder(
      reorderColumnIds(
        table.getVisibleLeafColumns().map((column) => column.id),
        sourceId,
        targetId,
      ),
    )
    this.clearColumnDrag()
  }

  endColumnDrag(): void {
    this.clearColumnDrag()
  }

  private clearColumnDrag(): void {
    this.draggedColumnId.set(null)
    this.dropTargetColumnId.set(null)
  }

  selectRow(
    table: RowSelectionTable,
    row: SelectableRow,
    event: MouseEvent,
  ): void {
    selectRowFromPointer(table, row, event)
  }

  navigateCells(table: CellNavigationTable, event: KeyboardEvent): void {
    handleCellNavigation(table, event)
  }

  sortIndicator(direction: false | 'asc' | 'desc'): string {
    return sortIndicator(direction)
  }

  sortAriaValue(
    direction: false | 'asc' | 'desc',
  ): 'ascending' | 'descending' | 'none' {
    return sortAriaValue(direction)
  }
}
