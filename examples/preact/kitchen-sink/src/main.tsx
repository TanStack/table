import { render } from 'preact'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import { useEffect, useMemo, useReducer, useRef, useState } from 'preact/hooks'
import { faker } from '@faker-js/faker'
import {
  aggregationFns,
  createColumnHelper,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  metaHelper,
  sortFns,
  stockFeatures,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/preact-table-devtools'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { makeData } from './makeData'
import type { JSX } from 'preact'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'
import type {
  Cell,
  Column,
  FilterFn,
  Header,
  PreactTable,
  Row,
  SortFn,
  TableFeatures,
} from '@tanstack/preact-table'
import './index.css'

interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

// The filter meta that the fuzzy filter attaches to rows, declared per-table
// via the `filterMeta` slot below. No declaration merging needed!
interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// Broad features type for writing the custom fns below before the `features`
// object exists, with the filter meta type plugged in
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilter: FilterFn<FuzzyFeatures, any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

const features = tableFeatures({
  ...stockFeatures,
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: {
    ...sortFns,
    fuzzy: fuzzySort,
    sortStatus: (rowA: any, rowB: any) => {
      const statusOrder = ['single', 'complicated', 'relationship']
      return (
        statusOrder.indexOf(rowA.original.status) -
        statusOrder.indexOf(rowB.original.status)
      )
    },
  },
  aggregationFns,
  filterMeta: metaHelper<FuzzyFilterMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})

const getCommonPinningStyles = (
  column: Column<typeof features, Person>,
): JSX.CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
  }
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & JSX.InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current && typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [indeterminate, rest.checked])

  return <input type="checkbox" ref={ref} className={className} {...rest} />
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  const [value, setValue] = useState(initialValue)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <input
      {...props}
      value={value}
      onInput={(e) => {
        const nextValue = e.currentTarget.value
        setValue(nextValue)
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          onChange(nextValue)
        }, debounce)
      }}
    />
  )
}

