import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  ColumnDef,
  FlexRender,
  TableController,
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { Person, makeData } from './makeData'

const _features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const columns: Array<ColumnDef<typeof _features, Person>> = [
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
  },
  {
    accessorKey: 'visits',
    header: () => html`<span>Visits</span>`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
  {
    accessorKey: 'rank',
    header: 'Rank',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {},
        data: this._data,
        columns,
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
      },
      (state) => ({
        columnSizing: state.columnSizing,
        columnResizing: state.columnResizing,
      }),
    )

    return html`
      <div>
        <button
          @click=${() => {
            this._data = makeData(1_000)
          }}
        >
          Regenerate Data
        </button>
        <button
          @click=${() => {
            this._data = makeData(500_000)
          }}
        >
          Stress Test (500k rows)
        </button>
      </div>
      <table style="width: ${table.getCenterTotalSize()}px">
        <thead>
          ${repeat(
            table.getHeaderGroups(),
            (headerGroup) => headerGroup.id,
            (headerGroup) => html`
              <tr>
                ${headerGroup.headers.map(
                  (header) => html`
                    <th
                      colspan="${header.colSpan}"
                      style="width: ${header.getSize()}px"
                    >
                      ${FlexRender({ header })}
                      ${header.isPlaceholder
                        ? null
                        : html`<div
                            class="resizer ${table.options
                              .columnResizeDirection} ${header.column.getIsResizing()
                              ? 'is-resizing'
                              : ''}"
                            @dblclick="${() => header.column.resetSize()}"
                            @mousedown="${header.getResizeHandler()}"
                            @touchstart="${header.getResizeHandler()}"
                          />`}
                    </th>
                  `,
                )}
              </tr>
            `,
          )}
        </thead>
        <tbody>
          ${table
            .getRowModel()
            .rows.slice(0, 10)
            .map(
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
      <pre>${JSON.stringify(table.state, null, 2)}</pre>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        table {
          border: 1px solid lightgray;
        }

        tbody {
          border-bottom: 1px solid lightgray;
        }

        th,
        td {
          border-bottom: 1px solid lightgray;
          border-right: 1px solid lightgray;
          padding: 2px 4px;
        }

        th {
          padding: 2px 4px;
          position: relative;
          font-weight: bold;
          text-align: center;
          height: 30px;
        }

        tfoot {
          color: gray;
        }

        tfoot th {
          font-weight: normal;
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

        .resizer.is-resizing {
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
