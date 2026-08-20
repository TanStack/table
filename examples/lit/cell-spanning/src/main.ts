import { customElement, state } from 'lit/decorators.js'
import { LitElement, css, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData, makeSummaryData } from './makeData'
import type { Cell } from '@tanstack/lit-table'
import type { Shift, SummaryRow } from './makeData'

const features = tableFeatures({
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
})

const columnHelper = createColumnHelper<typeof features, Shift>()

const columns = columnHelper.columns([
  columnHelper.accessor('region', {
    header: 'Region',
    sortFn: 'alphanumeric',
    // Adjacent rows that share a region merge into one vertically spanning
    // cell. Spans always derive from the rows that are actually rendered, so
    // sorting, filtering, and paging just change which rows are adjacent.
    spanRows: true,
  }),
  columnHelper.accessor('team', {
    header: 'Team',
    sortFn: 'alphanumeric',
    spanRows: true,
  }),
  columnHelper.accessor('shift', {
    header: 'Shift',
    sortFn: 'alphanumeric',
    // The predicate form: shifts only merge while the table is sorted by the
    // shift column, so the predicate itself is visibly reactive.
    spanRows: ({ column, value, anchorValue }) =>
      column.getIsSorted() !== false && value === anchorValue,
  }),
  columnHelper.accessor('employee', {
    header: 'Employee',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('hours', {
    header: 'Hours',
    sortFn: 'basic',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
])

const summaryFeatures = tableFeatures({
  cellSpanningFeature,
  columnVisibilityFeature,
})

const summaryColumnHelper = createColumnHelper<
  typeof summaryFeatures,
  SummaryRow
>()

const summaryColumns = summaryColumnHelper.columns([
  summaryColumnHelper.accessor('label', {
    header: 'Shift',
    // Subtotal rows render one label cell covering every column but the
    // total. `Infinity` clamps to the rest of the cell's pinned region.
    spanColumns: ({ row }) => (row.original.kind === 'subtotal' ? Infinity : 1),
  }),
  summaryColumnHelper.accessor('region', {
    header: 'Region',
  }),
  summaryColumnHelper.accessor('hours', {
    header: 'Hours',
  }),
])

/**
 * Selection styling for the spanning table. A merged cell is always entirely
 * selected or entirely unselected: the selection bounds expand to enclose any
 * merge they touch, so the tint and the outline land on the rendered anchor.
 */
function getCellClassName(cell: Cell<typeof features, Shift>): string {
  const base =
    cell.getRowSpan() > 1 ? 'cell-selectable span-cell' : 'cell-selectable'

  if (!cell.getIsSelected()) {
    return cell.getIsFocused() ? `${base} cell-focused` : base
  }

  const edges = cell.getSelectionEdges()

  return [
    base,
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

@customElement('lit-cell-spanning-example')
export class LitCellSpanningExample extends LitElement {
  private tableController = new TableController<typeof features, Shift>(this)
  private summaryTableController = new TableController<
    typeof summaryFeatures,
    SummaryRow
  >(this)

  @state()
  private _data = makeData()

  @state()
  private _spanningEnabled = true

  private _summaryData = makeSummaryData()

  // Lit renders into shadow DOM, so the demo styles live here rather than in a
  // global stylesheet. The selection outline uses inset box-shadows: on a
  // border-collapse table a thicker border widens the shared grid line, which
  // would change row heights as cells become selected.
  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      font-size: 14px;
    }

    table {
      border: 1px solid lightgray;
      border-collapse: collapse;
      border-spacing: 0;
    }

    tbody {
      border-bottom: 1px solid lightgray;
    }

    th {
      border-bottom: 1px solid lightgray;
      border-right: 1px solid lightgray;
      padding: 2px 4px;
    }

    .demo-root {
      padding: 0.5rem;
    }

    .spacer-sm {
      height: 0.5rem;
    }

    .spacer-md {
      height: 1rem;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .demo-button,
    .filter-input {
      border: 1px solid currentColor;
      border-radius: 0.25rem;
    }

    .demo-button {
      padding: 0.5rem;
    }

    .demo-button-sm {
      padding: 0.25rem;
    }

    .filter-input {
      width: 6rem;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
    }

    .section-title {
      font-size: 1.25rem;
    }

    .sortable-header {
      cursor: pointer;
      user-select: none;
    }

    /* Lays the example panels side by side when the viewport allows it. */
    .example-grid {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 1rem 1.5rem;
    }

    .example-panel {
      flex: 0 1 auto;
    }

    /* Cell spanning demo styling. Cell borders make the merged cells obvious. */
    td {
      border: 1px solid lightgray;
      padding: 2px 4px;
    }

    .span-cell {
      vertical-align: middle;
      background: #f8fafc;
      font-weight: 600;
    }

    .subtotal-row {
      background: #f3f4f6;
      font-weight: 600;
    }

    .header-sort-button {
      border: none;
      background: none;
      font: inherit;
      font-weight: 600;
      padding: 0;
    }

    /* Cell selection over merged cells: the tint and outline land on the
       rendered anchor, drawn with inset box-shadows so a border-collapse table
       never changes row heights as cells become selected. */
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

  protected render() {
    const table = this.tableController.table(
      {
        debugTable: true,
        features,
        columns,
        data: this._data,
        enableCellSpanning: this._spanningEnabled,
        initialState: {
          pagination: { pageIndex: 0, pageSize: 12 },
        },
      },
      (state) => state, // default selector
    )

    const summaryTable = this.summaryTableController.table(
      {
        debugTable: true,
        features: summaryFeatures,
        columns: summaryColumns,
        data: this._summaryData,
      },
      (state) => state, // default selector
    )

    const visibleLeafCount = table.getVisibleLeafColumns().length

    const renderHead = () => html`
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
                    <button
                      type="button"
                      class="sortable-header header-sort-button"
                      @click=${header.column.getToggleSortingHandler()}
                    >
                      ${FlexRender({ header })}
                      ${
                        { asc: ' 🔼', desc: ' 🔽' }[
                          header.column.getIsSorted() as string
                        ] ?? ''
                      }
                    </button>
                  </th>
                `,
              )}
            </tr>
          `,
        )}
      </thead>
    `

    return html`
      <div class="demo-root">
        <div class="controls">
          <button class="demo-button" @click=${() => (this._data = makeData())}>
            Regenerate Data
          </button>
          <label>
            <input
              type="checkbox"
              .checked=${this._spanningEnabled}
              @change=${(event: Event) =>
                (this._spanningEnabled = (
                  event.target as HTMLInputElement
                ).checked)}
            />
            Row spanning
          </label>
          ${['team', 'shift'].map((columnId) => {
            const column = table.getColumn(columnId)!
            return html`
              <label>
                <input
                  type="checkbox"
                  .checked=${column.getIsVisible()}
                  @change=${column.getToggleVisibilityHandler()}
                />
                ${String(column.columnDef.header)}
              </label>
            `
          })}
          <select
            data-testid="status-filter"
            .value=${table.getColumn('status')!.getFilterValue() ?? ''}
            @change=${(event: Event) =>
              table
                .getColumn('status')!
                .setFilterValue(
                  (event.target as HTMLSelectElement).value || undefined,
                )}
          >
            <option value="">All statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input
            data-testid="employee-filter"
            class="filter-input"
            placeholder="Filter employees..."
            .value=${table.getColumn('employee')!.getFilterValue() ?? ''}
            @input=${(event: Event) =>
              table
                .getColumn('employee')!
                .setFilterValue(
                  (event.target as HTMLInputElement).value || undefined,
                )}
          />
        </div>
        <div class="spacer-sm"></div>
        <div class="controls">
          <button
            class="demo-button-sm"
            @click=${() => table.previousPage()}
            ?disabled=${!table.getCanPreviousPage()}
          >
            ${'<'}
          </button>
          <button
            class="demo-button-sm"
            @click=${() => table.nextPage()}
            ?disabled=${!table.getCanNextPage()}
          >
            ${'>'}
          </button>
          <span>
            Page ${table.state.pagination.pageIndex + 1} of
            ${table.getPageCount()}
          </span>
          <select
            data-testid="page-size"
            .value=${String(table.state.pagination.pageSize)}
            @change=${(event: Event) =>
              table.setPageSize(
                Number((event.target as HTMLSelectElement).value),
              )}
          >
            ${[10, 12, 36].map(
              (pageSize) => html`
                <option
                  value="${pageSize}"
                  ?selected=${table.state.pagination.pageSize === pageSize}
                >
                  Show ${pageSize}
                </option>
              `,
            )}
          </select>
          <span>
            Visible columns:
            <span data-testid="visible-leaf-count">${visibleLeafCount}</span>
          </span>
          <span>
            Selected cells:
            <span data-testid="selected-count">
              ${table.getSelectedCellCount()}
            </span>
          </span>
        </div>
        <div class="spacer-md"></div>
        <!-- The panels wrap into a grid whenever the viewport is wide enough. -->
        <div class="example-grid">
          <section class="example-panel">
            <h2 class="section-title">Row Spanning</h2>
            <table data-testid="span-table">
              ${renderHead()}
              <tbody>
                ${repeat(
                  table.getRowModel().rows,
                  (row) => row.id,
                  (row) => html`
                    <tr>
                      ${row.getVisibleCells().map((cell) => {
                        const rowSpan = cell.getRowSpan()
                        const colSpan = cell.getColSpan()

                        // A span of 0 means this cell is covered by a cell
                        // above or to its left. Skip it. Do NOT render
                        // rowspan="0": in HTML that means "span to the end of
                        // the row group", so forgetting this check merges the
                        // cell down the whole tbody instead of rendering
                        // nothing.
                        if (rowSpan === 0 || colSpan === 0) return null

                        return html`
                          <td
                            rowspan="${rowSpan}"
                            colspan="${colSpan}"
                            class=${getCellClassName(cell)}
                            @mousedown=${cell.getSelectionStartHandler()}
                            @mouseenter=${cell.getSelectionExtendHandler()}
                          >
                            ${FlexRender({ cell })}
                          </td>
                        `
                      })}
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </section>

          <section class="example-panel">
            <h2 class="section-title">Reference (no spanning)</h2>
            <!-- The same table instance rendered flat. Under every sort,
                 filter, and page combination the merged panel must describe
                 exactly this grid. -->
            <table data-testid="reference-table">
              ${renderHead()}
              <tbody>
                ${repeat(
                  table.getRowModel().rows,
                  (row) => row.id,
                  (row) => html`
                    <tr>
                      ${row
                        .getVisibleCells()
                        .map((cell) => html`<td>${FlexRender({ cell })}</td>`)}
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </section>

          <section class="example-panel">
            <h2 class="section-title">Summary Rows (colSpan)</h2>
            <table data-testid="summary-table">
              <thead>
                ${repeat(
                  summaryTable.getHeaderGroups(),
                  (headerGroup) => headerGroup.id,
                  (headerGroup) => html`
                    <tr>
                      ${repeat(
                        headerGroup.headers,
                        (header) => header.id,
                        (header) => html`
                          <th colspan="${header.colSpan}">
                            ${FlexRender({ header })}
                          </th>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </thead>
              <tbody>
                ${repeat(
                  summaryTable.getRowModel().rows,
                  (row) => row.id,
                  (row) => html`
                    <tr
                      class=${
                        row.original.kind === 'subtotal' ? 'subtotal-row' : ''
                      }
                    >
                      ${row.getVisibleCells().map((cell) => {
                        const rowSpan = cell.getRowSpan()
                        const colSpan = cell.getColSpan()

                        if (rowSpan === 0 || colSpan === 0) return null

                        return html`
                          <td rowspan="${rowSpan}" colspan="${colSpan}">
                            ${FlexRender({ cell })}
                          </td>
                        `
                      })}
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </section>
        </div>
        <div class="spacer-md"></div>
        <pre data-testid="table-state">
${JSON.stringify(table.state, null, 2)}</pre>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-cell-spanning-example': LitCellSpanningExample
  }
}
