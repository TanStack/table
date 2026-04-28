import {
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  createTable,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type {
  ColumnResizeDirection,
  ColumnResizeMode,
} from '@tanstack/solid-table'
import type { Person } from './makeData'

const _features = tableFeatures({ columnResizingFeature, columnSizingFeature })

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
        header: () => <span>Last Name</span>,
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
            header: () => <span>Visits</span>,
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

function App() {
  const [data, setData] = createSignal(makeData(10))
  const refreshData = () => setData(makeData(10))
  const stressTest = () => setData(makeData(100))
  const [columnResizeMode, setColumnResizeMode] =
    createSignal<ColumnResizeMode>('onChange')
  const [columnResizeDirection, setColumnResizeDirection] =
    createSignal<ColumnResizeDirection>('ltr')

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns,
      get data() {
        return data()
      },
      get columnResizeMode() {
        return columnResizeMode()
      },
      get columnResizeDirection() {
        return columnResizeDirection()
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state,
  )

  const resizerTransform = (
    header: ReturnType<typeof table.getHeaderGroups>[number]['headers'][number],
  ) => {
    if (columnResizeMode() === 'onEnd' && header.column.getIsResizing()) {
      const delta = table.store.state.columnResizing.deltaOffset ?? 0
      const dir = table.options.columnResizeDirection === 'rtl' ? -1 : 1
      return `translateX(${dir * delta}px)`
    }
    return ''
  }

  return (
    <div class="p-2">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100 rows)</button>
      </div>
      <select
        value={columnResizeMode()}
        onChange={(e) =>
          setColumnResizeMode(e.currentTarget.value as ColumnResizeMode)
        }
        class="border p-2 border-black rounded"
      >
        <option value="onEnd">Resize: "onEnd"</option>
        <option value="onChange">Resize: "onChange"</option>
      </select>
      <select
        value={columnResizeDirection()}
        onChange={(e) =>
          setColumnResizeDirection(
            e.currentTarget.value as ColumnResizeDirection,
          )
        }
        class="border p-2 border-black rounded"
      >
        <option value="ltr">Resize Direction: "ltr"</option>
        <option value="rtl">Resize Direction: "rtl"</option>
      </select>
      <div style={{ direction: table.options.columnResizeDirection }}>
        <div class="h-4" />
        <div class="text-xl">{'<table/>'}</div>
        <div class="overflow-x-auto">
          <table style={{ width: `${table.getCenterTotalSize()}px` }}>
            <thead>
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th
                          colSpan={header.colSpan}
                          style={{ width: `${header.getSize()}px` }}
                        >
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                          <div
                            onDblClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            class={`resizer ${table.options.columnResizeDirection} ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                            style={{ transform: resizerTransform(header) }}
                          />
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody>
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <tr>
                    <For each={row.getAllCells()}>
                      {(cell) => (
                        <td style={{ width: `${cell.column.getSize()}px` }}>
                          <table.FlexRender cell={cell} />
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <div class="h-4" />
        <div class="text-xl">{'<div/> (relative)'}</div>
        <div class="overflow-x-auto">
          <div class="divTable" style={{ width: `${table.getTotalSize()}px` }}>
            <div class="thead">
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <div class="tr">
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <div
                          class="th"
                          style={{ width: `${header.getSize()}px` }}
                        >
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                          <div
                            onDblClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            class={`resizer ${table.options.columnResizeDirection} ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                            style={{ transform: resizerTransform(header) }}
                          />
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </div>
            <div class="tbody">
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <div class="tr">
                    <For each={row.getAllCells()}>
                      {(cell) => (
                        <div
                          class="td"
                          style={{ width: `${cell.column.getSize()}px` }}
                        >
                          <table.FlexRender cell={cell} />
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
        <div class="h-4" />
        <div class="text-xl">{'<div/> (absolute positioning)'}</div>
        <div class="overflow-x-auto">
          <div class="divTable" style={{ width: `${table.getTotalSize()}px` }}>
            <div class="thead">
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <div class="tr" style={{ position: 'relative' }}>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <div
                          class="th"
                          style={{
                            position: 'absolute',
                            left: `${header.getStart()}px`,
                            width: `${header.getSize()}px`,
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                          <div
                            onDblClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            class={`resizer ${table.options.columnResizeDirection} ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                            style={{ transform: resizerTransform(header) }}
                          />
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </div>
            <div class="tbody">
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <div class="tr" style={{ position: 'relative' }}>
                    <For each={row.getAllCells()}>
                      {(cell) => (
                        <div
                          class="td"
                          style={{
                            position: 'absolute',
                            left: `${cell.column.getStart()}px`,
                            width: `${cell.column.getSize()}px`,
                          }}
                        >
                          <table.FlexRender cell={cell} />
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
      <div class="h-4" />
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App
