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
  filterFn_inNumberRange,
  filterFn_includesString,
  metaHelper,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type {
  Column,
  ColumnDef,
  FilterFn,
  FilterFnOption,
  SortFnOption,
  Table,
} from '@tanstack/lit-table'

// This example builds its columns from the DATA instead of a hard-coded definition.
// The row shape is treated as unknown (a generic Record). For each key we:
//   1. detect the value's data type at runtime,
//   2. pick a sortFn and filterFn that suit that type,
//   3. render a different filter component per type (see the branches in <dynamic-filter>).
// The distinct values / min-max used by the filters come from the column faceting
// feature, not from a hand-rolled scan of the data.

// 1. Treat each row as an object of unknown shape
type DynamicRow = Record<string, unknown>

// The runtime-detected data type for a column, stored in its meta.
type DataType = 'string' | 'number' | 'boolean' | 'date'

// allows us to attach the detected data type to each column
interface DynamicColumnMeta {
  dataType: DataType
}

// 2. New in V9! Tell the table which features, row models, and fn registries we use.
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  columnFacetingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(), // powers the enum select options
  facetedMinMaxValues: createFacetedMinMaxValues(), // powers the numeric range hints
  // register only the built-in sort fns we reference by name
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
  // register only the built-in filter fns we reference by name
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  columnMeta: metaHelper<DynamicColumnMeta>(),
})

// Custom filter fns for the data types that have no suitable built-in.
// Per convention, standalone fns use `any` for TData since they aren't shape-specific.
const booleanFilterFn: FilterFn<typeof features, any> = (
  row,
  columnId,
  filterValue,
) => {
  if (filterValue === '' || filterValue == null) return true
  return String(row.getValue(columnId)) === String(filterValue)
}

const dateRangeFilterFn: FilterFn<typeof features, any> = (
  row,
  columnId,
  filterValue,
) => {
  const [min, max] = (filterValue as [string, string] | undefined) ?? ['', '']
  const value = row.getValue(columnId)
  const time =
    value instanceof Date
      ? value.getTime()
      : new Date(value as string).getTime()
  if (min && time < new Date(min).getTime()) return false
  if (max && time > new Date(max).getTime()) return false
  return true
}

// Turn a data key like "firstName" into a readable header like "First Name"
function formatHeader(key: string) {
  const withSpaces = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/[_-]+/g, ' ') // split snake_case / kebab-case
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

// Inspect a sample value for a key and decide its data type.
function detectDataType(data: Array<DynamicRow>, key: string): DataType {
  const sample = data.find((row) => row[key] != null)?.[key]
  if (sample instanceof Date) return 'date'
  if (typeof sample === 'boolean') return 'boolean'
  if (typeof sample === 'number') return 'number'
  return 'string'
}

// Pick a built-in sort fn (by name) based on the data type.
function getSortFn(dataType: DataType): SortFnOption<typeof features, any> {
  switch (dataType) {
    case 'number':
    case 'boolean':
      return 'basic'
    case 'date':
      return 'datetime'
    case 'string':
    default:
      return 'alphanumeric'
  }
}

// Pick a filter fn based on the data type. Mixes built-in fns (by name) with
// the custom fns defined above.
function getFilterFn(dataType: DataType): FilterFnOption<typeof features, any> {
  switch (dataType) {
    case 'number':
      return 'inNumberRange'
    case 'boolean':
      return booleanFilterFn
    case 'date':
      return dateRangeFilterFn
    case 'string':
    default:
      return 'includesString'
  }
}

// Render a cell value based on its data type.
function renderValue(value: unknown, dataType: DataType) {
  if (value == null) return ''
  if (dataType === 'date') return (value as Date).toLocaleDateString()
  if (dataType === 'boolean') return (value as boolean) ? '✅' : '❌'
  return String(value)
}

