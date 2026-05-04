import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { createAtom } from '@tanstack/store'
import { makeData } from './makeData'
import type { PaginationState, SortingState } from '@tanstack/lit-table'
import type { Person } from './makeData'

// This example demonstrates managing individual slices of table state via
// external TanStack Store atoms. Each atom is a stand-alone, subscribable
// reactive cell — you can read, write, or subscribe to it from anywhere,
// which makes it convenient for sharing state across components or modules.

const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

// Create stable external atoms for the individual state slices you want to
// own. These live at module scope here, but could just as easily be created
// in a shared store module and imported by multiple components.
const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    // The table creates internal base atoms for every slice, and (because we
    // pass `atoms` below) reads/writes for `sorting` and `pagination` are
    // routed through the external atoms we created instead. The
    // TableController subscribes to `table.store` for us, so any atom change
    // flowing through the derived store triggers `host.requestUpdate()`.
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          sortedRowModel: createSortedRowModel(sortFns),
          paginatedRowModel: createPaginatedRowModel(),
        },
        columns,
        data: this._data,
        atoms: {
          sorting: sortingAtom,
          pagination: paginationAtom,
        },
        debugTable: true,
      },
      (state) => ({
        sorting: state.sorting,
        pagination: state.pagination,
      }),
    )

    const pagination = paginationAtom.get()
    const sorting = sortingAtom.get()

    return html`
      <div class="demo-root">
        <div>
          <button
            @click=${() => {
              this._data = makeData(1_000)
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
                          : html`<div
                              class="${header.column.getCanSort()
                                ? 'sortable-header'
                                : ''}"
                              @click="${header.column.getToggleSortingHandler()}"
                            >
                              ${FlexRender({ header })}
                              ${{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>`}
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
                  ${repeat(
                    row.getAllCells(),
                    (cell) => cell.id,
                    (cell) => html` <td>${FlexRender({ cell })}</td> `,
                  )}
                </tr>
              `,
            )}
          </tbody>
        </table>
        <div class="spacer-sm"></div>
        <div class="controls">
          <button
            class="demo-button demo-button-sm"
            @click="${() => table.setPageIndex(0)}"
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
            @click="${() => table.setPageIndex(table.getPageCount() - 1)}"
            ?disabled="${!table.getCanNextPage()}"
          >
            &gt;&gt;
          </button>
          <span class="inline-controls">
            <div>Page</div>
            <strong>
              ${(pagination.pageIndex + 1).toLocaleString()} of
              ${table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span class="inline-controls">
            | Go to page:
            <input
              type="number"
              min="1"
              max="${table.getPageCount()}"
              .value="${String(pagination.pageIndex + 1)}"
              @input="${(e: InputEvent) => {
                const target = e.currentTarget as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}"
              class="page-size-input"
            />
          </span>
          <select
            .value="${String(pagination.pageSize)}"
            @change="${(e: Event) => {
              const target = e.currentTarget as HTMLSelectElement
              table.setPageSize(Number(target.value))
            }}"
          >
            ${[10, 20, 30, 40, 50].map(
              (pageSize) =>
                html`<option value="${pageSize}">Show ${pageSize}</option>`,
            )}
          </select>
        </div>
        <div class="spacer-md"></div>
        <pre>${JSON.stringify({ sorting, pagination }, null, 2)}</pre>
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

        .sortable-header {
          cursor: pointer;
        }

        .sortable-header {
          user-select: none;
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
