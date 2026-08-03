<script lang="ts">
  import { untrack } from 'svelte'
  import { constructFilterFn, createColumnHelper, createTable, filterFn_includesString } from '@tanstack/svelte-table'
  import SpreadsheetGrid from './SpreadsheetGrid.svelte'
  import { createGridInteractions } from './createGridInteractions.svelte'
  import { createSpreadsheetHistory } from './spreadsheetHistory.svelte'
  import { DEFAULT_COLUMN_COUNT, DEFAULT_ROW_COUNT, STRESS_COLUMN_COUNT, STRESS_ROW_COUNT, formatCellValue, makeBlankSpreadsheetData, makeSpreadsheetData } from './spreadsheetModel'
  import { spreadsheetFeatures } from './spreadsheetTable'
  import type { SpreadsheetGridHandle } from './SpreadsheetGrid.svelte'
  import type { SpreadsheetColumnMeta, SpreadsheetData, SpreadsheetRow } from './spreadsheetModel'
  import './index.css'

  interface WorkbookSheet { id: string; name: string; data: SpreadsheetData }
  const columnHelper = createColumnHelper<typeof spreadsheetFeatures, SpreadsheetRow>()
  const fieldAwareIncludesStringFilter = constructFilterFn({ ...filterFn_includesString, filter: (value, filter, row, columnId, addMeta) => row.original.kind === 'field-header' || filterFn_includesString.filter(value, filter, row, columnId, addMeta) })
  let seed = 7
  let spreadsheetData = $state(makeSpreadsheetData(DEFAULT_ROW_COUNT, DEFAULT_COLUMN_COUNT, seed))
  let sheets = $state<Array<WorkbookSheet>>([{ id: 'sheet-1', name: 'Sheet1', data: spreadsheetData }])
  let activeSheetId = $state('sheet-1')
  let frozenRowCount = $state(1)
  let frozenColumnCount = $state(1)
  let zoom = $state(100)
  let ribbonTab = $state<'home' | 'data' | 'view'>('home')
  let gridHandle: SpreadsheetGridHandle | undefined
  const columnIndexById = $derived(new Map(spreadsheetData.columns.map((column) => [column.id, column.index])))
  const history = createSpreadsheetHistory(spreadsheetData.rows, () => columnIndexById)
  const columns = $derived(columnHelper.columns(spreadsheetData.columns.map((column) => columnHelper.accessor((row) => row.cells[column.index] as unknown, { id: column.id, header: column.label, size: getInitialColumnSize(column), minSize: 72, filterFn: fieldAwareIncludesStringFilter, sortFn: column.initialType === 'number' || column.initialType === 'boolean' ? 'basic' : column.initialType === 'date' ? 'alphanumeric' : 'text', meta: column }))))
  const table = createTable({ key: 'spreadsheet', features: spreadsheetFeatures, get columns() { return columns }, get data() { return history.rows }, getRowId: (row) => row.id, enableCellSelection: true, autoResetCellSelection: false, columnResizeMode: 'onChange', keepPinnedRows: false })
  $effect(() => {
    const desired = table.getRowModel().rows.slice(0, frozenRowCount).map((row) => row.id)
    const current = table.atoms.rowPinning.get()
    if (!arraysEqual(current.top, desired) || current.bottom.length) untrack(() => table.setRowPinning({ top: desired, bottom: [] }))
  })
  $effect(() => {
    const desired = table.getAllLeafColumns().slice(0, frozenColumnCount).map((column) => column.id)
    const current = table.atoms.columnPinning.get()
    if (!arraysEqual(current.start, desired) || current.end.length) untrack(() => table.setColumnPinning({ start: desired, end: [] }))
  })
  const interactions = createGridInteractions({ table, rows: () => history.rows, columns: () => spreadsheetData.columns, execute: history.execute, undo: history.undo, redo: history.redo, scrollToCell: (rowId, columnId) => gridHandle?.scrollToCell(rowId, columnId) })
  const selection = $derived(table.atoms.cellSelection.get())
  const active = $derived(selection.at(-1))
  const activeValue = $derived(active ? formatCellValue(interactions.getValue(active.anchorRowId, active.anchorColumnId)) : '')
  let formulaDraft = $state('')
  $effect(() => { formulaDraft = activeValue })
  const summary = $derived.by(() => { void selection; return interactions.getSelectionSummary() })
  const activeSheetIndex = $derived(sheets.findIndex((sheet) => sheet.id === activeSheetId))

  function resetTableView() { table.resetSorting(true); table.resetColumnFilters(true); table.resetColumnSizing(true); table.resetCellSelection(true) }
  function loadDataset(rows: number, columns: number) { seed++; const next = makeSpreadsheetData(rows, columns, seed); spreadsheetData = next; history.reset(next.rows); resetTableView(); frozenRowCount = 1; frozenColumnCount = 1 }
  function persist(current: Array<WorkbookSheet>) { return current.map((sheet) => sheet.id === activeSheetId ? { ...sheet, data: { ...spreadsheetData, rows: history.rows } } : sheet) }
  function switchSheet(id: string) { if (id === activeSheetId) return; const target = sheets.find((sheet) => sheet.id === id); if (!target) return; sheets = persist(sheets); activeSheetId = target.id; spreadsheetData = target.data; history.reset(target.data.rows); resetTableView() }
  function addSheet() { seed++; const number = sheets.length + 1; const data = makeBlankSpreadsheetData(DEFAULT_ROW_COUNT, DEFAULT_COLUMN_COUNT, seed); const sheet = { id: `sheet-${number}`, name: `Sheet${number}`, data }; sheets = [...persist(sheets), sheet]; activeSheetId = sheet.id; spreadsheetData = data; history.reset(data.rows); resetTableView(); frozenRowCount = 1; frozenColumnCount = 1 }
  function commitFormula(move?: 'up' | 'down' | 'left' | 'right') { if (active) interactions.commitCellValue(active.anchorRowId, active.anchorColumnId, formulaDraft, move) }
  function getInitialColumnSize(column: SpreadsheetColumnMeta) { if (column.initialType === 'boolean') return 92; if (column.initialType === 'number') return 112; if (column.initialType === 'date') return 124; if (column.label === 'Notes') return 190; return 144 }
  function arraysEqual(a: ReadonlyArray<string>, b: ReadonlyArray<string>) { return a.length === b.length && a.every((value, index) => value === b[index]) }
  function formatNumber(value: number) { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) }
