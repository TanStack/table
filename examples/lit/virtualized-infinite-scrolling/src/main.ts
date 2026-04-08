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
        (${this._data.length} of ${this._totalRowCount} rows fetched)
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
          border-collapse: collapse;
          border-spacing: 0;
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
      </style>
    `
  }
}
