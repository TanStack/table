import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnSizingFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { styleMap } from 'lit/directives/style-map.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import { VirtualizerController } from '@tanstack/lit-virtual'
import { Person, makeColumns, makeData } from './makeData.ts'
import type { ColumnDef } from '@tanstack/lit-table'

const _features = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  rowSortingFeature,
})

const columns = makeColumns(1_000) as Array<ColumnDef<typeof _features, Person>>
const data = makeData(1_000, columns)

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  private tableContainerRef: Ref = createRef()

  @state()
  private _data = data

  private columnVirtualizerController!: VirtualizerController<Element, Element>
  private rowVirtualizerController!: VirtualizerController<Element, Element>

  connectedCallback() {
    super.connectedCallback()
  }

  private _ensureVirtualizers(
    visibleColumnCount: number,
    rowCount: number,
    visibleColumns: Array<any>,
  ) {
    // Create column virtualizer once we have the scroll element
    if (!this.columnVirtualizerController) {
      this.columnVirtualizerController = new VirtualizerController(this, {
        count: visibleColumnCount,
        estimateSize: (index: number) =>
          visibleColumns[index]?.getSize() ?? 150,
        getScrollElement: () => this.tableContainerRef.value!,
        horizontal: true,
        overscan: 3,
      })
    }

    if (!this.rowVirtualizerController) {
      this.rowVirtualizerController = new VirtualizerController(this, {
        count: rowCount,
        estimateSize: () => 33,
        getScrollElement: () => this.tableContainerRef.value!,
        overscan: 5,
      })
    }
  }

  private _refreshData() {
    this._data = makeData(1_000, columns)
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
      },
      () => ({}),
    )

    const visibleColumns = table.getVisibleLeafColumns()
    const { rows } = table.getRowModel()

    this._ensureVirtualizers(visibleColumns.length, rows.length, visibleColumns)

    const columnVirtualizer = this.columnVirtualizerController?.getVirtualizer()
    const rowVirtualizer = this.rowVirtualizerController?.getVirtualizer()

    if (!columnVirtualizer || !rowVirtualizer) {
      return html`<div>Loading...</div>`
    }

    // Update virtualizer counts
    columnVirtualizer.setOptions({
      ...columnVirtualizer.options,
      count: visibleColumns.length,
      estimateSize: (index: number) => visibleColumns[index]?.getSize() ?? 150,
    })
    rowVirtualizer.setOptions({
      ...rowVirtualizer.options,
      count: rows.length,
    })

    const virtualColumns = columnVirtualizer.getVirtualItems()
    const virtualRows = rowVirtualizer.getVirtualItems()

    let virtualPaddingLeft: number | undefined
    let virtualPaddingRight: number | undefined

    if (virtualColumns.length > 0) {
      virtualPaddingLeft = virtualColumns[0]?.start ?? 0
      virtualPaddingRight =
        columnVirtualizer.getTotalSize() -
        (virtualColumns[virtualColumns.length - 1]?.end ?? 0)
    }

    return html`
      <div class="app">
        <div>(${columns.length.toLocaleString()} columns)</div>
        <div>(${this._data.length.toLocaleString()} rows)</div>
        <button @click="${() => this._refreshData()}">Refresh Data</button>
        <div
          class="container"
          ${ref(this.tableContainerRef)}
          style="${styleMap({
            overflow: 'auto',
            position: 'relative',
            height: '800px',
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
                    ${virtualPaddingLeft
                      ? html`<th
                          style="${styleMap({
                            display: 'flex',
                            width: `${virtualPaddingLeft}px`,
                          })}"
                        ></th>`
                      : null}
                    ${repeat(
                      virtualColumns,
                      (vc) => vc.index,
                      (virtualColumn) => {
                        const header = headerGroup.headers[virtualColumn.index]
                        return html`
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
                        `
                      },
                    )}
                    ${virtualPaddingRight
                      ? html`<th
                          style="${styleMap({
                            display: 'flex',
                            width: `${virtualPaddingRight}px`,
                          })}"
                        ></th>`
                      : null}
                  </tr>
                `,
              )}
            </thead>
            <tbody
              style="${styleMap({
                display: 'grid',
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              })}"
            >
              ${repeat(
                virtualRows,
                (item) => item.key,
                (virtualRow) => {
                  const row = rows[virtualRow.index]
                  const visibleCells = row.getVisibleCells()
                  return html`
                    <tr
                      data-index="${virtualRow.index}"
                      style="${styleMap({
                        display: 'flex',
                        position: 'absolute',
                        transform: `translateY(${virtualRow.start}px)`,
                        width: '100%',
                      })}"
                      ${ref((node) =>
                        rowVirtualizer.measureElement(node ?? null),
                      )}
                    >
                      ${virtualPaddingLeft
                        ? html`<td
                            style="${styleMap({
                              display: 'flex',
                              width: `${virtualPaddingLeft}px`,
                            })}"
                          ></td>`
                        : null}
                      ${repeat(
                        virtualColumns,
                        (vc) => vc.index,
                        (virtualColumn) => {
                          const cell = visibleCells[virtualColumn.index]
                          return html`
                            <td
                              style="${styleMap({
                                display: 'flex',
                                width: `${cell.column.getSize()}px`,
                              })}"
                            >
                              ${FlexRender({ cell })}
                            </td>
                          `
                        },
                      )}
                      ${virtualPaddingRight
                        ? html`<td
                            style="${styleMap({
                              display: 'flex',
                              width: `${virtualPaddingRight}px`,
                            })}"
                          ></td>`
                        : null}
                    </tr>
                  `
                },
              )}
            </tbody>
          </table>
        </div>
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
