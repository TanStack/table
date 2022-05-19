<script lang="ts">
  import { writable } from 'svelte/store'
  import {
    createTable,
    getCoreRowModel,
    createTableInstance,
  } from '@tanstack/svelte-table'
  import './index.css'

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
          cell: info => info.getValue(),
          footer: props => props.column.id,
        }),
        table.createDataColumn(row => row.lastName, {
          id: 'lastName',
          cell: info => info.getValue(),
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

  const options = writable(table.createOptions({
    data: defaultData,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  }))

  const rerender = () => {
    options.update(options => ({
      ...options,
      data: defaultData,
    }))
  }

  const instance = createTableInstance(table, options)
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
            <td>
              <svelte:component this={cell.renderCell()} />
            </td>
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
                <svelte:component this={header.renderFooter()} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </tfoot>
  </table>
  <div class="h-4" />
  <button on:click={() => rerender()} class="border p-2"> Rerender </button>
</div>
