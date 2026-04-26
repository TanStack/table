<script lang="ts">
  import { faker } from '@faker-js/faker'
  import {
    columnOrderingFeature,
    columnPinningFeature,
    columnVisibilityFeature,
    createTable,
    FlexRender,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { ColumnDef } from '@tanstack/svelte-table'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({
    columnVisibilityFeature,
    columnPinningFeature,
    columnOrderingFeature,
  })

  const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
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

  let data = $state(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(100_000) }

  const columns = defaultColumns

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns,
      get data() {
        return data
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state,
  )

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }
</script>

<div class="p-2">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
  </div>
  <div class="inline-block border border-black shadow rounded">
    <div class="px-1 border-b border-black">
      <label>
        <input
          type="checkbox"
          checked={table.getIsAllColumnsVisible()}
          onchange={table.getToggleAllColumnsVisibilityHandler()}
        />
        {' '}Toggle All
      </label>
    </div>
    {#each table.getAllLeafColumns() as column}
      <div class="px-1">
        <label>
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onchange={column.getToggleVisibilityHandler()}
          />
          {' '}{column.id}
        </label>
      </div>
    {/each}
  </div>
  <div class="h-4"></div>
  <div class="flex flex-wrap gap-2">
    <button onclick={() => refreshData()} class="border p-1">
      Regenerate Data
    </button>
    <button onclick={() => stressTest()} class="border p-1">
      Stress Test (100k rows)
    </button>
    <button onclick={() => randomizeColumns()} class="border p-1">
      Shuffle Columns
    </button>
  </div>
  <div class="h-4"></div>
  <p class="text-sm mb-2">
    This example takes advantage of the "splitting" APIs. (APIs that have
    "left", "center", and "right" modifiers)
  </p>
  <div class="flex gap-4">
    <table class="border-2 border-black">
      <thead>
        {#each table.getLeftHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colSpan={header.colSpan}>
                <div class="whitespace-nowrap">
                  {#if !header.isPlaceholder}
                    <FlexRender header={header} />
                  {/if}
                </div>
                {#if !header.isPlaceholder && header.column.getCanPin()}
                  <div class="flex gap-1 justify-center">
                    {#if header.column.getIsPinned() !== 'left'}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin('left')}
                      >
                        {'<='}
                      </button>
                    {/if}
                    {#if header.column.getIsPinned()}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin(false)}
                      >
                        X
                      </button>
                    {/if}
                    {#if header.column.getIsPinned() !== 'right'}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin('right')}
                      >
                        {'=>'}
                      </button>
                    {/if}
                  </div>
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getRowModel().rows.slice(0, 20) as row (row.id)}
          <tr>
            {#each row.getLeftVisibleCells() as cell (cell.id)}
              <td>
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <table class="border-2 border-black">
      <thead>
        {#each table.getCenterHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colSpan={header.colSpan}>
                <div class="whitespace-nowrap">
                  {#if !header.isPlaceholder}
                    <FlexRender header={header} />
                  {/if}
                </div>
                {#if !header.isPlaceholder && header.column.getCanPin()}
                  <div class="flex gap-1 justify-center">
                    {#if header.column.getIsPinned() !== 'left'}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin('left')}
                      >
                        {'<='}
                      </button>
                    {/if}
                    {#if header.column.getIsPinned()}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin(false)}
                      >
                        X
                      </button>
                    {/if}
                    {#if header.column.getIsPinned() !== 'right'}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin('right')}
                      >
                        {'=>'}
                      </button>
                    {/if}
                  </div>
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getRowModel().rows.slice(0, 20) as row (row.id)}
          <tr>
            {#each row.getCenterVisibleCells() as cell (cell.id)}
              <td>
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <table class="border-2 border-black">
      <thead>
        {#each table.getRightHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colSpan={header.colSpan}>
                <div class="whitespace-nowrap">
                  {#if !header.isPlaceholder}
                    <FlexRender header={header} />
                  {/if}
                </div>
                {#if !header.isPlaceholder && header.column.getCanPin()}
                  <div class="flex gap-1 justify-center">
                    {#if header.column.getIsPinned() !== 'left'}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin('left')}
                      >
                        {'<='}
                      </button>
                    {/if}
                    {#if header.column.getIsPinned()}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin(false)}
                      >
                        X
                      </button>
                    {/if}
                    {#if header.column.getIsPinned() !== 'right'}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin('right')}
                      >
                        {'=>'}
                      </button>
                    {/if}
                  </div>
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getRowModel().rows.slice(0, 20) as row (row.id)}
          <tr>
            {#each row.getRightVisibleCells() as cell (cell.id)}
              <td>
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <pre>{JSON.stringify(table.state, null, 2)}</pre>
</div>
