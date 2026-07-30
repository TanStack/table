import React from 'react'
import { createPortal } from 'react-dom'
import type { GridInteractions } from './useGridInteractions'
import type {
  SpreadsheetTable,
  SpreadsheetTableColumn,
} from './spreadsheetTable'

interface CellContextMenuProps {
  x: number
  y: number
  column: SpreadsheetTableColumn
  table: SpreadsheetTable
  interactions: GridInteractions
  onClose: () => void
}

export function CellContextMenu({
  x,
  y,
  column,
  table,
  interactions,
  onClose,
}: CellContextMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const run = (action: () => void | Promise<void>) => {
    onClose()
    void action()
  }

  return createPortal(
    <div
      ref={menuRef}
      className="cell-context-menu"
      role="menu"
      aria-label="Cell actions"
      style={{
        left: Math.min(x, window.innerWidth - 218),
        top: Math.min(y, window.innerHeight - 286),
      }}
    >
      <button
        type="button"
        role="menuitem"
        onClick={() => run(interactions.cutToClipboard)}
      >
        <span>✂</span> Cut <kbd>Ctrl+X</kbd>
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() => run(interactions.copyToClipboard)}
      >
        <span>▣</span> Copy <kbd>Ctrl+C</kbd>
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() => run(interactions.pasteFromClipboard)}
      >
        <span>▤</span> Paste <kbd>Ctrl+V</kbd>
      </button>
      <div className="menu-rule" />
      <button
        type="button"
        role="menuitem"
        onClick={() => run(interactions.clearSelection)}
      >
        <span>⌫</span> Clear contents
      </button>
      <div className="menu-rule" />
      <button
        type="button"
        role="menuitem"
        onClick={() =>
          run(() => table.setSorting([{ id: column.id, desc: false }]))
        }
      >
        <span>↑</span> Sort ascending
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() =>
          run(() => table.setSorting([{ id: column.id, desc: true }]))
        }
      >
        <span>↓</span> Sort descending
      </button>
    </div>,
    document.body,
  )
}
