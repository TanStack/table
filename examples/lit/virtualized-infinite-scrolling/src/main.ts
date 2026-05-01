import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnSizingFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { styleMap } from 'lit/directives/style-map.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import { VirtualizerController } from '@tanstack/lit-virtual'
import { fetchData } from './makeData.ts'
import type { Person } from './makeData.ts'
import type { ColumnDef, SortingState } from '@tanstack/lit-table'

const fetchSize = 50

const _features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
})

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
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
    size: 50,
  },
  {
    accessorKey: 'visits',
    header: () => html`<span>Visits</span>`,
    size: 50,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    size: 80,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (info) => info.getValue<Date>().toLocaleString(),
    size: 200,
  },
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  private tableContainerRef: Ref = createRef()

  private rowVirtualizerController!: VirtualizerController<Element, Element>

  @state()
  private _data: Array<Person> = []

  @state()
  private _isFetching = false

  @state()
  private _totalRowCount = 0

  @state()
  private _sorting: SortingState = []

  connectedCallback() {
    super.connectedCallback()
    // Fetch initial data
    this._fetchMoreData()
  }

  private async _fetchMoreData() {
    if (this._isFetching) return

    this._isFetching = true

    try {
      const response = await fetchData(
        this._data.length,
        fetchSize,
        this._sorting,
      )
      this._data = [...this._data, ...response.data]
      this._totalRowCount = response.meta.totalRowCount
    } finally {
      this._isFetching = false
    }
  }

  private async _refetchData() {
    this._isFetching = true
    this._data = []

    try {
      const response = await fetchData(0, fetchSize, this._sorting)
      this._data = response.data
      this._totalRowCount = response.meta.totalRowCount
    } finally {
      this._isFetching = false
    }
  }

  private _handleScroll(e: Event) {
    const target = e.currentTarget as HTMLDivElement
    const { scrollHeight, scrollTop, clientHeight } = target
    if (
      scrollHeight - scrollTop - clientHeight < 500 &&
      !this._isFetching &&
      this._data.length < this._totalRowCount
    ) {
      this._fetchMoreData()
    }
  }

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          sortedRowModel: createSortedRowModel(sortFns),
        },
        columns,
        data: this._data,
        state: {
          sorting: this._sorting,
        },
        manualSorting: true,
        onSortingChange: (updater) => {
          const newSorting =
            typeof updater === 'function' ? updater(this._sorting) : updater
          this._sorting = newSorting
          // Reset data and refetch when sorting changes
          this._refetchData()
          // Scroll back to top
          if (this.tableContainerRef.value) {
            this.tableContainerRef.value.scrollTop = 0
          }
        },
      },
      () => ({}),
    )

    const { rows } = table.getRowModel()

    if (!this.rowVirtualizerController) {
      this.rowVirtualizerController = new VirtualizerController(this, {
        count: rows.length,
        estimateSize: () => 33,
        getScrollElement: () => this.tableContainerRef.value!,
        overscan: 5,
      })
    }

    const virtualizer = this.rowVirtualizerController.getVirtualizer()

    // Update count when rows change
    virtualizer.setOptions({
      ...virtualizer.options,
      count: rows.length,
    })

    const virtualRows = virtualizer.getVirtualItems()

    return html`
      <div class="app">
        (${this._data.length.toLocaleString()} of
        ${this._totalRowCount.toLocaleString()} rows fetched)
        <div
          class="container"
          ${ref(this.tableContainerRef)}
          @scroll="${this._handleScroll}"
          style="${styleMap({
            overflow: 'auto',
            position: 'relative',
            height: '600px',
          })}"
        >
          <table style="display: grid">
            <thead
              style="${styleMap({
                display: 'grid',
                position: 'sticky',
                top: '0',
                zIndex: '1',
              })}"
            >
              ${repeat(
                table.getHeaderGroups(),
                (headerGroup) => headerGroup.id,
                (headerGroup) => html`
                  <tr style="${styleMap({ display: 'flex', width: '100%' })}">
                    ${repeat(
                      headerGroup.headers,
                      (header) => header.id,
                      (header) => html`
                        <th
                          style="${styleMap({
                            display: 'flex',
                            width: `${header.getSize()}px`,
                          })}"
                          @click="${header.column.getToggleSortingHandler()}"
                        >
                          ${FlexRender({ header })}
                          ${{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </th>
                      `,
                    )}
                  </tr>
                `,
              )}
            </thead>
            <tbody
              style="${styleMap({
                display: 'grid',
                height: `${virtualizer.getTotalSize()}px`,
                position: 'relative',
              })}"
            >
              ${repeat(
                virtualRows,
                (item) => item.key,
                (virtualRow) => {
                  const row = rows[virtualRow.index]
                  return html`
                    <tr
                      data-index="${virtualRow.index}"
                      style="${styleMap({
                        display: 'flex',
                        position: 'absolute',
                        transform: `translateY(${virtualRow.start}px)`,
                        width: '100%',
                      })}"
                      ${ref((node) => virtualizer.measureElement(node ?? null))}
                    >
                      ${repeat(
                        row.getAllCells(),
                        (cell) => cell.id,
                        (cell) => html`
                          <td
                            style="${styleMap({
                              display: 'flex',
                              width: `${cell.column.getSize()}px`,
                            })}"
                          >
                            ${FlexRender({ cell })}
                          </td>
                        `,
                      )}
                    </tr>
                  `
                },
              )}
            </tbody>
          </table>
        </div>
        ${this._isFetching ? html`<div>Fetching More...</div>` : null}
      </div>

      <style>
        html {
          font-family: sans-serif;
          font-size: 14px;
        }

        table {
          font-family: arial, sans-serif;
          table-layout: fixed;
        }

        thead {
          background: lightgray;
        }

        tr {
          border-bottom: 1px solid lightgray;
        }

        th {
          border-bottom: 1px solid lightgray;
          border-right: 1px solid lightgray;
          padding: 2px 4px;
          text-align: left;
          cursor: pointer;
        }

        td {
          padding: 6px;
        }

        .container {
          border: 1px solid lightgray;
          margin: 1rem auto;
        }

        .app {
          margin: 1rem auto;
          text-align: center;
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
