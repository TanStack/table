<script lang="ts">
  import {
    createColumnHelper,
    createExpandedRowModel,
    createTable,
    FlexRender,
    rowExpandingFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Row } from '@tanstack/svelte-table'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({ rowExpandingFeature })

  const columnHelper = createColumnHelper<typeof _features, Person>()

  const columns = columnHelper.columns([
    columnHelper.display({
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
        if (row.getCanExpand()) {
          return 'expandable'
        }
        return 'leaf'
      },
    }),
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: ({ getValue }) => getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
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
      footer: (props) => props.column.id,
    }),
  ])

  let data = $state(makeData(20))
  const refreshData = () => { data = makeData(20) }
  const stressTest = () => { data = makeData(1_000) }

  const table = createTable(
    {
      debugTable: true,
      _features,
      _rowModels: {
        expandedRowModel: createExpandedRowModel(),
      },
      columns,
      get data() {
        return data
      },
      getRowCanExpand: () => true,
    },
    (state) => state,
  )
</script>

{#snippet ExpanderButton(row: Row<typeof _features, Person>)}
  {#if row.getCanExpand()}
    <button
      onclick={row.getToggleExpandedHandler()}
      style="cursor: pointer"
    >
      {row.getIsExpanded() ? 'v' : '>'}
    </button>
  {:else}
    *
  {/if}
{/snippet}

{#snippet SubComponent(row: Row<typeof _features, Person>)}
  <pre style="font-size: 10px">
    <code>{JSON.stringify(row.original, null, 2)}</code>
  </pre>
{/snippet}

<div class="p-2">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1k rows)</button>
  </div>
  <div class="h-2"></div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <div>
                  <FlexRender header={header} />
                </div>
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each table.getRowModel().rows as row (row.id)}
        <tr>
          {#each row.getAllCells() as cell (cell.id)}
            <td>
              {#if cell.column.id === 'expander'}
                {@render ExpanderButton(row)}
              {:else if cell.column.id === 'firstName'}
                <div style="padding-left: {row.depth * 2}rem">
                  <FlexRender cell={cell} />
                </div>
              {:else}
                <FlexRender cell={cell} />
              {/if}
            </td>
          {/each}
        </tr>
        {#if row.getIsExpanded()}
          <tr>
            <td colSpan={row.getAllCells().length}>
              {@render SubComponent(row)}
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
  <div class="h-2"></div>
  <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
</div>
