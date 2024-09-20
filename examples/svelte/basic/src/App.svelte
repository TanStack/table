<script lang="ts">
  import type { ColumnDef, TableOptions } from '@tanstack/svelte-table'
  import {
    createTable,
    FlexRender,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import './index.css'

  // This example uses the classic standalone `createTable` util to create a table without the new `createTableHelper` util.

  // 1. Define what the shape of your data will be for each row
  type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
  }

  // 2. Create some dummy data with a stable reference (this could be an API response stored in useState or similar)
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

  // 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
  const _features = tableFeatures({})

  // 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns. Alternatively, check out the createTableHelper/createColumnHelper util for an even more type-safe way to define columns.
  const columns: ColumnDef<typeof _features, Person>[] = [
    {
      accessorKey: 'firstName',
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    },
    {
      accessorFn: (row) => row.lastName,
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
      footer: (info) => info.column.id,
    },
    {
      accessorKey: 'age',
      header: () => 'Age',
      footer: (info) => info.column.id,
    },
    {
      accessorKey: 'visits',
      header: () => 'Visits',
      footer: (info) => info.column.id,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      footer: (info) => info.column.id,
    },
    {
      accessorKey: 'progress',
      header: 'Profile Progress',
      footer: (info) => info.column.id,
    },
  ]

  // 5. Create the table instance with required _features, columns, and data
  const table = createTable({
    _features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
    _rowModels: {}, // `Core` row model is now included by default, but you can still override it here
    columns,
    data,
    // add additional table options here
  })
</script>

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
