import { customElement, property, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { makeData } from './makeData'
import type { Column, FilterFn, SortFn } from '@tanstack/lit-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const fuzzyFilter: FilterFn<typeof _features, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<typeof _features, Person> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

declare module '@tanstack/lit-table' {
  interface FilterFns {
    fuzzy: FilterFn<typeof _features, Person>
  }
  interface FilterMeta {
    itemRank?: RankingInfo
  }
}

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    filterFn: 'includesStringSensitive',
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => html`<span>Last Name</span>`,
    filterFn: 'includesString',
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
    filterFn: 'fuzzy',
    sortFn: fuzzySort,
  }),
])

@customElement('debounced-input')
class DebouncedInput extends LitElement {
  @property()
  value: string | number = ''

  @property()
  type = 'text'

  @property()
  placeholder = ''

  @property({ type: Number })
  debounce = 500

  private _timer: ReturnType<typeof setTimeout> | undefined

  render() {
    return html`
      <input
        type=${this.type}
        .value=${String(this.value)}
        @input=${(e: InputEvent) => {
          const val = (e.target as HTMLInputElement).value
          clearTimeout(this._timer)
          this._timer = setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent('debounced-change', {
                detail: { value: val },
                bubbles: true,
                composed: true,
              }),
            )
          }, this.debounce)
        }}
        placeholder=${this.placeholder}
        style="border: 1px solid gray; border-radius: 4px; padding: 2px"
      />
    `
  }
}

@customElement('column-filter')
class ColumnFilterEl extends LitElement {
  @property({ attribute: false })
  column!: Column<typeof _features, Person>

  render() {
    const columnFilterValue = this.column.getFilterValue()

    return html`
      <debounced-input
        type="text"
        .value=${columnFilterValue ?? ''}
        @debounced-change=${(e: CustomEvent) =>
          this.column.setFilterValue(e.detail.value)}
        placeholder="Search..."
      ></debounced-input>
    `
  }
}

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(5_000)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          filteredRowModel: createFilteredRowModel({
            ...filterFns,
            fuzzy: fuzzyFilter,
          }),
          paginatedRowModel: createPaginatedRowModel(),
          sortedRowModel: createSortedRowModel(sortFns),
        },
        columns,
        data: this._data,
        globalFilterFn: 'fuzzy',
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
      },
      (state) => ({
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
        sorting: state.sorting,
        pagination: state.pagination,
      }),
    )

    // Auto-sort by fullName when its filter is active
    if (table.state.columnFilters[0]?.id === 'fullName') {
      if (table.state.sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }

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
              this._data = makeData(100_000)
            }}
          >
            Stress Test (100k rows)
          </button>
        </div>
        <div>
          <debounced-input
            .value=${(table.state.globalFilter ?? '') as string}
            @debounced-change=${(e: CustomEvent) =>
              table.setGlobalFilter(String(e.detail.value))}
            placeholder="Search all columns..."
          ></debounced-input>
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
                              <div
                                @click=${header.column.getToggleSortingHandler()}
                                style="cursor: ${header.column.getCanSort()
                                  ? 'pointer'
                                  : 'default'}"
                              >
                                ${FlexRender({ header })}
                                ${{ asc: ' 🔼', desc: ' 🔽' }[
                                  header.column.getIsSorted() as string
                                ] ?? null}
                              </div>
                              ${header.column.getCanFilter()
                                ? html`<div>
                                    <column-filter
                                      .column=${header.column}
                                    ></column-filter>
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
        <div class="spacer-sm"></div>
        <div class="page-controls">
          <button
            @click=${() => table.setPageIndex(0)}
            ?disabled=${!table.getCanPreviousPage()}
          >
            &lt;&lt;
          </button>
          <button
            @click=${() => table.previousPage()}
            ?disabled=${!table.getCanPreviousPage()}
          >
            &lt;
          </button>
          <button
            @click=${() => table.nextPage()}
            ?disabled=${!table.getCanNextPage()}
          >
            &gt;
          </button>
          <button
            @click=${() => table.setPageIndex(table.getPageCount() - 1)}
            ?disabled=${!table.getCanNextPage()}
          >
            &gt;&gt;
          </button>
          <span>
            Page
            <strong>
              ${(table.state.pagination.pageIndex + 1).toLocaleString()} of
              ${table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span>
            | Go to page:
            <input
              type="number"
              .value=${String(table.state.pagination.pageIndex + 1)}
              @input=${(e: InputEvent) => {
                const page = (e.target as HTMLInputElement).value
                  ? Number((e.target as HTMLInputElement).value) - 1
                  : 0
                table.setPageIndex(page)
              }}
              style="width: 64px; border: 1px solid gray; padding: 2px; border-radius: 4px"
            />
          </span>
          <select
            .value=${String(table.state.pagination.pageSize)}
            @change=${(e: Event) =>
              table.setPageSize(Number((e.target as HTMLSelectElement).value))}
          >
            ${[10, 20, 30, 40, 50].map(
              (pageSize) =>
                html`<option value=${pageSize}>Show ${pageSize}</option>`,
            )}
          </select>
        </div>
        <div>
          ${table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows
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
