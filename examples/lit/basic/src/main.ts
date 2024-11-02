import { customElement } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  ColumnDef,
  RowSorting,
  TableController,
  flexRender,
  tableFeatures,
} from '@tanstack/lit-table'
import install from '@twind/with-web-components'
import config from '../twind.config'

const withTwind = install(config)

// 1. Define what the shape of your data will be for each row
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const _features = tableFeatures({
  RowSorting: RowSorting,
})

// const columnHelper = createColumnHelper<typeof _features, Person>()

// 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns. Alternatively, check out the createTableHelper/createColumnHelper util for an even more type-safe way to define columns.
const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey method (most common for simple use-cases)
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn used (alternative) along with a custom id
    id: 'lastName',
    header: () => html`<span>Last Name</span>`,
    cell: (info) => html`<i>${info.getValue<string>()}</i>`,
  },
  {
    accessorFn: (row) => Number(row.age), // accessorFn used to transform the data
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
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
]

const data: Array<Person> = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'mor',
    lastName: 'kadosh',
    age: 31,
    visits: 30,
    status: 'In Relationship',
    progress: 90,
  },
]

@customElement('lit-table-example')
@withTwind
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  protected render(): unknown {
    const table = this.tableController.table({
      _features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
      _rowModels: {}, // `Core` row model is now included by default, but you can still override it here
      columns,
      data,
      // add additional table options here
      debugTable: true,
    })

    console.log(table)

    return html`
      <table>
        <thead>
          ${repeat(
            table.getHeaderGroups(),
            (headerGroup) => headerGroup.id,
            (headerGroup) =>
              html`${repeat(
                headerGroup.headers,
                (header) => header.id,
                (header) =>
                  html` <th>
                    ${header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>`,
              )}`,
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
                  (cell) =>
                    html` <td>
                      ${flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>`,
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
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </th>
                  `,
                )}
              </tr>
            `,
          )}
        </tfoot>
      </table>
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
