<script lang="ts">
  import {
    FlexRender,
    cellSelectionFeature,
    cellSpanningFeature,
    columnFilteringFeature,
    columnVisibilityFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    filterFn_includesString,
    rowPaginationFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_basic,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData, makeSummaryData } from './makeData'
  import type { Cell } from '@tanstack/svelte-table'
  import type { Shift, SummaryRow } from './makeData'
  import './index.css'

  const features = tableFeatures({
    cellSelectionFeature,
    cellSpanningFeature,
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
  })

  const columnHelper = createColumnHelper<typeof features, Shift>()

  const columns = columnHelper.columns([
    columnHelper.accessor('region', {
      header: 'Region',
      sortFn: 'alphanumeric',
      // Adjacent rows that share a region merge into one vertically spanning
      // cell. Spans always derive from the rows that are actually rendered, so
      // sorting, filtering, and paging just change which rows are adjacent.
      spanRows: true,
    }),
    columnHelper.accessor('team', {
      header: 'Team',
      sortFn: 'alphanumeric',
      spanRows: true,
    }),
    columnHelper.accessor('shift', {
      header: 'Shift',
      sortFn: 'alphanumeric',
      // The predicate form: shifts only merge while the table is sorted by the
      // shift column, so the predicate itself is visibly reactive.
      spanRows: ({ column, value, anchorValue }) =>
        column.getIsSorted() !== false && value === anchorValue,
    }),
    columnHelper.accessor('employee', {
      header: 'Employee',
      sortFn: 'alphanumeric',
      filterFn: 'includesString',
    }),
    columnHelper.accessor('hours', {
      header: 'Hours',
      sortFn: 'basic',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      sortFn: 'alphanumeric',
      filterFn: 'includesString',
    }),
  ])

  const summaryFeatures = tableFeatures({
    cellSpanningFeature,
    columnVisibilityFeature,
  })

  const summaryColumnHelper = createColumnHelper<
    typeof summaryFeatures,
    SummaryRow
  >()

  const summaryColumns = summaryColumnHelper.columns([
    summaryColumnHelper.accessor('label', {
      header: 'Shift',
      // Subtotal rows render one label cell covering every column but the
      // total. `Infinity` clamps to the rest of the cell's pinned region.
      spanColumns: ({ row }) =>
        row.original.kind === 'subtotal' ? Infinity : 1,
    }),
    summaryColumnHelper.accessor('region', {
      header: 'Region',
    }),
    summaryColumnHelper.accessor('hours', {
      header: 'Hours',
    }),
  ])

  /**
   * Selection styling for the spanning table. A merged cell is always entirely
   * selected or entirely unselected: the selection bounds expand to enclose any
   * merge they touch, so the tint and the outline land on the rendered anchor.
   */
  function getCellClassName(cell: Cell<typeof features, Shift>): string {
    const base =
      cell.getRowSpan() > 1 ? 'cell-selectable span-cell' : 'cell-selectable'

    if (!cell.getIsSelected()) {
      return cell.getIsFocused() ? `${base} cell-focused` : base
    }

    const edges = cell.getSelectionEdges()

    return [
      base,
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

  let data = $state(makeData())
  const summaryData = makeSummaryData()
  let spanningEnabled = $state(true)
  const refreshData = () => (data = makeData())

  const table = createTable({
    debugTable: true,
    features,
    columns,
    get data() {
      return data
    },
    get enableCellSpanning() {
      return spanningEnabled
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 12 },
    },
  })

  const summaryTable = createTable({
    debugTable: true,
    features: summaryFeatures,
    columns: summaryColumns,
    data: summaryData,
  })

  const pagination = $derived(table.atoms.pagination.get())
</script>

{#snippet tableHead()}
  <thead>
    {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
      <tr>
        {#each headerGroup.headers as header (header.id)}
          <th colspan={header.colSpan}>
            <button
              type="button"
              class="sortable-header header-sort-button"
              onclick={header.column.getToggleSortingHandler()}
            >
              <FlexRender {header} />
              {{ asc: ' 🔼', desc: ' 🔽' }[
                header.column.getIsSorted() as string
              ] ?? ''}
            </button>
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
{/snippet}

<div class="demo-root">
  <div class="controls">
    <button onclick={() => refreshData()} class="demo-button">
      Regenerate Data
    </button>
    <label>
      <input
        type="checkbox"
        checked={spanningEnabled}
        onchange={(event) => (spanningEnabled = event.currentTarget.checked)}
      />
      Row spanning
    </label>
    {#each ['team', 'shift'] as columnId (columnId)}
      {@const column = table.getColumn(columnId)!}
      <label>
        <input
          type="checkbox"
          checked={column.getIsVisible()}
          onchange={column.getToggleVisibilityHandler()}
        />
        {String(column.columnDef.header)}
      </label>
    {/each}
    <select
      data-testid="status-filter"
      value={(table.getColumn('status')!.getFilterValue() as
        | string
        | undefined) ?? ''}
      onchange={(event) =>
        table
          .getColumn('status')!
          .setFilterValue(event.currentTarget.value || undefined)}
    >
      <option value="">All statuses</option>
      <option value="Approved">Approved</option>
      <option value="Pending">Pending</option>
      <option value="Rejected">Rejected</option>
    </select>
    <input
      data-testid="employee-filter"
      class="filter-input"
      placeholder="Filter employees..."
      value={(table.getColumn('employee')!.getFilterValue() as
        | string
        | undefined) ?? ''}
      oninput={(event) =>
        table
          .getColumn('employee')!
          .setFilterValue(event.currentTarget.value || undefined)}
    />
  </div>
  <div class="spacer-sm"></div>
  <div class="controls">
    <button
      class="demo-button-sm"
      onclick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      {'<'}
    </button>
    <button
      class="demo-button-sm"
      onclick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      {'>'}
    </button>
    <span>
      Page {pagination.pageIndex + 1} of {table.getPageCount()}
    </span>
    <select
      data-testid="page-size"
      value={pagination.pageSize}
      onchange={(event) => table.setPageSize(Number(event.currentTarget.value))}
    >
      {#each [10, 12, 36] as pageSize (pageSize)}
        <option value={pageSize}>
          Show {pageSize}
        </option>
      {/each}
    </select>
    <span>
      Visible columns:
      <span data-testid="visible-leaf-count"
        >{table.getVisibleLeafColumns().length}</span
      >
    </span>
    <span>
      Selected cells:
      <span data-testid="selected-count">{table.getSelectedCellCount()}</span>
    </span>
  </div>
  <div class="spacer-md"></div>
  <!-- The panels wrap into a grid whenever the viewport is wide enough. -->
  <div class="example-grid">
    <section class="example-panel">
      <h2 class="section-title">Row Spanning</h2>
      <table data-testid="span-table">
        {@render tableHead()}
        <tbody>
          {#each table.getRowModel().rows as row (row.id)}
            <tr>
              {#each row.getVisibleCells() as cell (cell.id)}
                {@const rowSpan = cell.getRowSpan()}
                {@const colSpan = cell.getColSpan()}
                <!--
                  A span of 0 means this cell is covered by a cell above or to
                  its left. Skip it. Do NOT render `rowspan="0"`: in HTML that
                  means "span to the end of the row group", so forgetting this
                  check merges the cell down the whole tbody instead of
                  rendering nothing.
                -->
                {#if rowSpan !== 0 && colSpan !== 0}
                  <td
                    rowspan={rowSpan}
                    colspan={colSpan}
                    class={getCellClassName(cell)}
                    onmousedown={cell.getSelectionStartHandler()}
                    onmouseenter={cell.getSelectionExtendHandler()}
                  >
                    <FlexRender {cell} />
                  </td>
                {/if}
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </section>

    <section class="example-panel">
      <h2 class="section-title">Reference (no spanning)</h2>
      <!-- The same table instance rendered flat. Under every sort, filter,
           and page combination the merged panel must describe exactly this
           grid. -->
      <table data-testid="reference-table">
        {@render tableHead()}
        <tbody>
          {#each table.getRowModel().rows as row (row.id)}
            <tr>
              {#each row.getVisibleCells() as cell (cell.id)}
                <td>
                  <FlexRender {cell} />
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </section>

    <section class="example-panel">
      <h2 class="section-title">Summary Rows (colSpan)</h2>
      <table data-testid="summary-table">
        <thead>
          {#each summaryTable.getHeaderGroups() as headerGroup (headerGroup.id)}
            <tr>
              {#each headerGroup.headers as header (header.id)}
                <th colspan={header.colSpan}>
                  <FlexRender {header} />
                </th>
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#each summaryTable.getRowModel().rows as row (row.id)}
            <tr class={row.original.kind === 'subtotal' ? 'subtotal-row' : undefined}>
              {#each row.getVisibleCells() as cell (cell.id)}
                {@const rowSpan = cell.getRowSpan()}
                {@const colSpan = cell.getColSpan()}
                {#if rowSpan !== 0 && colSpan !== 0}
                  <td rowspan={rowSpan} colspan={colSpan}>
                    <FlexRender {cell} />
                  </td>
                {/if}
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
  </div>
  <div class="spacer-md"></div>
  <pre data-testid="table-state">{JSON.stringify(table.store.get(), null, 2)}</pre>
</div>
