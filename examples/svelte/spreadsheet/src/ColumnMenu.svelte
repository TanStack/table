<script lang="ts">
  import { onMount } from 'svelte'
  import type { SpreadsheetTable, SpreadsheetTableColumn } from './spreadsheetTable'
  let { anchorRect, column, table, onClose }: { anchorRect: DOMRect; column: SpreadsheetTableColumn; table: SpreadsheetTable; onClose: () => void } = $props()
  let menuRef: HTMLDivElement
  const filterValue = $derived(String(column.getFilterValue() ?? ''))
  onMount(() => {
    const pointer = (event: PointerEvent) => { if (!menuRef?.contains(event.target as Node)) onClose() }
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('pointerdown', pointer)
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', key) }
  })
</script>

<div bind:this={menuRef} class="column-menu" role="dialog" aria-label={`Column ${column.columnDef.meta?.letter ?? column.id} options`} style:left={`${Math.max(8, Math.min(anchorRect.left, innerWidth - 286))}px`} style:top={`${Math.min(anchorRect.bottom + 4, innerHeight - 250)}px`}>
    <div class="column-menu-title"><span>{column.columnDef.meta?.letter}</span><strong>{column.columnDef.meta?.label}</strong></div>
    <button type="button" onclick={() => { table.setSorting([{ id: column.id, desc: false }]); onClose() }}>Sort A → Z</button>
    <button type="button" onclick={() => { table.setSorting([{ id: column.id, desc: true }]); onClose() }}>Sort Z → A</button>
    <button type="button" disabled={!column.getIsSorted()} onclick={() => { column.clearSorting(); onClose() }}>Clear sort</button>
    <div class="column-menu-separator"></div>
    <label>Filter values containing<input autofocus value={filterValue} oninput={(event) => column.setFilterValue(event.currentTarget.value)} placeholder="Type to filter…" /></label>
    <button type="button" disabled={!filterValue} onclick={() => column.setFilterValue(undefined)}>Clear this filter</button>
</div>
