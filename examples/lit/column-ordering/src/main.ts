import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
  TableController,
  columnOrderingFeature,
  columnVisibilityFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type {
  ColumnDef,
  ColumnOrderState,
  VisibilityState,
} from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnOrderingFeature,
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

const data: Array<Person> = makeData(20)

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  @state()
  private columnOrder: ColumnOrderState = []

  @state()
  private columnVisibility: VisibilityState = {}

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {},
        columns: defaultColumns,
        data,
        state: {
          columnOrder: this.columnOrder,
          columnVisibility: this.columnVisibility,
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
      },
      (state) => ({
        columnOrder: state.columnOrder,
        columnVisibility: state.columnVisibility,
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
              this.columnOrder = []
              this.columnVisibility = {}
            }}"
            class="border p-1"
          >
            Reset
          </button>
          <button @click="${randomizeColumns}" class="border p-1">
            Shuffle Columns
          </button>
        </div>
        <div class="h-4"></div>
        <table>
          <thead>
            ${table.getHeaderGroups().map(
              (headerGroup) => html`
                <tr>
                  ${headerGroup.headers.map(
                    (header) => html`
                      <th colspan="${header.colSpan}">
                        ${header.isPlaceholder ? null : FlexRender({ header })}
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
                    row.getVisibleCells(),
                    (cell) => cell.id,
                    (cell) => html` <td>${FlexRender({ cell })}</td> `,
                  )}
                </tr>
              `,
            )}
          </tbody>
          <tfoot>
            ${table.getFooterGroups().map(
              (footerGroup) => html`
                <tr>
                  ${footerGroup.headers.map(
                    (header) => html`
                      <th colspan="${header.colSpan}">
                        ${header.isPlaceholder
                          ? null
                          : FlexRender({ footer: header })}
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </tfoot>
        </table>
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
