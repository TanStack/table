<script lang="ts">
  import { faker } from '@faker-js/faker'
  import type {
    ColumnDef,
    ColumnOrderState,
    OnChangeFn,
    TableOptions,
    VisibilityState,
  } from '@tanstack/svelte-table'
  import {
    FlexRender,
    createSvelteTable,
    getCoreRowModel,
    getSortedRowModel,
  } from '@tanstack/svelte-table'
  import './index.css'
  import { makeData, type Person } from './makeData'
  import { createTableState } from './state.svelte'

  const columns: ColumnDef<Person>[] = [
    {
      header: 'Name',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          cell: info => info.getValue(),
          footer: props => props.column.id,
        },
        {
          accessorFn: row => row.lastName,
          id: 'lastName',
          cell: info => info.getValue(),
          header: () => 'Last Name',
          footer: props => props.column.id,
        },
      ],
    },
    {
      header: 'Info',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'age',
          header: () => 'Age',
          footer: props => props.column.id,
        },
        {
          header: 'More Info',
          columns: [
            {
              accessorKey: 'visits',
              header: () => 'Visits',
              footer: props => props.column.id,
            },
            {
              accessorKey: 'status',
              header: 'Status',
              footer: props => props.column.id,
            },
            {
              accessorKey: 'progress',
              header: 'Profile Progress',
              footer: props => props.column.id,
            },
          ],
        },
      ],
    },
  ]

  let data = $state(makeData(5000))

  const [columnOrder, setColumnOrder] = createTableState<ColumnOrderState>([])
  const [columnVisibility, setColumnVisibility] =
    createTableState<VisibilityState>({})

  const options: TableOptions<Person> = {
    get data() {
      return data
    },
    columns,
    state: {
      get columnOrder() {
        return columnOrder()
      },
      get columnVisibility() {
        return columnVisibility()
      },
    },
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  }

  const randomizeColumns = () => {
    table.setColumnOrder(_updater =>
      faker.helpers.shuffle(table.getAllLeafColumns().map(d => d.id))
    )
  }

  const table = createSvelteTable(options)
</script>

<div class="p-2">
  <div class="inline-block border border-black shadow rounded">
    <div class="px-1 border-b border-black">
      <label>
        <input
          checked={table.getIsAllColumnsVisible()}
          on:change={e => {
            console.info(table.getToggleAllColumnsVisibilityHandler()(e))
          }}
          type="checkbox"
        />{' '}
        Toggle All
      </label>
    </div>
    {#each table.getAllLeafColumns() as column}
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
    <button
      on:click={() => {
        data = makeData(5000)
      }}
      class="border p-1"
    >
      Refresh Data
    </button>
    <button on:click={() => randomizeColumns()} class="border p-1">
      Shuffle Columns
    </button>
  </div>
  <div class="h-4" />
  <table class="border-2 border-black">
    <thead>
      {#each table.getHeaderGroups() as headerGroup}
        <tr>
          {#each headerGroup.headers as header}
            <th colSpan={header.colSpan}>
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
      {#each table.getCoreRowModel().rows.slice(0, 20) as row}
        <tr>
          {#each row.getVisibleCells() as cell}
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
  </table>
  <pre>{JSON.stringify(table.getState().columnOrder, null, 2)}</pre>
</div>
