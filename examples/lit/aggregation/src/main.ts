import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  aggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { Sale } from './makeData'
import type { Table } from '@tanstack/lit-table'

type RowSource = 'all' | 'custom' | 'filtered' | 'page' | 'selected'
type AggregationTableMeta = { rowSource: RowSource }

const features = tableFeatures({
  aggregationFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  aggregationFns: {
    count: aggregationFn_count,
    extent: aggregationFn_extent,
    mean: aggregationFn_mean,
    sum: aggregationFn_sum,
  },
  tableMeta: metaHelper<AggregationTableMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Sale>()

const formatAggregationValue = (value: unknown): string => {
  if (Array.isArray(value)) return value.map(formatAggregationValue).join(' – ')
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, entry]) => `${key}: ${formatAggregationValue(entry)}`)
      .join(', ')
  }
  return typeof value === 'number'
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : String(value ?? '—')
}

function getAggregationRows(table: Table<typeof features, Sale>) {
  const source = table.options.meta?.rowSource
  if (source === 'all') return table.getCoreRowModel().rows
  if (source === 'page') return table.getRowModel().rows
  if (source === 'selected') return table.getFilteredSelectedRowModel().rows
  if (source === 'custom') return table.getCoreRowModel().rows.slice(0, 3)
  return undefined
}

