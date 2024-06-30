import { customElement } from 'lit/decorators.js'
import { html, LitElement } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  TableController,
} from '@tanstack/lit-table'
import config from '../twind.config'
import { styleMap } from 'lit/directives/style-map.js'
import { virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js'
import { makeData, Person } from './makeData.ts'

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'firstName',
    cell: info => info.getValue(),
  },
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => info.getValue(),
    header: () => html`<span>Last Name</span>`,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    size: 50,
  },
  {
    accessorKey: 'visits',
    header: () => html`<span>Visits</span>`,
    size: 50,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    size: 80,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: info => info.getValue<Date>().toLocaleString(),
    size: 250,
  },
]
const data = makeData(50_000)

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<Person>(this)

  protected render(): unknown {
    const table = this.tableController.table({
      columns,
      data,
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    })
    const { rows } = table.getRowModel()
    return html`
      <div class="app">
        (${data.length} rows)
        <div
          class="container"
          style="${styleMap({
            overflow: 'auto', //our scrollable table container
            position: 'relative', //needed for sticky header
            height: '800px', //should be a fixed height
          })}"
        >
          <table style="display: grid">
            <thead
              style="${styleMap({
                display: 'grid',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              })}"
            >
              ${repeat(
                table.getHeaderGroups(),
                headerGroup => headerGroup.id,
                headerGroup => html`
                  <tr style="${styleMap({ display: 'flex', width: '100%' })}">
                    ${repeat(
                      headerGroup.headers,
                      header => header.id,
                      header => html`
                        <th
                          style="${styleMap({
                            display: 'flex',
                            width: `${header.getSize()}px`,
                          })}"
                          @click="${header.column.getToggleSortingHandler()}"
                        >
                          ${flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          ${{ asc: ' 🔼', desc: ' 🔽' }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </th>
                      `
                    )}
                  </tr>
                `
              )}
            </thead>
            <tbody
              style=${styleMap({
                display: 'grid',
                height: 500,
                // height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                position: 'relative', //needed for absolute positioning of rows
              })}
            >
              ${virtualize({
                items: data,
                renderItem: (_, index) => {
                  const row = rows[index]
                  return html`
                    <tr
                      style=${styleMap({
                        display: 'flex',
                        width: '100%',
                      })}
                    >
                      ${repeat(
                        row.getVisibleCells(),
                        cell => cell.id,
                        cell => html`
                          <td
                            style=${styleMap({
                              display: 'flex',
                              width: `${cell.column.getSize()}px`,
                            })}
                          >
                            ${flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        `
                      )}
                    </tr>
                  `
                },
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        html {
          font-family: sans-serif;
          font-size: 14px;
        }

        table {
          border-collapse: collapse;
          border-spacing: 0;
          font-family: arial, sans-serif;
          table-layout: fixed;
        }

        thead {
          background: lightgray;
        }

        tr {
          border-bottom: 1px solid lightgray;
        }

        th {
          border-bottom: 1px solid lightgray;
          border-right: 1px solid lightgray;
          padding: 2px 4px;
          text-align: left;
        }

        td {
          padding: 6px;
        }

        .container {
          border: 1px solid lightgray;
          margin: 1rem auto;
        }

        .app {
          margin: 1rem auto;
          text-align: center;
        }
      </style>
    `
  }
}
