<script lang="ts">
  import type { ColumnDef } from '@tanstack/svelte-table'
  import {
    FlexRender,
    columnFacetingFeature,
    columnFilteringFeature,
    createFacetedMinMaxValues,
    createFacetedRowModel,
    createFacetedUniqueValues,
    createFilteredRowModel,
    createTable,
    filterFns,
    globalFilteringFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import DebouncedInput from './DebouncedInput.svelte'
  import ColumnFilter from './ColumnFilter.svelte'
  import './index.css'
  import { makeData, type Person } from './makeData'

  const _features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    columnFacetingFeature,
  })

  const columns: Array<ColumnDef<typeof _features, Person>> = [
    {
      header: 'Name',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.lastName,
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
        },
      ],
    },
    {
      header: 'Info',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'age',
          header: () => 'Age',
          footer: (props) => props.column.id,
        },
        {
          header: 'More Info',
          columns: [
            {
              accessorKey: 'visits',
              header: () => 'Visits',
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'status',
              header: 'Status',
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'progress',
              header: 'Profile Progress',
              footer: (props) => props.column.id,
            },
          ],
        },
      ],
    },
  ]

  let data = $state(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(500_000) }

  const table = createTable(
    {
      _features,
      _rowModels: {
        facetedRowModel: createFacetedRowModel(),
        facetedMinMaxValues: createFacetedMinMaxValues(),
        facetedUniqueValues: createFacetedUniqueValues(),
        filteredRowModel: createFilteredRowModel(filterFns),
      },
      get data() {
        return data
      },
      columns,
      globalFilterFn: 'includesString',
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
    },
    (state) => state,
  )
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (500k rows)</button>
  </div>
  <DebouncedInput
    value={table.state.globalFilter ?? ''}
    onchange={(value) => table.setGlobalFilter(String(value))}
    class="summary-panel"
    placeholder="Search all columns..."
  />
  <div class="spacer-sm"></div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)
      }
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender header={header} />
                {#if header.column.getCanFilter()}
                  <div>
                    <ColumnFilter column={header.column} {table} />
                  </div>
                {/if}
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each table.getRowModel().rows.slice(0, 10) as row (row.id)}
        <tr>
          {#each row.getAllCells() as cell (cell.id)}
            <td>
              <FlexRender cell={cell} />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <div>{table.getRowModel().rows.length.toLocaleString()
  } Rows</div>
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (500k rows)</button>
  </div>
  <pre>{JSON.stringify(table.state, null, 2)}</pre>
</div>
