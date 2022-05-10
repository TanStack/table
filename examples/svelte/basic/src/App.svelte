<script lang="ts">
  import './index.css'
  import {
    createTable,
    getCoreRowModelSync,
    createTableInstance,
  } from '@tanstack/svelte-table'

  type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
  }

  const table = createTable().setRowType<Person>()

  const defaultData: Person[] = [
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

  const defaultColumns = [
    table.createGroup({
      header: 'Name',
      footer: props => props.column.id,
      columns: [
        table.createDataColumn('firstName', {
          cell: info => info.value,
          footer: props => props.column.id,
        }),
        table.createDataColumn(row => row.lastName, {
          id: 'lastName',
          cell: info => info.value,
          header: () => 'Last Name',
          footer: props => props.column.id,
        }),
      ],
    }),
    table.createGroup({
      header: 'Info',
      footer: props => props.column.id,
      columns: [
        table.createDataColumn('age', {
          header: () => 'Age',
          footer: props => props.column.id,
        }),
        table.createGroup({
          header: 'More Info',
          columns: [
            table.createDataColumn('visits', {
              header: () => 'Visits',
              footer: props => props.column.id,
            }),
            table.createDataColumn('status', {
              header: 'Status',
              footer: props => props.column.id,
            }),
            table.createDataColumn('progress', {
              header: 'Profile Progress',
              footer: props => props.column.id,
            }),
          ],
        }),
      ],
    }),
  ]

  let data = defaultData
  let columns = defaultColumns

  const rerender = () => {
    data = data
  }

  const instance = createTableInstance(table, {
    data,
    columns,
    getCoreRowModel: getCoreRowModelSync(),
  })
</script>

<div class="p-2">
  <table>
    <thead>
      {#each $instance.getHeaderGroups() as headerGroup}
        <tr>
          {#each headerGroup.headers as header}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <svelte:component this={header.renderHeader()} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each $instance.getRowModel().rows as row}
        <tr>
          {#each row.getVisibleCells() as cell}
            <td><svelte:component this={cell.renderCell} /></td>
          {/each}
        </tr>
      {/each}
    </tbody>
    <tfoot>
      {#each $instance.getFooterGroups() as footerGroup}
        <tr>
          {#each footerGroup.headers as header}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <svelte:component this={header.renderFooter} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </tfoot>
  </table>
  <div class="h-4" />
  <button onClick={() => rerender()} class="border p-2"> Rerender </button>
</div>
