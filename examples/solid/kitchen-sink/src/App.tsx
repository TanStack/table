import { faker } from '@faker-js/faker'
import {
  aggregationFns,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  metaHelper,
  sortFns,
  stockFeatures,
  tableFeatures,
} from '@tanstack/solid-table'
import { useTanStackTableDevtools } from '@tanstack/solid-table-devtools'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import {
  For,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js'
import { makeData } from './makeData'
import type { JSX } from 'solid-js'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'
import type {
  Cell,
  Column,
  FilterFn,
  Header,
  Row,
  SortFn,
  TableFeatures,
} from '@tanstack/solid-table'

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilterFn: FilterFn<FuzzyFeatures, any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySortFn: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

const features = tableFeatures({
  ...stockFeatures,
  columnMeta: metaHelper<MyColumnMeta>(),
  filterMeta: metaHelper<FuzzyFilterMeta>(),
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilterFn },
  sortFns: { ...sortFns, fuzzy: fuzzySortFn },
  aggregationFns,
})

const { createAppTable, createAppColumnHelper } = createTableHook({
  features,
})

const sortStatusFn: SortFn<typeof features, Person> = (rowA, rowB) => {
  const statusOrder = ['single', 'complicated', 'relationship']
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  )
}

const getCommonPinningStyles = (
  column: Column<typeof features, Person>,
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
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    'z-index': isPinned ? 1 : 0,
  }
}

function IndeterminateCheckbox(
  props: {
    indeterminate?: boolean
  } & JSX.InputHTMLAttributes<HTMLInputElement>,
) {
  let ref!: HTMLInputElement
  createEffect(() => {
    if (typeof props.indeterminate === 'boolean') {
      ref.indeterminate = !props.checked && props.indeterminate
    }
  })

  return <input type="checkbox" ref={ref} {...props} />
}

function DebouncedInput(
  props: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>,
) {
  const [value, setValue] = createSignal(props.value)

  createEffect(() => {
    setValue(props.value)
  })

  createEffect(() => {
    const currentValue = value()
    const timeout = setTimeout(
      () => props.onChange(currentValue),
      props.debounce ?? 300,
    )
    onCleanup(() => clearTimeout(timeout))
  })

  return (
    <input
      {...props}
      value={value()}
      onInput={(e) => setValue(e.currentTarget.value)}
    />
  )
}

