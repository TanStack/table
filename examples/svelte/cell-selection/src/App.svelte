<script lang="ts">
  import { faker } from '@faker-js/faker'
  import { untrack } from 'svelte'
  import { createHotkeysAttachment } from '@tanstack/svelte-hotkeys'
  import {
    FlexRender,
    cellSelectionFeature,
    columnOrderingFeature,
    columnPinningFeature,
    columnVisibilityFeature,
    createColumnHelper,
    createSortedRowModel,
    createTable,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_datetime,
    sortFn_text,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Cell } from '@tanstack/svelte-table'
  import type { Person } from './makeData'
  import './index.css'

  const features = tableFeatures({
    cellSelectionFeature,
    columnOrderingFeature,
    columnPinningFeature,
    columnVisibilityFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: {
      alphanumeric: sortFn_alphanumeric,
      datetime: sortFn_datetime,
      text: sortFn_text,
    },
  })

  const columnHelper = createColumnHelper<typeof features, Person>()

  // Serializing a selection for the clipboard is a userland concern: the table
  // hands back `getSelectedCellRangesData()` as raw values, and the delimiter,
  // the null representation, and the quoting rules are all yours to pick. This
  // is the spreadsheet-flavored version.
  function escapeTsvValue(value: unknown) {
    const text = value == null ? '' : String(value)
    const safeText =
      typeof value === 'string' && /^[\t\r ]*[=+@-]/.test(value)
        ? `'${text}`
        : text

    // spreadsheets expect a field to be quoted once it contains a delimiter, a
    // newline, or a quote, with inner quotes doubled
    return /["\t\n\r]/.test(safeText)
      ? `"${safeText.replace(/"/g, '""')}"`
      : safeText
  }

  function toTsv(ranges: Array<Array<Array<unknown>>>) {
    return ranges
      .map((grid) =>
        grid.map((row) => row.map(escapeTsvValue).join('\t')).join('\n'),
      )
      .join('\n\n') // blank line between final selected regions
  }

  function getCellClassName(cell: Cell<typeof features, Person>) {
    // Most cells in a large grid are unselected, so bail before asking for
    // edges. getSelectionEdges() would otherwise resolve the cell's position a
    // second time just to discover it is not selected.
    if (!cell.getIsSelected()) {
      return cell.getIsFocused()
        ? 'cell-selectable cell-focused'
        : 'cell-selectable'
    }

    const edges = cell.getSelectionEdges()

    return [
      'cell-selectable',
      'cell-selected',
      cell.getIsFocused() && 'cell-focused',
      edges.top && 'cell-edge-top',
      edges.right && 'cell-edge-right',
      edges.bottom && 'cell-edge-bottom',
      edges.left && 'cell-edge-left',
    ]
      .filter(Boolean)
      .join(' ')
  }

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      // enableCellSelection: false, // this column opts out of cell selection
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('city', {
      header: 'City',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('country', {
      header: 'Country',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('department', {
      header: 'Department',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('salary', {
      header: 'Salary',
      cell: (info) => info.getValue().toLocaleString(),
      footer: (props) => props.column.id,
    }),
  ])

  let data = $state(makeData(20))
  const refreshData = () => (data = makeData(20))
  const stressTest = () => (data = makeData(1_000))

  const table = createTable(
    {
      key: 'cell-selection',
      features,
      get data() {
        return data
      },
      columns,
      getRowId: (row: Person) => row.id,
      enableCellSelection: true, // enable cell selection for all cells
      // initialState: { cellSelection: [] }, // select cells on first render
      // state: { cellSelection }, // classic controlled state; pair with onCellSelectionChange
      // onCellSelectionChange: setCellSelection,
      // enableCellRangeSelection: false, // disable Shift-click and drag ranges; default true
      // enableMultiCellRangeSelection: false, // allow only one rectangle at a time; default true
      // enableCellSelectionDrag: false, // disable drag-to-select; default true
      // isCellRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
      debugTable: true,
    },
  )

  const randomizeColumns = () =>
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )

  const copySelection = () =>
    void navigator.clipboard.writeText(toTsv(table.getSelectedCellRangesData()))

  // optionally, reset the cellSelection state not only when data changes, but
  // also when column order, pinning, visibility, or sorting changes
  // customize this to your needs
  let isFirstColumnLayout = true
  $effect(() => {
    // Read only the layout atoms so selection changes do not re-run this
    // effect. A full `table.store.get()` read would track every state slice.
    void table.atoms.columnOrder.get()
    void table.atoms.columnPinning.get()
    void table.atoms.columnVisibility.get()
    void table.atoms.sorting.get()

    if (isFirstColumnLayout) {
      isFirstColumnLayout = false
      return
    }
    untrack(() => table.resetCellSelection(true))
  })

  // keyboard navigation is TanStack Hotkeys driving the table's imperative
  // APIs; table-core ships no keydown handling of its own
  const gridKeys = createHotkeysAttachment([
    { hotkey: 'ArrowUp', callback: () => table.moveCellSelection('up') },
    { hotkey: 'ArrowDown', callback: () => table.moveCellSelection('down') },
    { hotkey: 'ArrowLeft', callback: () => table.moveCellSelection('left') },
    { hotkey: 'ArrowRight', callback: () => table.moveCellSelection('right') },
    {
      hotkey: 'Shift+ArrowUp',
      callback: () => table.extendCellSelection('up'),
    },
    {
      hotkey: 'Shift+ArrowDown',
      callback: () => table.extendCellSelection('down'),
    },
    {
      hotkey: 'Shift+ArrowLeft',
      callback: () => table.extendCellSelection('left'),
    },
    {
      hotkey: 'Shift+ArrowRight',
      callback: () => table.extendCellSelection('right'),
    },
    { hotkey: 'Mod+A', callback: () => table.selectAllCells() },
    { hotkey: 'Escape', callback: () => table.resetCellSelection(true) },
    { hotkey: 'Mod+C', callback: () => copySelection() },
  ])
</script>

<div class="demo-root">
  <div>
    <button class="demo-button demo-button-spaced" onclick={() => refreshData()}
      >Regenerate Data</button
    >
    <button class="demo-button demo-button-spaced" onclick={() => stressTest()}
      >Stress Test (1K rows)</button
    >
  </div>
  <div class="spacer-sm"></div>
  <p>
    Click and drag to select a range of cells. Hold Shift while clicking to
    extend the selection, or Ctrl/Cmd to add or subtract a rectangle. Arrow keys move
    the selection, Shift+Arrow extends it, Mod+A selects all, Mod+C copies, and
    Escape clears. Uncomment `enableCellSelection: false` on a column def to opt
    that column out of selection.
  </p>
  <p class="demo-note">
    Hiding, reordering, and pinning columns all keep a live selection anchored
    to the same cell ids. Ranges are indexed in render order, so a pinned column
    moves the rectangle with it rather than splitting it.
  </p>
  <div class="column-toggle-panel">
    <div class="column-toggle-panel-header">
      <label>
        <input
          type="checkbox"
          checked={table.getIsAllColumnsVisible()}
          onchange={table.getToggleAllColumnsVisibilityHandler()}
        />
        Toggle All
      </label>
    </div>
    {#each table.getAllLeafColumns() as column (column.id)}
      <div class="column-toggle-row">
        <label>
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onchange={column.getToggleVisibilityHandler()}
          />
          {column.id}
        </label>
      </div>
    {/each}
  </div>
  <div class="spacer-sm"></div>
  <div class="button-row">
    <button
      class="demo-button demo-button-spaced"
      onclick={() => randomizeColumns()}>Shuffle Columns</button
    >
    <button
      class="demo-button demo-button-spaced"
      onclick={() =>
        table.setColumnOrder(
          [...table.getAllLeafColumns().map((column) => column.id)].reverse(),
        )}>Reverse Column Order</button
    >
    <button
      class="demo-button demo-button-spaced"
      onclick={() => table.resetColumnOrder()}>Reset Column Order</button
    >
    <button
      class="demo-button demo-button-spaced"
      onclick={() => table.resetColumnPinning()}>Reset Pinning</button
    >
    <button
      class="demo-button demo-button-spaced"
      onclick={() => table.resetColumnVisibility()}>Reset Visibility</button
    >
  </div>
  <div class="spacer-sm"></div>
  <!--
    Svelte's runes track this read, and the compiler updates only the affected
    text nodes. There is no equivalent of React's per-row Subscribe to reach for.
  -->
  <div>
    {table.getSelectedCellCount().toLocaleString()} cells selected across {table
      .getCellSelectionRowIds()
      .length.toLocaleString()} rows and {table.getCellSelectionColumnIds()
      .length} columns
  </div>
  <div class="spacer-sm"></div>
  <div>
    <table
      role="grid"
      aria-label="Cell selection grid"
      tabindex="0"
      {@attach gridKeys}
    >
      <thead>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colspan={header.colSpan}>
                {#if !header.isPlaceholder}
                  <button
                    type="button"
                    disabled={!header.column.getCanSort()}
                    class={header.column.getCanSort()
                      ? 'header-button sortable-header'
                      : 'header-button'}
                    onclick={header.column.getToggleSortingHandler()}
                  >
                    <FlexRender {header} />
                    {{ asc: ' 🔼', desc: ' 🔽' }[
                      header.column.getIsSorted() as string
                    ] ?? ''}
                  </button>
                  {#if header.column.getCanPin()}
                    <div class="pin-actions">
                      {#if header.column.getIsPinned() !== 'start'}
                        <button
                          class="pin-button"
                          onclick={() => header.column.pin('start')}
                          >{'<='}</button
                        >
                      {/if}
                      {#if header.column.getIsPinned()}
                        <button
                          class="pin-button"
                          onclick={() => header.column.pin(false)}>X</button
                        >
                      {/if}
                      {#if header.column.getIsPinned() !== 'end'}
                        <button
                          class="pin-button"
                          onclick={() => header.column.pin('end')}
                          >{'=>'}</button
                        >
                      {/if}
                    </div>
                  {/if}
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getRowModel().rows as row (row.id)}
          <tr>
            {#each row.getVisibleCells() as cell (cell.id)}
              {#if cell.getCanSelect()}
                <td
                  class={getCellClassName(cell)}
                  tabindex={cell.getTabIndex()}
                  onmousedown={cell.getSelectionStartHandler()}
                  onmouseenter={cell.getSelectionExtendHandler()}
                >
                  <FlexRender {cell} />
                </td>
              {:else}
                <td>
                  <FlexRender {cell} />
                </td>
              {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <td colspan={20}>
            Rows ({table.getRowModel().rows.length.toLocaleString()})
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div class="spacer-sm"></div>
  <div>
    <button
      class="demo-button demo-button-spaced"
      onclick={() => copySelection()}>Copy Selection</button
    >
    <button
      class="demo-button demo-button-spaced"
      onclick={() => table.selectAllCells()}>Select All Cells</button
    >
    <button
      class="demo-button demo-button-spaced"
      onclick={() => table.resetCellSelection(true)}>Clear Selection</button
    >
  </div>
  <hr />
  <br />
  <div>
    <button
      class="demo-button demo-button-spaced"
      onclick={() =>
        console.info(
          'table.getSelectedCellRangesData()',
          table.getSelectedCellRangesData(),
        )}>Log table.getSelectedCellRangesData()</button
    >
  </div>
  <div>
    <label for="state-dump">State:</label>
    <pre id="state-dump">{data.length < 1_001
        ? JSON.stringify(table.store.get(), null, 2)
        : ''}</pre>
  </div>
  <div>
    <label for="paste-target">Paste Test:</label>
    <!--
      scratch area for pasting a copied selection back in, to eyeball the
      tab-separated shape. It sits outside the grid element, so the table
      hotkeys never intercept typing or Mod+V in here.
    -->
    <textarea
      id="paste-target"
      class="text-input"
      rows={8}
      placeholder="Copy a selection, then paste here to check the tab-separated output..."
    ></textarea>
  </div>
</div>
