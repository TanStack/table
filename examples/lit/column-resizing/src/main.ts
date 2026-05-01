import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import {
  FlexRender,
  TableController,
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type {
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
} from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnResizingFeature,
  columnSizingFeature,
})

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => html`<span>Last Name</span>`,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
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
        ],
      },
    ],
  },
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  @state()
  private _data: Array<Person> = makeData(10)

  @state()
  private columnResizeMode: ColumnResizeMode = 'onChange'

  @state()
  private columnResizeDirection: ColumnResizeDirection = 'ltr'

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {},
        columns,
        data: this._data,
        columnResizeMode: this.columnResizeMode,
        columnResizeDirection: this.columnResizeDirection,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
      },
      (state) => ({
        columnSizing: state.columnSizing,
        columnResizing: state.columnResizing,
      }),
    )

    const resizerTransform = (
      header: ReturnType<
        typeof table.getHeaderGroups
      >[number]['headers'][number],
    ) => {
      if (this.columnResizeMode === 'onEnd' && header.column.getIsResizing()) {
        const delta = table.store.state.columnResizing.deltaOffset ?? 0
        const dir = this.columnResizeDirection === 'rtl' ? -1 : 1
        return `translateX(${dir * delta}px)`
      }
      return ''
    }

    return html`
      <div class="demo-root">
        <div>
          <button
            @click=${() => {
              this._data = makeData(10)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this._data = makeData(100)
            }}
          >
            Stress Test (100 rows)
          </button>
        </div>
        <select
          .value="${this.columnResizeMode}"
          @change="${(e: Event) => {
            this.columnResizeMode = (e.target as HTMLSelectElement)
              .value as ColumnResizeMode
          }}"
          class="demo-button outlined-control"
        >
          <option value="onEnd">Resize: "onEnd"</option>
          <option value="onChange">Resize: "onChange"</option>
        </select>
        <select
          .value="${this.columnResizeDirection}"
          @change="${(e: Event) => {
            this.columnResizeDirection = (e.target as HTMLSelectElement)
              .value as ColumnResizeDirection
          }}"
          class="demo-button outlined-control"
        >
          <option value="ltr">Resize Direction: "ltr"</option>
          <option value="rtl">Resize Direction: "rtl"</option>
        </select>
        <div style="${styleMap({ direction: this.columnResizeDirection })}">
          <div class="spacer-md"></div>
          <div class="section-title">${'<table/>'}</div>
          <div class="scroll-container">
            <table
              style="${styleMap({ width: `${table.getCenterTotalSize()}px` })}"
            >
              <thead>
                ${repeat(
                  table.getHeaderGroups(),
                  (headerGroup) => headerGroup.id,
                  (headerGroup) => html`
                    <tr>
                      ${repeat(
                        headerGroup.headers,
                        (header) => header.id,
                        (header) => html`
                          <th
                            colspan="${header.colSpan}"
                            style="${styleMap({
                              width: `${header.getSize()}px`,
                            })}"
                          >
                            ${header.isPlaceholder
                              ? null
                              : FlexRender({ header })}
                            <div
                              @dblclick="${() => header.column.resetSize()}"
                              @mousedown="${header.getResizeHandler()}"
                              @touchstart="${header.getResizeHandler()}"
                              class="resizer ${this
                                .columnResizeDirection} ${header.column.getIsResizing()
                                ? 'isResizing'
                                : ''}"
                              style="${styleMap({
                                transform: resizerTransform(header),
                              })}"
                            ></div>
                          </th>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </thead>
              <tbody>
                ${repeat(
                  table.getRowModel().rows,
                  (row) => row.id,
                  (row) => html`
                    <tr>
                      ${repeat(
                        row.getAllCells(),
                        (cell) => cell.id,
                        (cell) => html`
                          <td
                            style="${styleMap({
                              width: `${cell.column.getSize()}px`,
                            })}"
                          >
                            ${FlexRender({ cell })}
                          </td>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </div>
          <div class="spacer-md"></div>
          <div class="section-title">${'<div/> (relative)'}</div>
          <div class="scroll-container">
            <div
              class="divTable"
              style="${styleMap({ width: `${table.getTotalSize()}px` })}"
            >
              <div class="thead">
                ${repeat(
                  table.getHeaderGroups(),
                  (headerGroup) => headerGroup.id,
                  (headerGroup) => html`
                    <div class="tr">
                      ${repeat(
                        headerGroup.headers,
                        (header) => header.id,
                        (header) => html`
                          <div
                            class="th"
                            style="${styleMap({
                              width: `${header.getSize()}px`,
                            })}"
                          >
                            ${header.isPlaceholder
                              ? null
                              : FlexRender({ header })}
                            <div
                              @dblclick="${() => header.column.resetSize()}"
                              @mousedown="${header.getResizeHandler()}"
                              @touchstart="${header.getResizeHandler()}"
                              class="resizer ${this
                                .columnResizeDirection} ${header.column.getIsResizing()
                                ? 'isResizing'
                                : ''}"
                              style="${styleMap({
                                transform: resizerTransform(header),
                              })}"
                            ></div>
                          </div>
                        `,
                      )}
                    </div>
                  `,
                )}
              </div>
              <div class="tbody">
                ${repeat(
                  table.getRowModel().rows,
                  (row) => row.id,
                  (row) => html`
                    <div class="tr">
                      ${repeat(
                        row.getAllCells(),
                        (cell) => cell.id,
                        (cell) => html`
                          <div
                            class="td"
                            style="${styleMap({
                              width: `${cell.column.getSize()}px`,
                            })}"
                          >
                            ${FlexRender({ cell })}
                          </div>
                        `,
                      )}
                    </div>
                  `,
                )}
              </div>
            </div>
          </div>
          <div class="spacer-md"></div>
          <div class="section-title">${'<div/> (absolute positioning)'}</div>
          <div class="scroll-container">
            <div
              class="divTable"
              style="${styleMap({ width: `${table.getTotalSize()}px` })}"
            >
              <div class="thead">
                ${repeat(
                  table.getHeaderGroups(),
                  (headerGroup) => headerGroup.id,
                  (headerGroup) => html`
                    <div
                      class="tr"
                      style="${styleMap({ position: 'relative' })}"
                    >
                      ${repeat(
                        headerGroup.headers,
                        (header) => header.id,
                        (header) => html`
                          <div
                            class="th"
                            style="${styleMap({
                              position: 'absolute',
                              left: `${header.getStart()}px`,
                              width: `${header.getSize()}px`,
                            })}"
                          >
                            ${header.isPlaceholder
                              ? null
                              : FlexRender({ header })}
                            <div
                              @dblclick="${() => header.column.resetSize()}"
                              @mousedown="${header.getResizeHandler()}"
                              @touchstart="${header.getResizeHandler()}"
                              class="resizer ${this
                                .columnResizeDirection} ${header.column.getIsResizing()
                                ? 'isResizing'
                                : ''}"
                              style="${styleMap({
                                transform: resizerTransform(header),
                              })}"
                            ></div>
                          </div>
                        `,
                      )}
                    </div>
                  `,
                )}
              </div>
              <div class="tbody">
                ${repeat(
                  table.getRowModel().rows,
                  (row) => row.id,
                  (row) => html`
                    <div
                      class="tr"
                      style="${styleMap({ position: 'relative' })}"
                    >
                      ${repeat(
                        row.getAllCells(),
                        (cell) => cell.id,
                        (cell) => html`
                          <div
                            class="td"
                            style="${styleMap({
                              position: 'absolute',
                              left: `${cell.column.getStart()}px`,
                              width: `${cell.column.getSize()}px`,
                            })}"
                          >
                            ${FlexRender({ cell })}
                          </div>
                        `,
                      )}
                    </div>
                  `,
                )}
              </div>
            </div>
          </div>
        </div>
        <div class="spacer-md"></div>
        <pre>${JSON.stringify(table.state, null, 2)}</pre>
      </div>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        table,
        .divTable {
          border: 1px solid lightgray;
          width: fit-content;
        }

        .tr {
          display: flex;
        }

        tr,
        .tr {
          width: fit-content;
          height: 30px;
        }

        th,
        .th,
        td,
        .td {
          box-shadow: inset 0 0 0 1px lightgray;
          padding: 0.25rem;
        }

        th,
        .th {
          padding: 2px 4px;
          position: relative;
          font-weight: bold;
          text-align: center;
          height: 30px;
        }

        td,
        .td {
          height: 30px;
        }

        .resizer {
          position: absolute;
          top: 0;
          height: 100%;
          width: 5px;
          background: rgba(0, 0, 0, 0.5);
          cursor: col-resize;
          user-select: none;
          touch-action: none;
        }

        .resizer.ltr {
          right: 0;
        }

        .resizer.rtl {
          left: 0;
        }

        .resizer.isResizing {
          background: blue;
          opacity: 1;
        }

        @media (hover: hover) {
          .resizer {
            opacity: 0;
          }

          *:hover > .resizer {
            opacity: 1;
          }
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
