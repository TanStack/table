import { customElement, property, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type {
  CellData,
  Column,
  ColumnDef,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  rowSortingFeature,
})

const columns: Array<ColumnDef<typeof _features, Person>> = [
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
        header: 'More Info',
        columns: [
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
    ],
  },
]

@customElement('faceted-filter')
class FacetedFilter extends LitElement {
  @property({ attribute: false })
  column!: Column<typeof _features, Person>

  @property({ attribute: false })
  table!: Table<typeof _features, Person>

  private _debounceTimer: ReturnType<typeof setTimeout> | undefined

  private _debouncedSetFilterValue(value: unknown) {
    clearTimeout(this._debounceTimer)
    this._debounceTimer = setTimeout(() => {
      this.column.setFilterValue(value)
    }, 500)
  }

  render() {
    const firstValue = this.table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(this.column.id)

    const columnFilterValue = this.column.getFilterValue()

    if (typeof firstValue === 'number') {
      const minMaxValues = this.column.getFacetedMinMaxValues()
      return html`
        <div style="display: flex; gap: 2px">
          <input
            type="number"
            min=${Number(minMaxValues?.[0] ?? '')}
            max=${Number(minMaxValues?.[1] ?? '')}
            .value=${String(
              (columnFilterValue as [number, number] | undefined)?.[0] ?? '',
            )}
            @input=${(e: InputEvent) => {
              const val = (e.target as HTMLInputElement).value
              this._debouncedSetFilterValue((old: [number, number]) => [
                val ? Number(val) : undefined,
                old?.[1],
              ])
            }}
            placeholder=${`Min ${minMaxValues?.[0] !== undefined ? `(${minMaxValues[0]})` : ''}`}
            style="width: 96px; border: 1px solid gray; border-radius: 4px; padding: 2px"
          />
          <input
            type="number"
            min=${Number(minMaxValues?.[0] ?? '')}
            max=${Number(minMaxValues?.[1] ?? '')}
            .value=${String(
              (columnFilterValue as [number, number] | undefined)?.[1] ?? '',
            )}
            @input=${(e: InputEvent) => {
              const val = (e.target as HTMLInputElement).value
              this._debouncedSetFilterValue((old: [number, number]) => [
                old?.[0],
                val ? Number(val) : undefined,
              ])
            }}
            placeholder=${`Max ${minMaxValues?.[1] !== undefined ? `(${minMaxValues[1]})` : ''}`}
            style="width: 96px; border: 1px solid gray; border-radius: 4px; padding: 2px"
          />
        </div>
      `
    }

    const sortedUniqueValues = Array.from(
      this.column.getFacetedUniqueValues().keys(),
    ).sort()

    return html`
      <div>
        <datalist id=${this.column.id + 'list'}>
          ${sortedUniqueValues
            .slice(0, 5000)
            .map((value: string) => html`<option value=${value}></option>`)}
        </datalist>
        <input
          type="text"
          .value=${columnFilterValue ?? ''}
          @input=${(e: InputEvent) => {
            const val = (e.target as HTMLInputElement).value
            this._debouncedSetFilterValue(val)
          }}
          placeholder=${`Search... (${this.column.getFacetedUniqueValues().size})`}
          style="width: 144px; border: 1px solid gray; border-radius: 4px; padding: 2px"
          list=${this.column.id + 'list'}
        />
      </div>
    `
  }
}

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000)

  private tableController = new TableController<typeof _features, Person>(this)

  private _globalFilterDebounce: ReturnType<typeof setTimeout> | undefined
  private _globalFilterValue = ''

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          facetedRowModel: createFacetedRowModel(),
          facetedMinMaxValues: createFacetedMinMaxValues(),
          facetedUniqueValues: createFacetedUniqueValues(),
          filteredRowModel: createFilteredRowModel(filterFns),
          sortedRowModel: createSortedRowModel(sortFns),
        },
        data: this._data,
        columns,
        globalFilterFn: 'includesString',
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
      },
      (state) => ({
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
      }),
    )

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
              this._data = makeData(500_000)
            }}
          >
            Stress Test (500k rows)
          </button>
        </div>
        <input
          style="padding: 8px; font-size: 16px; border: 1px solid gray; border-radius: 4px"
          .value=${(table.state.globalFilter ?? '') as string}
          @input=${(e: InputEvent) => {
            const value = (e.target as HTMLInputElement).value
            clearTimeout(this._globalFilterDebounce)
            this._globalFilterDebounce = setTimeout(() => {
              table.setGlobalFilter(value)
            }, 500)
          }}
          placeholder="Search all columns..."
        />
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
            ${table
              .getRowModel()
              .rows.slice(0, 10)
              .map(
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
        <div>${table.getRowModel().rows.length.toLocaleString()} Rows</div>
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
