import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  Subscribe,
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
} from '@tanstack/react-table'
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { useHotkeys } from '@tanstack/react-hotkeys'
import { useCreateAtom } from '@tanstack/react-store'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { makeData } from '../makeData'
import type { CSSProperties, HTMLProps } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from '../makeData'
import type {
  Cell,
  CellSelectionBounds,
  CellSelectionState,
  Column,
  FilterFn,
  Header,
  ReactTable,
  Row,
  SortFn,
  TableFeatures,
  TableState,
} from '@tanstack/react-table'

// =====================================================================
// Route (SSR entry) — data is generated only on the server (server fn)
// and serialized to the client so hydration sees the same rows. Random
// data generated during render would mismatch on every cell.
// =====================================================================

const getInitialData = createServerFn({ method: 'GET' }).handler(() =>
  makeData(1_000),
)

export const Route = createFileRoute('/')({
  loader: () => getInitialData(),
  component: App,
})

// =====================================================================
// Features (with type-only column meta slot)
// =====================================================================

interface MyColumnMeta {
  /** Per-column filter UI input variant. */
  filterVariant?: 'text' | 'range' | 'select'
}

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// Broad features type for writing custom fns before `features` exists,
// with the filter meta type plugged in
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

// =====================================================================
// Custom fuzzy filter / sort (from filters-fuzzy example)
// =====================================================================

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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  columnMeta: metaHelper<MyColumnMeta>(),
  filterMeta: metaHelper<FuzzyFilterMeta>(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  aggregationFns,
})

type KitchenSinkSelectedState = Omit<
  TableState<typeof features>,
  'cellSelection'
>

// =====================================================================
// Custom status sort (from sorting example)
// =====================================================================

const sortStatusFn: SortFn<typeof features, Person> = (rowA, rowB) => {
  const statusOrder = ['single', 'complicated', 'relationship']
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  )
}

// =====================================================================
// Sticky column-pinning helper (from column-pinning-sticky example)
// =====================================================================

const getCommonPinningStyles = (
  column: Column<typeof features, Person>,
): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'start' && column.getIsLastColumn('start')
  const isFirstRightPinnedColumn =
    isPinned === 'end' && column.getIsFirstColumn('end')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    insetInlineStart:
      isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    insetInlineEnd:
      isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
  }
}

// =====================================================================
// Components: IndeterminateCheckbox, Filter, DebouncedInput,
//             DraggableTableHeader, DragAlongCell
// =====================================================================

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
    // `checked` belongs here too: `getIsSomePageRowsSelected` stays true when
    // every page row is selected, so deselecting one only changes `checked`.
  }, [ref, indeterminate, rest.checked])

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
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedOnChange(e.target.value)
      }}
    />
  )
}

