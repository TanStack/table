import {
  FlexRender,
  columnSizingFeature,
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Row, SolidTable } from '@tanstack/solid-table'
import type { VirtualItem, Virtualizer } from '@tanstack/solid-virtual'
import type { Person } from './makeData'

const _features = tableFeatures({ columnSizingFeature, rowSortingFeature })

// This is a dynamic row height example, which is more complicated, but allows for a more realistic table.
// See https://tanstack.com/virtual/v3/docs/examples/solid/table for a simpler fixed row height example.
function App() {
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 60,
    },
    {
      accessorKey: 'firstName',
      cell: (info: any) => info.getValue(),
    },
    {
      accessorFn: (row: Person) => row.lastName,
      id: 'lastName',
      cell: (info: any) => info.getValue(),
      header: () => <span>Last Name</span>,
    },
    {
      accessorKey: 'age',
      header: () => 'Age',
      size: 50,
    },
    {
      accessorKey: 'visits',
      header: () => <span>Visits</span>,
      size: 50,
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'progress',
      header: 'Profile Progress',
      size: 80,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: (info: any) => info.getValue<Date>().toLocaleString(),
      size: 250,
    },
  ]

  const [data, setData] = createSignal(makeData(200_000))

  const refreshData = () => setData(makeData(200_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = createTable({
    _features,
    _rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
    columns,
    get data() {
      return data()
    },
    debugTable: true,
  })

  return (
    <>
      <div class="app">
        <div>
          <button onClick={() => refreshData()}>Regenerate Data</button>
          <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
        </div>
        ({data().length.toLocaleString()} rows)
        <VirtualizedTable table={table} />
      </div>
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </>
  )
}

// Important: Keep the virtualizer and the scroll container ref in the same component.
// The ref must be undefined when createVirtualizer runs (before JSX return),
// so that onMount can set up scroll observers after the element is in the DOM.
function VirtualizedTable(props: {
  table: SolidTable<typeof _features, Person>
}) {
  let tableContainerRef: HTMLDivElement | undefined

  const rows = () => props.table.getRowModel().rows

  // Important: Keep the row virtualizer in the lowest component possible to avoid unnecessary re-renders.
  const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>(
    {
      get count() {
        return rows().length
      },
      estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
      getScrollElement: () => tableContainerRef ?? null,
      // measure dynamic row height, except in firefox because it measures table border height incorrectly
      measureElement:
        typeof window !== 'undefined' &&
        navigator.userAgent.indexOf('Firefox') === -1
          ? (element) => element.getBoundingClientRect().height
          : undefined,
      overscan: 5,
    },
  )

  return (
    <div
      class="container"
      ref={tableContainerRef}
      style={{
        overflow: 'auto',
        position: 'relative',
        height: '800px',
      }}
    >
      {/* Even though we're still using semantic table tags, we must use CSS grid and flexbox for dynamic row heights */}
      <table style={{ display: 'grid' }}>
        <thead
          style={{
            display: 'grid',
            position: 'sticky',
            top: '0px',
            'z-index': 1,
          }}
        >
          <For each={props.table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr style={{ display: 'flex', width: '100%' }}>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th
                      style={{
                        display: 'flex',
                        width: `${header.getSize()}px`,
                      }}
                    >
                      <div
                        class={
                          header.column.getCanSort() ? 'sortable-header' : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <FlexRender header={header} />
                        {(
                          {
                            asc: ' 🔼',
                            desc: ' 🔽',
                          } as Record<string, string>
                        )[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody
          style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
            position: 'relative', // needed for absolute positioning of rows
          }}
        >
          <For each={rowVirtualizer.getVirtualItems()}>
            {(virtualRow) => {
              const row = rows()[virtualRow.index]
              return (
                <TableBodyRow
                  row={row}
                  virtualRow={virtualRow}
                  rowVirtualizer={rowVirtualizer}
                  table={props.table}
                />
              )
            }}
          </For>
        </tbody>
      </table>
    </div>
  )
}

function TableBodyRow(props: {
  row: Row<typeof _features, Person>
  virtualRow: VirtualItem
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  table: SolidTable<typeof _features, Person>
}) {
  return (
    <tr
      data-index={props.virtualRow.index} // needed for dynamic row height measurement
      ref={(node) => props.rowVirtualizer.measureElement(node)} // measure dynamic row height
      style={{
        display: 'flex',
        position: 'absolute',
        transform: `translateY(${props.virtualRow.start}px)`, // this should always be a `style` as it changes on scroll
        width: '100%',
      }}
    >
      <For each={props.row.getAllCells()}>
        {(cell) => (
          <td
            style={{
              display: 'flex',
              width: `${cell.column.getSize()}px`,
            }}
          >
            <FlexRender cell={cell} />
          </td>
        )}
      </For>
    </tr>
  )
}

export default App
