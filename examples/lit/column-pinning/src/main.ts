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
              this._data = makeData(500_000)
            }}"
            class="border p-1"
          >
            Stress Test (500k rows)
          </button>
          <button @click="${randomizeColumns}" class="border p-1">
            Shuffle Columns
          </button>
        </div>
        <div class="h-4"></div>
        <p class="text-sm mb-2">
          This example uses the non-split APIs. Columns are just reordered
          within 1 table instead of being split into 3 different tables.
        </p>
        <div class="flex">
          <table class="border-2 border-black">
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
                          <div class="whitespace-nowrap">
                            ${header.isPlaceholder
                              ? null
                              : FlexRender({ header })}
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
        <div class="h-4"></div>
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
          border-collapse: collapse;
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
      </style>
    `
  }
}
