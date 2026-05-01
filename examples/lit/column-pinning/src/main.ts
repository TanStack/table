import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
  TableController,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  VisibilityState,
} from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
})

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
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
  private _data: Array<Person> = makeData(1_000)

  @state()
  private columnOrder: ColumnOrderState = []

  @state()
  private columnVisibility: VisibilityState = {}

  @state()
  private columnPinning: ColumnPinningState = { left: [], right: [] }

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {},
        columns: defaultColumns,
        data: this._data,
        state: {
          columnOrder: this.columnOrder,
          columnVisibility: this.columnVisibility,
          columnPinning: this.columnPinning,
        },
        onColumnOrderChange: (updaterOrValue) => {
          if (typeof updaterOrValue === 'function') {
            this.columnOrder = updaterOrValue(this.columnOrder)
          } else {
            this.columnOrder = updaterOrValue
          }
        },
        onColumnVisibilityChange: (updaterOrValue) => {
          if (typeof updaterOrValue === 'function') {
            this.columnVisibility = updaterOrValue(this.columnVisibility)
          } else {
            this.columnVisibility = updaterOrValue
          }
        },
        onColumnPinningChange: (updaterOrValue) => {
          if (typeof updaterOrValue === 'function') {
            this.columnPinning = updaterOrValue(this.columnPinning)
          } else {
            this.columnPinning = updaterOrValue
          }
        },
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
      },
      (state) => ({
        columnOrder: state.columnOrder,
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
      }),
    )

    const randomizeColumns = () => {
      table.setColumnOrder(
        faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
      )
    }

    return html`
      <div class="demo-root">
        <div class="column-toggle-panel">
          <div class="column-toggle-panel-header">
            <label>
              <input
                type="checkbox"
                .checked="${table.getIsAllColumnsVisible()}"
                @change="${table.getToggleAllColumnsVisibilityHandler()}"
              />
              Toggle All
            </label>
          </div>
          ${table.getAllLeafColumns().map(
            (column) => html`
              <div class="column-toggle-row">
                <label>
                  <input
                    type="checkbox"
                    .checked="${column.getIsVisible()}"
                    @change="${column.getToggleVisibilityHandler()}"
                  />
                  ${column.id}
                </label>
              </div>
            `,
          )}
        </div>
        <div class="spacer-md"></div>
        <div class="button-row">
          <button
            @click="${() => {
              this._data = makeData(1_000)
            }}"
            class="demo-button demo-button-sm"
          >
            Regenerate Data
          </button>
          <button
            @click="${() => {
              this._data = makeData(500_000)
            }}"
            class="demo-button demo-button-sm"
          >
            Stress Test (500k rows)
          </button>
          <button
            @click="${randomizeColumns}"
            class="demo-button demo-button-sm"
          >
            Shuffle Columns
          </button>
        </div>
        <div class="spacer-md"></div>
        <p class="demo-note">
          This example uses the non-split APIs. Columns are just reordered
          within 1 table instead of being split into 3 different tables.
        </p>
        <div class="table-row-group">
          <table class="outlined-table">
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
                        <th colspan="${header.colSpan}">
                          <div class="nowrap">
                            ${header.isPlaceholder
                              ? null
                              : FlexRender({ header })}
                          </div>
                          ${!header.isPlaceholder && header.column.getCanPin()
                            ? html`
                                <div class="pin-actions">
                                  ${header.column.getIsPinned() !== 'left'
                                    ? html`
                                        <button
                                          class="pin-button"
                                          @click="${() =>
                                            header.column.pin('left')}"
                                        >
                                          ${'<='}
                                        </button>
                                      `
                                    : null}
                                  ${header.column.getIsPinned()
                                    ? html`
                                        <button
                                          class="pin-button"
                                          @click="${() =>
                                            header.column.pin(false)}"
                                        >
                                          X
                                        </button>
                                      `
                                    : null}
                                  ${header.column.getIsPinned() !== 'right'
                                    ? html`
                                        <button
                                          class="pin-button"
                                          @click="${() =>
                                            header.column.pin('right')}"
                                        >
                                          ${'=>'}
                                        </button>
                                      `
                                    : null}
                                </div>
                              `
                            : null}
                        </th>
                      `,
                    )}
                  </tr>
                `,
              )}
            </thead>
            <tbody>
              ${repeat(
                table.getRowModel().rows.slice(0, 20),
                (row) => row.id,
                (row) => html`
                  <tr>
                    ${repeat(
                      row.getVisibleCells(),
                      (cell) => cell.id,
                      (cell) => html` <td>${FlexRender({ cell })}</td> `,
                    )}
                  </tr>
                `,
              )}
            </tbody>
          </table>
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

        table {
          border: 1px solid lightgray;
        }

        tbody {
          border-bottom: 1px solid lightgray;
        }

        th {
          border-bottom: 1px solid lightgray;
          border-right: 1px solid lightgray;
          padding: 2px 4px;
        }

        tfoot {
          color: gray;
        }

        tfoot th {
          font-weight: normal;
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
