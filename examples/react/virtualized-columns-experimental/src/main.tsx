import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  FlexRender,
  columnSizingFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { makeColumns, makeData } from './makeData'
import type {
  Cell,
  ColumnDef,
  Header,
  HeaderGroup,
  ReactTable,
  Row,
} from '@tanstack/react-table'
import type { Virtualizer } from '@tanstack/react-virtual'
import type { Person } from './makeData'

const _features = {
  columnSizingFeature,
  rowSortingFeature,
}

// All important CSS styles are included as inline styles for this example. This is not recommended for your code.
function App() {
  const columns = React.useMemo<Array<ColumnDef<typeof _features, Person>>>(
    () => makeColumns(1_000),
    [],
  )

  const [data, setData] = React.useState(() => makeData(1_000, columns))

  const refreshData = React.useCallback(() => {
    setData(makeData(1_000, columns))
  }, [columns])

  const stressTest = React.useCallback(() => {
    setData(makeData(10_000, columns))
  }, [columns])

  // The table does not live in the same scope as the virtualizers
  const table = useTable({
    _features,
    _rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
    columns,
    data,
    debugTable: true,
  })

  return (
    <div className="app">
      {process.env.NODE_ENV === 'development' ? (
        <p>
          <strong>Notice:</strong> You are currently running React in
          development mode. Virtualized rendering performance will be slightly
          degraded until this application is built for production.
        </p>
      ) : null}
      <div>({columns.length.toLocaleString()} columns)</div>
      <div>({data.length.toLocaleString()} rows)</div>
      <div>
        <button onClick={refreshData}>Regenerate Data</button>
        <button onClick={stressTest}>Stress Test (10k rows)</button>
      </div>
      <TableContainer table={table} />
    </div>
  )
}

interface TableContainerProps {
  table: ReactTable<typeof _features, Person>
}

function TableContainer({ table }: TableContainerProps) {
  const visibleColumns = table.getAllLeafColumns()

  // The virtualizers need to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  // we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
  const columnVirtualizer = useVirtualizer<
    HTMLDivElement,
    HTMLTableCellElement
  >({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(), // estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3, // how many columns to render on each side off screen each way (adjust this for performance)
    onChange: (instance) => {
      // requestAnimationFrame(() => {
      const virtualColumns = instance.getVirtualItems()
      // different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
      const virtualPaddingLeft = virtualColumns[0]?.start ?? 0
      const virtualPaddingRight =
        instance.getTotalSize() -
        (virtualColumns[virtualColumns.length - 1]?.end ?? 0)

      tableContainerRef.current?.style.setProperty(
        '--virtual-padding-left',
        `${virtualPaddingLeft}px`,
      )
      tableContainerRef.current?.style.setProperty(
        '--virtual-padding-right',
        `${virtualPaddingRight}px`,
      )
      // })
    },
  })

  return (
    <div
      className="container"
      ref={tableContainerRef}
      style={{
        overflow: 'auto', // our scrollable table container
        position: 'relative', // needed for sticky header
        height: '800px', // should be a fixed height
      }}
    >
      <table.Subscribe source={table.atoms.sorting}>
        {() => (
          // Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights
          <table style={{ display: 'grid' }}>
            <TableHead table={table} columnVirtualizer={columnVirtualizer} />
            <TableBody
              columnVirtualizer={columnVirtualizer}
              table={table}
              tableContainerRef={tableContainerRef}
            />
          </table>
        )}
      </table.Subscribe>
    </div>
  )
}

interface TableHeadProps {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  table: ReactTable<typeof _features, Person>
}

function TableHead({ table, columnVirtualizer }: TableHeadProps) {
  return (
    <thead
      style={{
        display: 'grid',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableHeadRow
          columnVirtualizer={columnVirtualizer}
          key={headerGroup.id}
          headerGroup={headerGroup}
        />
      ))}
    </thead>
  )
}

interface TableHeadRowProps {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  headerGroup: HeaderGroup<typeof _features, Person>
}

function TableHeadRow({ columnVirtualizer, headerGroup }: TableHeadRowProps) {
  const virtualColumnIndexes = columnVirtualizer.getVirtualIndexes()

  return (
    <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
      {/* fake empty column to the left for virtualization scroll padding */}
      <th className="left-column-spacer" />
      {virtualColumnIndexes.map((virtualColumnIndex) => {
        const header = headerGroup.headers[virtualColumnIndex]
        return (
          <TableHeadCellMemo
            columnVirtualizer={columnVirtualizer}
            key={header.id}
            header={header}
          />
        )
      })}
      {/* fake empty column to the right for virtualization scroll padding */}
      <th className="right-column-spacer" />
    </tr>
  )
}

interface TableHeadCellProps {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  header: Header<typeof _features, Person, unknown>
}

