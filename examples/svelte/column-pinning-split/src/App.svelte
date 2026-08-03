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

  const features = tableFeatures({
    columnVisibilityFeature,
    columnPinningFeature,
    columnOrderingFeature,
  })

  const defaultColumns: Array<ColumnDef<typeof features, Person>> = [
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
  const stressTest = () => { data = makeData(1_000_000) }

  const columns = defaultColumns

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return data
      },
      // initialState: { columnPinning: { start: ['firstName'], end: [] } }, // `start`/`end` follow layout direction
      // atoms: { columnPinning: columnPinningAtom }, // preferred: own pinning state with an external atom
      // state: { columnPinning }, // classic controlled state; pair with onColumnPinningChange
      // onColumnPinningChange: setColumnPinning,
      // enableColumnPinning: false, // disable pinning for every column; default true
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
  )

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1M rows)</button>
  </div>
  <div class="column-toggle-panel">
    <div class="column-toggle-panel-header">
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
      <div class="column-toggle-row">
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
  <div class="spacer-md"></div>
  <div class="button-row">
    <button onclick={() => randomizeColumns()} class="demo-button demo-button-sm">
      Shuffle Columns
    </button>
  </div>
  <div class="spacer-md"></div>
  <p class="demo-note">
    This example takes advantage of the "splitting" APIs. (APIs that have
    "left", "center", and "right" modifiers)
  </p>
  <div class="split-tables">
    <table class="outlined-table">
      <thead>
        {#each table.getStartHeaderGroups() as headerGroup (headerGroup.id)
        }
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colSpan={header.colSpan}>
                <div class="nowrap">
                  {#if !header.isPlaceholder}
                    <FlexRender header={header} />
                  {/if}
                </div>
                {#if !header.isPlaceholder && header.column.getCanPin()}
                  <div class="pin-actions">
                    {#if header.column.getIsPinned() !== 'start'}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin('start')}
                      >
                        {'<='}
                      </button>
                    {/if}
                    {#if header.column.getIsPinned()}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin(false)}
                      >
                        X
                      </button>
                    {/if}
                    {#if header.column.getIsPinned() !== 'end'}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin('end')}
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
            {#each row.getStartVisibleCells() as cell (cell.id)}
              <td>
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <table class="outlined-table">
      <thead>
        {#each table.getCenterHeaderGroups() as headerGroup (headerGroup.id)
        }
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colSpan={header.colSpan}>
                <div class="nowrap">
                  {#if !header.isPlaceholder}
                    <FlexRender header={header} />
                  {/if}
                </div>
                {#if !header.isPlaceholder && header.column.getCanPin()}
                  <div class="pin-actions">
                    {#if header.column.getIsPinned() !== 'start'}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin('start')}
                      >
                        {'<='}
                      </button>
                    {/if}
                    {#if header.column.getIsPinned()}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin(false)}
                      >
                        X
                      </button>
                    {/if}
                    {#if header.column.getIsPinned() !== 'end'}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin('end')}
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
    <table class="outlined-table">
      <thead>
        {#each table.getEndHeaderGroups() as headerGroup (headerGroup.id)
        }
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th colSpan={header.colSpan}>
                <div class="nowrap">
                  {#if !header.isPlaceholder}
                    <FlexRender header={header} />
                  {/if}
                </div>
                {#if !header.isPlaceholder && header.column.getCanPin()}
                  <div class="pin-actions">
                    {#if header.column.getIsPinned() !== 'start'}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin('start')}
                      >
                        {'<='}
                      </button>
                    {/if}
                    {#if header.column.getIsPinned()}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin(false)}
                      >
                        X
                      </button>
                    {/if}
                    {#if header.column.getIsPinned() !== 'end'}
                      <button
                        class="pin-button"
                        onclick={() => header.column.pin('end')}
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
            {#each row.getEndVisibleCells() as cell (cell.id)}
              <td>
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <pre data-testid="table-state">{JSON.stringify(table.store.get(), null, 2)
  }</pre>
</div>
