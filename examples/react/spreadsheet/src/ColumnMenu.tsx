import React from 'react'
import { createPortal } from 'react-dom'
import type {
  SpreadsheetTable,
  SpreadsheetTableColumn,
} from './spreadsheetTable'

interface ColumnMenuProps {
  anchorRect: DOMRect
  column: SpreadsheetTableColumn
  table: SpreadsheetTable
  onClose: () => void
}

export function ColumnMenu({
  anchorRect,
  column,
  table,
  onClose,
}: ColumnMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null)
  const filterValue = String(column.getFilterValue() ?? '')
  const left = Math.min(anchorRect.left, window.innerWidth - 286)

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

  return createPortal(
    <div
      ref={menuRef}
      className="column-menu"
      role="dialog"
      aria-label={`Column ${column.columnDef.meta?.letter ?? column.id} options`}
      style={{
        left: Math.max(8, left),
        top: Math.min(anchorRect.bottom + 4, window.innerHeight - 250),
      }}
    >
      <div className="column-menu-title">
        <span>{column.columnDef.meta?.letter}</span>
        <strong>{column.columnDef.meta?.label}</strong>
      </div>
      <button
        type="button"
        onClick={() => {
          table.setSorting([{ id: column.id, desc: false }])
          onClose()
        }}
      >
        Sort A → Z
      </button>
      <button
        type="button"
        onClick={() => {
          table.setSorting([{ id: column.id, desc: true }])
          onClose()
        }}
      >
        Sort Z → A
      </button>
      <button
        type="button"
        disabled={!column.getIsSorted()}
        onClick={() => {
          column.clearSorting()
          onClose()
        }}
      >
        Clear sort
      </button>
      <div className="column-menu-separator" />
      <label>
        Filter values containing
        <input
          autoFocus
          value={filterValue}
          onChange={(event) => column.setFilterValue(event.target.value)}
          placeholder="Type to filter…"
        />
      </label>
      <button
        type="button"
        disabled={!filterValue}
        onClick={() => column.setFilterValue(undefined)}
      >
        Clear this filter
      </button>
    </div>,
    document.body,
  )
}
