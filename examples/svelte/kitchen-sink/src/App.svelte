<script lang="ts">
  import { faker } from '@faker-js/faker'
  import {
    aggregationFns,
    createExpandedRowModel,
    createFacetedMinMaxValues,
    createFacetedRowModel,
    createFacetedUniqueValues,
    createFilteredRowModel,
    createGroupedRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTableHook,
    filterFns,
    FlexRender,
    metaHelper,
    sortFns,
    stockFeatures,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
  import type { RankingInfo } from '@tanstack/match-sorter-utils'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import type {
    Cell,
    Column,
    FilterFn,
    Header,
    Row,
    SortFn,
    TableFeatures,
  } from '@tanstack/svelte-table'
  import './index.css'

  interface MyColumnMeta {
    filterVariant?: 'text' | 'range' | 'select'
  }

  interface FuzzyFilterMeta {
    itemRank?: RankingInfo
  }

  type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

  const fuzzyFilter: FilterFn<FuzzyFeatures, any> = (
    row,
    columnId,
    value,
    addMeta,
  ) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta?.({ itemRank })
    return itemRank.passed
  }

  const fuzzySort: SortFn<FuzzyFeatures, any> = (
    rowA,
    rowB,
    columnId,
  ) => {
    let dir = 0
    if (rowA.columnFiltersMeta[columnId]) {
      dir = compareItems(
        rowA.columnFiltersMeta[columnId].itemRank!,
        rowB.columnFiltersMeta[columnId].itemRank!,
      )
    }
    return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
  }

  const sortStatusFn: SortFn<TableFeatures, Person> = (rowA, rowB) => {
    const statusOrder = ['single', 'complicated', 'relationship']
    return (
      statusOrder.indexOf(rowA.original.status) -
      statusOrder.indexOf(rowB.original.status)
    )
  }

  const features = tableFeatures({
    ...stockFeatures,
    columnMeta: metaHelper<MyColumnMeta>(),
    filterMeta: metaHelper<FuzzyFilterMeta>(),
    expandedRowModel: createExpandedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    facetedRowModel: createFacetedRowModel(),
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedUniqueValues: createFacetedUniqueValues(),
    groupedRowModel: createGroupedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: { ...filterFns, fuzzy: fuzzyFilter },
    sortFns: { ...sortFns, fuzzy: fuzzySort, status: sortStatusFn },
    aggregationFns,
  })

  const { createAppTable, createAppColumnHelper } = createTableHook({
    features,
  })

  const columnHelper = createAppColumnHelper<Person>()

  const columns = columnHelper.columns([
    columnHelper.display({
      id: 'select',
      size: 80,
      minSize: 80,
      maxSize: 80,
      enableSorting: false,
      enableGrouping: false,
      enableHiding: false,
      enableResizing: false,
      header: ({ table }) =>
        table.getIsAllPageRowsSelected()
          ? 'all'
          : table.getIsSomePageRowsSelected()
            ? 'some'
            : 'none',
      cell: ({ row }) => (row.getIsPinned() === 'top' ? 'Pinned' : 'Pin'),
    }),
    columnHelper.accessor('firstName', {
      id: 'firstName',
      size: 200,
      header: 'First Name',
      filterFn: 'fuzzy',
      sortFn: 'fuzzy',
      meta: { filterVariant: 'text' },
      getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      size: 180,
      header: 'Last Name',
      meta: { filterVariant: 'text' },
    }),
    columnHelper.accessor('age', {
      id: 'age',
      size: 200,
      header: 'Age',
      meta: { filterVariant: 'range' },
      aggregationFn: 'median',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100,
    }),
    columnHelper.accessor('visits', {
      id: 'visits',
      size: 200,
      header: 'Visits',
      meta: { filterVariant: 'range' },
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      size: 200,
      header: 'Status',
      sortFn: 'status',
      meta: { filterVariant: 'select' },
    }),
    columnHelper.accessor('progress', {
      id: 'progress',
      size: 200,
      header: 'Profile Progress',
      meta: { filterVariant: 'range' },
      aggregationFn: 'mean',
      cell: ({ getValue }) => `${Math.round(getValue<number>() * 100) / 100}%`,
      aggregatedCell: ({ getValue }) =>
        `${Math.round(getValue<number>() * 100) / 100}%`,
    }),
  ])

  let data = $state(makeData(1_000))
  const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()

  const table = createAppTable(
    {
      columns,
      get data() {
        return data
      },
      getSubRows: (row) => row.subRows,
      globalFilterFn: 'fuzzy',
      columnResizeMode: 'onChange',
      defaultColumn: { minSize: 200, maxSize: 800 },
      initialState: {
        columnOrder: columns.map((c) => c.id!),
        columnPinning: { left: ['select'], right: [] },
        pagination: { pageIndex: 0, pageSize: 20 },
      },
      keepPinnedRows: true,
      debugTable: true,
    },
    (state) => state,
  )

  function debounceSet(key: string, setValue: () => void) {
    clearTimeout(debounceTimers.get(key))
    debounceTimers.set(
      key,
      setTimeout(() => {
        setValue()
        debounceTimers.delete(key)
      }, 300),
    )
  }

  function getCommonPinningStyle(column: Column<typeof features, Person>) {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right')

    return [
      isLastLeftPinnedColumn
        ? 'box-shadow: -4px 0 4px -4px gray inset'
        : isFirstRightPinnedColumn
          ? 'box-shadow: 4px 0 4px -4px gray inset'
          : '',
      isPinned === 'left' ? `left: ${column.getStart('left')}px` : '',
      isPinned === 'right' ? `right: ${column.getAfter('right')}px` : '',
      `opacity: ${isPinned ? 0.97 : 1}`,
      `position: ${isPinned ? 'sticky' : 'relative'}`,
      `z-index: ${isPinned ? 1 : 0}`,
    ]
      .filter(Boolean)
      .join('; ')
  }

  function headerStyle(header: Header<typeof features, Person, unknown>) {
    return `${getCommonPinningStyle(header.column)}; white-space: nowrap; width: calc(var(--header-${header.id}-size) * 1px)`
  }

  function cellStyle(cell: Cell<typeof features, Person, unknown>) {
    return `${getCommonPinningStyle(cell.column)}; width: calc(var(--col-${cell.column.id}-size) * 1px)`
  }

  function cellClass(cell: Cell<typeof features, Person, unknown>) {
    const groupingActive = table.state.grouping.length > 0
    const hasAggregation = !!cell.column.columnDef.aggregationFn
    return !groupingActive
      ? undefined
      : cell.getIsGrouped()
        ? 'cell-grouped'
        : hasAggregation && cell.getIsAggregated()
          ? 'cell-aggregated'
          : cell.getIsPlaceholder()
            ? 'cell-placeholder'
            : undefined
  }

  function pinnedRowStyle(row: Row<typeof features, Person>) {
    const bottomRows = table.getBottomRows()
    return [
      'position: sticky',
      row.getIsPinned() === 'top'
        ? `top: ${row.getPinnedIndex() * 32 + 48}px`
        : '',
      row.getIsPinned() === 'bottom'
        ? `bottom: ${(bottomRows.length - 1 - row.getPinnedIndex()) * 32}px`
        : '',
      'z-index: 1',
    ]
      .filter(Boolean)
      .join('; ')
  }

  function tableStyle() {
    const styles = [`width: ${table.getTotalSize()}px`]
    for (const header of table.getFlatHeaders()) {
      styles.push(`--header-${header.id}-size: ${header.getSize()}`)
      styles.push(`--col-${header.column.id}-size: ${header.column.getSize()}`)
    }
    return styles.join('; ')
  }

  function sortedUniqueValues(column: Column<typeof features, Person>) {
    if (column.columnDef.meta?.filterVariant === 'range') return []
    return Array.from(column.getFacetedUniqueValues().keys())
      .sort()
      .slice(0, 5000)
  }

  function updateRangeFilter(
    column: Column<typeof features, Person>,
    index: 0 | 1,
    value: string,
  ) {
    column.setFilterValue((old: [number, number] | undefined) =>
      index === 0 ? [value, old?.[1]] : [old?.[0], value],
    )
  }

  const refreshData = () => { data = makeData(1_000) }
  const nestedData = () => { data = makeData(100, 5, 3) }
  const stress10k = () => { data = makeData(10_000) }
  const stress100k = () => { data = makeData(100_000) }
  const shuffleColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }
