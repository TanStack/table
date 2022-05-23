<script lang="ts">
  import { writable } from 'svelte/store'
  import {
    createTable,
    getCoreRowModel,
    createTableInstance,
    getSortedRowModel,
  } from '@tanstack/svelte-table'
  import { makeData, Person } from './makeData'
  import './index.css'

  const table = createTable().setRowType<Person>()

  const columns = [
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

  const data = makeData(100_000)

  let sorting = []

  const setSorting = updater => {
    if (updater instanceof Function) {
      sorting = updater(sorting)
    } else {
      sorting = updater
    }
    options.update(old => ({
      ...old,
      state: {
        ...old.state,
        sorting,
      },
    }))
  }

  const options = writable(
    table.createOptions({
      data,
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: true,
    })
  )

  const refreshData = () => {
    console.log('refresh')
    options.update(prev => ({
      ...prev,
      data: makeData(100_000),
    }))
  }

  const rerender = () => {
    options.update(options => ({
      ...options,
      data,
    }))
  }

  const instance = createTableInstance(table, options)
</script>

<div class="p-2">
  <div class="h-2" />
  <table>
    <thead>
      {#each $instance.getHeaderGroups() as headerGroup}
        <tr>
          {#each headerGroup.headers as header}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <div
                  class:cursor-pointer={header.column.getCanSort()}
                  class:select-none={header.column.getCanSort()}
                  on:click={header.column.getToggleSortingHandler()}
                >
                  <svelte:component this={header.renderHeader()} />
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted().toString()] ?? ''}
                </div>
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each $instance.getRowModel().rows.slice(0, 10) as row}
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
  <div>{$instance.getRowModel().rows.length} Rows</div>
  <div>
    <button on:click={() => rerender()}>Force Rerender</button>
  </div>
  <div>
    <button on:click={() => refreshData()}>Refresh Data</button>
  </div>
  <pre>{JSON.stringify($instance.getState().sorting, null, 2)}</pre>
</div>