function TableHeadCell({
  columnVirtualizer: _columnVirtualizer,
  header,
}: TableHeadCellProps) {
  return (
    <th
      key={header.id}
      style={{
        display: 'flex',
        width: header.getSize(),
      }}
    >
      <div
        className={
          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
        }
        onClick={header.column.getToggleSortingHandler()}
        title={
          header.column.getCanSort()
            ? header.column.getNextSortingOrder() === 'asc'
              ? 'Sort ascending'
              : header.column.getNextSortingOrder() === 'desc'
                ? 'Sort descending'
                : 'Clear sort'
            : undefined
        }
      >
        <FlexRender header={header} />
        {{
          asc: ' 🔼',
          desc: ' 🔽',
        }[header.column.getIsSorted() as string] ?? null}
      </div>
    </th>
  )
}

const TableHeadCellMemo = React.memo(
  TableHeadCell,
  (_prev, next) => next.columnVirtualizer.isScrolling,
) as typeof TableHeadCell

interface TableBodyProps {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  table: ReactTable<typeof _features, Person>
  tableContainerRef: React.RefObject<HTMLDivElement | null>
}

function TableBody({
  columnVirtualizer,
  table,
  tableContainerRef,
}: TableBodyProps) {
  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null)
  const rowRefsMap = React.useRef<Map<number, HTMLTableRowElement>>(new Map())

  const { rows } = table.getRowModel()

  // dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without the need for `measureElement`
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 5,
    onChange: (instance) => {
      // requestAnimationFrame(() => {
      tableBodyRef.current!.style.height = `${instance.getTotalSize()}px`
      instance.getVirtualItems().forEach((virtualRow) => {
        const rowRef = rowRefsMap.current.get(virtualRow.index)
        if (!rowRef) return
        rowRef.style.transform = `translateY(${virtualRow.start}px)`
      })
      // })
    },
  })

  React.useLayoutEffect(() => {
    rowVirtualizer.measure()
  }, [table.store.state])

  const virtualRowIndexes = rowVirtualizer.getVirtualIndexes()

  return (
    <tbody
      ref={tableBodyRef}
      style={{
        display: 'grid',
        position: 'relative', // needed for absolute positioning of rows
      }}
    >
      {virtualRowIndexes.map((virtualRowIndex) => {
        const row = rows[virtualRowIndex]

        return (
          <TableBodyRow
            columnVirtualizer={columnVirtualizer}
            key={row.id}
            row={row}
            rowRefsMap={rowRefsMap}
            rowVirtualizer={rowVirtualizer}
            virtualRowIndex={virtualRowIndex}
          />
        )
      })}
    </tbody>
  )
}

interface TableBodyRowProps {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  row: Row<typeof _features, Person>
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  virtualRowIndex: number
  rowRefsMap: React.RefObject<Map<number, HTMLTableRowElement>>
}

function TableBodyRow({
  columnVirtualizer,
  row,
  rowVirtualizer,
  virtualRowIndex,
  rowRefsMap,
}: TableBodyRowProps) {
  const visibleCells = row.getAllCells()
  const virtualColumnIndexes = columnVirtualizer.getVirtualIndexes()

  return (
    <tr
      data-index={virtualRowIndex} // needed for dynamic row height measurement
      ref={(node) => {
        if (node && typeof virtualRowIndex !== 'undefined') {
          rowVirtualizer.measureElement(node)
          rowRefsMap.current.set(virtualRowIndex, node)
        }
      }} // measure dynamic row height
      key={row.id}
      style={{
        display: 'flex',
        position: 'absolute',
        width: '100%',
      }}
    >
      {/* fake empty column to the left for virtualization scroll padding */}
      <td className="left-column-spacer" />
      {virtualColumnIndexes.map((virtualColumnIndex) => {
        const cell = visibleCells[virtualColumnIndex]
        return (
          <TableBodyCellMemo
            key={cell.id}
            cell={cell}
            columnVirtualizer={columnVirtualizer}
          />
        )
      })}
      {/* fake empty column to the right for virtualization scroll padding */}
      <td className="right-column-spacer" />
    </tr>
  )
}

// TODO: Can rows be memoized in any way without breaking column virtualization?
// const TableBodyRowMemo = React.memo(
//   TableBodyRow,
//   (_prev, next) => next.rowVirtualizer.isScrolling
// )

interface TableBodyCellProps {
  cell: Cell<typeof _features, Person, unknown>
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
}

function TableBodyCell({
  cell,
  columnVirtualizer: _columnVirtualizer,
}: TableBodyCellProps) {
  return (
    <td
      key={cell.id}
      style={{
        display: 'flex',
        width: cell.column.getSize(),
      }}
    >
      <FlexRender cell={cell} />
    </td>
  )
}

const TableBodyCellMemo = React.memo(
  TableBodyCell,
  (_prev, next) => next.columnVirtualizer.isScrolling,
) as typeof TableBodyCell

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
