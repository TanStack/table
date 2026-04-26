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
  createSortedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { Column, ColumnDef, Table } from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  rowSelectionFeature,
})

function indeterminateCheckbox(options: {
  checked: boolean
  indeterminate: boolean
  onChange: (e: Event) => void
}) {
  return html`
    <input
      type="checkbox"
      .checked="${options.checked}"
      .indeterminate="${!options.checked && options.indeterminate}"
      @change="${options.onChange}"
      style="cursor: pointer"
    />
  `
}

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

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    header: ({ table }) => html`
      ${indeterminateCheckbox({
        checked: table.getIsAllRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllRowsSelectedHandler(),
      })}
      <button @click="${table.getToggleAllRowsExpandedHandler()}">
        ${table.getIsAllRowsExpanded() ? '👇' : '👉'}
      </button>
      First Name
    `,
    cell: ({ row, getValue }) => html`
      <div style="padding-left:${row.depth * 2}rem">
        ${indeterminateCheckbox({
          checked: row.getIsSelected(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        })}
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
    footer: (props) => props.column.id,
  },
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
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(100, 5, 3)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          expandedRowModel: createExpandedRowModel(),
          filteredRowModel: createFilteredRowModel(filterFns),
          paginatedRowModel: createPaginatedRowModel(),
          sortedRowModel: createSortedRowModel(sortFns),
        },
        columns,
        data: this._data,
        getSubRows: (row) => row.subRows,
        debugTable: true,
      },
      (state) => ({
        expanded: state.expanded,
        rowSelection: state.rowSelection,
        columnFilters: state.columnFilters,
        pagination: state.pagination,
        sorting: state.sorting,
      }),
    )

    return html`
      <div class="p-2">
        <div>
          <button
            @click=${() => {
              this._data = makeData(100, 5, 3)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this._data = makeData(1_000, 5, 3)
            }}
          >
            Stress Test (1k rows)
          </button>
        </div>
        <div class="h-2"></div>
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
        <div class="h-2"></div>
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
        <div>${table.getRowModel().rows.length.toLocaleString()} Rows</div>
        <div>
          <button
            @click="${() => {
              this._data = makeData(100, 5, 3)
            }}"
          >
            Regenerate Data
          </button>
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
          border-collapse: collapse;
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
      </style>
    `
  }
}