function Filter({ column }: { column: Column<typeof features, Person> }) {
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnFilterValue = column.getFilterValue()
  const minMaxValues =
    filterVariant === 'range' ? column.getFacetedMinMaxValues() : undefined

  const sortedUniqueValues = React.useMemo(
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
      onChange={(e) => column.setFilterValue(e.target.value)}
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

function DraggableTableHeader({
  header,
  table,
}: {
  header: Header<typeof features, Person, unknown>
  table: ReactTable<typeof features, Person, KitchenSinkSelectedState>
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({ id: header.column.id })

  const column = header.column

  return (
    // work around react compiler memoization for nested components using table/column/header APIs
    <Subscribe
      source={table.store}
      selector={(state) => ({
        columnPinning: state.columnPinning,
        grouping: state.grouping,
        sorting: state.sorting,
      })}
    >
      {() => {
        const pinningStyles = getCommonPinningStyles(column)
        const style: CSSProperties = {
          ...pinningStyles,
          opacity: isDragging ? 0.8 : (pinningStyles.opacity ?? 1),
          transform: CSS.Translate.toString(transform),
          transition: 'width transform 0.2s ease-in-out',
          whiteSpace: 'nowrap',
          width: `calc(var(--header-${header.id}-size) * 1px)`,
          zIndex: isDragging ? 2 : pinningStyles.zIndex,
        }

        if (header.isPlaceholder) {
          return <th ref={setNodeRef} style={style} colSpan={header.colSpan} />
        }

        return (
          <th ref={setNodeRef} style={style} colSpan={header.colSpan}>
            <div className="header-row">
              {column.id !== 'select' ? (
                <button
                  className="drag-handle"
                  type="button"
                  {...attributes}
                  {...listeners}
                  title="Drag to reorder"
                >
                  ⠿
                </button>
              ) : null}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="header-controls">
                  {column.getCanPin() ? (
                    <span className="pin-actions">
                      {column.getIsPinned() !== 'start' ? (
                        <button
                          className="pin-button"
                          onClick={() => column.pin('start')}
                          title="Pin left"
                        >
                          ←
                        </button>
                      ) : null}
                      {column.getIsPinned() ? (
                        <button
                          className="pin-button"
                          onClick={() => column.pin(false)}
                          title="Unpin"
                        >
                          ×
                        </button>
                      ) : null}
                      {column.getIsPinned() !== 'end' ? (
                        <button
                          className="pin-button"
                          onClick={() => column.pin('end')}
                          title="Pin right"
                        >
                          →
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
                        ? `🛑(${column.getGroupedIndex()})`
                        : '👊'}
                    </button>
                  ) : null}
                </div>
                {column.getCanSort() ? (
                  <button
                    type="button"
                    className="sortable-header"
                    onClick={column.getToggleSortingHandler()}
                    title={
                      column.getNextSortingOrder() === 'asc'
                        ? 'Sort ascending'
                        : column.getNextSortingOrder() === 'desc'
                          ? 'Sort descending'
                          : 'Clear sort'
                    }
                  >
                    <table.FlexRender header={header} />
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[column.getIsSorted() as string] ?? null}
                  </button>
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
                onDoubleClick={() => column.resetSize()}
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className={`resizer ${column.getIsResizing() ? 'isResizing' : ''}`}
              />
            ) : null}
          </th>
        )
      }}
    </Subscribe>
  )
}

function DragAlongCell({
  cell,
  table,
}: {
  cell: Cell<typeof features, Person, unknown>
  table: ReactTable<typeof features, Person, KitchenSinkSelectedState>
}) {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  })

  const pinningStyles = getCommonPinningStyles(cell.column)
  const rowSpan = cell.getRowSpan()
  const colSpan = cell.getColSpan()

  // A span of 0 marks a cell covered by another cell. Rendering rowSpan={0}
  // would mean "span to the end of the row group" in HTML, so covered cells
  // must be omitted entirely.
  if (rowSpan === 0 || colSpan === 0) return null

  const style: CSSProperties = {
    ...pinningStyles,
    opacity: isDragging ? 0.8 : (pinningStyles.opacity ?? 1),
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
    zIndex: isDragging ? 2 : pinningStyles.zIndex,
  }

  // Highlight grouped/aggregated/placeholder cells only when grouping is
  // active AND the column actually participates in aggregation. This keeps
  // display columns (selection, row pin) styled normally even on synthetic
  // parent group rows, and prevents the implicit "parent has subRows"
  // aggregated highlight from showing on plain nested data.
  const groupingActive = table.state.grouping.length > 0
  const hasAggregation = !!cell.column.columnDef.aggregationFn
  const groupingClassName = !groupingActive
    ? undefined
    : cell.getIsGrouped()
      ? 'cell-grouped'
      : hasAggregation && cell.getIsAggregated()
        ? 'cell-aggregated'
        : cell.getIsPlaceholder()
          ? 'cell-placeholder'
          : undefined

  const selectionClassNames = cell.getCanSelect()
    ? (() => {
        const isSelected = cell.getIsSelected()
        const edges = isSelected ? cell.getSelectionEdges() : undefined

        return [
          'cell-selectable',
          isSelected && 'cell-selected',
          cell.getIsFocused() && 'cell-focused',
          edges?.top && 'cell-edge-top',
          edges?.right && 'cell-edge-right',
          edges?.bottom && 'cell-edge-bottom',
          edges?.left && 'cell-edge-left',
        ]
      })()
    : []

  const className = [groupingClassName, ...selectionClassNames]
    .filter(Boolean)
    .join(' ')

  // FlexRender now handles aggregatedCell / placeholder dispatch internally
  // (returns null for placeholders, picks aggregatedCell when available).
  // The only state we still wrap manually is the grouped-cell expander —
  // that's UI specific to this example.
  return (
    <td
      ref={setNodeRef}
      style={style}
      className={className || undefined}
      rowSpan={rowSpan}
      colSpan={colSpan}
      tabIndex={cell.getCanSelect() ? cell.getTabIndex() : undefined}
      onMouseDown={
        cell.getCanSelect() ? cell.getSelectionStartHandler() : undefined
      }
      onMouseEnter={
        cell.getCanSelect() ? cell.getSelectionExtendHandler() : undefined
      }
    >
      {cell.getIsGrouped() ? (
        <button
          onClick={cell.row.getToggleExpandedHandler()}
          style={{ cursor: cell.row.getCanExpand() ? 'pointer' : 'normal' }}
        >
          {cell.row.getIsExpanded() ? '👇' : '👉'}{' '}
          <table.FlexRender cell={cell} /> (
          {cell.row.subRows.length.toLocaleString()})
        </button>
      ) : (
        <table.FlexRender cell={cell} />
      )}
    </td>
  )
}

// =====================================================================
// Pinned row (sticky positioning at top/bottom)
// =====================================================================

function PinnedRow({
  row,
  table,
}: {
  row: Row<typeof features, Person>
  table: ReactTable<typeof features, Person, KitchenSinkSelectedState>
}) {
  const bottomRows = table.getBottomRows()
  return (
    <Subscribe
      source={table.atoms.cellSelection}
      selector={(ranges) =>
        rowSelectionKey(
          ranges,
          table.getCellSelectionBounds(),
          row.getDisplayIndex(),
          row.id,
        )
      }
    >
      {() => (
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
            <SortableContext
              key={cell.id}
              items={table.state.columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              <DragAlongCell key={cell.id} cell={cell} table={table} />
            </SortableContext>
          ))}
        </tr>
      )}
    </Subscribe>
  )
}

