import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnVisibilityFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnVisibilityFeature,
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
  @state()
  private _data: Array<Person> = makeData(20)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {},
        columns,
        data: this._data,
        debugTable: true,
      },
      (state) => ({ columnVisibility: state.columnVisibility }),
    )

    return html`
      <div class="p-2">
        <div>
          <button
            @click=${() => {
              this._data = makeData(20)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this._data = makeData(1_000)
            }}
          >
            Stress Test (1k rows)
          </button>
        </div>
        <div class="h-4"></div>
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
        <table>
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
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
            ${table.getRowModel().rows.map(
              (row) => html`
                <tr>
                  ${row
                    .getVisibleCells()
                    .map((cell) => html` <td>${FlexRender({ cell })}</td> `)}
                </tr>
              `,
            )}
          </tbody>
          <tfoot>
            ${repeat(
              table.getFooterGroups(),
              (footerGroup) => footerGroup.id,
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

        td {
          padding: 2px 4px;
        }

        tfoot {
          color: gray;
        }

        tfoot th {
          font-weight: normal;
        }

        .p-2 {
          padding: 0.5rem;
        }

        .h-4 {
          height: 1rem;
        }

        .inline-block {
          display: inline-block;
        }

        .border {
          border: 1px solid black;
        }

        .border-b {
          border-bottom: 1px solid black;
        }

        .shadow {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }

        .rounded {
          border-radius: 0.25rem;
        }

        .px-1 {
          padding-left: 0.25rem;
          padding-right: 0.25rem;
        }
      </style>
    `
  }
}