</script>

<main class="spreadsheet-app">
  <div class="excel-chrome">
    <header class="excel-titlebar">
      <div class="quick-access" aria-label="Quick access">
        <button type="button" disabled={!history.canUndo} onclick={history.undo} title="Undo (Ctrl/Cmd+Z)" aria-label="Undo">↶</button>
        <button type="button" disabled={!history.canRedo} onclick={history.redo} title="Redo (Ctrl/Cmd+Y)" aria-label="Redo">↷</button>
      </div>
      <div class="excel-document-title"><span class="excel-logo" aria-hidden="true">X</span><div><h1>TanStack Sheet</h1><p>Spreadsheet example</p></div></div>
      <div class="titlebar-actions" aria-hidden="true"><span>—</span><span>□</span><span>×</span></div>
    </header>
    <div class="ribbon-tab-row" role="tablist" aria-label="Ribbon"><span class="file-tab">File</span>{#each ['home', 'data', 'view'] as tab}<button type="button" role="tab" aria-selected={ribbonTab === tab} class:ribbon-tab-active={ribbonTab === tab} onclick={() => ribbonTab = tab as typeof ribbonTab}>{tab[0].toUpperCase() + tab.slice(1)}</button>{/each}</div>
    <div class="spreadsheet-ribbon" role="toolbar" aria-label={`${ribbonTab} tools`}>
      {#if ribbonTab === 'home'}
        <div class="ribbon-group"><div class="ribbon-buttons"><button type="button" class="ribbon-large-button" onclick={() => void interactions.pasteFromClipboard()}><span>▤</span> Paste</button><div><button type="button" onclick={() => void interactions.cutToClipboard()}>✂ Cut</button><button type="button" onclick={() => void interactions.copyToClipboard()}>▣ Copy</button></div></div><small>Clipboard</small></div>
        <div class="ribbon-group"><div class="ribbon-buttons"><button type="button" onclick={interactions.clearSelection}>⌫ Clear contents</button><button type="button" disabled={!table.atoms.columnFilters.get().length} onclick={() => table.resetColumnFilters(true)}>◌ Clear filters</button></div><small>Editing</small></div>
        <div class="ribbon-group"><div class="ribbon-buttons"><button type="button" onclick={() => loadDataset(DEFAULT_ROW_COUNT, DEFAULT_COLUMN_COUNT)}>Default data</button><button type="button" onclick={() => loadDataset(STRESS_ROW_COUNT, STRESS_COLUMN_COUNT)}>Stress data</button><span class="dataset-size" aria-live="polite">{history.rows.length.toLocaleString()} × {spreadsheetData.columns.length.toLocaleString()}</span></div><small>Workbook</small></div>
      {:else if ribbonTab === 'data'}
        <div class="ribbon-group"><div class="ribbon-buttons"><button type="button" disabled>A→Z Sort</button><button type="button" disabled>Z→A Sort</button><button type="button" disabled={!table.atoms.columnFilters.get().length} onclick={() => table.resetColumnFilters(true)}>Clear filters</button></div><small>Sort &amp; Filter · use column menus</small></div><div class="ribbon-group ribbon-note">Right-click a cell or open a column menu to sort and filter.</div>
      {:else}
        <div class="ribbon-group"><div class="ribbon-buttons ribbon-selects"><label>Freeze rows<select aria-label="Freeze rows" bind:value={frozenRowCount}>{#each [0,1,2,3] as count}<option value={count}>{count}</option>{/each}</select></label><label>Freeze columns<select aria-label="Freeze columns" bind:value={frozenColumnCount}>{#each [0,1,2,3] as count}<option value={count}>{count}</option>{/each}</select></label></div><small>Window</small></div><div class="ribbon-group ribbon-note">Frozen rows and columns stay anchored while the grid virtualizes.</div>
      {/if}
    </div>
  </div>

  <div class="value-bar"><output aria-label="Active range">{interactions.getRangeLabel() || '—'}</output><span class="value-bar-icon" aria-hidden="true">fx</span><input aria-label="Cell value" bind:value={formulaDraft} disabled={!active} onkeydown={(event) => { if (event.key === 'Escape') { event.preventDefault(); formulaDraft = activeValue; interactions.cancelEditing() } else if (event.key === 'Enter') { event.preventDefault(); commitFormula(event.shiftKey ? 'up' : 'down') } else if (event.key === 'Tab') { event.preventDefault(); commitFormula(event.shiftKey ? 'left' : 'right') } }} onblur={() => commitFormula()} /></div>

  <SpreadsheetGrid {table} {interactions} {zoom} onReady={(handle) => gridHandle = handle} />

  <footer class="spreadsheet-footer">
    <div class="sheet-controls"><div class="sheet-navigation"><button type="button" aria-label="Previous sheet" disabled={activeSheetIndex <= 0} onclick={() => { const previous = sheets.at(activeSheetIndex - 1); if (previous) switchSheet(previous.id) }}>◀</button><button type="button" aria-label="Next sheet" disabled={activeSheetIndex < 0 || activeSheetIndex >= sheets.length - 1} onclick={() => { const next = sheets.at(activeSheetIndex + 1); if (next) switchSheet(next.id) }}>▶</button></div><button type="button" class="add-sheet" aria-label="Add sheet" onclick={addSheet}>+</button><div class="sheet-tabs" role="tablist" aria-label="Sheets">{#each sheets as sheet (sheet.id)}<button type="button" role="tab" class="sheet-tab" class:sheet-tab-active={sheet.id === activeSheetId} aria-selected={sheet.id === activeSheetId} onclick={() => switchSheet(sheet.id)}>{sheet.name}</button>{/each}</div><span class="status-ready">Ready</span></div>
    <div class="selection-summary" aria-live="polite"><span>{summary.count.toLocaleString()} selected</span>{#if summary.numericCount}<span>Count: {summary.numericCount.toLocaleString()}</span><span>Sum: {formatNumber(summary.sum)}</span><span>Average: {formatNumber(summary.average)}</span>{/if}</div>
    <div class="zoom-control"><button type="button" aria-label="Zoom out" disabled={zoom <= 25} onclick={() => zoom = Math.max(25, zoom - 10)}>−</button><input type="range" min="25" max="200" bind:value={zoom} aria-label="Zoom" /><button type="button" aria-label="Zoom in" disabled={zoom >= 200} onclick={() => zoom = Math.min(200, zoom + 10)}>+</button><output>{zoom}%</output></div>
  </footer>
</main>