function rowSelectionKey(
  ranges: CellSelectionState,
  bounds: Array<CellSelectionBounds>,
  rowIndex: number,
  rowId: string,
) {
  const active = ranges[ranges.length - 1]
  let key =
    ranges.length > 0 && active.anchorRowId === rowId
      ? `f${active.anchorColumnId}`
      : ''

  for (const bound of bounds) {
    const self = rowIndex >= bound.minRowIndex && rowIndex <= bound.maxRowIndex
    const above =
      rowIndex - 1 >= bound.minRowIndex && rowIndex - 1 <= bound.maxRowIndex
    const below =
      rowIndex + 1 >= bound.minRowIndex && rowIndex + 1 <= bound.maxRowIndex

    if (self || above || below) {
      key += `|${self ? 1 : 0}${above ? 1 : 0}${below ? 1 : 0}:${bound.minColumnIndex}-${bound.maxColumnIndex}`
    }
  }

  return key
}

// =====================================================================
// Main app
// =====================================================================

function App() {
  const columns = React.useMemo(() => {
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
        enableCellSelection: false,
        enableCellSpanning: false,
        header: ({ table }) => (
          // work around react compiler memoization for nested components using table APIs
          <Subscribe source={table.atoms.rowSelection}>
            {() => (
              <IndeterminateCheckbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={table.getIsSomePageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
                title="Select all on this page"
              />
            )}
          </Subscribe>
        ),
        cell: ({ row, table }) => (
          // work around react compiler memoization for nested components using row APIs
          <Subscribe
            source={table.store}
            selector={(s) => ({
              rowSelection: s.rowSelection,
              rowPinning: s.rowPinning,
            })}
          >
            {() => (
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
                  title={
                    row.getIsPinned() === 'top' ? 'Unpin row' : 'Pin row top'
                  }
                >
                  {row.getIsPinned() === 'top' ? '📌' : '📍'}
                </button>
              </div>
            )}
          </Subscribe>
        ),
      }),
      columnHelper.accessor('firstName', {
        id: 'firstName',
        size: 200,
        header: 'First Name',
        filterFn: 'fuzzy',
        sortFn: 'fuzzy',
        meta: { filterVariant: 'text' },
        // override grouping value so first+last combine as a group key
        getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
        // Other grouped columns do not aggregate names. An explicit empty
        // renderer avoids coercing their missing aggregate to "undefined".
        aggregatedCell: () => null,
        cell: ({ row, getValue }) => (
          <div style={{ paddingLeft: `${row.depth * 1.5}rem` }}>
            {/* On a grouped row the grouped-cell wrapper already renders the
                expander, so don't render a second one here. This expander is
                only for expanding nested sub-rows. */}
            {row.getIsGrouped() ? null : row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                style={{ cursor: 'pointer', marginRight: '0.25rem' }}
              >
                {row.getIsExpanded() ? '👇' : '👉'}
              </button>
            ) : (
              <span style={{ marginRight: '0.25rem' }}>·</span>
            )}
            {getValue()}
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
        // Adjacent equal statuses are merged in the rendered row model.
        // Sort by Status to make the spanning behavior especially visible.
        spanRows: true,
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

  const initialData = Route.useLoaderData()
  const [data, setData] = React.useState(initialData)
  const refreshData = () => setData(makeData(1_000))
  const nestedData = () => setData(makeData(100, 5, 3))
  const stress10k = () => setData(makeData(10_000))
  const stress100k = () => setData(makeData(100_000))
  const cellSelectionAtom = useCreateAtom<CellSelectionState>([])

  const table = useTable(
    {
      key: 'kitchen-sink', // needed for devtools
      features,
      atoms: { cellSelection: cellSelectionAtom },
      columns,
      data,
      getSubRows: (row) => row.subRows,
      enableCellSelection: true,
      enableCellSpanning: true,
      globalFilterFn: 'fuzzy',
      columnResizeMode: 'onChange',
      defaultColumn: { minSize: 200, maxSize: 800 },
      initialState: {
        columnOrder: columns.map((c) => c.id!),
        columnPinning: { start: ['select'], end: [] },
        pagination: { pageIndex: 0, pageSize: 20 },
      },
      keepPinnedRows: true,
      debugTable: true,
      autoResetExpanded: false, // keep expanded rows during filtering changes
    },
    // Cell selection deliberately stays out of the root subscription. Each
    // rendered row subscribes only to the geometry that can change its cells.
    (state) => ({
      columnFilters: state.columnFilters,
      columnOrder: state.columnOrder,
      columnPinning: state.columnPinning,
      columnResizing: state.columnResizing,
      columnSizing: state.columnSizing,
      columnVisibility: state.columnVisibility,
      expanded: state.expanded,
      globalFilter: state.globalFilter,
      grouping: state.grouping,
      pagination: state.pagination,
      rowPinning: state.rowPinning,
      rowSelection: state.rowSelection,
      sorting: state.sorting,
    }),
  )

  useTanStackTableDevtools(table)

  // memoized column-size css variables (column-resizing-performant pattern)
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.state.columnResizing, table.state.columnSizing])

  // DnD column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      table.setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  const selectedCount = table.getSelectedRowModel().flatRows.length
  const gridRef = React.useRef<HTMLDivElement>(null)

  // Keyboard handling is intentionally userland: TanStack Hotkeys scopes the
  // shortcuts to the focused grid and drives the table's selection APIs.
  useHotkeys(
    [
      { hotkey: 'ArrowUp', callback: () => table.moveCellSelection('up') },
      { hotkey: 'ArrowDown', callback: () => table.moveCellSelection('down') },
      { hotkey: 'ArrowLeft', callback: () => table.moveCellSelection('left') },
      {
        hotkey: 'ArrowRight',
        callback: () => table.moveCellSelection('right'),
      },
      {
        hotkey: 'Shift+ArrowUp',
        callback: () => table.extendCellSelection('up'),
      },
      {
        hotkey: 'Shift+ArrowDown',
        callback: () => table.extendCellSelection('down'),
      },
      {
        hotkey: 'Shift+ArrowLeft',
        callback: () => table.extendCellSelection('left'),
      },
      {
        hotkey: 'Shift+ArrowRight',
        callback: () => table.extendCellSelection('right'),
      },
      { hotkey: 'Mod+A', callback: () => table.selectAllCells() },
      { hotkey: 'Escape', callback: () => table.resetCellSelection(true) },
    ],
    { target: gridRef },
  )

  return (
    <DndContext
      // stable id keeps dnd-kit's generated aria-describedby ids identical
      // between server and client (avoids a hydration mismatch)
      id="kitchen-sink-dnd"
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="demo-root">
        <h1>Kitchen Sink — All Features (Start SSR)</h1>

        {/* Toolbar */}
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
            <button
              onClick={refreshData}
              className="demo-button demo-button-sm"
            >
              Flat 1k
            </button>
            <button onClick={nestedData} className="demo-button demo-button-sm">
              Nested 100×5×3
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
            <span className="nowrap">
              {selectedCount.toLocaleString()} of{' '}
              {table.getCoreRowModel().flatRows.length.toLocaleString()}{' '}
              selected
            </span>
            <table.Subscribe source={table.atoms.cellSelection}>
              {() => (
                <span className="nowrap">
                  {table.getSelectedCellCount().toLocaleString()} cells selected
                </span>
              )}
            </table.Subscribe>
            <button
              onClick={() => table.resetCellSelection(true)}
              className="demo-button demo-button-sm"
            >
              Clear cells
            </button>
            <button
              onClick={() => table.selectAllCells()}
              className="demo-button demo-button-sm"
            >
              Select all cells
            </button>
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

        {/* Table */}
        <div className="table-container" ref={gridRef} tabIndex={0}>
          <table style={{ ...columnSizeVars, width: table.getTotalSize() }}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <SortableContext
                    items={table.state.columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableTableHeader
                        key={header.id}
                        header={header}
                        table={table}
                      />
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getTopRows().map((row) => (
                <PinnedRow key={row.id} row={row} table={table} />
              ))}
              {table.getCenterRows().map((row) => (
                <Subscribe
                  key={row.id}
                  source={table.atoms.cellSelection}
                  selector={(ranges) =>
                    rowSelectionKey(
                      ranges,
                      table.getCellSelectionBounds(),
                      row.getDisplayIndex(),
                      row.id,
                    )
                  }
                >
                  {() => (
                    <tr>
                      {row.getVisibleCells().map((cell) => (
                        <SortableContext
                          key={cell.id}
                          items={table.state.columnOrder}
                          strategy={horizontalListSortingStrategy}
                        >
                          <DragAlongCell
                            key={cell.id}
                            cell={cell}
                            table={table}
                          />
                        </SortableContext>
                      ))}
                    </tr>
                  )}
                </Subscribe>
              ))}
              {table.getBottomRows().map((row) => (
                <PinnedRow key={row.id} row={row} table={table} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
              defaultValue={table.state.pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              className="page-size-input"
            />
          </span>
          <select
            value={table.state.pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
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
          <pre className="state-dump" data-testid="table-state">
            {JSON.stringify(table.state, null, 2)}
          </pre>
        </details>
      </div>
    </DndContext>
  )
}
