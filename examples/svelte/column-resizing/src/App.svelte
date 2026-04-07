<script lang="ts">
  import {
    columnResizingFeature,
    columnSizingFeature,
    createColumnHelper,
    createTable,
    FlexRender,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import type {
    ColumnResizeDirection,
    ColumnResizeMode,
  } from '@tanstack/svelte-table'
  import './index.css'

  const _features = tableFeatures({
    columnResizingFeature,
    columnSizingFeature,
  })

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
    columnHelper.group({
      header: 'Name',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
        }),
      ]),
    }),
    columnHelper.group({
      header: 'Info',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
        }),
        columnHelper.group({
          header: 'More Info',
          columns: columnHelper.columns([
            columnHelper.accessor('visits', {
              header: () => 'Visits',
              footer: (props) => props.column.id,
            }),
            columnHelper.accessor('status', {
              header: 'Status',
              footer: (props) => props.column.id,
            }),
            columnHelper.accessor('progress', {
              header: 'Profile Progress',
              footer: (props) => props.column.id,
            }),
          ]),
        }),
      ]),
    }),
  ])

  let data = $state([...defaultData])
  let columnResizeMode = $state<ColumnResizeMode>('onChange')
  let columnResizeDirection = $state<ColumnResizeDirection>('ltr')

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns,
      get data() {
        return data
      },
      get columnResizeMode() {
        return columnResizeMode
      },
      get columnResizeDirection() {
        return columnResizeDirection
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state,
  )

  function resizerTransform(
    header: ReturnType<typeof table.getHeaderGroups>[number]['headers'][number],
  ) {
    if (columnResizeMode === 'onEnd' && header.column.getIsResizing()) {
      const delta = table.store.state.columnResizing.deltaOffset ?? 0
      const dir = table.options.columnResizeDirection === 'rtl' ? -1 : 1
      return `translateX(${dir * delta}px)`
    }
    return ''
  }
</script>

<div class="p-2">
  <select
    value={columnResizeMode}
    onchange={(e) => {
      columnResizeMode = (e.target as HTMLSelectElement).value as ColumnResizeMode
    }}
    class="border p-2 border-black rounded"
  >
    <option value="onEnd">Resize: "onEnd"</option>
    <option value="onChange">Resize: "onChange"</option>
  </select>
  <select
    value={columnResizeDirection}
    onchange={(e) => {
      columnResizeDirection = (e.target as HTMLSelectElement)
        .value as ColumnResizeDirection
    }}
    class="border p-2 border-black rounded"
  >
    <option value="ltr">Resize Direction: "ltr"</option>
    <option value="rtl">Resize Direction: "rtl"</option>
  </select>
  <div style:direction={table.options.columnResizeDirection}>
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
                  <div
                    ondblclick={() => header.column.resetSize()}
                    onmousedown={header.getResizeHandler()}
                    ontouchstart={header.getResizeHandler()}
                    aria-hidden="true"
                    class="resizer {table.options
                      .columnResizeDirection} {header.column.getIsResizing()
                      ? 'isResizing'
                      : ''}"
                    style="transform: {resizerTransform(header)}"
                  ></div>
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
                  <div
                    ondblclick={() => header.column.resetSize()}
                    onmousedown={header.getResizeHandler()}
                    ontouchstart={header.getResizeHandler()}
                    aria-hidden="true"
                    class="resizer {table.options
                      .columnResizeDirection} {header.column.getIsResizing()
                      ? 'isResizing'
                      : ''}"
                    style="transform: {resizerTransform(header)}"
                  ></div>
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
                  <div
                    ondblclick={() => header.column.resetSize()}
                    onmousedown={header.getResizeHandler()}
                    ontouchstart={header.getResizeHandler()}
                    aria-hidden="true"
                    class="resizer {table.options
                      .columnResizeDirection} {header.column.getIsResizing()
                      ? 'isResizing'
                      : ''}"
                    style="transform: {resizerTransform(header)}"
                  ></div>
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
  </div>
  <div class="h-4"></div>
  <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
</div>
