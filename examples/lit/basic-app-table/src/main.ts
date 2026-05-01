import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { Person } from './makeData'

// This example uses the new `createTableHook` method to create a re-usable table hook factory instead of independently using the standalone `TableController` and `createColumnHelper` method. You can choose to use either way.

// 3. New in V9! Tell the table which features and row models we want to use. In this case, we want sorting.
const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({
    rowSortingFeature,
  }),
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
  },
  debugTable: true,
})

// 4. Create a helper object to help define our columns
const columnHelper = createAppColumnHelper<Person>()

// 5. Define the columns for your table with a stable reference (in this case, defined statically outside of a Lit component)
const columns = columnHelper.columns([
  // accessorKey method (most common for simple use-cases)
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  // accessorFn used (alternative) along with a custom id
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => html`<i>${info.getValue()}</i>`,
    header: () => html`<span>Last Name</span>`,
    footer: (info) => info.column.id,
  }),
  // accessorFn used to transform the data
  columnHelper.accessor((row) => Number(row.age), {
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => html`<span>Visits</span>`,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
])

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private data: Array<Person> = makeData(20)

  // 6. Store data with a reactive reference
  // (in Lit, we use @state() for reactive properties)

  // 7. Create the table instance with the required columns and data.
  //    Features and row models are already defined in the createTableHook call above
  //    NOTE: Capture `this` as `host` because inside the getter, `this` refers
  //    to the options object (not the LitElement), which would cause infinite recursion.
  private appTable = (() => {
    const host = this
    return useAppTable(
      this,
      {
        debugTable: true,
        columns,
        get data() {
          return host.data
        },
      },
      (state) => ({ sorting: state.sorting }),
    )
  })()

  private rerender() {
    this.data = makeData(20)
  }

  // 8. Render your table markup from the table instance APIs
  protected render(): unknown {
    const table = this.appTable.table()

    return html`
      <div class="demo-root">
        <div>
          <button
            @click=${() => {
              this.data = makeData(20)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this.data = makeData(1_000)
            }}
          >
            Stress Test (1k rows)
          </button>
        </div>
        <table>
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) => html`
                <tr>
                  ${headerGroup.headers.map((header) =>
                    table.AppHeader(
                      header,
                      (h) => html`
                        <th colspan=${h.colSpan}>
                          ${h.isPlaceholder
                            ? null
                            : html`<div
                                title=${h.column.getCanSort()
                                  ? h.column.getNextSortingOrder() === 'asc'
                                    ? 'Sort ascending'
                                    : h.column.getNextSortingOrder() === 'desc'
                                      ? 'Sort descending'
                                      : 'Clear sort'
                                  : ''}
                                @click=${h.column.getToggleSortingHandler()}
                                style="cursor: ${h.column.getCanSort()
                                  ? 'pointer'
                                  : 'not-allowed'}"
                              >
                                ${h.FlexRender()}
                                ${{ asc: ' \u{1F53C}', desc: ' \u{1F53D}' }[
                                  h.column.getIsSorted() as string
                                ] ?? null}
                              </div>`}
                        </th>
                      `,
                    ),
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
                    .map((cell) =>
                      table.AppCell(
                        cell,
                        (c) => html` <td>${c.FlexRender()}</td> `,
                      ),
                    )}
                </tr>
              `,
            )}
          </tbody>
          <tfoot>
            ${repeat(
              table.getFooterGroups(),
              (footerGroup) => footerGroup.id,
              (footerGroup) => html`
                <tr>
                  ${footerGroup.headers.map((header) =>
                    table.AppFooter(
                      header,
                      (h) => html`
                        <th>${h.isPlaceholder ? null : h.FlexRender()}</th>
                      `,
                    ),
                  )}
                </tr>
              `,
            )}
          </tfoot>
        </table>
        <div class="spacer-md"></div>
        <button @click=${() => this.rerender()} class="demo-button">
          Rerender (sort by age)
        </button>
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
          border-right: 1px solid lightgray;
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
