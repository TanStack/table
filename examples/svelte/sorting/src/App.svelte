<script lang="ts">
  import type {
    ColumnDef,
    SortingState,
    TableOptions,
  } from '@tanstack/svelte-table'
  import {
    FlexRender,
    RowSorting,
    createSortedRowModel,
    createTable,
    createTableState,
    renderComponent,
    sortingFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import Header from './Header.svelte'
  import './index.css'
  import { makeData, type Person } from './makeData'

  const _features = tableFeatures({
    RowSorting: RowSorting,
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

  const [sorting, setSorting] = createTableState<SortingState>([])

  const refreshData = () => {
    console.info('refresh')
    data = makeData(100_000) // stress test
  }

  const table = createTable({
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(),
    },
    _processingFns: {
      sortingFns,
    },
    get data() {
      return data
    },
    columns,
    state: {
      get sorting() {
        return sorting()
      },
    },
    onSortingChange: setSorting,
    debugTable: true,
  })
</script>

<div class="p-2">
  <div class="h-2"></div>
  <table>
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
      {#each table.getRowModel().rows.slice(0, 10) as row}
        <tr>
          {#each row.getAllCells() as cell}
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
    <tfoot>
      {#each table.getFooterGroups() as footerGroup}
        <tr>
          {#each footerGroup.headers as header}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.footer}
                  context={header.getContext()}
                />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </tfoot>
  </table>
  <div>{table.getRowModel().rows.length} Rows</div>
  <div>
    <button onclick={() => refreshData()}>Refresh Data</button>
  </div>
  <pre>{JSON.stringify(table.getState().sorting, null, 2)}</pre>
</div>
