<script lang="ts">
  import type { ColumnDef } from '@tanstack/svelte-table'
  import {
    FlexRender,
    createSortedRowModel,
    createTable,
    rowSortingFeature,
    renderComponent,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import Header from './Header.svelte'
  import './index.css'
  import { makeData, type Person } from './makeData'

  const _features = tableFeatures({
    rowSortingFeature,
  })

  const columns: ColumnDef<typeof _features, Person>[] = [
    {
      header: 'Name',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          header: ({ header }) => renderComponent(Header, { header }),
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.lastName,
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: ({ header }) =>
            renderComponent(Header, { label: 'Last Name', header }),
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
          header: ({ header }) =>
            renderComponent(Header, { label: 'Age', header }),
          footer: (props) => props.column.id,
        },
        {
          header: 'More Info',
          columns: [
            {
              accessorKey: 'visits',
              header: ({ header }) =>
                renderComponent(Header, { label: 'Visits', header }),
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'status',
              header: ({ header }) =>
                renderComponent(Header, { label: 'Status', header }),
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'progress',
              header: ({ header }) =>
                renderComponent(Header, { label: 'Progress', header }),
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

  const table = createTable(
    {
      _features,
      _rowModels: {
        sortedRowModel: createSortedRowModel(sortFns),
      },
      get data() {
        return data
      },
      columns,
      debugTable: true,
    },
    (state) => state, // Select all state for reactivity
  )
</script>

<div class="p-2">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
  </div>
  <div class="h-2"></div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
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
      {#each table.getRowModel().rows.slice(0, 10) as row (row.id)}
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
  <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
  </div>
  <pre>{JSON.stringify(table.state, null, 2)}</pre>
</div>
