import { customElement, property, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import {
  createBucketFilter,
  formatBytes,
  getBucket,
  lastLoginBuckets,
  storageBuckets,
} from './buckets'
import type {
  CellData,
  Column,
  ColumnDef,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/lit-table'
import type { Account } from './makeData'
import type { BucketColumnMeta, FacetKey } from './buckets'

const features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  columnMeta: metaHelper<BucketColumnMeta>(),
})

const columns: Array<ColumnDef<typeof features, Account>> = [
  {
    accessorKey: 'name',
    header: 'Account',
    filterFn: 'includesString',
    meta: { filterVariant: 'text' },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last login',
    cell: (info) => (info.getValue() as Date).toLocaleString(),
    getUniqueValues: (row) => [getBucket(row.lastLogin, lastLoginBuckets)],
    filterFn: createBucketFilter(lastLoginBuckets),
    meta: { filterVariant: 'facets', facetOptions: lastLoginBuckets },
  },
  {
    accessorKey: 'storageBytes',
    header: 'Storage',
    cell: (info) => formatBytes(info.getValue() as number),
    getUniqueValues: (row) => [getBucket(row.storageBytes, storageBuckets)],
    filterFn: createBucketFilter(storageBuckets),
    meta: { filterVariant: 'facets', facetOptions: storageBuckets },
  },
  {
    accessorKey: 'files',
    header: 'Files',
    enableColumnFilter: false,
    cell: (info) => (info.getValue() as number).toLocaleString(),
  },
]

@customElement('faceted-filter')
class FacetedFilter extends LitElement {
  @property({ attribute: false })
  column!: Column<typeof features, Account>

  @property({ attribute: false })
  table!: Table<typeof features, Account>

  render() {
    const columnFilterValue = this.column.getFilterValue()
    if (this.column.columnDef.meta?.filterVariant === 'facets') {
      const selected = (columnFilterValue ?? []) as Array<FacetKey>
      const counts = this.column.getFacetedUniqueValues()
      return html`
        <fieldset class="facet-options">
          ${(this.column.columnDef.meta?.facetOptions ?? []).map(
            (option) =>
              html`<label>
                <input
                  type="checkbox"
                  .checked=${selected.includes(option.value)}
                  @change=${() =>
                    this.column.setFilterValue(
                      selected.includes(option.value)
                        ? selected.filter((value) => value !== option.value)
                        : [...selected, option.value],
                    )}
                />
                <span>${option.label}</span>
                <span class="count"
                  >${(counts.get(option.value) ?? 0).toLocaleString()}</span
                >
              </label>`,
          )}
        </fieldset>
      `
    }
    return html`
      <input
        type="text"
        .value=${(columnFilterValue ?? '') as string}
        @input=${(event: InputEvent) =>
          this.column.setFilterValue((event.target as HTMLInputElement).value)}
        placeholder="Search…"
      />
    `
  }
}

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Account> = makeData(5_000)

  private tableController = new TableController<typeof features, Account>(this)

  protected render() {
    const table = this.tableController.table(
      {
        features,
        data: this._data,
        columns,
        // Column faceting has no table-level options; configure its row-model factories in `features`.
        // initialState: { columnFilters: [{ id: 'firstName', value: 'Jane' }] }, // set filters once
        // atoms: { columnFilters: columnFiltersAtom }, // preferred: own column filters with an external atom
        // state: { columnFilters }, // classic controlled state; pair with onColumnFiltersChange
        // onColumnFiltersChange: setColumnFilters,
        // enableFilters: false, // disable all column and global filtering; default true
        // enableColumnFilters: false, // disable per-column filters; default true
        // filterFromLeafRows: true, // keep parents whose descendants match; default filters from parents down
        // maxLeafRowFilterDepth: 1, // only filter through this nested-row depth; default 100
        // manualFiltering: true, // pass data that is already filtered, for example from a server
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
      },
      (state) => ({
        columnFilters: state.columnFilters,
        pagination: state.pagination,
      }),
    )

    return html`
      <div class="demo-root">
        <div>
          <button
            @click=${() => {
              this._data = makeData(5_000)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this._data = makeData(1_000_000)
            }}
          >
            Stress Test (1M rows)
          </button>
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
                      <th colspan=${header.colSpan}>
                        ${header.isPlaceholder
                          ? null
                          : html`
                              ${FlexRender({ header })}
                              ${header.column.getCanFilter()
                                ? html`<div>
                                    <faceted-filter
                                      .column=${header.column}
                                      .table=${table}
                                    ></faceted-filter>
                                  </div>`
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
            ${table.getRowModel().rows.map(
              (row) => html`
                <tr>
                  ${row
                    .getAllCells()
                    .map((cell) => html` <td>${FlexRender({ cell })}</td> `)}
                </tr>
              `,
            )}
          </tbody>
        </table>
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
          ${table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows
        </div>
        <pre data-testid="table-state">
${JSON.stringify(table.state, null, 2)}</pre
        >
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
        .facet-options {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          margin: 0;
          border: 0;
          padding: 0;
          font-weight: normal;
        }
        .facet-options label {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
        }
        .count {
          margin-left: auto;
          color: gray;
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
