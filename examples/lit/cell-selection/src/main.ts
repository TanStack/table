import { customElement, state } from 'lit/decorators.js'
import { LitElement, css, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { faker } from '@faker-js/faker'
import { createMultiHotkeyHandler } from '@tanstack/lit-hotkeys'
import {
  FlexRender,
  TableController,
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { Cell, ColumnDef, LitTable } from '@tanstack/lit-table'
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

const columns: Array<ColumnDef<typeof features, Person>> = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorFn: (row) => row.lastName, id: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'visits', header: 'Visits' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    // enableCellSelection: false, // this column opts out of cell selection
  },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'country', header: 'Country' },
  { accessorKey: 'department', header: 'Department' },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cell: (info) => (info.getValue() as number).toLocaleString(),
  },
]

@customElement('lit-cell-selection-example')
export class LitCellSelectionExample extends LitElement {
  private tableController = new TableController<typeof features, Person>(this)

  @state()
  private _data = makeData(20)

  // tracks whether the layout-change reset should skip its first run
  private _isFirstColumnLayout = true
  private _lastLayoutKey = ''
  private _table?: LitTable<typeof features, Person>

  // Lit renders into shadow DOM, so the demo styles live here rather than in a
  // global stylesheet. The selection outline uses inset box-shadows: on a
  // border-collapse table a thicker border widens the shared grid line, which
  // would change row heights as cells become selected.
  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      font-size: 14px;
      padding: 0.5rem;
    }

    table {
      border: 1px solid lightgray;
      border-collapse: collapse;
      border-spacing: 0;
    }

    th {
      border-bottom: 1px solid lightgray;
      border-right: 1px solid lightgray;
      padding: 2px 4px;
    }

    td {
      border-right: 1px solid lightgray;
      padding: 2px 4px;
    }

    td:last-child {
      border-right: 0;
    }

    tfoot {
      color: gray;
    }

    button {
      margin-right: 0.5rem;
    }

    .header-button {
      padding: 0;
      border: 0;
      color: inherit;
      font: inherit;
      background: transparent;
    }

    .sortable-header {
      cursor: pointer;
      user-select: none;
    }

    .pin-actions {
      display: flex;
      gap: 2px;
      justify-content: center;
    }

    .pin-button {
      margin: 0;
      padding: 0 4px;
    }

    .column-toggle-panel {
      display: inline-block;
      border: 1px solid lightgray;
      padding: 0.25rem 0.5rem;
    }

    .cell-selectable {
      user-select: none;
      cursor: cell;
      --cell-edge-top: 0 0 0 0 transparent;
      --cell-edge-right: 0 0 0 0 transparent;
      --cell-edge-bottom: 0 0 0 0 transparent;
      --cell-edge-left: 0 0 0 0 transparent;
      box-shadow:
        inset var(--cell-edge-top),
        inset var(--cell-edge-right),
        inset var(--cell-edge-bottom),
        inset var(--cell-edge-left);
    }

    .cell-selected {
      background: #dbeafe;
    }

    .cell-focused {
      background: #bfdbfe;
    }

    .cell-edge-top {
      --cell-edge-top: 0 2px 0 0 #2563eb;
    }

    .cell-edge-right {
      --cell-edge-right: -2px 0 0 0 #2563eb;
    }

    .cell-edge-bottom {
      --cell-edge-bottom: 0 -2px 0 0 #2563eb;
    }

    .cell-edge-left {
      --cell-edge-left: 2px 0 0 0 #2563eb;
    }
  `

  private copySelection(table: LitTable<typeof features, Person>) {
    void navigator.clipboard.writeText(toTsv(table.getSelectedCellRangesData()))
  }

  // optionally, reset the cellSelection state not only when data changes, but
  // also when column order, pinning, visibility, or sorting changes
  // customize this to your needs
  private resetOnLayoutChange(table: LitTable<typeof features, Person>) {
    const layoutKey = JSON.stringify([
      table.atoms.columnOrder.get(),
      table.atoms.columnPinning.get(),
      table.atoms.columnVisibility.get(),
      table.atoms.sorting.get(),
    ])

    if (this._isFirstColumnLayout) {
      this._isFirstColumnLayout = false
      this._lastLayoutKey = layoutKey
      return
    }

    if (layoutKey !== this._lastLayoutKey) {
      this._lastLayoutKey = layoutKey
      queueMicrotask(() => table.resetCellSelection(true))
    }
  }

  protected updated() {
    if (this._table) {
      this.resetOnLayoutChange(this._table)
    }
  }

  protected render() {
    const table = this.tableController.table(
      {
        features,
        data: this._data,
        columns,
        getRowId: (row) => row.id,
        enableCellSelection: true, // enable cell selection for all cells
        // initialState: { cellSelection: [] }, // select cells on first render
        // atoms: { cellSelection: cellSelectionAtom }, // own selection state with an external atom
        // state: { cellSelection }, // classic controlled state; pair with onCellSelectionChange
        // onCellSelectionChange: setCellSelection,
        // enableCellRangeSelection: false, // disable Shift-click and drag ranges; default true
        // enableMultiCellRangeSelection: false, // allow only one rectangle at a time; default true
        // enableCellSelectionDrag: false, // disable drag-to-select; default true
        // isCellRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
        debugTable: true,
      },
      (state) => ({
        cellSelection: state.cellSelection,
        sorting: state.sorting,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
      }),
    )

    this._table = table

    // keyboard navigation is TanStack Hotkeys driving the table's imperative
    // APIs; table-core ships no keydown handling of its own. One stateless
    // handler is simpler here than eleven HotkeyControllers.
    const onGridKeyDown = createMultiHotkeyHandler({
      ArrowUp: () => table.moveCellSelection('up'),
      ArrowDown: () => table.moveCellSelection('down'),
      ArrowLeft: () => table.moveCellSelection('left'),
      ArrowRight: () => table.moveCellSelection('right'),
      'Shift+ArrowUp': () => table.extendCellSelection('up'),
      'Shift+ArrowDown': () => table.extendCellSelection('down'),
      'Shift+ArrowLeft': () => table.extendCellSelection('left'),
      'Shift+ArrowRight': () => table.extendCellSelection('right'),
      'Mod+A': () => table.selectAllCells(),
      Escape: () => table.resetCellSelection(true),
      'Mod+C': () => this.copySelection(table),
    })

    return html`
      <div>
        <button @click=${() => (this._data = makeData(20))}>
          Regenerate Data
        </button>
        <button @click=${() => (this._data = makeData(1_000))}>
          Stress Test (1K rows)
        </button>
      </div>
      <p>
        Click and drag to select a range of cells. Hold Shift while clicking to
        extend the selection, or Ctrl/Cmd to add a second rectangle. Arrow keys
        move the selection, Shift+Arrow extends it, Mod+A selects all, Mod+C
        copies, and Escape clears. Uncomment
        <code>enableCellSelection: false</code> on a column def to opt that
        column out of selection.
      </p>
      <p>
        Hiding, reordering, and pinning columns all keep a live selection
        anchored to the same cell ids. Ranges are indexed in render order, so a
        pinned column moves the rectangle with it rather than splitting it.
      </p>
      <div class="column-toggle-panel">
        <div>
          <label>
            <input
              type="checkbox"
              .checked=${table.getIsAllColumnsVisible()}
              @change=${table.getToggleAllColumnsVisibilityHandler()}
            />
            Toggle All
          </label>
        </div>
        ${repeat(
          table.getAllLeafColumns(),
          (column) => column.id,
          (column) => html`
            <div>
              <label>
                <input
                  type="checkbox"
                  .checked=${column.getIsVisible()}
                  @change=${column.getToggleVisibilityHandler()}
                />
                ${column.id}
              </label>
            </div>
          `,
        )}
      </div>
      <div>
        <button
          @click=${() =>
            table.setColumnOrder(
              faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
            )}
        >
          Shuffle Columns
        </button>
        <button
          @click=${() =>
            table.setColumnOrder(
              [
                ...table.getAllLeafColumns().map((column) => column.id),
              ].reverse(),
            )}
        >
          Reverse Column Order
        </button>
        <button @click=${() => table.resetColumnOrder()}>
          Reset Column Order
        </button>
        <button @click=${() => table.resetColumnPinning()}>
          Reset Pinning
        </button>
        <button @click=${() => table.resetColumnVisibility()}>
          Reset Visibility
        </button>
      </div>
      <!--
        The table controller re-renders this element on selection changes, and
        lit-html patches only the attributes that actually changed, so there is
        no equivalent of React's per-row Subscribe to reach for here.
      -->
      <div>
        ${table.getSelectedCellCount().toLocaleString()} cells selected across
        ${table.getCellSelectionRowIds().length.toLocaleString()} rows and
        ${table.getCellSelectionColumnIds().length} columns
      </div>
      <div tabindex="0" @keydown=${onGridKeyDown}>
        <table>
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) => html`
                <tr>
                  ${repeat(
                    headerGroup.headers,
                    (header) => header.id,
                    (header) => html`
                      <th colspan="${header.colSpan}">
                        ${header.isPlaceholder
                          ? null
                          : html`
                              <button
                                type="button"
                                class="header-button ${header.column.getCanSort()
                                  ? 'sortable-header'
                                  : ''}"
                                ?disabled=${!header.column.getCanSort()}
                                @click=${header.column.getToggleSortingHandler()}
                              >
                                ${FlexRender({ header })}
                                ${{ asc: ' 🔼', desc: ' 🔽' }[
                                  header.column.getIsSorted() as string
                                ] ?? ''}
                              </button>
                              ${header.column.getCanPin()
                                ? html`
                                    <div class="pin-actions">
                                      ${header.column.getIsPinned() !== 'start'
                                        ? html`<button
                                            class="pin-button"
                                            @click=${() =>
                                              header.column.pin('start')}
                                          >
                                            &lt;=
                                          </button>`
                                        : null}
                                      ${header.column.getIsPinned()
                                        ? html`<button
                                            class="pin-button"
                                            @click=${() =>
                                              header.column.pin(false)}
                                          >
                                            X
                                          </button>`
                                        : null}
                                      ${header.column.getIsPinned() !== 'end'
                                        ? html`<button
                                            class="pin-button"
                                            @click=${() =>
                                              header.column.pin('end')}
                                          >
                                            =&gt;
                                          </button>`
                                        : null}
                                    </div>
                                  `
                                : null}
                            `}
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </thead>
          <tbody>
            ${repeat(
              table.getRowModel().rows,
              (row) => row.id,
              (row) => html`
                <tr>
                  ${row
                    .getVisibleCells()
                    .map((cell) =>
                      cell.getCanSelect()
                        ? html`<td
                            class=${getCellClassName(cell)}
                            tabindex=${cell.getTabIndex()}
                            @mousedown=${cell.getSelectionStartHandler()}
                            @mouseenter=${cell.getSelectionExtendHandler()}
                          >
                            ${FlexRender({ cell })}
                          </td>`
                        : html`<td>${FlexRender({ cell })}</td>`,
                    )}
                </tr>
              `,
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="20">
                Rows (${table.getRowModel().rows.length.toLocaleString()})
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div>
        <button @click=${() => this.copySelection(table)}>
          Copy Selection
        </button>
        <button @click=${() => table.selectAllCells()}>Select All Cells</button>
        <button @click=${() => table.resetCellSelection(true)}>
          Clear Selection
        </button>
      </div>
      <hr />
      <div>
        <button
          @click=${() =>
            console.info(
              'table.getSelectedCellRangesData()',
              table.getSelectedCellRangesData(),
            )}
        >
          Log table.getSelectedCellRangesData()
        </button>
      </div>
      <div>
        <label>State:</label>
        <pre>
${this._data.length < 1_001 ? JSON.stringify(table.state, null, 2) : ''}</pre
        >
      </div>
      <div>
        <label for="paste-target">Paste Test:</label>
        <!--
          scratch area for pasting a copied selection back in, to eyeball the
          tab-separated shape. It sits outside the grid element, so the table
          hotkeys never intercept typing or Mod+V in here.
        -->
        <textarea
          id="paste-target"
          rows="8"
          cols="60"
          placeholder="Copy a selection, then paste here to check the tab-separated output..."
        ></textarea>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-cell-selection-example': LitCellSelectionExample
  }
}