// 3. Derive the columns from the keys of the data instead of hard-coding them.
function buildColumns(
  data: Array<DynamicRow>,
): Array<ColumnDef<typeof features, DynamicRow>> {
  if (data.length === 0) return []
  return Object.keys(data[0]).map(
    (key): ColumnDef<typeof features, DynamicRow> => {
      const dataType = detectDataType(data, key)
      return {
        accessorKey: key,
        header: formatHeader(key),
        meta: { dataType },
        sortFn: getSortFn(dataType),
        filterFn: getFilterFn(dataType),
        cell: (info) => renderValue(info.getValue(), dataType),
      }
    },
  )
}

// A different filter UI per data type. Which branch renders is driven by the
// `dataType` detected at build time and stored in the column's meta. The distinct
// values (enum options) and numeric min/max hints come from column faceting.
@customElement('dynamic-filter')
class DynamicFilter extends LitElement {
  @property({ attribute: false })
  column!: Column<typeof features, DynamicRow>

  // The table reference changes on every parent render, which forces this element
  // to re-render (and re-read the fresh column filter/faceted values) whenever the
  // table state changes.
  @property({ attribute: false })
  table!: Table<typeof features, DynamicRow>

  private _debounceTimer: ReturnType<typeof setTimeout> | undefined

  private _debouncedSetFilterValue(value: unknown) {
    clearTimeout(this._debounceTimer)
    this._debounceTimer = setTimeout(() => {
      this.column.setFilterValue(value as any)
    }, 500)
  }

  // Render without shadow DOM so the shared inline <style> in <lit-table-example>
  // applies to these inputs as well.
  protected createRenderRoot() {
    return this
  }

