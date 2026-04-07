<script lang="ts">
  // This example uses the standalone `createTable` function to create a table without the `createTableHook` util.

  import { createTable, FlexRender, tableFeatures } from '@tanstack/svelte-table'
  import type { ColumnDef } from '@tanstack/svelte-table'
  import './index.css'

  // 1. Define what the shape of your data will be for each row
  type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
  }

  // 2. Create some dummy data with a stable reference (this could be an API response stored in a $state rune)
  const defaultData: Array<Person> = [
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
    {
      firstName: 'kevin',
      lastName: 'vandy',
      age: 12,
      visits: 100,
      status: 'Single',
      progress: 70,
    },
  ]

  // 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
  const _features = tableFeatures({}) // util method to create sharable TFeatures object/type

  // 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns.
  //    Alternatively, check out the createTableHook/createAppColumnHelper util for an even more type-safe way to define columns.
  const columns: Array<ColumnDef<typeof _features, Person>> = [
    {
      accessorKey: 'firstName', // accessorKey method (most common for simple use-cases)
      header: 'First Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.lastName, // accessorFn used (alternative) along with a custom id
      id: 'lastName',
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => Number(row.age), // accessorFn used to transform the data
      id: 'age',
      header: () => 'Age',
      cell: (info) => info.renderValue(),
    },
    {
      accessorKey: 'visits',
      header: () => 'Visits',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'progress',
      header: 'Profile Progress',
    },
  ]

  // 5. Store data with a $state rune for reactivity
  let data = $state([...defaultData])
  const rerender = () => (data = [...defaultData])

  // 6. Create the table instance with required _features, columns, and data
  const table = createTable({
    _features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
    _rowModels: {}, // `Core` row model is now included by default, but you can still override it here
    columns,
    get data() {
      return data
    },
    // add additional table options here
  })
</script>

<!-- 7. Render your table markup from the table instance APIs -->
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
  <div class="h-4"></div>
  <button onclick={() => rerender()} class="border p-2"> Rerender </button>
</div>