function Filter({ column }: { column: Column<typeof features, Person> }) {
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnFilterValue = column.getFilterValue()
  const minMaxValues =
    filterVariant === 'range' ? column.getFacetedMinMaxValues() : undefined
  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === 'range'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant],
  )

  return filterVariant === 'range' ? (
    <div className="filter-row">
      <DebouncedInput
        type="number"
        min={Number(minMaxValues?.[0] ?? '')}
        max={Number(minMaxValues?.[1] ?? '')}
        value={(columnFilterValue as [number, number] | undefined)?.[0] ?? ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            value,
            old?.[1],
          ])
        }
        placeholder={`Min${minMaxValues?.[0] !== undefined ? ` (${minMaxValues[0]})` : ''}`}
        className="filter-input"
      />
      <DebouncedInput
        type="number"
        min={Number(minMaxValues?.[0] ?? '')}
        max={Number(minMaxValues?.[1] ?? '')}
        value={(columnFilterValue as [number, number] | undefined)?.[1] ?? ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            old?.[0],
            value,
          ])
        }
        placeholder={`Max${minMaxValues?.[1] !== undefined ? ` (${minMaxValues[1]})` : ''}`}
        className="filter-input"
      />
    </div>
  ) : filterVariant === 'select' ? (
    <select
      onChange={(e) => column.setFilterValue(e.currentTarget.value)}
      value={(columnFilterValue ?? '').toString()}
      className="filter-select"
    >
      <option value="">All</option>
      {sortedUniqueValues.map((value) => (
        <option value={value} key={String(value)}>
          {String(value)}
        </option>
      ))}
    </select>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.map((value) => (
          <option value={String(value)} key={String(value)} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search (${column.getFacetedUniqueValues().size})`}
        className="filter-select"
        list={column.id + 'list'}
      />
    </>
  )
}

function TableHeader({
  header,
  table,
}: {
  header: Header<typeof features, Person, unknown>
  table: PreactTable<typeof features, Person>
}) {
  const column = header.column
  const style: JSX.CSSProperties = {
    ...getCommonPinningStyles(column),
    whiteSpace: 'nowrap',
    width: `calc(var(--header-${header.id}-size) * 1px)`,
  }

  if (header.isPlaceholder) {
    return <th style={style} colSpan={header.colSpan} />
  }

  return (
    <th style={style} colSpan={header.colSpan}>
      <div className="header-row">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="header-controls">
            {column.getCanPin() ? (
              <span className="pin-actions">
                {column.getIsPinned() !== 'left' ? (
                  <button
                    className="pin-button"
                    onClick={() => column.pin('left')}
                    title="Pin left"
                  >
                    {'<'}
                  </button>
                ) : null}
                {column.getIsPinned() ? (
                  <button
                    className="pin-button"
                    onClick={() => column.pin(false)}
                    title="Unpin"
                  >
                    x
                  </button>
                ) : null}
                {column.getIsPinned() !== 'right' ? (
                  <button
                    className="pin-button"
                    onClick={() => column.pin('right')}
                    title="Pin right"
                  >
                    {'>'}
                  </button>
                ) : null}
              </span>
            ) : null}
            {column.getCanGroup() ? (
              <button
                className="pin-button"
                onClick={column.getToggleGroupingHandler()}
                title={
                  column.getIsGrouped()
                    ? 'Stop grouping by this column'
                    : 'Group by this column'
                }
              >
                {column.getIsGrouped()
                  ? `Stop (${column.getGroupedIndex()})`
                  : 'Group'}
              </button>
            ) : null}
          </div>
          {column.getCanSort() ? (
            <span
              className="sortable-header"
              onClick={column.getToggleSortingHandler()}
            >
              <table.FlexRender header={header} />
              {{
                asc: ' ▲',
                desc: ' ▼',
              }[column.getIsSorted() as string] ?? null}
            </span>
          ) : (
            <table.FlexRender header={header} />
          )}
          {column.getCanFilter() ? (
            <div>
              <Filter column={column} />
            </div>
          ) : null}
        </div>
      </div>
      {column.getCanResize() ? (
        <div
          onDblClick={() => column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`resizer ${column.getIsResizing() ? 'isResizing' : ''}`}
        />
      ) : null}
    </th>
  )
}

function TableCell({
  cell,
  table,
}: {
  cell: Cell<typeof features, Person, unknown>
  table: PreactTable<typeof features, Person>
}) {
  const groupingActive = table.state.grouping.length > 0
  const hasAggregation = !!cell.column.columnDef.aggregationFn
  const className = !groupingActive
    ? undefined
    : cell.getIsGrouped()
      ? 'cell-grouped'
      : hasAggregation && cell.getIsAggregated()
        ? 'cell-aggregated'
        : cell.getIsPlaceholder()
          ? 'cell-placeholder'
          : undefined

  return (
    <td
      style={{
        ...getCommonPinningStyles(cell.column),
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
      }}
      className={className}
    >
      {cell.getIsGrouped() ? (
        <button
          onClick={cell.row.getToggleExpandedHandler()}
          style={{ cursor: cell.row.getCanExpand() ? 'pointer' : 'normal' }}
        >
          {cell.row.getIsExpanded() ? 'v' : '>'}{' '}
          <table.FlexRender cell={cell} /> (
          {cell.row.subRows.length.toLocaleString()})
        </button>
      ) : (
        <table.FlexRender cell={cell} />
      )}
    </td>
  )
}

function PinnedRow({
  row,
  table,
}: {
  row: Row<typeof features, Person>
  table: PreactTable<typeof features, Person>
}) {
  const bottomRows = table.getBottomRows()
  return (
    <tr
      className="pinned-row"
      style={{
        position: 'sticky',
        top:
          row.getIsPinned() === 'top'
            ? `${row.getPinnedIndex() * 32 + 48}px`
            : undefined,
        bottom:
          row.getIsPinned() === 'bottom'
            ? `${(bottomRows.length - 1 - row.getPinnedIndex()) * 32}px`
            : undefined,
        zIndex: 1,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} cell={cell} table={table} />
      ))}
    </tr>
  )
}

function App() {
  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<typeof features, Person>()
    return columnHelper.columns([
      columnHelper.display({
        id: 'select',
        size: 80,
        minSize: 80,
        maxSize: 80,
        enableSorting: false,
        enableGrouping: false,
        enableHiding: false,
        enableResizing: false,
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            title="Select all on this page"
          />
        ),
        cell: ({ row }) => (
          <div className="column-toggle-row">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />{' '}
            <button
              className="pin-button"
              onClick={() =>
                row.pin(row.getIsPinned() === 'top' ? false : 'top')
              }
              title={row.getIsPinned() === 'top' ? 'Unpin row' : 'Pin row top'}
            >
              {row.getIsPinned() === 'top' ? 'Pinned' : 'Pin'}
            </button>
          </div>
        ),
      }),
      columnHelper.accessor('firstName', {
        id: 'firstName',
        size: 200,
        header: 'First Name',
        filterFn: 'fuzzy',
        sortFn: 'fuzzy',
        meta: { filterVariant: 'text' },
        getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row, getValue }) => (
          <div style={{ paddingLeft: `${row.depth * 1.5}rem` }}>
            {row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                style={{ cursor: 'pointer', marginRight: '0.25rem' }}
              >
                {row.getIsExpanded() ? 'v' : '>'}
              </button>
            ) : (
              <span style={{ marginRight: '0.25rem' }}>-</span>
            )}
            {String(getValue())}
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        size: 180,
        header: 'Last Name',
        meta: { filterVariant: 'text' },
      }),
      columnHelper.accessor('age', {
        id: 'age',
        size: 200,
        header: 'Age',
        meta: { filterVariant: 'range' },
        aggregationFn: 'median',
        aggregatedCell: ({ getValue }) =>
          Math.round(getValue<number>() * 100) / 100,
      }),
      columnHelper.accessor('visits', {
        id: 'visits',
        size: 200,
        header: 'Visits',
        meta: { filterVariant: 'range' },
        aggregationFn: 'sum',
        aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        size: 200,
        header: 'Status',
        sortFn: 'sortStatus',
        meta: { filterVariant: 'select' },
      }),
      columnHelper.accessor('progress', {
        id: 'progress',
        size: 200,
        header: 'Profile Progress',
        meta: { filterVariant: 'range' },
        aggregationFn: 'mean',
        cell: ({ getValue }) =>
          `${Math.round(getValue<number>() * 100) / 100}%`,
        aggregatedCell: ({ getValue }) =>
          `${Math.round(getValue<number>() * 100) / 100}%`,
      }),
    ])
  }, [])

  const [data, setData] = useState(() => makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const nestedData = () => setData(makeData(100, 5, 3))
  const stress10k = () => setData(makeData(10_000))
  const stress100k = () => setData(makeData(100_000))

  const table = useTable(
    {
      key: 'kitchen-sink', // needed for devtools
      features,
      columns,
      data,
      getSubRows: (row) => row.subRows,
      globalFilterFn: 'fuzzy',
      columnResizeMode: 'onChange',
      defaultColumn: { minSize: 200, maxSize: 800 },
      initialState: {
        columnOrder: columns.map((c) => c.id!),
        columnPinning: { left: ['select'], right: [] },
        pagination: { pageIndex: 0, pageSize: 20 },
      },
      keepPinnedRows: true,
      debugTable: true,
    },
    (state) => state,
  )

  useTanStackTableDevtools(table)

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.state.columnResizing, table.state.columnSizing])

  const shuffleColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  const selectedCount = table.getSelectedRowModel().flatRows.length

  return (
    <div className="demo-root">
      <h1>Kitchen Sink - All Features</h1>
      <div className="toolbar">
        <div className="toolbar-row">
          <DebouncedInput
            value={(table.state.globalFilter ?? '') as string}
            onChange={(value) => table.setGlobalFilter(String(value))}
            className="global-filter-input"
            placeholder="Fuzzy search all columns..."
          />
        </div>
        <div className="toolbar-row">
          <button onClick={refreshData} className="demo-button demo-button-sm">
            Flat 1k
          </button>
          <button onClick={nestedData} className="demo-button demo-button-sm">
            Nested 100x5x3
          </button>
          <button onClick={stress10k} className="demo-button demo-button-sm">
            Stress 10k (flat)
          </button>
          <button onClick={stress100k} className="demo-button demo-button-sm">
            Stress 100k (flat)
          </button>
          <button
            onClick={() => table.reset()}
            className="demo-button demo-button-sm"
          >
            Reset Table
          </button>
          <button
            onClick={shuffleColumns}
            className="demo-button demo-button-sm"
          >
            Shuffle Columns
          </button>
          <button
            onClick={() => rerender(undefined)}
            className="demo-button demo-button-sm"
          >
            Force Rerender
          </button>
          <span className="nowrap">
            {selectedCount.toLocaleString()} of{' '}
            {table.getCoreRowModel().flatRows.length.toLocaleString()} selected
          </span>
        </div>
        <details className="column-toggle-panel">
          <summary className="column-toggle-panel-header">
            Column visibility
          </summary>
          <div className="column-toggle-row">
            <label>
              <input
                type="checkbox"
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
              />{' '}
              Toggle All
            </label>
          </div>
          {table.getAllLeafColumns().map((column) => (
            <div key={column.id} className="column-toggle-row">
              <label>
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  disabled={!column.getCanHide()}
                  onChange={column.getToggleVisibilityHandler()}
                />{' '}
                {column.id}
              </label>
            </div>
          ))}
        </details>
      </div>
      <div className="table-container">
        <table style={{ ...columnSizeVars, width: table.getTotalSize() }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeader key={header.id} header={header} table={table} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getTopRows().map((row) => (
              <PinnedRow key={row.id} row={row} table={table} />
            ))}
            {table.getCenterRows().map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} cell={cell} table={table} />
                ))}
              </tr>
            ))}
            {table.getBottomRows().map((row) => (
              <PinnedRow key={row.id} row={row} table={table} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="spacer-sm" />
      <div className="controls">
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <div>Page</div>
          <strong>
            {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.state.pagination.pageIndex + 1}
            onInput={(e) => {
              const page = e.currentTarget.value
                ? Number(e.currentTarget.value) - 1
                : 0
              table.setPageIndex(page)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={table.state.pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.currentTarget.value))}
        >
          {[10, 20, 30, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="spacer-sm" />
      <div className="nowrap">
        {table.getRowModel().rows.length.toLocaleString()} rows on this page (
        {table.getFilteredRowModel().rows.length.toLocaleString()} filtered of{' '}
        {table.getCoreRowModel().rows.length.toLocaleString()} total)
      </div>
      <div className="spacer-md" />
      <details>
        <summary>Table state (live)</summary>
        <pre className="state-dump">{JSON.stringify(table.state, null, 2)}</pre>
      </details>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(
  <>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </>,
  rootElement,
)