  render() {
    const dataType = this.column.columnDef.meta?.dataType ?? 'string'
    const filterValue = this.column.getFilterValue()

    if (dataType === 'number') {
      const [min, max] = this.column.getFacetedMinMaxValues() ?? []
      return html`
        <div class="filter-row">
          <input
            type="number"
            class="filter-input"
            .value=${String(
              (filterValue as [number, number] | undefined)?.[0] ?? '',
            )}
            @input=${(e: InputEvent) => {
              const val = (e.target as HTMLInputElement).value
              this._debouncedSetFilterValue(
                (old: [number, number] | undefined) => [
                  val ? Number(val) : undefined,
                  old?.[1],
                ],
              )
            }}
            placeholder=${`Min${min !== undefined ? ` (${min})` : ''}`}
          />
          <input
            type="number"
            class="filter-input"
            .value=${String(
              (filterValue as [number, number] | undefined)?.[1] ?? '',
            )}
            @input=${(e: InputEvent) => {
              const val = (e.target as HTMLInputElement).value
              this._debouncedSetFilterValue(
                (old: [number, number] | undefined) => [
                  old?.[0],
                  val ? Number(val) : undefined,
                ],
              )
            }}
            placeholder=${`Max${max !== undefined ? ` (${max})` : ''}`}
          />
        </div>
      `
    }

    if (dataType === 'date') {
      return html`
        <div class="filter-row">
          <input
            type="date"
            class="filter-input"
            .value=${(filterValue as [string, string] | undefined)?.[0] ?? ''}
            @input=${(e: InputEvent) => {
              const val = (e.target as HTMLInputElement).value
              this._debouncedSetFilterValue(
                (old: [string, string] | undefined) => [
                  String(val),
                  old?.[1] ?? '',
                ],
              )
            }}
          />
          <input
            type="date"
            class="filter-input"
            .value=${(filterValue as [string, string] | undefined)?.[1] ?? ''}
            @input=${(e: InputEvent) => {
              const val = (e.target as HTMLInputElement).value
              this._debouncedSetFilterValue(
                (old: [string, string] | undefined) => [
                  old?.[0] ?? '',
                  String(val),
                ],
              )
            }}
          />
        </div>
      `
    }

    if (dataType === 'boolean') {
      return html`
        <select
          class="filter-select"
          .value=${(filterValue ?? '').toString()}
          @change=${(e: Event) => {
            this.column.setFilterValue((e.target as HTMLSelectElement).value)
          }}
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      `
    }

    // string: low-cardinality columns become a select of their faceted values,
    // everything else gets a free-text search.
    const uniqueValues = Array.from(this.column.getFacetedUniqueValues().keys())
      .map(String)
      .sort()
    const isEnum = uniqueValues.length > 0 && uniqueValues.length <= 10

    if (isEnum) {
      return html`
        <select
          class="filter-select"
          .value=${(filterValue ?? '').toString()}
          @change=${(e: Event) => {
            this.column.setFilterValue((e.target as HTMLSelectElement).value)
          }}
        >
          <option value="">All</option>
          ${uniqueValues.map(
            (value) => html`<option value=${value}>${value}</option>`,
          )}
        </select>
      `
    }

    return html`
      <input
        type="text"
        class="filter-input"
        .value=${String(filterValue ?? '')}
        @input=${(e: InputEvent) => {
          const val = (e.target as HTMLInputElement).value
          this._debouncedSetFilterValue(val)
        }}
        placeholder=${`Search... (${this.column.getFacetedUniqueValues().size})`}
      />
    `
  }
}

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<DynamicRow> = makeData(1_000)

  private tableController = new TableController<typeof features, DynamicRow>(
    this,
  )

  // Only rebuild the derived columns when the underlying data reference changes,
  // not on every state-driven re-render (e.g. sorting / filtering).
  private _columnsCache: Array<ColumnDef<typeof features, DynamicRow>> = []
  private _columnsCacheData: Array<DynamicRow> | null = null

  private get columns() {
    if (this._columnsCacheData !== this._data) {
      this._columnsCacheData = this._data
      this._columnsCache = buildColumns(this._data)
    }
    return this._columnsCache
  }

  protected render() {
    const table = this.tableController.table(
      {
        features,
        data: this._data,
        columns: this.columns,
        debugTable: true,
      },
      (state) => ({
        columnFilters: state.columnFilters,
        sorting: state.sorting,
      }),
    )

    return html`
      <div class="demo-root">
        <p class="demo-note">
          Columns, sort fns, filter fns, and filter components are all derived
          from the data type of each field, not from a hard-coded column
          definition.
        </p>
        <div class="button-row">
          <button
            class="demo-button demo-button-sm"
            @click=${() => {
              this._data = makeData(1_000)
            }}
          >
            Regenerate Data
          </button>
          <button
            class="demo-button demo-button-sm"
            @click=${() => {
              this._data = makeData(1_000_000)
            }}
          >
            Stress Test (1M rows)
          </button>
        </div>
        <div class="spacer-sm"></div>
        <div class="scroll-container">
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
                                  class=${header.column.getCanSort()
                                    ? 'sortable-header'
                                    : ''}
                                  title=${header.column.getCanSort()
                                    ? 'Toggle sorting'
                                    : ''}
                                  @click=${header.column.getToggleSortingHandler()}
                                >
                                  ${FlexRender({ header })}${{
                                    asc: ' 🔼',
                                    desc: ' 🔽',
                                  }[header.column.getIsSorted() as string] ??
                                  ''}
                                </div>
                                ${header.column.getCanFilter()
                                  ? html`<dynamic-filter
                                      .column=${header.column}
                                      .table=${table}
                                    ></dynamic-filter>`
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
                .rows.slice(0, 15)
                .map(
                  (row) => html`
                    <tr>
                      ${row
                        .getAllCells()
                        .map((cell) => html`<td>${FlexRender({ cell })}</td>`)}
                    </tr>
                  `,
                )}
            </tbody>
          </table>
        </div>
        <div class="spacer-sm"></div>
        <div>${table.getRowModel().rows.length.toLocaleString()} Rows</div>
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

declare global {
  interface HTMLElementTagNameMap {
    'dynamic-filter': DynamicFilter
    'lit-table-example': LitTableExample
  }
}
