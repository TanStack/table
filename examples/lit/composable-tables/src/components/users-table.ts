import { LitElement, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { createAppColumnHelper, useAppTable } from '../hooks/table'
import { makeData } from '../makeData'
import type { Person } from '../makeData'
// Import table-level custom elements so they are registered
import './table-components'

// Create the column helper pre-bound with features — only need the data type!
const personColumnHelper = createAppColumnHelper<Person>()

// Define columns using the column helper.
// NOTE: Use createAppColumnHelper (not createColumnHelper) to get pre-bound
// component types on cell/header objects (e.g., cell.TextCell, header.SortIndicator).
const columns = personColumnHelper.columns([
  personColumnHelper.accessor('firstName', {
    header: 'First Name',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.TextCell(),
  }),
  personColumnHelper.accessor('lastName', {
    header: 'Last Name',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.TextCell(),
  }),
  personColumnHelper.accessor('age', {
    header: 'Age',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.NumberCell(),
  }),
  personColumnHelper.accessor('visits', {
    header: 'Visits',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.NumberCell(),
  }),
  personColumnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.StatusCell(),
  }),
  personColumnHelper.accessor('progress', {
    header: 'Progress',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.ProgressCell(),
  }),
  personColumnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ cell }) => cell.RowActionsCell(),
  }),
])

@customElement('users-table')
export class UsersTable extends LitElement {
  @state()
  private data = makeData(1000)

  // Create the table — _features and _rowModels are already configured!
  // NOTE: We capture `this` (the LitElement) as `host` because inside the
  // object literal's getter, `this` would refer to the options object itself
  // (causing infinite recursion if we wrote `get data() { return this.data }`).
  private appTable = (() => {
    const host = this
    return useAppTable(
      this,
      {
        columns,
        get data() {
          return host.data
        },
        debugTable: true,
      },
      (state) => ({
        pagination: state.pagination,
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      }),
    )
  })()

  private refreshData = () => {
    this.data = makeData(1000)
  }

  createRenderRoot() {
    return this
  }

  protected render() {
    const table = this.appTable.table()
    const { sorting, columnFilters } = table.state

    return html`
      <div class="table-container">
        <div>
          <button
            @click=${() => {
              this.data = makeData(1_000)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this.data = makeData(200_000)
            }}
          >
            Stress Test (200k rows)
          </button>
        </div>
        <!-- Table toolbar using context-based custom element -->
        <table-toolbar
          .title=${'Users Table'}
          .onRefresh=${this.refreshData}
        ></table-toolbar>

        <!-- Table element -->
        <table>
          <thead>
            ${table.getHeaderGroups().map(
              (headerGroup) => html`
                <tr>
                  ${headerGroup.headers.map((h) =>
                    table.AppHeader(
                      h,
                      (header) => html`
                        <th
                          colspan=${header.colSpan}
                          class=${header.column.getCanSort()
                            ? 'sortable-header'
                            : ''}
                          @click=${header.column.getToggleSortingHandler()}
                        >
                          ${header.isPlaceholder
                            ? nothing
                            : html`
                                ${header.FlexRender()} ${header.SortIndicator()}
                                ${header.ColumnFilter()}
                                ${sorting.length > 1 &&
                                sorting.findIndex(
                                  (s) => s.id === header.column.id,
                                ) > -1
                                  ? html`<span class="sort-order"
                                      >${sorting.findIndex(
                                        (s) => s.id === header.column.id,
                                      ) + 1}</span
                                    >`
                                  : nothing}
                              `}
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
                    .map((c) =>
                      table.AppCell(
                        c,
                        (cell) => html` <td>${cell.FlexRender()}</td> `,
                      ),
                    )}
                </tr>
              `,
            )}
          </tbody>
          <tfoot>
            ${table.getFooterGroups().map(
              (footerGroup) => html`
                <tr>
                  ${footerGroup.headers.map((f) =>
                    table.AppFooter(f, (footer) => {
                      const columnId = footer.column.id
                      const hasFilter = columnFilters.some(
                        (cf) => cf.id === columnId,
                      )
                      return html`
                        <td colspan=${footer.colSpan}>
                          ${footer.isPlaceholder
                            ? nothing
                            : columnId === 'age' ||
                                columnId === 'visits' ||
                                columnId === 'progress'
                              ? html`
                                  ${footer.FooterSum()}
                                  ${hasFilter
                                    ? html`<span class="filtered-indicator">
                                        (filtered)</span
                                      >`
                                    : nothing}
                                `
                              : columnId === 'actions'
                                ? nothing
                                : html`
                                    ${footer.FooterColumnId()}
                                    ${hasFilter
                                      ? html`<span class="filtered-indicator">
                                          ✓</span
                                        >`
                                      : nothing}
                                  `}
                        </td>
                      `
                    }),
                  )}
                </tr>
              `,
            )}
          </tfoot>
        </table>

        <!-- Pagination and row count using context-based custom elements -->
        <pagination-controls></pagination-controls>
        <row-count></row-count>
      </div>
    `
  }
}
