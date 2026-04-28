import { faker } from '@faker-js/faker'
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createTable,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Column } from '@tanstack/solid-table'
import type { JSX } from 'solid-js'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

const getCommonPinningStyles = (
  column: Column<typeof _features, Person>,
): JSX.CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    'box-shadow': isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: `${column.getSize()}px`,
    'z-index': isPinned ? 1 : 0,
  }
}

const defaultColumns = [
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
    cell: (info: any) => info.getValue(),
    footer: (props: any) => props.column.id,
    size: 180,
  },
  {
    accessorFn: (row: Person) => row.lastName,
    id: 'lastName',
    cell: (info: any) => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: (props: any) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'age',
    id: 'age',
    header: 'Age',
    footer: (props: any) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'visits',
    id: 'visits',
    header: 'Visits',
    footer: (props: any) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    footer: (props: any) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'progress',
    id: 'progress',
    header: 'Profile Progress',
    footer: (props: any) => props.column.id,
    size: 180,
  },
]

function App() {
  const [data, setData] = createSignal(makeData(20))
  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns: defaultColumns,
      get data() {
        return data()
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
      columnResizeMode: 'onChange',
    },
    (state) => state,
  )

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  return (
    <div class="p-2">
      <div class="inline-block border border-black shadow rounded">
        <div class="px-1 border-b border-black">
          <label>
            <input
              type="checkbox"
              checked={table.getIsAllColumnsVisible()}
              onChange={table.getToggleAllColumnsVisibilityHandler()}
            />{' '}
            Toggle All
          </label>
        </div>
        <For each={table.getAllLeafColumns()}>
          {(column) => (
            <div class="px-1">
              <label>
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />{' '}
                {column.id}
              </label>
            </div>
          )}
        </For>
      </div>
      <div class="h-4" />
      <div class="flex flex-wrap gap-2">
        <button onClick={() => refreshData()} class="border p-1">
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} class="border p-1">
          Stress Test (1k rows)
        </button>
        <button onClick={() => randomizeColumns()} class="border p-1">
          Shuffle Columns
        </button>
      </div>
      <div class="h-4" />
      <div class="table-container">
        <table style={{ width: `${table.getTotalSize()}px` }}>
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => {
                      const { column } = header
                      return (
                        <th
                          colSpan={header.colSpan}
                          style={{ ...getCommonPinningStyles(column) }}
                        >
                          <div class="whitespace-nowrap">
                            {header.isPlaceholder ? null : (
                              <>
                                <table.FlexRender header={header} />{' '}
                              </>
                            )}
                            {column.getIndex(column.getIsPinned() || 'center')}
                          </div>
                          {!header.isPlaceholder &&
                            header.column.getCanPin() && (
                              <div class="flex gap-1 justify-center">
                                {header.column.getIsPinned() !== 'left' ? (
                                  <button
                                    class="border rounded px-2"
                                    onClick={() => header.column.pin('left')}
                                  >
                                    {'<='}
                                  </button>
                                ) : null}
                                {header.column.getIsPinned() ? (
                                  <button
                                    class="border rounded px-2"
                                    onClick={() => header.column.pin(false)}
                                  >
                                    X
                                  </button>
                                ) : null}
                                {header.column.getIsPinned() !== 'right' ? (
                                  <button
                                    class="border rounded px-2"
                                    onClick={() => header.column.pin('right')}
                                  >
                                    {'=>'}
                                  </button>
                                ) : null}
                              </div>
                            )}
                          <div
                            onDblClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            class={`resizer ${
                              header.column.getIsResizing() ? 'isResizing' : ''
                            }`}
                          />
                        </th>
                      )
                    }}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows}>
              {(row) => (
                <tr>
                  <For each={row.getVisibleCells()}>
                    {(cell) => {
                      const { column } = cell
                      return (
                        <td style={{ ...getCommonPinningStyles(column) }}>
                          <table.FlexRender cell={cell} />
                        </td>
                      )
                    }}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App
