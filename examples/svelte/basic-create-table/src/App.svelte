<script lang="ts">
  // This example uses the standalone `createTable` function to create a table without the `createTableHook` util.

  import { createColumnHelper, createTable, FlexRender, tableFeatures
  } from '@tanstack/svelte-table'
  import { makeData, type Person } from './makeData'
  import './index.css'

  // 1. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
  const features = tableFeatures({
  }) // util method to create sharable TFeatures object/type

  // 2. Create a column helper with the table features and row type
  const columnHelper = createColumnHelper<typeof features, Person>()

  // 3. Define the columns for your table with the column helper
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => Number(row.age), {
      id: 'age',
      header: () => 'Age',
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
    }),
  ])

  // 4. Store data with a $state rune for reactivity
  let data = $state(makeData(20))
  const refreshData = () => { data = makeData(20) }
  const stressTest = () => { data = makeData(1_000) }

  // 5. Create the table instance with required features, columns, and data
  const table = createTable({
    debugTable: true,
    features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
    columns,
    get data() {
      return data
    },
    // add additional table options here
  })
</script>

<!-- 6. Render your table markup from the table instance APIs -->
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
                <FlexRender header={header} />
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
</div>
