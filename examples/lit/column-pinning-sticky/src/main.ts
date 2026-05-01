import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
  TableController,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type {
  Column,
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
} from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

const getCommonPinningStyles = (
  column: Column<typeof _features, Person>,
): Record<string, string | undefined> => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    'box-shadow': isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? '0.95' : '1',
    position: isPinned ? 'sticky' : 'relative',
    width: `${column.getSize()}px`,
    'z-index': isPinned ? '1' : '0',
  }
}

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => html`<span>Last Name</span>`,
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'age',
    id: 'age',
    header: 'Age',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'visits',
    id: 'visits',
    header: 'Visits',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'progress',
    id: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 180,
  },
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  @state()
  private _data: Array<Person> = makeData(20)

  @state()
  private columnVisibility: ColumnVisibilityState = {}

  @state()
  private columnPinning: ColumnPinningState = { left: [], right: [] }

  @state()
  private columnSizing: ColumnSizingState = {}

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {},
        columns: defaultColumns,
        data: this._data,
        state: {
          columnVisibility: this.columnVisibility,
          columnPinning: this.columnPinning,
          columnSizing: this.columnSizing,
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
        onColumnSizingChange: (updaterOrValue) => {
          if (typeof updaterOrValue === 'function') {
            this.columnSizing = updaterOrValue(this.columnSizing)
          } else {
            this.columnSizing = updaterOrValue
          }
        },
        columnResizeMode: 'onChange',
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
      },
      (state) => ({
        columnPinning: state.columnPinning,
        columnSizing: state.columnSizing,
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
              this._data = makeData(20)
            }}"
            class="demo-button demo-button-sm"
          >
            Regenerate Data
          </button>
          <button
            @click="${() => {
              this._data = makeData(1_000)
            }}"
            class="demo-button demo-button-sm"
          >
            Stress Test (1k rows)
          </button>
          <button
            @click="${randomizeColumns}"
            class="demo-button demo-button-sm"
          >
            Shuffle Columns
          </button>
        </div>
        <div class="spacer-md"></div>
        <div class="table-container">
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
                      (header) => {
                        const { column } = header
                        return html`
                          <th
                            colspan="${header.colSpan}"
                            style="${styleMap(getCommonPinningStyles(column))}"
                          >
                            <div class="nowrap">
                              ${header.isPlaceholder
                                ? null
                                : html`${FlexRender({ header })} `}
                              ${column.getIndex(
                                column.getIsPinned() || 'center',
                              )}
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
                            <div
                              @dblclick="${() => header.column.resetSize()}"
                              @mousedown="${header.getResizeHandler()}"
                              @touchstart="${header.getResizeHandler()}"
                              class="resizer ${header.column.getIsResizing()
                                ? 'isResizing'
                                : ''}"
                            ></div>
                          </th>
                        `
                      },
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
                      row.getVisibleCells(),
                      (cell) => cell.id,
                      (cell) => {
                        const { column } = cell
                        return html`
                          <td
                            style="${styleMap(getCommonPinningStyles(column))}"
                          >
                            ${FlexRender({ cell })}
                          </td>
                        `
                      },
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

        .table-container {
          border: 1px solid lightgray;
          overflow-x: scroll;
          width: 100%;
          max-width: 960px;
          position: relative;
        }

        table {
        }

        th {
          background-color: lightgray;
          border-bottom: 1px solid lightgray;
          font-weight: bold;
          height: 30px;
          padding: 2px 4px;
          position: relative;
          text-align: center;
        }

        td {
          background-color: white;
          padding: 2px 4px;
        }

        .resizer {
          background: rgba(0, 0, 0, 0.5);
          cursor: col-resize;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          touch-action: none;
          user-select: none;
          width: 5px;
        }

        .resizer.isResizing {
          background: blue;
          opacity: 1;
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
