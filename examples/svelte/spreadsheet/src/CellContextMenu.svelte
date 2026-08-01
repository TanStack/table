<script lang="ts">
  import { onMount } from 'svelte'
  import type { GridInteractions } from './createGridInteractions.svelte'
  import type { SpreadsheetTable, SpreadsheetTableColumn } from './spreadsheetTable'

  let { x, y, column, table, interactions, onClose }: {
    x: number
    y: number
    column: SpreadsheetTableColumn
    table: SpreadsheetTable
    interactions: GridInteractions
    onClose: () => void
  } = $props()
  let menuRef: HTMLDivElement
  onMount(() => {
    const pointer = (event: PointerEvent) => {
      if (!menuRef?.contains(event.target as Node)) onClose()
    }
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('pointerdown', pointer)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', pointer)
      document.removeEventListener('keydown', key)
    }
  })
  const run = (action: () => void | Promise<void>) => { onClose(); void action() }
</script>

<div bind:this={menuRef} class="cell-context-menu" role="menu" aria-label="Cell actions" style:left={`${Math.min(x, innerWidth - 218)}px`} style:top={`${Math.min(y, innerHeight - 286)}px`}>
    <button type="button" role="menuitem" onclick={() => run(interactions.cutToClipboard)}><span>✂</span> Cut <kbd>Ctrl+X</kbd></button>
    <button type="button" role="menuitem" onclick={() => run(interactions.copyToClipboard)}><span>▣</span> Copy <kbd>Ctrl+C</kbd></button>
    <button type="button" role="menuitem" onclick={() => run(interactions.pasteFromClipboard)}><span>▤</span> Paste <kbd>Ctrl+V</kbd></button>
    <div class="menu-rule"></div>
    <button type="button" role="menuitem" onclick={() => run(interactions.clearSelection)}><span>⌫</span> Clear contents</button>
    <div class="menu-rule"></div>
    <button type="button" role="menuitem" onclick={() => run(() => table.setSorting([{ id: column.id, desc: false }]))}><span>↑</span> Sort ascending</button>
    <button type="button" role="menuitem" onclick={() => run(() => table.setSorting([{ id: column.id, desc: true }]))}><span>↓</span> Sort descending</button>
</div>