function Filter(props: { column: Column<typeof features, Person> }) {
  const filterVariant = () => props.column.columnDef.meta?.filterVariant
  const sortedUniqueValues = createMemo(() =>
    filterVariant() === 'range'
      ? []
      : Array.from(props.column.getFacetedUniqueValues().keys())
          .sort()
          .slice(0, 5000),
  )

  return (
    <>
      {filterVariant() === 'range' ? (
        <div class="filter-row">
          <DebouncedInput
            type="number"
            min={Number(props.column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(props.column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={
              (
                props.column.getFilterValue() as [number, number] | undefined
              )?.[0] ?? ''
            }
            onChange={(value) =>
              props.column.setFilterValue(
                (old: [number, number] | undefined) => [value, old?.[1]],
              )
            }
            placeholder={`Min${
              props.column.getFacetedMinMaxValues()?.[0] !== undefined
                ? ` (${props.column.getFacetedMinMaxValues()?.[0]})`
                : ''
            }`}
            class="filter-input"
          />
          <DebouncedInput
            type="number"
            min={Number(props.column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(props.column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={
              (
                props.column.getFilterValue() as [number, number] | undefined
              )?.[1] ?? ''
            }
            onChange={(value) =>
              props.column.setFilterValue(
                (old: [number, number] | undefined) => [old?.[0], value],
              )
            }
            placeholder={`Max${
              props.column.getFacetedMinMaxValues()?.[1] !== undefined
                ? ` (${props.column.getFacetedMinMaxValues()?.[1]})`
                : ''
            }`}
            class="filter-input"
          />
        </div>
      ) : filterVariant() === 'select' ? (
        <select
          onChange={(e) => props.column.setFilterValue(e.currentTarget.value)}
          value={(props.column.getFilterValue() ?? '').toString()}
          class="filter-select"
        >
          <option value="">All</option>
          <For each={sortedUniqueValues()}>
            {(value) => <option value={String(value)}>{String(value)}</option>}
          </For>
        </select>
      ) : (
        <>
          <datalist id={props.column.id + 'list'}>
            <For each={sortedUniqueValues()}>
              {(value) => <option value={String(value)} />}
            </For>
          </datalist>
          <DebouncedInput
            type="text"
            value={(props.column.getFilterValue() ?? '') as string}
            onChange={(value) => props.column.setFilterValue(value)}
            placeholder={`Search (${props.column.getFacetedUniqueValues().size})`}
            class="filter-select"
            list={props.column.id + 'list'}
          />
        </>
      )}
    </>
  )
}

type AppTable = ReturnType<typeof createAppTable<Person>>

function TableHeader(props: {
  header: Header<typeof features, Person, unknown>
  table: AppTable
}) {
  const column = () => props.header.column
  const style = () => ({
    ...getCommonPinningStyles(column()),
    'white-space': 'nowrap',
    width: `calc(var(--header-${props.header.id}-size) * 1px)`,
  })

  return (
    <th style={style()} colSpan={props.header.colSpan}>
      {!props.header.isPlaceholder ? (
        <>
          <div class="header-row">
            <div style={{ flex: 1, 'min-width': 0 }}>
              <div class="header-controls">
                {column().getCanPin() ? (
                  <span class="pin-actions">
                    {column().getIsPinned() !== 'left' ? (
                      <button
                        class="pin-button"
                        onClick={() => column().pin('left')}
                      >
                        {'<'}
                      </button>
                    ) : null}
                    {column().getIsPinned() ? (
                      <button
                        class="pin-button"
                        onClick={() => column().pin(false)}
                      >
                        x
                      </button>
                    ) : null}
                    {column().getIsPinned() !== 'right' ? (
                      <button
                        class="pin-button"
                        onClick={() => column().pin('right')}
                      >
                        {'>'}
                      </button>
                    ) : null}
                  </span>
                ) : null}
                {column().getCanGroup() ? (
                  <button
                    class="pin-button"
                    onClick={column().getToggleGroupingHandler()}
                  >
                    {column().getIsGrouped()
                      ? `Stop (${column().getGroupedIndex()})`
                      : 'Group'}
                  </button>
                ) : null}
              </div>
              {column().getCanSort() ? (
                <span
                  class="sortable-header"
                  onClick={column().getToggleSortingHandler()}
                >
                  <props.table.FlexRender header={props.header} />
                  {{
                    asc: ' ▲',
                    desc: ' ▼',
                  }[column().getIsSorted() as string] ?? null}
                </span>
              ) : (
                <props.table.FlexRender header={props.header} />
              )}
              {column().getCanFilter() ? (
                <div>
                  <Filter column={column()} />
                </div>
              ) : null}
            </div>
          </div>
          {column().getCanResize() ? (
            <div
              onDblClick={() => column().resetSize()}
              onMouseDown={props.header.getResizeHandler()}
              onTouchStart={props.header.getResizeHandler()}
              class={`resizer ${column().getIsResizing() ? 'isResizing' : ''}`}
            />
          ) : null}
        </>
      ) : null}
    </th>
  )
}

function TableCell(props: {
  cell: Cell<typeof features, Person, unknown>
  table: AppTable
}) {
  const className = () => {
    const groupingActive = props.table.atoms.grouping.get().length > 0
    const hasAggregation = !!props.cell.column.columnDef.aggregationFn
    return !groupingActive
      ? undefined
      : props.cell.getIsGrouped()
        ? 'cell-grouped'
        : hasAggregation && props.cell.getIsAggregated()
          ? 'cell-aggregated'
          : props.cell.getIsPlaceholder()
            ? 'cell-placeholder'
            : undefined
  }

  return (
    <td
      style={{
        ...getCommonPinningStyles(props.cell.column),
        width: `calc(var(--col-${props.cell.column.id}-size) * 1px)`,
      }}
      class={className()}
    >
      {props.cell.getIsGrouped() ? (
        <button
          onClick={props.cell.row.getToggleExpandedHandler()}
          style={{
            cursor: props.cell.row.getCanExpand() ? 'pointer' : 'normal',
          }}
        >
          {props.cell.row.getIsExpanded() ? 'v' : '>'}{' '}
          <props.table.FlexRender cell={props.cell} /> (
          {props.cell.row.subRows.length.toLocaleString()})
        </button>
      ) : (
        <props.table.FlexRender cell={props.cell} />
      )}
    </td>
  )
}

function PinnedRow(props: {
  row: Row<typeof features, Person>
  table: AppTable
}) {
  const bottomRows = () => props.table.getBottomRows()
  return (
    <tr
      class="pinned-row"
      style={{
        position: 'sticky',
        top:
          props.row.getIsPinned() === 'top'
            ? `${props.row.getPinnedIndex() * 32 + 48}px`
            : undefined,
        bottom:
          props.row.getIsPinned() === 'bottom'
            ? `${(bottomRows().length - 1 - props.row.getPinnedIndex()) * 32}px`
            : undefined,
        'z-index': 1,
      }}
    >
      <For each={props.row.getVisibleCells()}>
        {(cell) => <TableCell cell={cell} table={props.table} />}
      </For>
    </tr>
  )
}

const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
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
      <div class="column-toggle-row">
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />{' '}
        <button
          class="pin-button"
          onClick={() => row.pin(row.getIsPinned() === 'top' ? false : 'top')}
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
      <div style={{ 'padding-left': `${row.depth * 1.5}rem` }}>
        {row.getCanExpand() ? (
          <button
            onClick={row.getToggleExpandedHandler()}
            style={{ cursor: 'pointer', 'margin-right': '0.25rem' }}
          >
            {row.getIsExpanded() ? 'v' : '>'}
          </button>
        ) : (
          <span style={{ 'margin-right': '0.25rem' }}>-</span>
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
    sortFn: sortStatusFn,
    meta: { filterVariant: 'select' },
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    size: 200,
    header: 'Profile Progress',
    meta: { filterVariant: 'range' },
    aggregationFn: 'mean',
    cell: ({ getValue }) => `${Math.round(getValue<number>() * 100) / 100}%`,
    aggregatedCell: ({ getValue }) =>
      `${Math.round(getValue<number>() * 100) / 100}%`,
  }),
])

function App() {
  const [data, setData] = createSignal(makeData(1_000))
  const [, setRenderTick] = createSignal({})

  const table = createAppTable({
    key: 'kitchen-sink', // needed for devtools
    columns,
    get data() {
      return data()
    },
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
  })

  useTanStackTableDevtools(table)

  const columnSizeVars = createMemo(() => {
    void table.atoms.columnResizing.get()
    void table.atoms.columnSizing.get()
    const colSizes: Record<string, number> = {}
    for (const header of table.getFlatHeaders()) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  })

  const refreshData = () => setData(makeData(1_000))
  const nestedData = () => setData(makeData(100, 5, 3))
  const stress10k = () => setData(makeData(10_000))
  const stress100k = () => setData(makeData(100_000))
  const shuffleColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  return (
    <div class="demo-root">
      <h1>Kitchen Sink - All Features</h1>
      <div class="toolbar">
        <div class="toolbar-row">
          <DebouncedInput
            value={(table.atoms.globalFilter.get() ?? '') as string}
            onChange={(value) => table.setGlobalFilter(String(value))}
            class="global-filter-input"
            placeholder="Fuzzy search all columns..."
          />
        </div>
        <div class="toolbar-row">
          <button onClick={refreshData} class="demo-button demo-button-sm">
            Flat 1k
          </button>
          <button onClick={nestedData} class="demo-button demo-button-sm">
            Nested 100x5x3
          </button>
          <button onClick={stress10k} class="demo-button demo-button-sm">
            Stress 10k (flat)
          </button>
          <button onClick={stress100k} class="demo-button demo-button-sm">
            Stress 100k (flat)
          </button>
          <button
            onClick={() => table.reset()}
            class="demo-button demo-button-sm"
          >
            Reset Table
          </button>
          <button onClick={shuffleColumns} class="demo-button demo-button-sm">
            Shuffle Columns
          </button>
          <button
            onClick={() => setRenderTick({})}
            class="demo-button demo-button-sm"
          >
            Force Rerender
          </button>
          <span class="nowrap">
            {table.getSelectedRowModel().flatRows.length.toLocaleString()} of{' '}
            {table.getCoreRowModel().flatRows.length.toLocaleString()} selected
          </span>
        </div>
        <details class="column-toggle-panel">
          <summary class="column-toggle-panel-header">
            Column visibility
          </summary>
          <div class="column-toggle-row">
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
              <div class="column-toggle-row">
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
            )}
          </For>
        </details>
      </div>
      <div class="table-container">
        <table
          style={{ ...columnSizeVars(), width: `${table.getTotalSize()}px` }}
        >
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => <TableHeader header={header} table={table} />}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getTopRows()}>
              {(row) => <PinnedRow row={row} table={table} />}
            </For>
            <For each={table.getCenterRows()}>
              {(row) => (
                <tr>
                  <For each={row.getVisibleCells()}>
                    {(cell) => <TableCell cell={cell} table={table} />}
                  </For>
                </tr>
              )}
            </For>
            <For each={table.getBottomRows()}>
              {(row) => <PinnedRow row={row} table={table} />}
            </For>
          </tbody>
        </table>
      </div>
      <div class="spacer-sm" />
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {(table.atoms.pagination.get().pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.atoms.pagination.get().pageIndex + 1}
            onInput={(e) => {
              const page = e.currentTarget.value
                ? Number(e.currentTarget.value) - 1
                : 0
              table.setPageIndex(page)
            }}
            class="page-size-input"
          />
        </span>
        <select
          value={table.atoms.pagination.get().pageSize}
          onChange={(e) => table.setPageSize(Number(e.currentTarget.value))}
        >
          <For each={[10, 20, 30, 50, 100]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
      <div class="spacer-sm" />
      <div class="nowrap">
        {table.getRowModel().rows.length.toLocaleString()} rows on this page (
        {table.getFilteredRowModel().rows.length.toLocaleString()} filtered of{' '}
        {table.getCoreRowModel().rows.length.toLocaleString()} total)
      </div>
      <div class="spacer-md" />
      <details>
        <summary>Table state (live)</summary>
        <pre class="state-dump">
          {JSON.stringify(table.store.get(), null, 2)}
        </pre>
      </details>
    </div>
  )
}

export default App
