<script lang="ts">
  import {
    createTableHook,
    FlexRender,
    renderSnippet,
  } from '@tanstack/svelte-table'
  import { capitalized, countup, spectrum } from './snippets.svelte'
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

  // 1. Define what the shape of your data will be for each row
  type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
  }

  // 2. Create some dummy data with a stable reference (this could be an API
  //    response stored in a rune).
  const data: Person[] = [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50,
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80,
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10,
    },
  ]

  // 3. New in V9! Tell the table which features and row models we want to use.
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
    columns,
    data,
  })
</script>

<!-- 7. Render the table in markup using the Instance APIs. -->
<div class="p-2">
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
