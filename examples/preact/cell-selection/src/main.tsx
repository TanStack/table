import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { render } from 'preact'
import { faker } from '@faker-js/faker'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import {
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/preact-table-devtools'
import { useHotkeys } from '@tanstack/preact-hotkeys'
import { useCreateAtom } from '@tanstack/preact-store'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type {
  Cell,
  CellSelectionBounds,
  CellSelectionState,
} from '@tanstack/preact-table'
import './index.css'

const features = tableFeatures({
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

// Serializing a selection for the clipboard is a userland concern: the table
// hands back `getSelectedCellRangesData()` as raw values, and the delimiter,
// the null representation, and the quoting rules are all yours to pick. This is
// the spreadsheet-flavored version.
function escapeTsvValue(value: unknown) {
  const text = value == null ? '' : String(value)
  const safeText =
    typeof value === 'string' && /^[\t\r ]*[=+@-]/.test(value)
      ? `'${text}`
      : text

  // spreadsheets expect a field to be quoted once it contains a delimiter, a
  // newline, or a quote, with inner quotes doubled
  return /["\t\n\r]/.test(safeText)
    ? `"${safeText.replace(/"/g, '""')}"`
    : safeText
}

function toTsv(ranges: Array<Array<Array<unknown>>>) {
  return ranges
    .map((grid) =>
      grid.map((row) => row.map(escapeTsvValue).join('\t')).join('\n'),
    )
    .join('\n\n') // blank line between disjoint rectangles
}

function App() {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          header: 'First Name',
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          header: () => <span>Last Name</span>,
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
        }),
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
          // enableCellSelection: false, // this column opts out of cell selection
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('email', {
          header: 'Email',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('phone', {
          header: 'Phone',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('city', {
          header: 'City',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('country', {
          header: 'Country',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('department', {
          header: 'Department',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('salary', {
          header: 'Salary',
          cell: (info) => info.getValue().toLocaleString(),
          footer: (props) => props.column.id,
        }),
      ]),
    [],
  )

  const [data, setData] = useState(() => makeData(20))
  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  // optionally, raise the selection state to your own atom
  const cellSelectionAtom = useCreateAtom<CellSelectionState>([])

  const table = useTable(
    {
      key: 'cell-selection', // needed for devtools
      features,
      atoms: {
        cellSelection: cellSelectionAtom,
      },
      columns,
      data,
      getRowId: (row) => row.id,
      enableCellSelection: true, // enable cell selection for all cells
      // initialState: { cellSelection: [] }, // select cells on first render
      // state: { cellSelection }, // classic controlled state; pair with onCellSelectionChange
      // onCellSelectionChange: setCellSelection,
      // enableCellRangeSelection: false, // disable Shift-click and drag ranges; default true
      // enableMultiCellRangeSelection: false, // allow only one rectangle at a time; default true
      // enableCellSelectionDrag: false, // disable drag-to-select; default true
      // isCellRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
      debugTable: true,
    },
    // Every slice that changes the table's structure has to be here, or the
    // headers and controls will not re-render when you pin, hide, or reorder.
    // cellSelection is the deliberate exception: it is read through <Subscribe>
    // instead, so a drag does not re-render the whole example.
    (state) => ({
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
      columnOrder: state.columnOrder,
      columnPinning: state.columnPinning,
    }),
  )

  useTanStackTableDevtools(table)

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  // optionally, reset the cellSelection state not only when data changes, but also when column order, pinning, visibility, or sorting changes
  // customize this to your needs
  const isFirstColumnLayout = useRef(true)
  useEffect(() => {
    if (isFirstColumnLayout.current) {
      isFirstColumnLayout.current = false
      return
    }
    table.resetCellSelection(true)
  }, [
    table.state.columnOrder,
    table.state.columnPinning,
    table.state.columnVisibility,
    table.state.sorting,
  ])

  const gridRef = useRef<HTMLDivElement>(null)

  // keyboard navigation is TanStack Hotkeys driving the table's imperative APIs;
  // table-core ships no keydown handling of its own
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
      {
        hotkey: 'Mod+C',
        callback: () => {
          void navigator.clipboard.writeText(
            toTsv(table.getSelectedCellRangesData()),
          )
        },
      },
    ],
    { target: gridRef },
  )

  return (
    <div className="demo-root">
      <div>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => refreshData()}
        >
          Regenerate Data
        </button>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => stressTest()}
        >
          Stress Test (1K rows)
        </button>
      </div>
      <div className="spacer-sm" />
      <p>
        Click and drag to select a range of cells. Hold Shift while clicking to
        extend the selection, or Ctrl/Cmd to add a second rectangle. Arrow keys
        move the selection, Shift+Arrow extends it, Mod+A selects all, Mod+C
        copies, and Escape clears. Uncomment `enableCellSelection: false` on a
        column def to opt that column out of selection.
      </p>
      <p className="demo-note">
        Hiding, reordering, and pinning columns all keep a live selection
        anchored to the same cell ids. Ranges are indexed in render order, so a
        pinned column moves the rectangle with it rather than splitting it.
      </p>
      <div className="column-toggle-panel">
        <div className="column-toggle-panel-header">
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
                onChange={column.getToggleVisibilityHandler()}
              />{' '}
              {column.id}
            </label>
          </div>
        ))}
      </div>
      <div className="spacer-sm" />
      <div className="button-row">
        <button
          className="demo-button demo-button-spaced"
          onClick={() => randomizeColumns()}
        >
          Shuffle Columns
        </button>
        <button
          className="demo-button demo-button-spaced"
          onClick={() =>
            table.setColumnOrder(
              [
                ...table.getAllLeafColumns().map((column) => column.id),
              ].reverse(),
            )
          }
        >
          Reverse Column Order
        </button>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => table.resetColumnOrder()}
        >
          Reset Column Order
        </button>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => table.resetColumnPinning()}
        >
          Reset Pinning
        </button>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => table.resetColumnVisibility()}
        >
          Reset Visibility
        </button>
      </div>
      <div className="spacer-sm" />
      <table.Subscribe source={table.atoms.cellSelection}>
        {() => (
          <div>
            {table.getSelectedCellCount().toLocaleString()} cells selected
            across {table.getCellSelectionRowIds().length.toLocaleString()} rows
            and {table.getCellSelectionColumnIds().length} columns
          </div>
        )}
      </table.Subscribe>
      <div className="spacer-sm" />
      <div ref={gridRef} tabIndex={0}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <button
                            type="button"
                            disabled={!header.column.getCanSort()}
                            className={
                              header.column.getCanSort()
                                ? 'header-button sortable-header'
                                : 'header-button'
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <table.FlexRender header={header} />
                            {{ asc: ' 🔼', desc: ' 🔽' }[
                              header.column.getIsSorted() as string
                            ] ?? null}
                          </button>
                          {header.column.getCanPin() && (
                            <div className="pin-actions">
                              {header.column.getIsPinned() !== 'start' ? (
                                <button
                                  className="pin-button"
                                  onClick={() => header.column.pin('start')}
                                >
                                  {'<='}
                                </button>
                              ) : null}
                              {header.column.getIsPinned() ? (
                                <button
                                  className="pin-button"
                                  onClick={() => header.column.pin(false)}
                                >
                                  X
                                </button>
                              ) : null}
                              {header.column.getIsPinned() !== 'end' ? (
                                <button
                                  className="pin-button"
                                  onClick={() => header.column.pin('end')}
                                >
                                  {'=>'}
                                </button>
                              ) : null}
                            </div>
                          )}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              // one subscription per row rather than one around the whole
              // tbody, so a drag only re-renders the rows whose key changed
              <table.Subscribe
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
                    {row.getVisibleCells().map((cell) =>
                      cell.getCanSelect() ? (
                        <td
                          key={cell.id}
                          className={getCellClassName(cell)}
                          tabIndex={cell.getTabIndex()}
                          onMouseDown={cell.getSelectionStartHandler()}
                          onMouseEnter={cell.getSelectionExtendHandler()}
                        >
                          <table.FlexRender cell={cell} />
                        </td>
                      ) : (
                        <td key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                )}
              </table.Subscribe>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={20}>
                Rows ({table.getRowModel().rows.length.toLocaleString()})
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="spacer-sm" />
      <div>
        <button
          className="demo-button demo-button-spaced"
          onClick={() =>
            void navigator.clipboard.writeText(
              toTsv(table.getSelectedCellRangesData()),
            )
          }
        >
          Copy Selection
        </button>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => table.selectAllCells()}
        >
          Select All Cells
        </button>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => table.resetCellSelection(true)}
        >
          Clear Selection
        </button>
      </div>
      <hr />
      <br />
      <div>
        <button
          className="demo-button demo-button-spaced"
          onClick={() =>
            console.info(
              'table.getSelectedCellRangesData()',
              table.getSelectedCellRangesData(),
            )
          }
        >
          Log table.getSelectedCellRangesData()
        </button>
      </div>
      <div>
        <label>State:</label>
        <table.Subscribe selector={(state) => state}>
          {(state) => (
            <pre>{data.length < 1_001 && JSON.stringify(state, null, 2)}</pre>
          )}
        </table.Subscribe>
      </div>
      <div>
        <label htmlFor="paste-target">Paste Test:</label>
        {/* scratch area for pasting a copied selection back in, to eyeball
              the tab-separated shape. It sits outside the grid ref, so the
              table hotkeys never intercept typing or Mod+V in here. */}
        <textarea
          id="paste-target"
          className="text-input"
          rows={8}
          placeholder="Copy a selection, then paste here to check the tab-separated output..."
        />
      </div>
    </div>
  )
}