</script>

<div class="demo-root">
  <h1>Kitchen Sink - All Features</h1>
  <div class="toolbar">
    <div class="toolbar-row">
      <input
        class="global-filter-input"
        placeholder="Fuzzy search all columns..."
        value={(table.state.globalFilter ?? '') as string}
        oninput={(event) =>
          debounceSet('global', () =>
            table.setGlobalFilter((event.target as HTMLInputElement).value),
          )}
      />
    </div>
    <div class="toolbar-row">
      <button onclick={refreshData} class="demo-button demo-button-sm">Flat 1k</button>
      <button onclick={nestedData} class="demo-button demo-button-sm">Nested 100x5x3</button>
      <button onclick={stress10k} class="demo-button demo-button-sm">Stress 10k (flat)</button>
      <button onclick={stress100k} class="demo-button demo-button-sm">Stress 100k (flat)</button>
      <button onclick={() => table.reset()} class="demo-button demo-button-sm">Reset Table</button>
      <button onclick={shuffleColumns} class="demo-button demo-button-sm">Shuffle Columns</button>
      <span class="nowrap">
        {table.getSelectedRowModel().flatRows.length.toLocaleString()} of{' '}
        {table.getCoreRowModel().flatRows.length.toLocaleString()} selected
      </span>
    </div>
    <details class="column-toggle-panel">
      <summary class="column-toggle-panel-header">Column visibility</summary>
      <div class="column-toggle-row">
        <label>
          <input
            type="checkbox"
            checked={table.getIsAllColumnsVisible()}
            onchange={table.getToggleAllColumnsVisibilityHandler()}
          />{' '}
          Toggle All
        </label>
      </div>
      {#each table.getAllLeafColumns() as column (column.id)}
        <div class="column-toggle-row">
          <label>
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              disabled={!column.getCanHide()}
              onchange={column.getToggleVisibilityHandler()}
            />{' '}
            {column.id}
          </label>
        </div>
      {/each}
    </details>
  </div>

  <div class="table-container">
    <table style={tableStyle()}>
      <thead>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colSpan={header.colSpan} style={headerStyle(header)}>
                {#if !header.isPlaceholder}
                  <div class="header-row">
                    <div style="flex: 1; min-width: 0">
                      <div class="header-controls">
                        {#if header.column.getCanPin()}
                          <span class="pin-actions">
                            {#if header.column.getIsPinned() !== 'left'}
                              <button class="pin-button" onclick={() => header.column.pin('left')}>{'<'}</button>
                            {/if}
                            {#if header.column.getIsPinned()}
                              <button class="pin-button" onclick={() => header.column.pin(false)}>x</button>
                            {/if}
                            {#if header.column.getIsPinned() !== 'right'}
                              <button class="pin-button" onclick={() => header.column.pin('right')}>{'>'}</button>
                            {/if}
                          </span>
                        {/if}
                        {#if header.column.getCanGroup()}
                          <button class="pin-button" onclick={header.column.getToggleGroupingHandler()}>
                            {header.column.getIsGrouped()
                              ? `Stop (${header.column.getGroupedIndex()})`
                              : 'Group'}
                          </button>
                        {/if}
                      </div>
                      {#if header.column.id === 'select'}
                        <input
                          type="checkbox"
                          checked={table.getIsAllPageRowsSelected()}
                          indeterminate={table.getIsSomePageRowsSelected()}
                          onchange={table.getToggleAllPageRowsSelectedHandler()}
                        />
                      {:else if header.column.getCanSort()}
                        <button
                          type="button"
                          class="sortable-header header-sort-button"
                          onclick={header.column.getToggleSortingHandler()}
                        >
                          <FlexRender header={header} />
                          {header.column.getIsSorted() === 'asc'
                            ? ' ▲'
                            : header.column.getIsSorted() === 'desc'
                              ? ' ▼'
                              : ''}
                        </button>
                      {:else}
                        <FlexRender header={header} />
                      {/if}
                      {#if header.column.getCanFilter()}
                        <div>
                          {#if header.column.columnDef.meta?.filterVariant === 'range'}
                            <div class="filter-row">
                              <input
                                type="number"
                                class="filter-input"
                                min={header.column.getFacetedMinMaxValues()?.[0] ?? ''}
                                max={header.column.getFacetedMinMaxValues()?.[1] ?? ''}
                                value={(header.column.getFilterValue() as [number, number] | undefined)?.[0] ?? ''}
                                placeholder={`Min${header.column.getFacetedMinMaxValues()?.[0] !== undefined ? ` (${header.column.getFacetedMinMaxValues()?.[0]})` : ''}`}
                                oninput={(event) =>
                                  debounceSet(header.column.id + '-min', () =>
                                    updateRangeFilter(
                                      header.column,
                                      0,
                                      (event.target as HTMLInputElement).value,
                                    ),
                                  )}
                              />
                              <input
                                type="number"
                                class="filter-input"
                                min={header.column.getFacetedMinMaxValues()?.[0] ?? ''}
                                max={header.column.getFacetedMinMaxValues()?.[1] ?? ''}
                                value={(header.column.getFilterValue() as [number, number] | undefined)?.[1] ?? ''}
                                placeholder={`Max${header.column.getFacetedMinMaxValues()?.[1] !== undefined ? ` (${header.column.getFacetedMinMaxValues()?.[1]})` : ''}`}
                                oninput={(event) =>
                                  debounceSet(header.column.id + '-max', () =>
                                    updateRangeFilter(
                                      header.column,
                                      1,
                                      (event.target as HTMLInputElement).value,
                                    ),
                                  )}
                              />
                            </div>
                          {:else if header.column.columnDef.meta?.filterVariant === 'select'}
                            <select
                              class="filter-select"
                              value={(header.column.getFilterValue() ?? '').toString()}
                              onchange={(event) =>
                                header.column.setFilterValue(
                                  (event.target as HTMLSelectElement).value,
                                )}
                            >
                              <option value="">All</option>
                              {#each sortedUniqueValues(header.column) as value (String(value))}
                                <option value={String(value)}>{String(value)}</option>
                              {/each}
                            </select>
                          {:else}
                            <datalist id={header.column.id + 'list'}>
                              {#each sortedUniqueValues(header.column) as value (String(value))}
                                <option value={String(value)}></option>
                              {/each}
                            </datalist>
                            <input
                              type="text"
                              class="filter-select"
                              list={header.column.id + 'list'}
                              value={(header.column.getFilterValue() ?? '') as string}
                              placeholder={`Search (${header.column.getFacetedUniqueValues().size})`}
                              oninput={(event) =>
                                debounceSet(header.column.id, () =>
                                  header.column.setFilterValue(
                                    (event.target as HTMLInputElement).value,
                                  ),
                                )}
                            />
                          {/if}
                        </div>
                      {/if}
                    </div>
                  </div>
                  {#if header.column.getCanResize()}
                    <button
                      type="button"
                      aria-label={`Resize ${header.column.id} column`}
                      ondblclick={() => header.column.resetSize()}
                      onmousedown={header.getResizeHandler()}
                      ontouchstart={header.getResizeHandler()}
                      class={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                    ></button>
                  {/if}
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getTopRows() as row (row.id)}
          <tr class="pinned-row" style={pinnedRowStyle(row)}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <td style={cellStyle(cell)} class={cellClass(cell)}>
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
        {#each table.getCenterRows() as row (row.id)}
          <tr>
            {#each row.getVisibleCells() as cell (cell.id)}
              <td style={cellStyle(cell)} class={cellClass(cell)}>
                {#if cell.column.id === 'select'}
                  <div class="column-toggle-row">
                    <input
                      type="checkbox"
                      checked={cell.row.getIsSelected()}
                      disabled={!cell.row.getCanSelect()}
                      indeterminate={cell.row.getIsSomeSelected()}
                      onchange={cell.row.getToggleSelectedHandler()}
                    />{' '}
                    <button
                      class="pin-button"
                      onclick={() =>
                        cell.row.pin(
                          cell.row.getIsPinned() === 'top' ? false : 'top',
                        )}
                    >
                      {cell.row.getIsPinned() === 'top' ? 'Pinned' : 'Pin'}
                    </button>
                  </div>
                {:else if cell.column.id === 'firstName'}
                  <div style={`padding-left: ${cell.row.depth * 1.5}rem`}>
                    {#if cell.row.getCanExpand()}
                      <button
                        onclick={cell.row.getToggleExpandedHandler()}
                        style="cursor: pointer; margin-right: 0.25rem"
                      >
                        {cell.row.getIsExpanded() ? 'v' : '>'}
                      </button>
                    {:else}
                      <span style="margin-right: 0.25rem">-</span>
                    {/if}
                    <FlexRender cell={cell} />
                  </div>
                {:else if cell.getIsGrouped()}
                  <button
                    onclick={cell.row.getToggleExpandedHandler()}
                    style:cursor={cell.row.getCanExpand() ? 'pointer' : 'normal'}
                  >
                    {cell.row.getIsExpanded() ? 'v' : '>'}
                    <FlexRender cell={cell} />
                    ({cell.row.subRows.length.toLocaleString()})
                  </button>
                {:else}
                  <FlexRender cell={cell} />
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
        {#each table.getBottomRows() as row (row.id)}
          <tr class="pinned-row" style={pinnedRowStyle(row)}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <td style={cellStyle(cell)} class={cellClass(cell)}>
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="spacer-sm"></div>
  <div class="controls">
    <button class="demo-button demo-button-sm" onclick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>{'<<'}</button>
    <button class="demo-button demo-button-sm" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button>
    <button class="demo-button demo-button-sm" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button>
    <button class="demo-button demo-button-sm" onclick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>{'>>'}</button>
    <span class="inline-controls">
      <div>Page</div>
      <strong>
        {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
        {table.getPageCount().toLocaleString()}
      </strong>
    </span>
    <span class="inline-controls">
      | Go to page:
      <input
        type="number"
        min="1"
        max={table.getPageCount()}
        value={table.state.pagination.pageIndex + 1}
        oninput={(event) => {
          const page = (event.target as HTMLInputElement).value
            ? Number((event.target as HTMLInputElement).value) - 1
            : 0
          table.setPageIndex(page)
        }}
        class="page-size-input"
      />
    </span>
    <select
      value={table.state.pagination.pageSize}
      onchange={(event) =>
        table.setPageSize(Number((event.target as HTMLSelectElement).value))}
    >
      {#each [10, 20, 30, 50, 100] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div class="spacer-sm"></div>
  <div class="nowrap">
    {table.getRowModel().rows.length.toLocaleString()} rows on this page (
    {table.getFilteredRowModel().rows.length.toLocaleString()} filtered of{' '}
    {table.getCoreRowModel().rows.length.toLocaleString()} total)
  </div>
  <div class="spacer-md"></div>
  <details>
    <summary>Table state (live)</summary>
    <pre class="state-dump">{JSON.stringify(table.state, null, 2)}</pre>
  </details>
</div>
