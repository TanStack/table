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
        <button @click="${() => this._refreshData()}">Regenerate Data</button>
        <button
          @click="${() => {
            this._data = makeData(10_000, columns)
          }}"
        >
          Stress Test (10k rows)
        </button>
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
