<script lang="ts">
  import { createTableHelper, FlexRender } from '@tanstack/svelte-table'
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
  const tableHelper = createTableHelper({
    _features: {},
    // 3a. `_rowModels` defines client-side row models. `Core` row model is now
    //     included by default, but you can still override it here.
    _rowModels: {},
    // 3b. Optionally, set the `TData` type. Omit TData is this table helper
    //     will be used to create multiple tables with different data types.
    TData: {} as Person,
  })

  // 4. For convenience, destructure the desired utilities from `tableHelper`
  const { columnHelper, createTable } = tableHelper

  // 5. Define the columns for your table with a stable reference (in this case,
  //    defined statically outside of a react component)
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('lastName', {
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
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

  // 6. Create the table instance with columns and data. Featufres and row
  //    models are already defined in the `tableHelper` object that
  //    `createTable` was destructured from.
  const table = createTable({
    columns,
    data,
  })
</script>

<!-- 7. Render the table in markup using the Instance APIs. -->
<div class="p-2">
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup}
        <tr>
          {#each headerGroup.headers as header}
            <th>
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.header}
                  context={header.getContext()}
                />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each table.getRowModel().rows as row}
        <tr>
          {#each row.getAllCells() as cell}
            <td>
              <FlexRender
                content={cell.column.columnDef.cell}
                context={cell.getContext()}
              />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    <tfoot>
      {#each table.getFooterGroups() as footerGroup}
        <tr>
          {#each footerGroup.headers as header}
            <th>
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.footer}
                  context={header.getContext()}
                />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </tfoot>
  </table>
  <div class="h-4"></div>
</div>
