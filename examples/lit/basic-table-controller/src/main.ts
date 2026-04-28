import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { FlexRender, TableController, tableFeatures } from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/lit-table'
import type { Person } from './makeData'

// This example uses the standalone `TableController` to create a table without the `createTableHook` util.

// 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const _features = tableFeatures({}) // util method to create sharable TFeatures object/type

// 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns. Alternatively, check out the createTableHook/createAppColumnHelper util for an even more type-safe way to define columns.
const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey method (most common for simple use-cases)
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn used (alternative) along with a custom id
    id: 'lastName',
    header: () => html`<span>Last Name</span>`,
    cell: (info) => html`<i>${info.getValue<string>()}</i>`,
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => Number(row.age), // accessorFn used to transform the data
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => html`<span>Visits</span>`,
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  },
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  // 5. Store data with a reactive reference
  @state()
  private data: Array<Person> = makeData(20)

  private tableController = new TableController<typeof _features, Person>(this)

  private rerender() {
    this.data = makeData(20)
  }

  protected render(): unknown {
    const data = this.data

    // 6. Create the table instance with required _features, columns, and data
    const table = this.tableController.table(
      {
        _features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
        _rowModels: {}, // `Core` row model is now included by default, but you can still override it here
        columns,
        get data() {
          return data
        },
        // add additional table options here
      },
      () => ({}), // selector - empty since we don't need any state
    )

    // 7. Render your table markup from the table instance APIs
    return html`
      <div class="p-2">
        <div>
          <button
            @click=${() => {
              this.data = makeData(20)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this.data = makeData(1_000)
            }}
          >
            Stress Test (1k rows)
          </button>
        </div>
        <table>
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
                      <th>
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
                    row.getAllCells(),
                    (cell) => cell.id,
                    (cell) => html` <td>${FlexRender({ cell })}</td> `,
                  )}
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
                  ${repeat(
                    footerGroup.headers,
                    (header) => header.id,
                    (header) => html`
                      <th>
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
        <button @click=${() => this.rerender()} class="border p-2">
          Rerender
        </button>
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
