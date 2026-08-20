<script lang="ts">
  import { get } from 'svelte/store'
  import { createHotkeysAttachment } from '@tanstack/svelte-hotkeys'
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import CellContextMenu from './CellContextMenu.svelte'
  import ColumnMenu from './ColumnMenu.svelte'
  import { getFillPreview } from './spreadsheetModel'
  import type { CellSelectionRangeOperation, CellSelectionState } from '@tanstack/svelte-table'
  import type { VirtualItem } from '@tanstack/svelte-virtual'
  import type { FillPreview, GridBounds, GridCoordinate } from './spreadsheetModel'
  import type { SpreadsheetTable, SpreadsheetTableCell, SpreadsheetTableColumn, SpreadsheetTableHeader, SpreadsheetTableRow } from './spreadsheetTable'
  import type { GridInteractions } from './createGridInteractions.svelte'

  export const ROW_HEIGHT = 24
  const HEADER_HEIGHT = 26
  const ROW_HEADER_WIDTH = 42
  const CELL_HORIZONTAL_PADDING = 10
  const EDGE_SCROLL_ZONE = 32
  const MAX_EDGE_SCROLL_SPEED = 22

  export interface SpreadsheetGridHandle { scrollToCell: (rowId: string, columnId: string) => void }
  interface OpenColumnMenu { column: SpreadsheetTableColumn; rect: DOMRect }
  interface OpenCellMenu { x: number; y: number; column: SpreadsheetTableColumn }
  interface FillDrag { source: GridBounds; preview: FillPreview | null }
  interface HeaderSelectionDrag { axis: 'column' | 'row'; anchorId: string; baseSelection: CellSelectionState; operation: CellSelectionRangeOperation }

  let { table, interactions, zoom, onReady }: { table: SpreadsheetTable; interactions: GridInteractions; zoom: number; onReady: (handle: SpreadsheetGridHandle) => void } = $props()
  let scrollRef = $state<HTMLDivElement>()
  let openMenu = $state<OpenColumnMenu | null>(null)
  let openCellMenu = $state<OpenCellMenu | null>(null)
  let fillPreview = $state<FillPreview | null>(null)
  let fillDrag: FillDrag | null = null
  let headerSelectionDrag: HeaderSelectionDrag | null = null
  let pointer = { clientX: 0, clientY: 0 }
  let scrollFrame: number | null = null

  const startColumns = $derived(table.getStartVisibleLeafColumns())
  const centerColumns = $derived(table.getCenterVisibleLeafColumns())
  const endColumns = $derived(table.getEndVisibleLeafColumns())
  const topRows = $derived(table.getTopRows())
  const centerRows = $derived(table.getCenterRows())
  const startWidth = $derived(startColumns.reduce((n, c) => n + c.getSize(), 0))
  const endWidth = $derived(endColumns.reduce((n, c) => n + c.getSize(), 0))
  const frozenRowsHeight = $derived(topRows.length * ROW_HEIGHT)
  const displayColumns = $derived([...startColumns, ...centerColumns, ...endColumns])

  const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({ count: centerRows.length, getScrollElement: () => scrollRef ?? null, getItemKey: (index) => centerRows[index]?.id ?? index, estimateSize: () => ROW_HEIGHT, paddingStart: HEADER_HEIGHT + frozenRowsHeight, scrollPaddingStart: HEADER_HEIGHT + frozenRowsHeight, overscan: 8 })
  const columnVirtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({ count: centerColumns.length, getScrollElement: () => scrollRef ?? null, getItemKey: (index) => centerColumns[index]?.id ?? index, estimateSize: (index) => centerColumns[index]?.getSize() ?? 120, horizontal: true, paddingStart: ROW_HEADER_WIDTH + startWidth, paddingEnd: endWidth, scrollPaddingStart: ROW_HEADER_WIDTH + startWidth, scrollPaddingEnd: endWidth, overscan: 3 })

  $effect(() => {
    if (!scrollRef) return
    const getEl = () => scrollRef ?? null
    get(rowVirtualizer).setOptions({ count: centerRows.length, getScrollElement: getEl, paddingStart: HEADER_HEIGHT + frozenRowsHeight, scrollPaddingStart: HEADER_HEIGHT + frozenRowsHeight })
    get(columnVirtualizer).setOptions({ count: centerColumns.length, getScrollElement: getEl, paddingStart: ROW_HEADER_WIDTH + startWidth, paddingEnd: endWidth, scrollPaddingStart: ROW_HEADER_WIDTH + startWidth, scrollPaddingEnd: endWidth })
  })
  $effect(() => { void table.atoms.columnSizing.get(); get(columnVirtualizer).measure() })
  $effect(() => {
    onReady({ scrollToCell(rowId, columnId) {
      if (!new Set(topRows.map((row) => row.id)).has(rowId)) {
        const index = centerRows.findIndex((row) => row.id === rowId)
        if (index >= 0) get(rowVirtualizer).scrollToIndex(index)
      }
      if (!new Set([...startColumns, ...endColumns].map((column) => column.id)).has(columnId)) {
        const index = centerColumns.findIndex((column) => column.id === columnId)
        if (index >= 0) get(columnVirtualizer).scrollToIndex(index)
      }
    } })
  })

  const gridKeys = createHotkeysAttachment(() => [
    { hotkey: 'ArrowUp', callback: () => interactions.moveSelection('up') },
    { hotkey: 'ArrowDown', callback: () => interactions.moveSelection('down') },
    { hotkey: 'ArrowLeft', callback: () => interactions.moveSelection('left') },
    { hotkey: 'ArrowRight', callback: () => interactions.moveSelection('right') },
    { hotkey: 'Shift+ArrowUp', callback: () => interactions.moveSelection('up', true) },
    { hotkey: 'Shift+ArrowDown', callback: () => interactions.moveSelection('down', true) },
    { hotkey: 'Shift+ArrowLeft', callback: () => interactions.moveSelection('left', true) },
    { hotkey: 'Shift+ArrowRight', callback: () => interactions.moveSelection('right', true) },
    { hotkey: 'Tab', callback: () => interactions.moveSelection('right') },
    { hotkey: 'Shift+Tab', callback: () => interactions.moveSelection('left') },
    { hotkey: 'Enter', callback: () => interactions.moveSelection('down') },
    { hotkey: 'Shift+Enter', callback: () => interactions.moveSelection('up') },
    { hotkey: 'F2', callback: interactions.startEditingActive },
    { hotkey: 'Delete', callback: interactions.clearSelection },
    { hotkey: 'Backspace', callback: interactions.clearSelection },
    { hotkey: 'Escape', callback: () => table.resetCellSelection(true) },
    { hotkey: 'Mod+A', callback: () => table.selectAllCells() },
    { hotkey: 'Mod+Z', callback: interactions.undo },
    { hotkey: 'Mod+Shift+Z', callback: interactions.redo },
    { hotkey: 'Mod+Y', callback: interactions.redo },
  ], () => ({ enabled: interactions.editing() == null, preventDefault: true, stopPropagation: true }))

  function resolveCoordinate(clientX: number, clientY: number): GridCoordinate | null {
    if (!scrollRef) return null
    const rect = scrollRef.getBoundingClientRect()
    const localX = Math.min(Math.max(clientX - rect.left, ROW_HEADER_WIDTH + 1), rect.width - 1)
    const localY = Math.min(Math.max(clientY - rect.top, HEADER_HEIGHT + 1), rect.height - 1)
    const hit = document.elementFromPoint(clientX, clientY)
    const hitRowIndex = Number(hit?.closest<HTMLElement>('[data-row-index]')?.dataset.rowIndex)
    let row: SpreadsheetTableRow | undefined = Number.isFinite(hitRowIndex) ? table.getRowsInDisplayOrder()[hitRowIndex] : undefined
    if (!row && topRows.length && localY < HEADER_HEIGHT + frozenRowsHeight) row = topRows[Math.min(topRows.length - 1, Math.max(0, Math.floor((localY - HEADER_HEIGHT) / ROW_HEIGHT)))]
    if (!row) { const item = get(rowVirtualizer).getVirtualItemForOffset(scrollRef.scrollTop + localY); row = item ? centerRows[item.index] : undefined }
    const hitColumnId = hit?.closest<HTMLElement>('[data-column-id]')?.dataset.columnId
    let column = hitColumnId ? displayColumns.find((candidate) => candidate.id === hitColumnId) : undefined
    if (!column && startColumns.length && localX < ROW_HEADER_WIDTH + startWidth) { let offset = ROW_HEADER_WIDTH; column = startColumns.find((candidate) => { const next = offset + candidate.getSize(); const match = localX >= offset && localX < next; offset = next; return match }) }
    if (!column && endColumns.length && localX > rect.width - endWidth) { let offset = rect.width - endWidth; column = endColumns.find((candidate) => { const next = offset + candidate.getSize(); const match = localX >= offset && localX < next; offset = next; return match }) }
    if (!column) { const item = get(columnVirtualizer).getVirtualItemForOffset(scrollRef.scrollLeft + localX); column = item ? centerColumns[item.index] : undefined }
    if (!row || !column) return null
    const columnIndex = table.getCellSelectionColumnIndexes()[column.id] ?? -1
    const rowIndex = row.getDisplayIndex()
    return rowIndex < 0 || columnIndex < 0 ? null : { rowIndex, columnIndex }
  }
  function applyHeaderSelectionDrag(drag: HeaderSelectionDrag, focusId: string) {
    if (drag.axis === 'column') interactions.selectColumnRange(drag.anchorId, focusId, drag.baseSelection, drag.operation)
    else interactions.selectRowRange(drag.anchorId, focusId, drag.baseSelection, drag.operation)
  }
  function updateDragTarget(event: MouseEvent) {
    const coordinate = resolveCoordinate(event.clientX, event.clientY)
    if (!coordinate) return
    if (fillDrag) { const preview = getFillPreview(fillDrag.source, coordinate); fillDrag.preview = preview; fillPreview = preview; return }
    if (headerSelectionDrag) { const id = headerSelectionDrag.axis === 'column' ? displayColumns[coordinate.columnIndex]?.id : table.getRowsInDisplayOrder()[coordinate.rowIndex]?.id; if (id) applyHeaderSelectionDrag(headerSelectionDrag, id); return }
    if (!table._isSelectingCells) return
    const row = table.getRowsInDisplayOrder()[coordinate.rowIndex]
    const column = displayColumns[coordinate.columnIndex]
    row.getAllCellsByColumnId()[column.id].getSelectionExtendHandler()(event)
  }
  function runEdgeScroll() {
    scrollFrame = null
    if ((!fillDrag && !headerSelectionDrag && !table._isSelectingCells) || !scrollRef) return
    const rect = scrollRef.getBoundingClientRect(); const { clientX, clientY } = pointer
    const header = headerSelectionDrag
    const dx = header?.axis === 'row' ? 0 : edgeDelta(clientX, rect.left + ROW_HEADER_WIDTH + startWidth, rect.right - endWidth, EDGE_SCROLL_ZONE)
    const dy = header?.axis === 'column' ? 0 : edgeDelta(clientY, rect.top + HEADER_HEIGHT + frozenRowsHeight, rect.bottom, EDGE_SCROLL_ZONE)
    if (dx || dy) { scrollRef.scrollLeft += dx; scrollRef.scrollTop += dy; updateDragTarget(new MouseEvent('mousemove', { clientX, clientY, bubbles: true })) }
    scrollFrame = requestAnimationFrame(runEdgeScroll)
  }
  function ensureEdgeScroll() { if (scrollFrame == null) scrollFrame = requestAnimationFrame(runEdgeScroll) }
  function startHeaderSelection(event: MouseEvent, axis: 'column' | 'row', id: string, fullySelected: boolean) {
    if (event.button !== 0) return
    event.preventDefault(); scrollRef?.focus({ preventScroll: true })
    const current = table.atoms.cellSelection.get(); const active = current.at(-1)
    let anchorId = id; let baseSelection: CellSelectionState = []; let operation: CellSelectionRangeOperation = 'include'
    if (event.shiftKey && active) { anchorId = axis === 'column' ? active.anchorColumnId : active.anchorRowId; baseSelection = current.slice(0, -1); operation = active.operation ?? 'include' }
    else if (event.metaKey || event.ctrlKey) { baseSelection = current; operation = fullySelected ? 'exclude' : 'include' }
    headerSelectionDrag = { axis, anchorId, baseSelection, operation }; pointer = { clientX: event.clientX, clientY: event.clientY }; applyHeaderSelectionDrag(headerSelectionDrag, id); ensureEdgeScroll()
  }
  function startFill(event: MouseEvent, source: GridBounds) { event.preventDefault(); event.stopPropagation(); scrollRef?.focus({ preventScroll: true }); pointer = { clientX: event.clientX, clientY: event.clientY }; fillDrag = { source, preview: null }; fillPreview = null; ensureEdgeScroll() }
  function mouseMove(event: MouseEvent) { pointer = { clientX: event.clientX, clientY: event.clientY }; if (fillDrag || headerSelectionDrag || table._isSelectingCells) { updateDragTarget(event); ensureEdgeScroll() } }
  function mouseUp() { if (fillDrag?.preview) interactions.applyFill(fillDrag.source, fillDrag.preview); fillDrag = null; headerSelectionDrag = null; fillPreview = null; if (scrollFrame != null) cancelAnimationFrame(scrollFrame); scrollFrame = null }
  function autoFit(column: SpreadsheetTableColumn) { table.setColumnSizing((current) => ({ ...current, [column.id]: getAutoFitColumnWidth(table, column) })) }
  function columnStyle(column: SpreadsheetTableColumn, left?: number, pinned?: 'start' | 'end') { if (pinned === 'start') return `width:${column.getSize()}px;inset-inline-start:${ROW_HEADER_WIDTH + column.getStart('start')}px`; if (pinned === 'end') return `width:${column.getSize()}px;inset-inline-end:${column.getAfter('end')}px`; return `width:${column.getSize()}px;left:${left ?? 0}px` }
  function edgeDelta(value: number, start: number, end: number, zone: number) { if (value < start + zone) return -Math.ceil(MAX_EDGE_SCROLL_SPEED * Math.min(1, Math.max(0, (start + zone - value) / zone))); if (value > end - zone) return Math.ceil(MAX_EDGE_SCROLL_SPEED * Math.min(1, Math.max(0, (value - (end - zone)) / zone))); return 0 }
  function formatted(value: unknown) { if (value == null) return ''; if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'; if (typeof value === 'number') return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value); return String(value) }
  let measureContext: CanvasRenderingContext2D | null = null
  function measure(value: string, bold = false) { measureContext ??= document.createElement('canvas').getContext('2d'); if (!measureContext) return value.length * 6; measureContext.font = `${bold ? '600 ' : ''}11px Arial, sans-serif`; return measureContext.measureText(value).width }
  function getAutoFitColumnWidth(table: SpreadsheetTable, column: SpreadsheetTableColumn) { const index = column.columnDef.meta?.index; if (index == null) return column.getSize(); let widest = 0; for (const row of table.options.data) widest = Math.max(widest, measure(formatted(row.cells[index]), row.kind === 'field-header')); return Math.max(column.columnDef.minSize ?? 0, Math.ceil(widest + CELL_HORIZONTAL_PADDING + 2)) }
</script>

<svelte:window onmousemove={mouseMove} onmouseup={mouseUp} />

<div bind:this={scrollRef} class="spreadsheet-grid" data-testid="spreadsheet-grid" role="grid" tabindex="0" aria-rowcount={table.getRowsInDisplayOrder().length} aria-colcount={displayColumns.length} onkeydown={interactions.handleGridTextEntry} oncopy={interactions.copySelection} oncut={interactions.cutSelection} onpaste={interactions.pasteSelection} onmousedown={(event) => { if (event.target === event.currentTarget) event.currentTarget.focus({ preventScroll: true }) }} {@attach gridKeys}>
  <div class="spreadsheet-canvas" data-zoom={zoom} style:width={`${Math.max($columnVirtualizer.getTotalSize(), 720)}px`} style:height={`${Math.max($rowVirtualizer.getTotalSize(), 320)}px`} style:zoom={zoom / 100}>
    <div class="spreadsheet-row spreadsheet-header-row" role="row" style:height={`${HEADER_HEIGHT}px`}>
      <button type="button" class="corner-header" aria-label="Select all cells" onclick={() => table.selectAllCells()}><span></span></button>
      {#each table.getStartLeafHeaders() as header (header.id)} {@render headerCell(header, undefined, 'start')} {/each}
      {#each $columnVirtualizer.getVirtualItems() as virtual (virtual.key)}
        {@const header = table.getCenterLeafHeaders()[virtual.index]}
        {#if header}{@render headerCell(header, virtual.start)}{/if}
      {/each}
      {#each table.getEndLeafHeaders() as header (header.id)} {@render headerCell(header, undefined, 'end')} {/each}
    </div>
    {#if topRows.length}<div class="frozen-row-region" style:height={`${frozenRowsHeight}px`}>{#each topRows as row, index (row.id)}{@render rowView(row, index * ROW_HEIGHT, true)}{/each}</div>{/if}
    {#each $rowVirtualizer.getVirtualItems() as virtual (virtual.key)}
      {@const row = centerRows[virtual.index]}
      {#if row}{@render rowView(row, virtual.start, false)}{/if}
    {/each}
  </div>
</div>

{#if openMenu}<ColumnMenu anchorRect={openMenu.rect} column={openMenu.column} {table} onClose={() => openMenu = null} />{/if}
{#if openCellMenu}<CellContextMenu x={openCellMenu.x} y={openCellMenu.y} column={openCellMenu.column} {table} {interactions} onClose={() => openCellMenu = null} />{/if}

{#snippet headerCell(header: SpreadsheetTableHeader, left?: number, pinned?: 'start' | 'end')}
  {@const column = header.column}
  {@const columnIndex = table.getCellSelectionColumnIndexes()[column.id] ?? -1}
  {@const rowCount = table.getRowsInDisplayOrder().length}
  {@const selected = table.getCellSelectionBounds().some((b) => b.minRowIndex === 0 && b.maxRowIndex === rowCount - 1 && columnIndex >= b.minColumnIndex && columnIndex <= b.maxColumnIndex)}
  {@const sorted = column.getIsSorted()}
  {@const filtered = column.getIsFiltered()}
  <div class:column-pinned={pinned} class:header-selected={selected} class="column-header" role="columnheader" data-column-id={column.id} aria-colindex={columnIndex + 1} aria-selected={selected} style={columnStyle(column, left, pinned)} onmousedown={(event) => startHeaderSelection(event, 'column', column.id, selected)}>
    <span class="column-letter">{column.columnDef.meta?.letter}</span>
    <button type="button" class:column-menu-active={sorted || filtered} class="column-menu-button" aria-label={`Open ${column.columnDef.meta?.letter} column menu`} onmousedown={(event) => event.stopPropagation()} onclick={(event) => { event.stopPropagation(); openMenu = { column, rect: event.currentTarget.getBoundingClientRect() } }}>{sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : filtered ? '●' : '▾'}</button>
    <div class:column-resizer-active={column.getIsResizing()} class="column-resizer" role="separator" aria-label={`Resize column ${column.columnDef.meta?.letter}`} ondblclick={(event) => { event.stopPropagation(); autoFit(column) }} onmousedown={(event) => { event.stopPropagation(); header.getResizeHandler()(event) }} ontouchstart={(event) => { event.stopPropagation(); header.getResizeHandler()(event) }}></div>
  </div>
{/snippet}

{#snippet rowView(row: SpreadsheetTableRow, top: number, frozen: boolean)}
  {@const rowIndex = row.getDisplayIndex()}
  {@const bounds = table.getCellSelectionBounds()}
  {@const selected = bounds.some((b) => b.minColumnIndex === 0 && b.maxColumnIndex === displayColumns.length - 1 && rowIndex >= b.minRowIndex && rowIndex <= b.maxRowIndex)}
  <div class="spreadsheet-row spreadsheet-data-row" class:spreadsheet-row-frozen={frozen} class:spreadsheet-field-row={row.original.kind === 'field-header'} role="row" aria-rowindex={rowIndex + 1} data-row-index={rowIndex} style:height={`${ROW_HEIGHT}px`} style:transform={`translateY(${top}px)`}>
    <button type="button" class="row-header" class:header-selected={selected} aria-label={`Select row ${rowIndex + 1}`} aria-selected={selected} onmousedown={(event) => startHeaderSelection(event, 'row', row.id, selected)}>{rowIndex + 1}</button>
    {#each row.getStartVisibleCells() as cell (cell.id)} {@render cellView(cell, rowIndex, undefined, 'start')} {/each}
    {#each $columnVirtualizer.getVirtualItems() as virtual (virtual.key)} {@const cell = row.getCenterVisibleCells()[virtual.index]} {#if cell}{@render cellView(cell, rowIndex, virtual.start)}{/if} {/each}
    {#each row.getEndVisibleCells() as cell (cell.id)} {@render cellView(cell, rowIndex, undefined, 'end')} {/each}
  </div>
{/snippet}

{#snippet cellView(cell: SpreadsheetTableCell, rowIndex: number, left?: number, pinned?: 'start' | 'end')}
  {@const columnIndex = table.getCellSelectionColumnIndexes()[cell.column.id] ?? -1}
  {@const edges = cell.getSelectionEdges()}
  {@const bound = table.getCellSelectionBounds().at(-1)}
  {@const editing = interactions.editing()}
  {@const isEditing = editing?.rowId === cell.row.id && editing.columnId === cell.column.id}
  {@const fillTarget = fillPreview && rowIndex >= fillPreview.destination.minRowIndex && rowIndex <= fillPreview.destination.maxRowIndex && columnIndex >= fillPreview.destination.minColumnIndex && columnIndex <= fillPreview.destination.maxColumnIndex}
  {@const showFill = bound && rowIndex === bound.maxRowIndex && columnIndex === bound.maxColumnIndex}
  <div class="spreadsheet-cell" class:cell-pinned={pinned} class:cell-selected={cell.getIsSelected()} class:cell-focused={cell.getIsFocused()} class:cell-edge-top={edges.top} class:cell-edge-right={edges.right} class:cell-edge-bottom={edges.bottom} class:cell-edge-left={edges.left} class:cell-fill-preview={fillTarget} class:cell-field-header={cell.row.original.kind === 'field-header'} role="gridcell" aria-colindex={columnIndex + 1} aria-selected={cell.getIsSelected()} data-sheet-cell data-row-id={cell.row.id} data-column-id={cell.column.id} tabindex={isEditing ? -1 : cell.getTabIndex()} style={columnStyle(cell.column, left, pinned)} onmousedown={(event) => { if (isEditing || event.button !== 0) return; event.currentTarget.closest<HTMLElement>('.spreadsheet-grid')?.focus({ preventScroll: true }); cell.getSelectionStartHandler(document)(event) }} onmouseenter={cell.getSelectionExtendHandler()} ondblclick={() => interactions.startEditing(cell.row.id, cell.column.id)} oncontextmenu={(event) => { event.preventDefault(); event.currentTarget.closest<HTMLElement>('.spreadsheet-grid')?.focus({ preventScroll: true }); openMenu = null; openCellMenu = { x: event.clientX, y: event.clientY, column: cell.column } }}>
    {#if isEditing}<input autofocus class="cell-editor" aria-label={`Edit ${cell.column.columnDef.meta?.letter}${rowIndex + 1}`} value={editing?.draft ?? ''} onfocus={(event) => event.currentTarget.select()} onmousedown={(event) => event.stopPropagation()} oninput={(event) => interactions.setEditingDraft(event.currentTarget.value)} onkeydown={interactions.handleEditorKeyDown} onblur={() => interactions.commitEditing()} />{:else}<span class="cell-value">{formatted(cell.getValue())}</span>{/if}{#if showFill}<span class="fill-handle" data-testid="fill-handle" aria-label="Drag to fill" onmousedown={(event) => startFill(event, { minRowIndex: bound.minRowIndex, maxRowIndex: bound.maxRowIndex, minColumnIndex: bound.minColumnIndex, maxColumnIndex: bound.maxColumnIndex })}></span>{/if}
  </div>
{/snippet}
