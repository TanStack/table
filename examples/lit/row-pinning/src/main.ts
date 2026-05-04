import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnFilteringFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { Column, ColumnDef, Row, Table } from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  rowPinningFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
})

function renderFilter(
  column: Column<typeof _features, Person>,
  table: Table<typeof _features, Person>,
) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  if (typeof firstValue === 'number') {
    return html`
      <div style="display:flex;gap:2px">
        <input
          type="number"
          .value="${String(
            (columnFilterValue as [number, number] | undefined)?.[0] ?? '',
          )}"
          @input="${(e: InputEvent) =>
            column.setFilterValue((old: [number, number] | undefined) => [
              (e.target as HTMLInputElement).value,
              old?.[1],
            ])}"
          placeholder="Min"
          style="width:6rem;border:1px solid #ccc;border-radius:4px"
        />
        <input
          type="number"
          .value="${String(
            (columnFilterValue as [number, number] | undefined)?.[1] ?? '',
          )}"
          @input="${(e: InputEvent) =>
            column.setFilterValue((old: [number, number] | undefined) => [
              old?.[0],
              (e.target as HTMLInputElement).value,
            ])}"
          placeholder="Max"
          style="width:6rem;border:1px solid #ccc;border-radius:4px"
        />
      </div>
    `
  }

  return html`
    <input
      type="text"
      .value="${String(columnFilterValue ?? '')}"
      @input="${(e: InputEvent) =>
        column.setFilterValue((e.target as HTMLInputElement).value)}"
      placeholder="Search..."
      style="width:9rem;border:1px solid #ccc;border-radius:4px"
    />
  `
}

function renderPinnedRow(
  row: Row<typeof _features, Person>,
  table: Table<typeof _features, Person>,
) {
  const isPinnedTop = row.getIsPinned() === 'top'
  const topOffset = isPinnedTop
    ? `${row.getPinnedIndex() * 26 + 48}px`
    : undefined
  const bottomOffset = !isPinnedTop
    ? `${(table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26}px`
    : undefined

  return html`
    <tr
      style="background-color:lightblue;position:sticky;${topOffset
        ? `top:${topOffset}`
        : ''}${bottomOffset ? `bottom:${bottomOffset}` : ''}"
    >
      ${row
        .getAllCells()
        .map((cell) => html` <td>${FlexRender({ cell })}</td> `)}
    </tr>
  `
}

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    id: 'pin',
    header: () => 'Pin',
    cell: ({ row }) =>
      row.getIsPinned()
        ? html`<button @click="${() => row.pin(false, true, false)}">
            ❌
          </button>`
        : html`<div style="display:flex;gap:4px">
            <button @click="${() => row.pin('top', true, false)}">⬆️</button>
            <button @click="${() => row.pin('bottom', true, false)}">⬇️</button>
          </div>`,
  },
  {
    accessorKey: 'firstName',
    header: ({ table }) => html`
      <button @click="${table.getToggleAllRowsExpandedHandler()}">
        ${table.getIsAllRowsExpanded() ? '👇' : '👉'}
      </button>
      First Name
    `,
    cell: ({ row, getValue }) => html`
      <div style="padding-left:${row.depth * 2}rem">
        ${row.getCanExpand()
          ? html`<button
              @click="${row.getToggleExpandedHandler()}"
              style="cursor:pointer"
            >
              ${row.getIsExpanded() ? '👇' : '👉'}
            </button>`
          : '🔵'}
        ${getValue()}
      </div>
    `,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => html`<span>Last Name</span>`,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
  {
    accessorKey: 'visits',
    header: () => html`<span>Visits</span>`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000, 2, 2)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          filteredRowModel: createFilteredRowModel(filterFns),
          expandedRowModel: createExpandedRowModel(),
          paginatedRowModel: createPaginatedRowModel(),
        },
        columns,
        data: this._data,
        initialState: {
          pagination: { pageSize: 20, pageIndex: 0 },
        },
        getSubRows: (row) => row.subRows,
        keepPinnedRows: true,
        debugAll: true,
      },
      (state) => ({
        rowPinning: state.rowPinning,
        expanded: state.expanded,
        columnFilters: state.columnFilters,
        pagination: state.pagination,
      }),
    )

    return html`
      <div class="app">
        <div class="demo-root container">
          <div>
            <button
              @click=${() => {
                this._data = makeData(1_000, 2, 2)
              }}
            >
              Regenerate Data
            </button>
            <button
              @click=${() => {
                this._data = makeData(200_000, 2, 2)
              }}
            >
              Stress Test (200k rows)
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
                        <th colspan="${header.colSpan}">
                          ${header.isPlaceholder
                            ? null
                            : html`
                                <div>
                                  ${FlexRender({ header })}
                                  ${header.column.getCanFilter()
                                    ? html`<div>
                                        ${renderFilter(header.column, table)}
                                      </div>`
                                    : null}
                                </div>
                              `}
                        </th>
                      `,
                    )}
                  </tr>
                `,
              )}
            </thead>
            <tbody>
              ${table.getTopRows().map((row) => renderPinnedRow(row, table))}
              ${table.getCenterRows().map(
                (row) => html`
                  <tr>
                    ${row
                      .getAllCells()
                      .map((cell) => html` <td>${FlexRender({ cell })}</td> `)}
                  </tr>
                `,
              )}
              ${table.getBottomRows().map((row) => renderPinnedRow(row, table))}
            </tbody>
          </table>
        </div>

        <div class="spacer-sm"></div>
        <div class="page-controls">
          <button
            @click="${() => table.setPageIndex(0)}"
            ?disabled="${!table.getCanPreviousPage()}"
          >
            &lt;&lt;
          </button>
          <button
            @click="${() => table.previousPage()}"
            ?disabled="${!table.getCanPreviousPage()}"
          >
            &lt;
          </button>
          <button
            @click="${() => table.nextPage()}"
            ?disabled="${!table.getCanNextPage()}"
          >
            &gt;
          </button>
          <button
            @click="${() => table.setPageIndex(table.getPageCount() - 1)}"
            ?disabled="${!table.getCanNextPage()}"
          >
            &gt;&gt;
          </button>
          <span style="display:flex;align-items:center;gap:4px">
            <span>Page</span>
            <strong>
              ${(table.state.pagination.pageIndex + 1).toLocaleString()} of
              ${table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span style="display:flex;align-items:center;gap:4px">
            | Go to page:
            <input
              type="number"
              min="1"
              max="${table.getPageCount()}"
              .value="${String(table.state.pagination.pageIndex + 1)}"
              @input="${(e: InputEvent) => {
                const page = (e.target as HTMLInputElement).value
                  ? Number((e.target as HTMLInputElement).value) - 1
                  : 0
                table.setPageIndex(page)
              }}"
              style="width:4rem;border:1px solid #ccc;padding:2px 4px;border-radius:4px"
            />
          </span>
          <select
            .value="${String(table.state.pagination.pageSize)}"
            @change="${(e: Event) => {
              table.setPageSize(Number((e.target as HTMLSelectElement).value))
            }}"
          >
            ${[10, 20, 30, 40, 50].map(
              (pageSize) =>
                html`<option value="${pageSize}">Show ${pageSize}</option>`,
            )}
          </select>
        </div>
        <div class="spacer-sm"></div>
        <pre>
${JSON.stringify(
            {
              rowPinning: table.state.rowPinning,
              pagination: table.state.pagination,
            },
            null,
            2,
          )}</pre
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

        .page-controls {
          display: flex;
          gap: 10px;
          padding: 4px 0;
          align-items: center;
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
