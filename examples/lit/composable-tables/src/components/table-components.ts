import { LitElement, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { useTableContext } from '../hooks/table'

// Table-level components are LitElement custom elements that use
// useTableContext(this) to access the table instance from the nearest
// ancestor that called useAppTable. They render in light DOM so that
// global CSS applies and @lit/context events bubble correctly.

@customElement('pagination-controls')
export class PaginationControls extends LitElement {
  private _table = useTableContext(this)

  createRenderRoot() {
    return this
  }

  protected render() {
    const table = this._table.value
    if (!table) return nothing

    return html`
      <div class="pagination">
        <button
          @click=${() => table.firstPage()}
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
          @click=${() => table.lastPage()}
          ?disabled=${!table.getCanNextPage()}
        >
          &gt;&gt;
        </button>
        <span>
          Page
          <strong>
            ${(table.getState().pagination.pageIndex + 1).toLocaleString()} of
            ${table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            .value=${String(table.getState().pagination.pageIndex + 1)}
            @change=${(e: Event) => {
              const page = (e.target as HTMLInputElement).value
                ? Number((e.target as HTMLInputElement).value) - 1
                : 0
              table.setPageIndex(page)
            }}
            style="width: 64px"
          />
        </span>
        <select
          .value=${String(table.getState().pagination.pageSize)}
          @change=${(e: Event) => {
            table.setPageSize(Number((e.target as HTMLSelectElement).value))
          }}
        >
          ${[10, 20, 30, 40, 50].map(
            (pageSize) =>
              html`<option value=${pageSize}>Show ${pageSize}</option>`,
          )}
        </select>
      </div>
    `
  }
}

@customElement('row-count')
export class RowCount extends LitElement {
  private _table = useTableContext(this)

  createRenderRoot() {
    return this
  }

  protected render() {
    const table = this._table.value
    if (!table) return nothing

    return html`
      <div class="row-count">
        Showing ${table.getRowModel().rows.length.toLocaleString()} of
        ${table.getRowCount().toLocaleString()} rows
      </div>
    `
  }
}

@customElement('table-toolbar')
export class TableToolbar extends LitElement {
  private _table = useTableContext(this)

  @property()
  declare title: string

  @property({ attribute: false })
  declare onRefresh: (() => void) | undefined

  createRenderRoot() {
    return this
  }

  protected render() {
    const table = this._table.value
    if (!table) return nothing

    return html`
      <div class="table-toolbar">
        <h2>${this.title}</h2>
        <div style="display: flex; gap: 8px">
          <button @click=${() => table.resetColumnFilters()}>
            Clear Filters
          </button>
          <button @click=${() => table.resetSorting()}>Clear Sorting</button>
          ${this.onRefresh
            ? html`<button @click=${this.onRefresh}>Regenerate Data</button>`
            : nothing}
        </div>
      </div>
    `
  }
}
