<script lang="ts">
  import {
    createTableHook,
    FlexRender,
    renderSnippet,
  } from '@tanstack/svelte-table'
  import { capitalized, countup, spectrum } from './snippets.svelte'
  import { makeData, type Person } from './makeData'
  import './index.css'

  /**
   * This `svelte-table` example demonstrates the following:
   * - Creating a basic table with no additional features (sorting, filtering,
   *   grouping, etc),
   * - Creating and using a `table helper`,
   * - Defining columns with custom headers, cells, and footers using the table
   *   helper, and
   * - Rendering a table with the instance APIs.
   */

  // 1. Store data with a $state rune for reactivity
  let data = $state(makeData(20))
  const refreshData = () => { data = makeData(20) }
  const stressTest = () => { data = makeData(1_000) }

  // 2. New in V9! Tell the table which features and row models we want to use.
  //    In this case, this will be a basic table with no additional features
  const { createAppTable, createAppColumnHelper } = createTableHook({
    _features: {},
    // 3a. `_rowModels` defines client-side row models. `Core` row model is now
    //     included by default, but you can still override it here.
    _rowModels: {},
  })

  // 4. Create a column helper pre-bound to our features
  const columnHelper = createAppColumnHelper<Person>()

  // 5. Define the columns for your table with a stable reference (in this case,
  //    defined statically).
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      // 5a. Use the `renderSnippet` utility to render the snippet in the cell.
      cell: (info) => renderSnippet(capitalized, info.getValue()),
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
      cell: (info) => renderSnippet(capitalized, info.getValue()),
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      cell: (info) => renderSnippet(countup, info.getValue()),
    }),
    columnHelper.accessor('visits', {
      header: 'Visits',
      cell: (info) => renderSnippet(countup, info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      cell(info) {
        return renderSnippet(spectrum, {
          value: info.getValue(),
          min: 0,
          max: 100,
        })
      },
    }),
  ])

  // 6. Create the table instance with columns and data. Features and row
  //    models are already defined in the `createTableHook` call that
  //    `createAppTable` was returned from.
  const table = createAppTable({
    debugTable: true,
    columns,
    get data() {
      return data
    },
  })
</script>

<!-- 7. Render the table in markup using the Instance APIs. -->
<div class="p-2">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1k rows)</button>
  </div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
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
  </table>
</div>
