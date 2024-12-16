import { customElement } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  TableController,
  columnSizingFeature,
  createSortedRowModel,
  flexRender,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { styleMap } from 'lit/directives/style-map.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import { VirtualizerController } from '@tanstack/lit-virtual'
import { Person, makeData } from './makeData.ts'
import type { ColumnDef } from '@tanstack/lit-table'

const _features = tableFeatures({
  columnSizingFeature,
})

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
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
    cell: (info) => info.getValue<Date>().toLocaleString(),
    size: 250,
  },
]
const data = makeData(50_000)

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<any, Person>(this)

  private tableContainerRef: Ref = createRef()

  private rowVirtualizerController: VirtualizerController<Element, Element>

  connectedCallback() {
    this.rowVirtualizerController = new VirtualizerController(this, {
      count: data.length,
      getScrollElement: () => this.tableContainerRef.value!,
      estimateSize: () => 33,
      overscan: 5,
    })
    super.connectedCallback()
  }

  protected render(): unknown {
    const table = this.tableController.table({
      _features,
      _rowModels: {
        sortedRowModel: createSortedRowModel(sortFns),
      },
      columns,
      data,
    })
    const { rows } = table.getRowModel()

    const virtualizer = this.rowVirtualizerController.getVirtualizer()
    return html`
      <div class="app">
        (${data.length} rows)
        <div
          class="container"
          ${ref(this.tableContainerRef)}
          style="${styleMap({
            overflow: 'auto', // our scrollable table container
            position: 'relative', // needed for sticky header
            height: '800px', // should be a fixed height
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
                (headerGroup) => headerGroup.id,
                (headerGroup) => html`
                  <tr style="${styleMap({ display: 'flex', width: '100%' })}">
                    ${repeat(
                      headerGroup.headers,
                      (header) => header.id,
                      (header) => html`
                        <th
                          style="${styleMap({
                            display: 'flex',
                            width: `${header.getSize()}px`,
                          })}"
                          @click="${header.column.getToggleSortingHandler()}"
                        >
                          ${flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          ${{ asc: ' 🔼', desc: ' 🔽' }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </th>
                      `,
                    )}
                  </tr>
                `,
              )}
            </thead>
            <tbody
              style=${styleMap({
                display: 'grid',
                height: `${virtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
                position: 'relative', // needed for absolute positioning of rows
              })}
            >
              ${repeat(
                this.rowVirtualizerController
                  .getVirtualizer()
                  .getVirtualItems(),
                (item) => item.key,
                (item) => {
                  const row = rows[item.index]
                  return html`
                    <tr
                      style=${styleMap({
                        display: 'flex',
                        position: 'absolute',
                        transform: `translateY(${item.start}px)`,
                        width: '100%',
                      })}
                      ${ref((node) =>
                        this.rowVirtualizerController
                          .getVirtualizer()
                          .measureElement(node),
                      )}
                    >
                      ${repeat(
                        row.getVisibleCells(),
                        (cell) => cell.id,
                        (cell) => html`
                          <td
                            style=${styleMap({
                              display: 'flex',
                              width: `${cell.column.getSize()}px`,
                            })}
                          >
                            ${flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        `,
                      )}
                    </tr>
                  `
                },
              )}
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
