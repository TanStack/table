import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  createExpandedRowModel,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { ColumnDef, Row } from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({ rowExpandingFeature })

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand()
        ? html`<button
            @click="${row.getToggleExpandedHandler()}"
            style="cursor:pointer"
          >
            ${row.getIsExpanded() ? '👇' : '👉'}
          </button>`
        : html`<span>🔵</span>`,
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row, getValue }) => html`
      <div style="padding-left:${row.depth * 2}rem">${getValue()}</div>
    `,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => html`<span>Last Name</span>`,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (props) => props.column.id,
  },
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
]

function renderSubComponent(row: Row<typeof _features, Person>) {
  return html`
    <pre style="font-size:10px">
<code>${JSON.stringify(row.original, null, 2)}</code></pre>
  `
}

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(10, 5)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          expandedRowModel: createExpandedRowModel(),
        },
        columns,
        data: this._data,
        getRowCanExpand: () => true,
      },
      (state) => ({
        expanded: state.expanded,
      }),
    )

    return html`
      <div class="p-2">
        <div>
          <button
            @click=${() => {
              this._data = makeData(10, 5)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this._data = makeData(100, 5)
            }}
          >
            Stress Test (100 rows)
          </button>
        </div>
        <div class="h-2"></div>
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
                        ${header.isPlaceholder
                          ? null
                          : html`<div>${FlexRender({ header })}</div>`}
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
                    .getAllCells()
                    .map((cell) => html` <td>${FlexRender({ cell })}</td> `)}
                </tr>
                ${row.getIsExpanded()
                  ? html`
                      <tr>
                        <td colspan="${row.getAllCells().length}">
                          ${renderSubComponent(row)}
                        </td>
                      </tr>
                    `
                  : null}
              `,
            )}
          </tbody>
        </table>
        <div class="h-2"></div>
        <div>${table.getRowModel().rows.length.toLocaleString()} Rows</div>
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
      </style>
    `
  }
}
