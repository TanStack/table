import { LitElement, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { createAppColumnHelper, useAppTable } from '../hooks/table'
import { makeProductData } from '../makeData'
import type { Product } from '../makeData'
// Import table-level custom elements so they are registered
import './table-components'

// Create the column helper pre-bound with features — only need the data type!
const productColumnHelper = createAppColumnHelper<Product>()

// Define columns — different structure than Users table, same reusable components
const columns = productColumnHelper.columns([
  productColumnHelper.accessor('name', {
    header: 'Product Name',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.TextCell(),
  }),
  productColumnHelper.accessor('category', {
    header: 'Category',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.CategoryCell(),
  }),
  productColumnHelper.accessor('price', {
    header: 'Price',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.PriceCell(),
  }),
  productColumnHelper.accessor('stock', {
    header: 'In Stock',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.NumberCell(),
  }),
  productColumnHelper.accessor('rating', {
    header: 'Rating',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.ProgressCell(),
  }),
])

@customElement('products-table')
export class ProductsTable extends LitElement {
  @state()
  private data = makeProductData(500)

  // Create the table using the same useAppTable hook
  // NOTE: Capture `this` as `host` to avoid infinite recursion in the getter
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
      (state) => ({
        pagination: state.pagination,
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      }),
    )
  })()

  private refreshData = () => {
    this.data = makeProductData(500)
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
              this.data = makeProductData(500)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this.data = makeProductData(100_000)
            }}
          >
            Stress Test (100k rows)
          </button>
        </div>
        <!-- Table toolbar using the same context-based custom element -->
        <table-toolbar
          .title=${'Products Table'}
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
                            : columnId === 'price' ||
                                columnId === 'stock' ||
                                columnId === 'rating'
                              ? html`
                                  ${footer.FooterSum()}
                                  ${hasFilter
                                    ? html`<span class="filtered-indicator">
                                        (filtered)</span
                                      >`
                                    : nothing}
                                `
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

        <!-- Pagination and row count using the same context-based custom elements -->
        <pagination-controls></pagination-controls>
        <row-count></row-count>
      </div>
    `
  }
}
