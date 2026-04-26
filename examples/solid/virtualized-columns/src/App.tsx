import {
  FlexRender,
  columnSizingFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { For, createSignal } from 'solid-js'
import { makeColumns, makeData } from './makeData'
import type {
  Cell,
  Header,
  HeaderGroup,
  Row,
  SolidTable,
} from '@tanstack/solid-table'
import type { VirtualItem, Virtualizer } from '@tanstack/solid-virtual'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  rowSortingFeature,
})

function App() {
  const columns = makeColumns(1_000)
  const [data, setData] = createSignal(makeData(1_000, columns))

  const refreshData = () => setData(makeData(1_000, columns))
  const stressTest = () => setData(makeData(10_000, columns))

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
    <div class="app">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (10k rows)</button>
      </div>
      <div>({columns.length.toLocaleString()} columns)</div>
      <div>({data().length.toLocaleString()} rows)</div>
      <TableContainer table={table} />
    </div>
  )
}

// Important: Keep both virtualizers and the scroll container ref in the same component.
// The ref must be undefined when createVirtualizer runs (before JSX return),
// so that onMount can set up scroll observers after the element is in the DOM.
function TableContainer(props: {
  table: SolidTable<typeof _features, Person>
}) {
  const visibleColumns = () => props.table.getVisibleLeafColumns()
  const rows = () => props.table.getRowModel().rows

  let tableContainerRef: HTMLDivElement | undefined

  // We are using a slightly different virtualization strategy for columns (compared to virtual rows)
  // in order to support dynamic row heights.
  const columnVirtualizer = createVirtualizer<
    HTMLDivElement,
    HTMLTableCellElement
  >({
    get count() {
      return visibleColumns().length
    },
    estimateSize: (index) => visibleColumns()[index].getSize(), // estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef ?? null,
    horizontal: true,
    overscan: 3, // how many columns to render on each side off screen (adjust this for performance)
  })

  // dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without `measureElement`
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

  // Different virtualization strategy for columns - instead of absolute and translateY,
  // we add empty columns to the left and right
  const virtualPaddingLeft = () => {
    const vcs = columnVirtualizer.getVirtualItems()
    return vcs.length ? (vcs[0]?.start ?? 0) : undefined
  }

  const virtualPaddingRight = () => {
    const vcs = columnVirtualizer.getVirtualItems()
    if (!vcs.length) return undefined
    return columnVirtualizer.getTotalSize() - (vcs[vcs.length - 1]?.end ?? 0)
  }

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
        <TableHead
          columnVirtualizer={columnVirtualizer}
          table={props.table}
          virtualPaddingLeft={virtualPaddingLeft()}
          virtualPaddingRight={virtualPaddingRight()}
        />
        <TableBody
          columnVirtualizer={columnVirtualizer}
          rowVirtualizer={rowVirtualizer}
          rows={rows}
          table={props.table}
          virtualPaddingLeft={virtualPaddingLeft()}
          virtualPaddingRight={virtualPaddingRight()}
        />
      </table>
    </div>
  )
}

function TableHead(props: {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  table: SolidTable<typeof _features, Person>
  virtualPaddingLeft: number | undefined
  virtualPaddingRight: number | undefined
}) {
  return (
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
          <TableHeadRow
            columnVirtualizer={props.columnVirtualizer}
            headerGroup={headerGroup}
            virtualPaddingLeft={props.virtualPaddingLeft}
            virtualPaddingRight={props.virtualPaddingRight}
            table={props.table}
          />
        )}
      </For>
    </thead>
  )
}

function TableHeadRow(props: {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  headerGroup: HeaderGroup<typeof _features, Person>
  virtualPaddingLeft: number | undefined
  virtualPaddingRight: number | undefined
  table: SolidTable<typeof _features, Person>
}) {
  const virtualColumns = () => props.columnVirtualizer.getVirtualItems()
  return (
    <tr style={{ display: 'flex', width: '100%' }}>
      {props.virtualPaddingLeft ? (
        // fake empty column to the left for virtualization scroll padding
        <th
          style={{ display: 'flex', width: `${props.virtualPaddingLeft}px` }}
        />
      ) : null}
      <For each={virtualColumns()}>
        {(virtualColumn) => {
          const header = props.headerGroup.headers[virtualColumn.index]
          return <TableHeadCell header={header} table={props.table} />
        }}
      </For>
      {props.virtualPaddingRight ? (
        // fake empty column to the right for virtualization scroll padding
        <th
          style={{ display: 'flex', width: `${props.virtualPaddingRight}px` }}
        />
      ) : null}
    </tr>
  )
}

function TableHeadCell(props: {
  header: Header<typeof _features, Person, unknown>
  table: SolidTable<typeof _features, Person>
}) {
  return (
    <th
      style={{
        display: 'flex',
        width: `${props.header.getSize()}px`,
      }}
    >
      <div
        class={
          props.header.column.getCanSort() ? 'cursor-pointer select-none' : ''
        }
        onClick={props.header.column.getToggleSortingHandler()}
      >
        <FlexRender header={props.header} />
        {(
          {
            asc: ' 🔼',
            desc: ' 🔽',
          } as Record<string, string>
        )[props.header.column.getIsSorted() as string] ?? null}
      </div>
    </th>
  )
}

function TableBody(props: {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  rows: () => Array<Row<typeof _features, Person>>
  table: SolidTable<typeof _features, Person>
  virtualPaddingLeft: number | undefined
  virtualPaddingRight: number | undefined
}) {
  const virtualRows = () => props.rowVirtualizer.getVirtualItems()

  return (
    <tbody
      style={{
        display: 'grid',
        height: `${props.rowVirtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
        position: 'relative', // needed for absolute positioning of rows
      }}
    >
      <For each={virtualRows()}>
        {(virtualRow) => {
          const row = props.rows()[virtualRow.index]
          return (
            <TableBodyRow
              columnVirtualizer={props.columnVirtualizer}
              row={row}
              rowVirtualizer={props.rowVirtualizer}
              virtualPaddingLeft={props.virtualPaddingLeft}
              virtualPaddingRight={props.virtualPaddingRight}
              virtualRow={virtualRow}
              table={props.table}
            />
          )
        }}
      </For>
    </tbody>
  )
}

function TableBodyRow(props: {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  row: Row<typeof _features, Person>
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  virtualPaddingLeft: number | undefined
  virtualPaddingRight: number | undefined
  virtualRow: VirtualItem
  table: SolidTable<typeof _features, Person>
}) {
  const visibleCells = () => props.row.getVisibleCells()
  const virtualColumns = () => props.columnVirtualizer.getVirtualItems()
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
      {props.virtualPaddingLeft ? (
        // fake empty column to the left for virtualization scroll padding
        <td
          style={{ display: 'flex', width: `${props.virtualPaddingLeft}px` }}
        />
      ) : null}
      <For each={virtualColumns()}>
        {(vc) => {
          const cell = visibleCells()[vc.index]
          return <TableBodyCell cell={cell} table={props.table} />
        }}
      </For>
      {props.virtualPaddingRight ? (
        // fake empty column to the right for virtualization scroll padding
        <td
          style={{ display: 'flex', width: `${props.virtualPaddingRight}px` }}
        />
      ) : null}
    </tr>
  )
}

function TableBodyCell(props: {
  cell: Cell<typeof _features, Person, unknown>
  table: SolidTable<typeof _features, Person>
}) {
  return (
    <td
      style={{
        display: 'flex',
        width: `${props.cell.column.getSize()}px`,
      }}
    >
      <FlexRender cell={props.cell} />
    </td>
  )
}

export default App
