import { onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import type {
  SpreadsheetTable,
  SpreadsheetTableColumn,
} from './spreadsheetTable'

interface Props {
  anchorRect: DOMRect
  column: SpreadsheetTableColumn
  table: SpreadsheetTable
  onClose: () => void
}

export function ColumnMenu(props: Props) {
  let menuRef: HTMLDivElement | undefined
  onMount(() => {
    const pointer = (event: PointerEvent) => {
      if (!menuRef?.contains(event.target as Node)) props.onClose()
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') props.onClose()
    }
    document.addEventListener('pointerdown', pointer)
    document.addEventListener('keydown', key)
    onCleanup(() => {
      document.removeEventListener('pointerdown', pointer)
      document.removeEventListener('keydown', key)
    })
  })
  const filterValue = () => String(props.column.getFilterValue() ?? '')
  const left = () => Math.min(props.anchorRect.left, window.innerWidth - 286)
  return (
    <Portal>
      <div
        ref={menuRef}
        class="column-menu"
        role="dialog"
        aria-label={`Column ${props.column.columnDef.meta?.letter ?? props.column.id} options`}
        style={{
          left: `${Math.max(8, left())}px`,
          top: `${Math.min(props.anchorRect.bottom + 4, window.innerHeight - 250)}px`,
        }}
      >
        <div class="column-menu-title">
          <span>{props.column.columnDef.meta?.letter}</span>
          <strong>{props.column.columnDef.meta?.label}</strong>
        </div>
        <button
          type="button"
          onClick={() => {
            props.table.setSorting([{ id: props.column.id, desc: false }])
            props.onClose()
          }}
        >
          Sort A → Z
        </button>
        <button
          type="button"
          onClick={() => {
            props.table.setSorting([{ id: props.column.id, desc: true }])
            props.onClose()
          }}
        >
          Sort Z → A
        </button>
        <button
          type="button"
          disabled={!props.column.getIsSorted()}
          onClick={() => {
            props.column.clearSorting()
            props.onClose()
          }}
        >
          Clear sort
        </button>
        <div class="column-menu-separator" />
        <label>
          Filter values containing
          <input
            autofocus
            value={filterValue()}
            onInput={(event) =>
              props.column.setFilterValue(event.currentTarget.value)
            }
            placeholder="Type to filter…"
          />
        </label>
        <button
          type="button"
          disabled={!filterValue()}
          onClick={() => props.column.setFilterValue(undefined)}
        >
          Clear this filter
        </button>
      </div>
    </Portal>
  )
}
