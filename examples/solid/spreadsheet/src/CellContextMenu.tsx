import { onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import type { GridInteractions } from './createGridInteractions'
import type {
  SpreadsheetTable,
  SpreadsheetTableColumn,
} from './spreadsheetTable'

interface Props {
  x: number
  y: number
  column: SpreadsheetTableColumn
  table: SpreadsheetTable
  interactions: GridInteractions
  onClose: () => void
}

export function CellContextMenu(props: Props) {
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
  const run = (action: () => void | Promise<void>) => {
    props.onClose()
    void action()
  }
  return (
    <Portal>
      <div
        ref={menuRef}
        class="cell-context-menu"
        role="menu"
        aria-label="Cell actions"
        style={{
          left: `${Math.min(props.x, window.innerWidth - 218)}px`,
          top: `${Math.min(props.y, window.innerHeight - 286)}px`,
        }}
      >
        <button
          type="button"
          role="menuitem"
          onClick={() => run(props.interactions.cutToClipboard)}
        >
          <span>✂</span> Cut <kbd>Ctrl+X</kbd>
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => run(props.interactions.copyToClipboard)}
        >
          <span>▣</span> Copy <kbd>Ctrl+C</kbd>
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => run(props.interactions.pasteFromClipboard)}
        >
          <span>▤</span> Paste <kbd>Ctrl+V</kbd>
        </button>
        <div class="menu-rule" />
        <button
          type="button"
          role="menuitem"
          onClick={() => run(props.interactions.clearSelection)}
        >
          <span>⌫</span> Clear contents
        </button>
        <div class="menu-rule" />
        <button
          type="button"
          role="menuitem"
          onClick={() =>
            run(() =>
              props.table.setSorting([{ id: props.column.id, desc: false }]),
            )
          }
        >
          <span>↑</span> Sort ascending
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() =>
            run(() =>
              props.table.setSorting([{ id: props.column.id, desc: true }]),
            )
          }
        >
          <span>↓</span> Sort descending
        </button>
      </div>
    </Portal>
  )
}
