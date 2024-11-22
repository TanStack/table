<script lang="ts">
  import { createTableHelper, FlexRender } from '@tanstack/svelte-table'
  import './index.css'

  // This example uses the new `createTableHelper` method to create a re-usable table helper object instead of independently using the standalone `createTable` hook and `createColumnHelper` method. You can choose to use either way.

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
  const tableHelper = createTableHelper({
    _features: { columnSizingFeature: {} },
    _rowModels: {}, // client-side row models. `Core` row model is now included by default, but you can still override it here
    _rowModelFns: {}, // client-side processing functions used by the row models (sorting, filtering, etc.). Not needed in this basic example
    debugTable: true,
    // TData: {} as Person, // optionally, set the TData type for the table helper. Omit if this will be a table helper for multiple tables of all different data types
  })

  // 4. Create a helper object to help define our columns
  // const { columnHelper } = tableHelper // if TData was set in the table helper options - otherwise use the createColumnHelper method below
  const columnHelper = tableHelper.createColumnHelper<Person>()

  // 5. Define the columns for your table with a stable reference (in this case, defined statically outside of a react component)
  const columns = columnHelper.columns([
    // accessorKey method (most common for simple use-cases)
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    // accessorFn used (alternative) along with a custom id
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
      footer: (info) => info.column.id,
    }),
    // accessorFn used to transform the data
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

  // 7. Create the table instance with the required columns and data.
  // Features and row models are already defined in the table helper object above
  const table = tableHelper.createTable({
    columns,
    data,
    // add additional table options here or in the table helper above
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
