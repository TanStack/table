import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  FlexRender,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { makeColumns, makeData } from './makeData'
import type {
  Cell,
  Header,
  HeaderGroup,
  ReactTable,
  Row,
} from '@tanstack/react-table'
import type { Virtualizer } from '@tanstack/react-virtual'
import type { Person } from './makeData'

const features = {
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
}

const columnHelper = createColumnHelper<typeof features, Person>()

const DEFAULT_ROW_COUNT = 1_000
const DEFAULT_COLUMN_COUNT = 1_000
const STRESS_ROW_COUNT = 10_000
const STRESS_COLUMN_COUNT = 10_000

const makeTableColumns = (columnCount: number) =>
  columnHelper.columns(
    makeColumns(columnCount).map((column) =>
      columnHelper.accessor(column.accessorKey, {
        header: column.header,
        size: column.size,
      }),
    ),
  )

// All important CSS styles are included as inline styles for this example. This is not recommended for your code.
function App() {
  const [columns, setColumns] = React.useState(() =>
    makeTableColumns(DEFAULT_COLUMN_COUNT),
  )

  const [data, setData] = React.useState(() =>
    makeData(DEFAULT_ROW_COUNT, columns),
  )

  const refreshData = React.useCallback(() => {
    const nextColumns = makeTableColumns(DEFAULT_COLUMN_COUNT)
    setColumns(nextColumns)
    setData(makeData(DEFAULT_ROW_COUNT, nextColumns))
  }, [])

  const stressTestRows = React.useCallback(() => {
    setData(makeData(STRESS_ROW_COUNT, columns))
  }, [columns])

  const stressTestColumns = React.useCallback(() => {
    const nextColumns = makeTableColumns(STRESS_COLUMN_COUNT)
    setColumns(nextColumns)
    setData(makeData(data.length, nextColumns))
  }, [data.length])

  // The table does not live in the same scope as the virtualizers
  const table = useTable(
    {
      features,
      columns,
      data,
      debugTable: true,
    },
    (state) => state, // default selector
  )

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
        <button onClick={stressTestRows}>Stress Test (10k rows)</button>
        <button onClick={stressTestColumns}>Stress Test (10k columns)</button>
      </div>
      <TableContainer table={table} />
    </div>
  )
}

interface TableContainerProps {
  table: ReactTable<typeof features, Person>
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
      {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
      <table style={{ display: 'grid' }}>
        <TableHead table={table} columnVirtualizer={columnVirtualizer} />
        <TableBody
          columnVirtualizer={columnVirtualizer}
          table={table}
          tableContainerRef={tableContainerRef}
        />
      </table>
    </div>
  )
}

interface TableHeadProps {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>
  table: ReactTable<typeof features, Person>
}

function TableHead({ table, columnVirtualizer }: TableHeadProps) {
  return (
    <thead
      style={{
        display: 'grid',
        height: '34px',
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
  headerGroup: HeaderGroup<typeof features, Person>
}

function TableHeadRow({ columnVirtualizer, headerGroup }: TableHeadRowProps) {
  const virtualColumnIndexes = columnVirtualizer.getVirtualIndexes()

  return (
    <tr
      key={headerGroup.id}
      style={{ display: 'flex', height: '34px', width: '100%' }}
    >
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
  header: Header<typeof features, Person, unknown>
}

function TableHeadCell({
  columnVirtualizer: _columnVirtualizer,
  header,
}: TableHeadCellProps) {
  return (
    <th
      key={header.id}
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '34px',
        width: header.getSize(),
      }}
    >
      <div
        className={header.column.getCanSort() ? 'sortable-header' : ''}
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
  table: ReactTable<typeof features, Person>
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
  }, [table.state])

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
  row: Row<typeof features, Person>
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
  cell: Cell<typeof features, Person, unknown>
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
