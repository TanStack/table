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
  private _data: Array<Person> = makeData(30)

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
      <div class="p-2">
        <div class="inline-block border border-black shadow rounded">
          <div class="px-1 border-b border-black">
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
              <div class="px-1">
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
        <div class="h-4"></div>
        <div class="flex flex-wrap gap-2">
          <button
            @click="${() => {
              this._data = makeData(1_000)
            }}"
            class="border p-1"
          >
            Regenerate Data
          </button>
          <button
            @click="${() => {
              this._data = makeData(100_000)
            }}"
            class="border p-1"
          >
            Stress Test (100k rows)
          </button>
          <button @click="${randomizeColumns}" class="border p-1">
            Shuffle Columns
          </button>
        </div>
        <div class="h-4"></div>
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
                            <div class="whitespace-nowrap">
                              ${header.isPlaceholder
                                ? null
                                : html`${FlexRender({ header })} `}
                              ${column.getIndex(
                                column.getIsPinned() || 'center',
                              )}
                            </div>
                            ${!header.isPlaceholder && header.column.getCanPin()
                              ? html`
                                  <div class="flex gap-1 justify-center">
                                    ${header.column.getIsPinned() !== 'left'
                                      ? html`
                                          <button
                                            class="border rounded px-2"
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
                                            class="border rounded px-2"
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
                                            class="border rounded px-2"
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
        <div class="h-4"></div>
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
          border-collapse: separate !important;
          border-spacing: 0;
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
      </style>
    `
  }
}
