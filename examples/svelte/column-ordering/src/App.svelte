<script lang="ts">
  import { writable } from 'svelte/store'
  import {
    createTable,
    getCoreRowModel,
    createTableInstance,
    getSortedRowModel,
  } from '@tanstack/svelte-table'
  import { makeData, Person } from './makeData'
  import faker from '@faker-js/faker'
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

  const data = makeData(5000)

  let columnOrder = []
  let columnVisibility = {}

  const setColumnOrder = updater => {
    if (updater instanceof Function) {
      columnOrder = updater(columnOrder)
    } else {
      columnOrder = updater
    }
    options.update(old => ({
      ...old,
      state: {
        ...old.state,
        columnOrder,
      },
    }))
  }

  const setColumnVisibility = updater => {
    if (updater instanceof Function) {
      columnVisibility = updater(columnVisibility)
    } else {
      columnVisibility = updater
    }
    options.update(old => ({
      ...old,
      state: {
        ...old.state,
        columnVisibility,
      },
    }))
  }

  const options = writable(
    table.createOptions({
      data,
      columns,
      state: {
        columnOrder,
        columnVisibility,
      },
      onColumnOrderChange: setColumnOrder,
      onColumnVisibilityChange: setColumnVisibility,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: true,
    })
  )

  const randomizeColumns = () => {
    $instance.setColumnOrder(_updater =>
      faker.helpers.shuffle($instance.getAllLeafColumns().map(d => d.id))
    )
  }

  const regenerate = () => {
    options.update(options => ({
      ...options,
      data: makeData(5000),
    }))
  }

  const instance = createTableInstance(table, options)
</script>

<div class="p-2">
  <div class="inline-block border border-black shadow rounded">
    <div class="px-1 border-b border-black">
      <label>
        <input
          checked={$instance.getIsAllColumnsVisible()}
          on:change={e => {
            console.info($instance.getToggleAllColumnsVisibilityHandler()(e))
          }}
          type="checkbox"
        />{' '}
        Toggle All
      </label>
    </div>
    {#each $instance.getAllLeafColumns() as column}
      <div class="px-1">
        <label>
          <input
            checked={column.getIsVisible()}
            on:change={column.getToggleVisibilityHandler()}
            type="checkbox"
          />{' '}
          {column.id}
        </label>
      </div>
    {/each}
  </div>
  <div class="h-4" />
  <div class="flex flex-wrap gap-2">
    <button on:click={() => regenerate()} class="border p-1">
      Regenerate
    </button>
    <button on:click={() => randomizeColumns()} class="border p-1">
      Shuffle Columns
    </button>
  </div>
  <div class="h-4" />
  <table class="border-2 border-black">
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
      {#each $instance.getCoreRowModel().rows.slice(0, 20) as row}
        <tr>
          {#each row.getVisibleCells() as cell}
            <td>
              <svelte:component this={cell.renderCell()} />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <pre>{JSON.stringify($instance.getState().columnOrder, null, 2)}</pre>
</div>