const columns = columnHelper.columns([
  columnHelper.display({ id: 'select' }),
  columnHelper.accessor('category', {
    header: 'Category',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('item', {
    header: 'Item',
    footer: ({ table }) => `${table.options.meta?.rowSource} total`,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    aggregationFn: 'sum',
    cell: ({ getValue }) => getValue<number>().toLocaleString(),
    footer: ({ column, table }) =>
      formatAggregationValue(
        column.getAggregationValue(getAggregationRows(table)),
      ),
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }],
    footer: ({ column, table }) =>
      formatAggregationValue(
        column.getAggregationValue(getAggregationRows(table)),
      ),
  }),
])

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Sale> = makeData(10_000)

  @state()
  private _rowSource: RowSource = 'filtered'

  private tableController = new TableController<typeof features, Sale>(this)

  protected render() {
    const table = this.tableController.table(
      {
        features,
        columns,
        data: this._data,
        meta: { rowSource: this._rowSource },
        initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
        // initialState: { pagination: { pageIndex: 1, pageSize: 20 } }, // set the initial page once
        // atoms: { pagination: paginationAtom }, // preferred: own pagination state with an external atom
        // state: { pagination }, // classic controlled state; pair with onPaginationChange
        // onPaginationChange: setPagination,
        // autoResetPageIndex: false, // keep the current page after page-altering changes; default true
        // autoResetAll: false, // turn off every feature's automatic reset, including page index
        // manualPagination: true, // pass data that is already paginated, for example from a server
        // pageCount: 10, // total pages for manual pagination; use -1 when unknown
        // rowCount: 1_000, // total rows for manual pagination; pageCount is calculated from this and pageSize
        debugTable: true,
      },
      (state) => ({ pagination: state.pagination }),
    )

    return html`
      <div class="demo-root">
        <h1>Aggregation without grouping</h1>
        <p>
          Amount uses a scalar <code>sum</code>. Score runs count, mean, and
          range together and returns a keyed object.
        </p>
        <div>
          <button
            @click=${() => {
              this._data = makeData(10_000)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this._data = makeData(200_000)
            }}
          >
            Stress Test (200k rows)
          </button>
        </div>
        <div class="spacer-sm"></div>
        <div class="controls">
          <label>
            Category filter:
            <input
              .value=${String(
                table.getColumn('category')?.getFilterValue() ?? '',
              )}
              @input=${(event: InputEvent) =>
                table
                  .getColumn('category')
                  ?.setFilterValue((event.target as HTMLInputElement).value)}
            />
          </label>
          <label>
            Total rows:
            <select
              .value=${this._rowSource}
              @change=${(event: Event) => {
                this._rowSource = (event.target as HTMLSelectElement)
                  .value as RowSource
              }}
            >
              <option value="filtered">Filtered rows</option>
              <option value="all">All rows</option>
              <option value="page">Visible page</option>
              <option value="selected">Filtered selected rows</option>
              <option value="custom">First three core rows</option>
            </select>
          </label>
        </div>
        <div class="spacer-sm"></div>
        <table>
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) => html`
                <tr>
                  ${headerGroup.headers.map(
                    (header) => html`
                      <th colspan="${header.colSpan}">
                        ${header.column.id === 'select'
                          ? html`<input
                              type="checkbox"
                              .checked=${table.getIsAllPageRowsSelected()}
                              @change=${() => table.toggleAllPageRowsSelected()}
                            />`
                          : header.isPlaceholder
                            ? null
                            : html`<div>${FlexRender({ header })}</div>`}
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </thead>
          <tbody>
            ${table.getRowModel().rows.map(
              (row) => html`
                <tr>
                  ${row
                    .getAllCells()
                    .map(
                      (cell) => html`
                        <td
                          class=${cell.column.id === 'amount' ? 'numeric' : ''}
                        >
                          ${cell.column.id === 'select'
                            ? html`<input
                                type="checkbox"
                                .checked=${row.getIsSelected()}
                                @change=${() => row.toggleSelected()}
                              />`
                            : FlexRender({ cell })}
                        </td>
                      `,
                    )}
                </tr>
              `,
            )}
          </tbody>
          <tfoot>
            ${table.getFooterGroups().map(
              (footerGroup) => html`
                <tr>
                  ${footerGroup.headers.map(
                    (header) => html`
                      <th colspan="${header.colSpan}">
                        ${header.isPlaceholder
                          ? null
                          : FlexRender({ footer: header })}
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </tfoot>
        </table>
        <div class="spacer-sm"></div>
        <div class="controls">
          <button
            class="demo-button demo-button-sm"
            @click="${() => table.firstPage()}"
            ?disabled="${!table.getCanPreviousPage()}"
          >
            &lt;&lt;
          </button>
          <button
            class="demo-button demo-button-sm"
            @click="${() => table.previousPage()}"
            ?disabled="${!table.getCanPreviousPage()}"
          >
            &lt;
          </button>
          <button
            class="demo-button demo-button-sm"
            @click="${() => table.nextPage()}"
            ?disabled="${!table.getCanNextPage()}"
          >
            &gt;
          </button>
          <button
            class="demo-button demo-button-sm"
            @click="${() => table.lastPage()}"
            ?disabled="${!table.getCanNextPage()}"
          >
            &gt;&gt;
          </button>
          <span class="inline-controls">
            <div>Page</div>
            <strong>
              ${(table.state.pagination.pageIndex + 1).toLocaleString()} of
              ${table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span class="inline-controls">
            | Go to page:
            <input
              type="number"
              min="1"
              max="${table.getPageCount()}"
              .value="${String(table.state.pagination.pageIndex + 1)}"
              @input="${(e: InputEvent) => {
                const target = e.target as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}"
              class="page-size-input"
              style="width: 4rem"
            />
          </span>
          <select
            .value="${String(table.state.pagination.pageSize)}"
            @change="${(e: Event) => {
              const target = e.target as HTMLSelectElement
              table.setPageSize(Number(target.value))
            }}"
          >
            ${[10, 20, 30, 40, 50].map(
              (pageSize) =>
                html`<option value="${pageSize}">Show ${pageSize}</option>`,
            )}
          </select>
        </div>
        <div>
          Showing ${table.getRowModel().rows.length.toLocaleString()} of
          ${table.getRowCount().toLocaleString()} Rows
        </div>
        <pre>${JSON.stringify(table.state, null, 2)}</pre>
      </div>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        table {
          border: 1px solid lightgray;
        }

        tbody {
          border-bottom: 1px solid lightgray;
        }

        th {
          border-bottom: 1px solid lightgray;
          border-right: 1px solid lightgray;
          padding: 2px 4px;
        }

        td {
          padding: 2px 4px;
        }

        tfoot {
          color: gray;
        }

        tfoot th {
          font-weight: normal;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Demo layout helpers for the plain example UI. */
        .demo-root {
          padding: 0.5rem;
        }
        .spacer-xs {
          height: 0.25rem;
        }
        .spacer-sm {
          height: 0.5rem;
        }
        .spacer-md {
          height: 1rem;
        }
        .controls,
        .button-row,
        .inline-controls,
        .pin-actions,
        .filter-row,
        .form-actions {
          display: flex;
          align-items: center;
        }
        .button-row {
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .controls {
          gap: 0.5rem;
        }
        .inline-controls,
        .pin-actions {
          gap: 0.25rem;
        }
        .pin-actions {
          justify-content: center;
        }
        .filter-row {
          gap: 0.5rem;
        }
        .form-actions {
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .split-tables {
          display: flex;
          gap: 1rem;
        }
        .table-row-group {
          display: flex;
        }
        .split-gap {
          gap: 1rem;
        }
        .vertical-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }
        .column-toggle-panel {
          display: inline-block;
          border: 1px solid #000;
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
        }
        .column-toggle-panel-header {
          border-bottom: 1px solid #000;
          padding: 0 0.25rem;
        }
        .column-toggle-row,
        .selection-cell {
          padding: 0 0.25rem;
        }
        .selection-cell {
          display: block;
        }
        .demo-button,
        .pin-button,
        .compact-input,
        .filter-input,
        .filter-select,
        .page-size-input,
        .text-input,
        .number-input,
        .wide-action-button,
        .primary-action,
        .secondary-action,
        .success-action {
          border: 1px solid currentColor;
          border-radius: 0.25rem;
        }
        .demo-button {
          padding: 0.5rem;
        }
        .demo-button-sm {
          padding: 0.25rem;
        }
        .demo-button-spaced {
          margin-bottom: 0.5rem;
        }
        .pin-button {
          padding: 0 0.5rem;
        }
        .outlined-table {
          border: 2px solid #000;
        }
        .outlined-control {
          border-color: #000;
        }
        .nowrap {
          white-space: nowrap;
        }
        .demo-note {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        .section-title {
          font-size: 1.25rem;
        }
        .scroll-container {
          overflow-x: auto;
        }
        .page-size-input {
          width: 4rem;
          padding: 0.25rem;
        }
        .number-input {
          width: 5rem;
          padding: 0 0.25rem;
        }
        .filter-input,
        .filter-select {
          width: 6rem;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
        }
        .filter-select {
          width: 9rem;
        }
        .text-input {
          width: 100%;
          padding: 0 0.25rem;
        }
        .compact-input {
          padding: 0 0.25rem;
        }
        .wide-action-button {
          width: 16rem;
        }
        .summary-panel {
          border: 1px solid currentColor;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
          padding: 0.5rem;
        }
        .sortable-header,
        .sortable {
          cursor: pointer;
          user-select: none;
        }
        .primary-action,
        .success-action,
        .secondary-action {
          color: #fff;
        }
        .primary-action {
          background: #3b82f6;
        }
        .success-action {
          background: #22c55e;
        }
        .secondary-action {
          background: #6b7280;
        }
        .submit-button:disabled {
          opacity: 0.5;
        }
        .error-text {
          color: #ef4444;
          font-size: 0.75rem;
        }
        .success-text {
          color: #16a34a;
        }
        .warning-text {
          color: #ca8a04;
        }
        .muted-text {
          color: #9ca3af;
        }
        .label-offset {
          margin-left: 0.5rem;
        }
        .cell-padding {
          padding: 0.25rem;
        }
        .table-spacer {
          margin-bottom: 0.5rem;
        }
        .centered-button-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }
      </style>
    `
  }
}
