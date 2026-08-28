import { createSignal } from 'solid-js'
import { reorderColumnIds } from './table-interactions'
import type { JSX } from 'solid-js'
import type { TradingTableInstance } from './trading-table-features'

export function createColumnDrag(table: TradingTableInstance) {
  const [sourceColumnId, setSourceColumnId] = createSignal<string | null>(null)
  const [targetColumnId, setTargetColumnId] = createSignal<string | null>(null)

  const clear = (): void => {
    setSourceColumnId(null)
    setTargetColumnId(null)
  }

  const createDropZoneProps = (
    columnId: string,
  ): Pick<JSX.IntrinsicElements['div'], 'onDragOver' | 'onDrop'> => ({
    onDragOver(event) {
      event.preventDefault()
      setTargetColumnId(sourceColumnId() === columnId ? null : columnId)
    },
    onDrop(event) {
      event.preventDefault()
      const sourceId =
        event.dataTransfer?.getData('text/plain') || sourceColumnId()
      if (sourceId) {
        table.setColumnOrder(
          reorderColumnIds(
            table.getVisibleLeafColumns().map((column) => column.id),
            sourceId,
            columnId,
          ),
        )
      }
      clear()
    },
  })

  const createHandleProps = (
    columnId: string,
  ): Pick<
    JSX.IntrinsicElements['button'],
    'draggable' | 'aria-label' | 'onDragStart' | 'onDragEnd'
  > => ({
    draggable: true,
    'aria-label': `Move ${columnId} column`,
    onDragStart(event) {
      setSourceColumnId(columnId)
      const dataTransfer = event.dataTransfer
      if (!dataTransfer) return

      dataTransfer.effectAllowed = 'move'
      dataTransfer.setData('text/plain', columnId)
    },
    onDragEnd: clear,
  })

  return {
    createDropZoneProps,
    createHandleProps,
    isDragging: (columnId: string) => sourceColumnId() === columnId,
    isDropTarget: (columnId: string) => targetColumnId() === columnId,
  }
}

export type ColumnDrag = ReturnType<typeof createColumnDrag>
