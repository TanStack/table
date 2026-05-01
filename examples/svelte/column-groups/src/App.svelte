<script lang="ts">
  import type { ColumnDef } from '@tanstack/svelte-table'
  import {
    FlexRender,
    createTable,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData, type Person } from './makeData'
  import './index.css'

  let data = $state(makeData(20))
  const refreshData = () => { data = makeData(20) }
  const stressTest = () => { data = makeData(1_000) }

  const _features = tableFeatures({})

  const defaultColumns: ColumnDef<typeof _features, Person>[] = [
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

  const table = createTable({
    debugTable: true,
    _features,
    _rowModels: {},
    get data() {
      return data
    },
    columns: defaultColumns,
  })
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1k rows)</button>
  </div>
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
</div>
