import { customElement, query, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { ColumnDef, LitTable } from '@tanstack/lit-table'
import type { Person } from './makeData'

/**
 * This example implements column resizing with NO Lit re-renders!
 * The controller selector subscribes to nothing, and we subscribe to the
 * table store OUTSIDE of Lit's render cycle to write CSS variables
 */

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => html`<span>Last Name</span>`,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'visits',
        header: () => html`<span>Visits</span>`,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: (props) => props.column.id,
      },
    ],
  },
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(200)

  private tableController = new TableController<typeof features, Person>(this)

  @query('table')
  private _tableEl?: HTMLTableElement

  private _table!: LitTable<typeof features, Person, Record<string, never>>
  private _sizingSub?: { unsubscribe: () => void }

  /**
   * Instead of re-rendering Lit on every resize tick, we subscribe to the
   * table store OUTSIDE of Lit and write the column size CSS variables
   * directly onto the <table> element. Header and data cells reference the
   * variables, so the browser updates widths with zero Lit work per tick.
   * (The core resize handler already coalesces pointer events to one state
   * update per animation frame.)
   */
  private _writeColumnSizeVars() {
    const tableEl = this._tableEl
    if (!tableEl) return
    for (const header of this._table.getFlatHeaders()) {
      tableEl.style.setProperty(
        `--header-${header.id}-size`,
        String(header.getSize()),
      )
      tableEl.style.setProperty(
        `--col-${header.column.id}-size`,
        String(header.column.getSize()),
      )
    }
    tableEl.style.width = `${this._table.getTotalSize()}px`
  }

  private _subscribeToColumnSizing() {
    if (this._sizingSub) return
    this._writeColumnSizeVars() // initial paint (and repaint after reconnect)
    this._sizingSub = this._table.atoms.columnSizing.subscribe(() =>
      this._writeColumnSizeVars(),
    )
  }

  protected override firstUpdated() {
    this._subscribeToColumnSizing()
  }

  override connectedCallback() {
    super.connectedCallback()
    // re-establish the subscription if this element is re-inserted into the
    // DOM after disconnectedCallback tore it down; skip the very first
    // connect, where the table and element ref don't exist yet
    if (this.hasUpdated) {
      this._subscribeToColumnSizing()
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._sizingSub?.unsubscribe()
    this._sizingSub = undefined
  }

  protected override render() {
    const table = this.tableController.table(
      {
        features,
        columns,
        data: this._data,
        defaultColumn: { minSize: 60, maxSize: 800 },
        columnResizeMode: 'onChange',
        // initialState: { columnSizing: { firstName: 200 } }, // set column sizes on first render
        // atoms: { columnResizing: columnResizingAtom }, // preferred: own transient resize state with an external atom
        // state: { columnResizing }, // classic controlled state; pair with onColumnResizingChange
        // onColumnResizingChange: setColumnResizing,
        // columnResizeDirection: 'rtl', // calculate resize offsets right-to-left; default 'ltr'
        // enableColumnResizing: false, // disable resizing for every column; default true
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
      },
      // subscribe to nothing instead of re-rendering on every internal state change
      (): Record<string, never> => ({}),
    )
    this._table = table

    return html`
      <div class="demo-root">
        <div>
          <button
            class="demo-button"
            @click=${() => {
              this._data = makeData(200)
            }}
          >
            Regenerate Data
          </button>
          <button
            class="demo-button"
            @click=${() => {
              this._data = makeData(5_000)
            }}
          >
            Stress Test (5k rows)
          </button>
        </div>
        <div class="spacer-md"></div>
        ${table.subscribe(
          table.store,
          (state) =>
            // Only this little island re-renders per resize tick
            html`<pre style="height: 10rem; overflow: auto">
${JSON.stringify(state, null, 2)}</pre
            >`,
        )}
        <div class="spacer-md"></div>
        (${this._data.length.toLocaleString()} rows)
        <div class="scroll-container">
          <!-- This example is using semantic table tags, but also CSS Grid/Flexbox layout for more absolute column widths -->
          <table style="display: grid">
            <thead style="display: grid">
              ${repeat(
                table.getHeaderGroups(),
                (headerGroup) => headerGroup.id,
                (headerGroup) => html`
                  <tr style="display: flex; width: 100%; height: 30px">
                    ${repeat(
                      headerGroup.headers,
                      (header) => header.id,
                      (header) => html`
                        <th
                          colspan=${header.colSpan}
                          style="display: flex; flex-shrink: 0; width: calc(var(--header-${header.id}-size) * 1px)"
                        >
                          ${header.isPlaceholder
                            ? null
                            : FlexRender({ header })}
                          ${table.subscribe(
                            table.atoms.columnResizing,
                            // Each resizer subscribes to just its own "am I
                            // being resized?" boolean, so a drag re-renders
                            // exactly one of these islands at drag start/end
                            (columnResizing) =>
                              columnResizing.isResizingColumn ===
                              header.column.id,
                            (isResizing) => html`
                              <div
                                @dblclick="${() => header.column.resetSize()}"
                                @mousedown="${header.getResizeHandler()}"
                                @touchstart="${header.getResizeHandler()}"
                                class="resizer ${isResizing
                                  ? 'isResizing'
                                  : ''}"
                              ></div>
                            `,
                          )}
                        </th>
                      `,
                    )}
                  </tr>
                `,
              )}
            </thead>
            <!-- No memoization needed: the host subscribes to no table state,
                 so the body only re-renders when the data itself changes -->
            <tbody style="display: grid">
              ${repeat(
                table.getRowModel().rows,
                (row) => row.id,
                (row) => html`
                  <tr
                    style="display: flex; width: 100%; height: 30px; content-visibility: auto; contain-intrinsic-height: auto 30px"
                  >
                    ${repeat(
                      row.getAllCells(),
                      (cell) => cell.id,
                      (cell) => html`
                        <td
                          style="display: flex; flex-shrink: 0; width: calc(var(--col-${cell
                            .column.id}-size) * 1px)"
                        >
                          ${cell.renderValue()}
                        </td>
                      `,
                    )}
                  </tr>
                `,
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        table {
          border: 1px solid lightgray;
          border-collapse: collapse;
          border-spacing: 0;
        }

        tr {
          height: 30px;
        }

        th,
        td {
          box-shadow: inset 0 0 0 1px lightgray;
          padding: 0.25rem;
        }

        th {
          padding: 2px 4px;
          position: relative;
          font-weight: bold;
          text-align: center;
          height: 30px;
        }

        td {
          height: 30px;
        }

        .resizer {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 5px;
          background: rgba(0, 0, 0, 0.5);
          cursor: col-resize;
          user-select: none;
          touch-action: none;
        }

        .resizer.isResizing {
          background: blue;
          opacity: 1;
        }

        @media (hover: hover) {
          .resizer {
            opacity: 0;
          }

          *:hover > .resizer {
            opacity: 1;
          }
        }

        /* Demo layout helpers for the plain example UI. */
        .demo-root {
          padding: 0.5rem;
        }
        .spacer-md {
          height: 1rem;
        }
        .demo-button {
          border: 1px solid currentColor;
          border-radius: 0.25rem;
          padding: 0.5rem;
        }
        .scroll-container {
          overflow-x: auto;
        }
      </style>
    `
  }
}
