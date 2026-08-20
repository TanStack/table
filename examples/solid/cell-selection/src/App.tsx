import { For, Show, createEffect, createSignal, on } from 'solid-js'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/solid-table'
import { useTanStackTableDevtools } from '@tanstack/solid-table-devtools'
import { createHotkeys } from '@tanstack/solid-hotkeys'
import { makeData } from './makeData'
import type { Cell } from '@tanstack/solid-table'
import type { Person } from './makeData'

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
    .join('\n\n') // blank line between final selected regions
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

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
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
])

function App() {
  const [data, setData] = createSignal(makeData(20))
  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const table = createTable({
    key: 'cell-selection', // needed for devtools
    features,
    get data() {
      return data()
    },
    columns,
    getRowId: (row: Person) => row.id,
    enableCellSelection: true, // enable cell selection for all cells
    // initialState: { cellSelection: [] }, // select cells on first render
    // state: { cellSelection }, // classic controlled state; pair with onCellSelectionChange
    // onCellSelectionChange: setCellSelection,
    // enableCellRangeSelection: false, // disable Shift-click and drag ranges; default true
    // enableMultiCellRangeSelection: false, // allow only one rectangle at a time; default true
    // enableCellSelectionDrag: false, // disable drag-to-select; default true
    // isCellRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
    debugTable: true,
  })

  useTanStackTableDevtools(table)

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  // optionally, reset the cellSelection state not only when data changes, but
  // also when column order, pinning, visibility, or sorting changes
  // customize this to your needs. `defer: true` skips the first run so an
  // initialState selection survives mount.
  createEffect(
    on(
      () => [
        table.atoms.columnOrder.get(),
        table.atoms.columnPinning.get(),
        table.atoms.columnVisibility.get(),
        table.atoms.sorting.get(),
      ],
      () => table.resetCellSelection(true),
      { defer: true },
    ),
  )

  let gridRef!: HTMLDivElement

  // keyboard navigation is TanStack Hotkeys driving the table's imperative
  // APIs; table-core ships no keydown handling of its own
  createHotkeys(
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
    () => ({ target: gridRef }),
  )

  return (
    <div class="demo-root">
      <div>
        <button
          class="demo-button demo-button-spaced"
          onClick={() => refreshData()}
        >
          Regenerate Data
        </button>
        <button
          class="demo-button demo-button-spaced"
          onClick={() => stressTest()}
        >
          Stress Test (1K rows)
        </button>
      </div>
      <div class="spacer-sm" />
      <p>
        Click and drag to select a range of cells. Hold Shift while clicking to
        extend the selection, or Ctrl/Cmd to add or subtract a rectangle. Arrow
        keys move the selection, Shift+Arrow extends it, Mod+A selects all,
        Mod+C copies, and Escape clears. Uncomment `enableCellSelection: false`
        on a column def to opt that column out of selection.
      </p>
      <p class="demo-note">
        Hiding, reordering, and pinning columns all keep a live selection
        anchored to the same cell ids. Ranges are indexed in render order, so a
        pinned column moves the rectangle with it rather than splitting it.
      </p>
      <div class="column-toggle-panel">
        <div class="column-toggle-panel-header">
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
                  onChange={column.getToggleVisibilityHandler()}
                />{' '}
                {column.id}
              </label>
            </div>
          )}
        </For>
      </div>
      <div class="spacer-sm" />
      <div class="button-row">
        <button
          class="demo-button demo-button-spaced"
          onClick={() => randomizeColumns()}
        >
          Shuffle Columns
        </button>
        <button
          class="demo-button demo-button-spaced"
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
          class="demo-button demo-button-spaced"
          onClick={() => table.resetColumnOrder()}
        >
          Reset Column Order
        </button>
        <button
          class="demo-button demo-button-spaced"
          onClick={() => table.resetColumnPinning()}
        >
          Reset Pinning
        </button>
        <button
          class="demo-button demo-button-spaced"
          onClick={() => table.resetColumnVisibility()}
        >
          Reset Visibility
        </button>
      </div>
      <div class="spacer-sm" />
      {/*
        Solid tracks atom reads natively, so this count re-evaluates on its own.
        There is no equivalent of React's per-row Subscribe to reach for here.
      */}
      <div>
        {table.getSelectedCellCount().toLocaleString()} cells selected across{' '}
        {table.getCellSelectionRowIds().length.toLocaleString()} rows and{' '}
        {table.getCellSelectionColumnIds().length} columns
      </div>
      <div class="spacer-sm" />
      <div ref={gridRef} tabindex={0}>
        <table>
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th colSpan={header.colSpan}>
                        <Show when={!header.isPlaceholder}>
                          <button
                            type="button"
                            disabled={!header.column.getCanSort()}
                            class={
                              header.column.getCanSort()
                                ? 'header-button sortable-header'
                                : 'header-button'
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <FlexRender header={header} />
                            {{ asc: ' 🔼', desc: ' 🔽' }[
                              header.column.getIsSorted() as string
                            ] ?? null}
                          </button>
                          <Show when={header.column.getCanPin()}>
                            <div class="pin-actions">
                              <Show
                                when={header.column.getIsPinned() !== 'start'}
                              >
                                <button
                                  class="pin-button"
                                  onClick={() => header.column.pin('start')}
                                >
                                  {'<='}
                                </button>
                              </Show>
                              <Show when={header.column.getIsPinned()}>
                                <button
                                  class="pin-button"
                                  onClick={() => header.column.pin(false)}
                                >
                                  X
                                </button>
                              </Show>
                              <Show
                                when={header.column.getIsPinned() !== 'end'}
                              >
                                <button
                                  class="pin-button"
                                  onClick={() => header.column.pin('end')}
                                >
                                  {'=>'}
                                </button>
                              </Show>
                            </div>
                          </Show>
                        </Show>
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
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <Show
                        when={cell.getCanSelect()}
                        fallback={
                          <td>
                            <FlexRender cell={cell} />
                          </td>
                        }
                      >
                        <td
                          class={getCellClassName(cell)}
                          tabindex={cell.getTabIndex()}
                          onMouseDown={cell.getSelectionStartHandler()}
                          onMouseEnter={cell.getSelectionExtendHandler()}
                        >
                          <FlexRender cell={cell} />
                        </td>
                      </Show>
                    )}
                  </For>
                </tr>
              )}
            </For>
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
      <div class="spacer-sm" />
      <div>
        <button
          class="demo-button demo-button-spaced"
          onClick={() =>
            void navigator.clipboard.writeText(
              toTsv(table.getSelectedCellRangesData()),
            )
          }
        >
          Copy Selection
        </button>
        <button
          class="demo-button demo-button-spaced"
          onClick={() => table.selectAllCells()}
        >
          Select All Cells
        </button>
        <button
          class="demo-button demo-button-spaced"
          onClick={() => table.resetCellSelection(true)}
        >
          Clear Selection
        </button>
      </div>
      <hr />
      <br />
      <div>
        <button
          class="demo-button demo-button-spaced"
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
        <pre>
          {data().length < 1_001
            ? JSON.stringify(table.store.get(), null, 2)
            : ''}
        </pre>
      </div>
      <div>
        <label for="paste-target">Paste Test:</label>
        {/*
          scratch area for pasting a copied selection back in, to eyeball the
          tab-separated shape. It sits outside the grid ref, so the table
          hotkeys never intercept typing or Mod+V in here.
        */}
        <textarea
          id="paste-target"
          class="text-input"
          rows={8}
          placeholder="Copy a selection, then paste here to check the tab-separated output..."
        />
      </div>
    </div>
  )
}

export default App
