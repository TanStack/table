<script lang="ts">
  // This example uses the new `createTableHook` method to create a re-usable table hook factory
  // instead of independently using the standalone `createTable` function and `createColumnHelper` method.
  // You can choose to use either way.

  import {
    createTableHook,
    FlexRender,
    rowSortingFeature,
    createSortedRowModel,
    sortFns,
  } from '@tanstack/svelte-table'
  import { makeData, type Person } from './makeData'
  import './index.css'

  // 1. New in V9! Tell the table which features and row models we want to use.
  const { createAppTable, createAppColumnHelper
  } = createTableHook({
    _features: { rowSortingFeature },
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
    },
    debugTable: true,
  })

  // 4. Create a helper object to help define our columns
  const columnHelper = createAppColumnHelper<Person>()

  // 5. Define the columns for your table with a stable reference
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => Number(row.age), {
      id: 'age',
      header: () => 'Age',
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: (info) => info.column.id,
    }),
  ])

  // 6. Store data with a $state rune for reactivity
  let data = $state(makeData(20))
  const refreshData = () => { data = makeData(20) }
  const stressTest = () => { data = makeData(1_000) }

  // 7. Create the table instance with the required columns and data.
  //    Features and row models are already defined in the createTableHook call above
  const table = createAppTable({
    debugTable: true,
    columns,
    get data() {
      return data
    },
  })
</script>

<!-- 8. Render your table markup from the table instance APIs -->
<div class="demo-root">
  <div>
    <button onclick={() => refreshData()
    }>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1k rows)</button>
  </div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)
      }
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th>
              {#if !header.isPlaceholder}
                <div
                  class={header.column.getCanSort()
                    ? 'sortable-header'
                    : ''}
                  role="button"
                  tabindex="0"
                  onclick={header.column.getToggleSortingHandler()}
                  onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      header.column.getToggleSortingHandler()?.(e)
                    }
                  }}
                >
                  <FlexRender header={header} />
                  {#if header.column.getIsSorted() === 'asc'}
                    {' '}🔼
                  {:else if header.column.getIsSorted() === 'desc'}
                    {' '}🔽
                  {/if}
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
              <FlexRender cell={cell} />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    <tfoot>
      {#each table.getFooterGroups() as footerGroup (footerGroup.id)}
        <tr>
          {#each footerGroup.headers as header (header.id)}
            <th>
              {#if !header.isPlaceholder}
                <FlexRender footer={header} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </tfoot>
  </table>
  <div class="spacer-md"></div>
  <pre>{JSON.stringify(table.store.state, null, 2)
  }</pre>
</div>
