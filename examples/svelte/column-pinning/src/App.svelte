<script lang="ts">
  import { faker } from '@faker-js/faker'
  import type {
    ColumnDef,
    ColumnOrderState,
    ColumnPinningState,
    ColumnVisibilityState,
    Header,
    HeaderGroup,
    TableOptions,
  } from '@tanstack/svelte-table'
  import {
    ColumnPinning,
    ColumnVisibility,
    FlexRender,
    RowSorting,
    createSortedRowModel,
    createTable,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import './index.css'
  import { makeData, type Person } from './makeData'
  import { createTableState } from './state.svelte'

  const _features = tableFeatures({
    RowSorting,
    ColumnVisibility,
    ColumnPinning,
  })

  const columns: ColumnDef<typeof _features, Person>[] = [
    {
      header: 'Name',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.lastName,
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
        },
      ],
    },
    {
      header: 'Info',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'age',
          header: () => 'Age',
          footer: (props) => props.column.id,
        },
        {
          header: 'More Info',
          columns: [
            {
              accessorKey: 'visits',
              header: () => 'Visits',
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'status',
              header: 'Status',
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'progress',
              header: 'Profile Progress',
              footer: (props) => props.column.id,
            },
          ],
        },
      ],
    },
  ]

  let data = $state(makeData(5000))
  let isSplit = $state(false)

  const [columnOrder, setColumnOrder] = createTableState<ColumnOrderState>([])
  const [columnPinning, setColumnPinning] =
    createTableState<ColumnPinningState>({ left: [], right: [] })
  const [columnVisibility, setColumnVisibility] =
    createTableState<ColumnVisibilityState>({})

  const options: TableOptions<any, Person> = {
    _features,
    _rowModels: { sortedRowModel: createSortedRowModel() },
    get data() {
      return data
    },
    columns,
    state: {
      get columnOrder() {
        return columnOrder()
      },
      get columnPinning() {
        return columnPinning()
      },
      get columnVisibility() {
        return columnVisibility()
      },
    },
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    debugTable: true,
  }

  const randomizeColumns = () => {
    table.setColumnOrder((_updater) =>
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  const table = createTable(options)
</script>

{#snippet headerCell(header: Header<any, Person, unknown>)}
  <th colSpan={header.colSpan}>
    <div class="whitespace-nowrap">
      {#if !header.isPlaceholder}
        <FlexRender
          content={header.column.columnDef.header}
          context={header.getContext()}
        />
      {/if}
    </div>
    {#if !header.isPlaceholder && header.column.getCanPin()}
      <div class="flex gap-1 justify-center">
        {#if header.column.getIsPinned() !== 'left'}
          <button
            class="border rounded px-2"
            onclick={() => {
              header.column.pin('left')
            }}
          >
            {'<='}
          </button>
        {/if}
        {#if header.column.getIsPinned()}
          <button
            class="border rounded px-2"
            onclick={() => {
              header.column.pin(false)
            }}
          >
            X
          </button>
        {/if}
        {#if header.column.getIsPinned() !== 'right'}
          <button
            class="border rounded px-2"
            onclick={() => {
              header.column.pin('right')
            }}
          >
            {'=>'}
          </button>
        {/if}
      </div>
    {/if}
  </th>
{/snippet}

<div class="p-2">
  <div class="inline-block border border-black shadow rounded">
    <div class="px-1 border-b border-black">
      <label>
        <input
          checked={table.getIsAllColumnsVisible()}
          onchange={(e) => {
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
            onchange={column.getToggleVisibilityHandler()}
            type="checkbox"
          />{' '}
          {column.id}
        </label>
      </div>
    {/each}
  </div>
  <div class="h-4"></div>
  <div class="flex flex-wrap gap-2">
    <button
      onclick={() => {
        data = makeData(5000)
      }}
      class="border p-1"
    >
      Refresh Data
    </button>
    <button onclick={() => randomizeColumns()} class="border p-1">
      Shuffle Columns
    </button>
  </div>
  <div class="h-4"></div>
  <div>
    <label>
      <input
        type="checkbox"
        checked={isSplit}
        onchange={(e) => (isSplit = e.currentTarget.checked)}
      />{' '}
      Split Mode
    </label>
  </div>
  <div class={`flex ${isSplit ? 'gap-4' : ''}`}>
    {#if isSplit}
      <table class="border-2 border-black">
        <thead>
          {#each table.getLeftHeaderGroups() as headerGroup}
            <tr>
              {#each headerGroup.headers as header}
                {@render headerCell(header)}
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#each table.getCoreRowModel().rows.slice(0, 20) as row}
            <tr>
              {#each row.getLeftVisibleCells() as cell}
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
    {/if}
    <table class="border-2 border-black">
      <thead>
        {#each isSplit ? table.getCenterHeaderGroups() : table.getHeaderGroups() as headerGroup}
          <tr>
            {#each headerGroup.headers as header}
              {@render headerCell(header)}
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getCoreRowModel().rows.slice(0, 20) as row}
          <tr>
            {#each isSplit ? row.getCenterVisibleCells() : row.getVisibleCells() as cell}
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
    {#if isSplit}
      <table class="border-2 border-black">
        <thead>
          {#each table.getRightHeaderGroups() as headerGroup}
            <tr>
              {#each headerGroup.headers as header}
                {@render headerCell(header)}
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#each table.getRowModel().rows.slice(0, 20) as row}
            <tr>
              {#each row.getRightVisibleCells() as cell}
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
    {/if}
  </div>
  <br />
  <pre>{JSON.stringify(table.getState().columnPinning, null, 2)}</pre>
</div>
