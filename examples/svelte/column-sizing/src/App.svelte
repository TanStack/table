<script lang="ts">
  import {
    columnSizingFeature,
    createColumnHelper,
    createTable,
    FlexRender,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import './index.css'

  const _features = tableFeatures({ columnSizingFeature })

  type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
  }

  const defaultData: Array<Person> = [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50,
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80,
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10,
    },
  ]

  const columnHelper = createColumnHelper<typeof _features, Person>()

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
      size: 120,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
      footer: (props) => props.column.id,
      size: 120,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      footer: (props) => props.column.id,
      size: 100,
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      footer: (props) => props.column.id,
      size: 80,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
      size: 200,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: (props) => props.column.id,
      size: 200,
    }),
  ])

  let data = $state([...defaultData])

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
</script>

<div class="p-2">
  <div class="flex flex-wrap gap-2">
    <div class="text-xl">Initial Column Sizes</div>
    <br />
    {#each table.getAllColumns() as column}
      <div>
        <label>
          {column.id}
          <input
            type="number"
            value={column.getSize()}
            oninput={(e) => {
              table.setColumnSizing({
                ...table.store.state.columnSizing,
                [column.id]: Number((e.target as HTMLInputElement).value),
              })
            }}
            class="border rounded p-1 w-24 ml-2"
          />
        </label>
      </div>
    {/each}
  </div>
  <div class="flex gap-2"></div>
  <div class="h-4"></div>
  <div class="text-xl">{'<table/>'}</div>
  <div class="overflow-x-auto">
    <table style="width: {table.getCenterTotalSize()}px">
      <thead>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as header (header.id)}
              <th
                colSpan={header.colSpan}
                style="width: {header.getSize()}px"
              >
                {#if !header.isPlaceholder}
                  <FlexRender header={header} />
                {/if}
                <div></div>
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getRowModel().rows as row (row.id)}
          <tr>
            {#each row.getAllCells() as cell (cell.id)}
              <td style="width: {cell.column.getSize()}px">
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="h-4"></div>
  <div class="text-xl">{'<div/> (relative)'}</div>
  <div class="overflow-x-auto">
    <div class="divTable" style="width: {table.getTotalSize()}px">
      <div class="thead">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <div class="tr">
            {#each headerGroup.headers as header (header.id)}
              <div class="th" style="width: {header.getSize()}px">
                {#if !header.isPlaceholder}
                  <FlexRender header={header} />
                {/if}
                <div></div>
              </div>
            {/each}
          </div>
        {/each}
      </div>
      <div class="tbody">
        {#each table.getRowModel().rows as row (row.id)}
          <div class="tr">
            {#each row.getAllCells() as cell (cell.id)}
              <div class="td" style="width: {cell.column.getSize()}px">
                <FlexRender cell={cell} />
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="h-4"></div>
  <div class="text-xl">{'<div/> (absolute positioning)'}</div>
  <div class="overflow-x-auto">
    <div class="divTable" style="width: {table.getTotalSize()}px">
      <div class="thead">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <div class="tr" style="position: relative">
            {#each headerGroup.headers as header (header.id)}
              <div
                class="th"
                style="position: absolute; left: {header.getStart()}px; width: {header.getSize()}px"
              >
                {#if !header.isPlaceholder}
                  <FlexRender header={header} />
                {/if}
                <div></div>
              </div>
            {/each}
          </div>
        {/each}
      </div>
      <div class="tbody">
        {#each table.getRowModel().rows as row (row.id)}
          <div class="tr" style="position: relative">
            {#each row.getAllCells() as cell (cell.id)}
              <div
                class="td"
                style="position: absolute; left: {cell.column.getStart()}px; width: {cell.column.getSize()}px"
              >
                <FlexRender cell={cell} />
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="h-4"></div>
  <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
</div>
