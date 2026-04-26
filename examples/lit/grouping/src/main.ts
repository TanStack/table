import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns: Array<ColumnDef<typeof _features, Person>> =
  columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (info) => info.getValue(),
      getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => html`<span>Last Name</span>`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100,
      aggregationFn: 'median',
    }),
    columnHelper.accessor('visits', {
      header: () => html`<span>Visits</span>`,
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      cell: ({ getValue }) => Math.round(getValue<number>() * 100) / 100 + '%',
      aggregationFn: 'mean',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100 + '%',
    }),
  ])

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(10_000)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          expandedRowModel: createExpandedRowModel(),
          filteredRowModel: createFilteredRowModel(filterFns),
          groupedRowModel: createGroupedRowModel(aggregationFns),
          paginatedRowModel: createPaginatedRowModel(),
          sortedRowModel: createSortedRowModel(sortFns),
        },
        columns,
        data: this._data,
        debugTable: true,
      },
      (state) => ({
        grouping: state.grouping,
        expanded: state.expanded,
        pagination: state.pagination,
      }),
    )

    return html`
      <div class="p-2">
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
              this._data = makeData(100_000)
            }}
          >
            Stress Test (100k rows)
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
                          : html`<div>
                              ${header.column.getCanGroup()
                                ? html`<button
                                    @click=${header.column.getToggleGroupingHandler()}
                                    style="cursor: pointer"
                                  >
                                    ${header.column.getIsGrouped()
                                      ? `🛑(${header.column.getGroupedIndex()}) `
                                      : '👊 '}
                                  </button>`
                                : null}
                              ${FlexRender({ header })}
                            </div>`}
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
                          style="background: ${cell.getIsGrouped()
                            ? '#0aff0082'
                            : cell.getIsAggregated()
                              ? '#ffa50078'
                              : cell.getIsPlaceholder()
                                ? '#ff000042'
                                : 'white'}"
                        >
                          ${cell.getIsGrouped()
                            ? html`<button
                                @click=${row.getToggleExpandedHandler()}
                                style="cursor: ${row.getCanExpand()
                                  ? 'pointer'
                                  : 'normal'}"
                              >
                                ${row.getIsExpanded() ? '👇' : '👉'}
                                ${FlexRender({ cell })}
                                (${row.subRows.length.toLocaleString()})
                              </button>`
                            : cell.getIsAggregated()
                              ? FlexRender({ cell })
                              : cell.getIsPlaceholder()
                                ? null
                                : FlexRender({ cell })}
                        </td>
                      `,
                    )}
                </tr>
              `,
            )}
          </tbody>
        </table>
        <div class="h-2"></div>
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
              min="1"
              max=${table.getPageCount()}
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