// each cell draws only the sides getSelectionEdges() reports as the boundary of
// the selection, so a union of rectangles gets one continuous outline
/**
 * The narrowest value a row's appearance depends on: whether its own cells fall
 * inside a range, whether the rows immediately above and below do (that decides
 * its top and bottom edges), and whether it owns the focused cell.
 *
 * Rows in the middle of a growing range produce an unchanged key, so <Subscribe>
 * skips re-rendering them. Column layout is deliberately absent: those changes
 * re-render App, which recreates these rows anyway.
 */
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

function getCellClassName(cell: Cell<typeof features, Person>) {
  // Most cells in a large grid are unselected, so bail before asking for edges.
  // getSelectionEdges() would otherwise resolve the cell's position a second
  // time just to discover it is not selected.
  if (!cell.getIsSelected()) {
    return cell.getIsFocused()
      ? 'cell-selectable cell-focused'
      : 'cell-selectable'
  }

  const edges = cell.getSelectionEdges()

  return [
    'cell-selectable',
    'cell-selected',
    cell.getIsFocused() && 'cell-focused',
    edges.top && 'cell-edge-top',
    edges.right && 'cell-edge-right',
    edges.bottom && 'cell-edge-bottom',
    edges.left && 'cell-edge-left',
  ]
    .filter(Boolean)
    .join(' ')
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
