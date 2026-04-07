<script lang="ts">
  import {
    columnResizingFeature,
    columnSizingFeature,
    createColumnHelper,
    createTable,
    FlexRender,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({
    columnSizingFeature,
    columnResizingFeature,
  })

  const columnHelper = createColumnHelper<typeof _features, Person>()

  const columns = columnHelper.columns([
    columnHelper.group({
      header: 'Name',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
        }),
      ]),
    }),
    columnHelper.group({
      header: 'Info',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
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
          footer: (props) => props.column.id,
        }),
      ]),
    }),
  ])

  let data = $state(makeData(200))

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns,
      get data() {
        return data
      },
      defaultColumn: { minSize: 60, maxSize: 800 },
      columnResizeMode: 'onChange',
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => ({
      columnSizing: state.columnSizing,
      columnResizing: state.columnResizing,
    }),
  )

  function getColumnSizeVars() {
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }

  function colSizeVarsToStyle(vars: Record<string, number>) {
    return Object.entries(vars)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')
  }
</script>

<div class="p-2">
  <i>
    This example has artificially slow cell renders to simulate complex usage
  </i>
  <div class="h-4"></div>
  <pre style="min-height: 10rem">
    {JSON.stringify(table.store.state, null, 2)}
  </pre>
  <div class="h-4"></div>
  ({data.length} rows)
  <div class="overflow-x-auto">
    <div
      class="divTable"
      style="{colSizeVarsToStyle(getColumnSizeVars())}; width: {table.getTotalSize()}px"
    >
      <div class="thead">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <div class="tr">
            {#each headerGroup.headers as header (header.id)}
              <div
                class="th"
                style="width: calc(var(--header-{header.id}-size) * 1px)"
              >
                {#if !header.isPlaceholder}
                  <FlexRender header={header} />
                {/if}
                <div
                  ondblclick={() => header.column.resetSize()}
                  onmousedown={header.getResizeHandler()}
                  ontouchstart={header.getResizeHandler()}
                  aria-hidden="true"
                  class="resizer {header.column.getIsResizing()
                    ? 'isResizing'
                    : ''}"
                ></div>
              </div>
            {/each}
          </div>
        {/each}
      </div>
      <div class="tbody">
        {#each table.getRowModel().rows as row (row.id)}
          <div class="tr">
            {#each row.getAllCells() as cell (cell.id)}
              {@const _ = (() => {
                // simulate expensive render
                for (const _i of Array.from({ length: 10000 })) {
                  Math.random()
                }
              })()}
              <div
                class="td"
                style="width: calc(var(--col-{cell.column.id}-size) * 1px)"
              >
                {cell.renderValue()}
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
