<script lang="ts">
  import type {
    ColumnDef,
    ColumnVisibilityState,
    Updater,
  } from '@tanstack/svelte-table'
  import {
    columnVisibilityFeature,
    FlexRender,
    createTable,
    isFunction,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData, type Person } from './makeData'
  import './index.css'

  let data = $state(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(500_000) }

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

  const _features = tableFeatures({ columnVisibilityFeature })

  let columnVisibility = $state<ColumnVisibilityState>({})

  function setColumnVisibility(updater: Updater<ColumnVisibilityState>) {
    if (isFunction(updater)) {
      columnVisibility = updater(columnVisibility)
    } else columnVisibility = updater
  }

  const table = createTable({
    _features,
    _rowModels: {},
    get data() {
      return data
    },
    columns,
    state: {
      get columnVisibility() {
        return columnVisibility
      },
    },
    onColumnVisibilityChange: setColumnVisibility,
    debugTable: true,
  })
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (500k rows)</button>
  </div>
  <div class="column-toggle-panel">
    <div class="column-toggle-panel-header">
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
      <div class="column-toggle-row">
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
  <div class="spacer-md"></div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)
      }
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender header={header} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each table.getCoreRowModel().rows.slice(0, 20) as row (row.id)}
        <tr>
          {#each row.getVisibleCells() as cell (cell.id)}
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
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender footer={header} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </tfoot>
  </table>
  <div class="spacer-md"></div>
  <pre>{JSON.stringify(table.store.state.columnVisibility, null, 2)
  }</pre>
</div>
