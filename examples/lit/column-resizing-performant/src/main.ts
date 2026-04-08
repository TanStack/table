import { customElement } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import {
  FlexRender,
  TableController,
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
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
]

const data: Array<Person> = makeData(200)

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {},
        columns,
        data,
        defaultColumn: { minSize: 60, maxSize: 800 },
        columnResizeMode: 'onChange',
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
      },
      (state) => ({
        columnSizing: state.columnSizing,
        columnResizing: state.columnResizing,
      }),
    )

    // Compute CSS variables for column sizes
    const columnSizeVars = (): Record<string, string> => {
      const headers = table.getFlatHeaders()
      const colSizes: Record<string, string> = {}
      for (const header of headers) {
        colSizes[`--header-${header.id}-size`] = `${header.getSize()}`
        colSizes[`--col-${header.column.id}-size`] =
          `${header.column.getSize()}`
      }
      return colSizes
    }

    return html`
      <div class="p-2">
        <i>
          This example has artificially slow cell renders to simulate complex
          usage
        </i>
        <div class="h-4"></div>
        <pre style="${styleMap({ 'min-height': '10rem' })}">
${JSON.stringify(table.state, null, 2)}</pre
        >
        <div class="h-4"></div>
        (${data.length} rows)
        <div class="overflow-x-auto">
          <div
            class="divTable"
            style="${styleMap({
              ...columnSizeVars(),
              width: `${table.getTotalSize()}px`,
            })}"
          >
            <div class="thead">
              ${repeat(
                table.getHeaderGroups(),
                (headerGroup) => headerGroup.id,
                (headerGroup) => html`
                  <div class="tr">
                    ${repeat(
                      headerGroup.headers,
                      (header) => header.id,
                      (header) => html`
                        <div
                          class="th"
                          style="${styleMap({
                            width: `calc(var(--header-${header.id}-size) * 1px)`,
                          })}"
                        >
                          ${header.isPlaceholder
                            ? null
                            : FlexRender({ header })}
                          <div
                            @dblclick="${() => header.column.resetSize()}"
                            @mousedown="${header.getResizeHandler()}"
                            @touchstart="${header.getResizeHandler()}"
                            class="resizer ${header.column.getIsResizing()
                              ? 'isResizing'
                              : ''}"
                          ></div>
                        </div>
                      `,
                    )}
                  </div>
                `,
              )}
            </div>
            <div class="tbody">
              ${repeat(
                table.getRowModel().rows,
                (row) => row.id,
                (row) => html`
                  <div class="tr">
                    ${repeat(
                      row.getAllCells(),
                      (cell) => cell.id,
                      (cell) => html`
                        <div
                          class="td"
                          style="${styleMap({
                            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                          })}"
                        >
                          ${cell.renderValue()}
                        </div>
                      `,
                    )}
                  </div>
                `,
              )}
            </div>
          </div>
        </div>
      </div>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        table,
        .divTable {
          border: 1px solid lightgray;
          width: fit-content;
        }

        .tr {
          display: flex;
        }

        tr,
        .tr {
          width: fit-content;
          height: 30px;
        }

        th,
        .th,
        td,
        .td {
          box-shadow: inset 0 0 0 1px lightgray;
          padding: 0.25rem;
        }

        th,
        .th {
          padding: 2px 4px;
          position: relative;
          font-weight: bold;
          text-align: center;
          height: 30px;
        }

        td,
        .td {
          height: 30px;
        }

        .resizer {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 5px;
          background: rgba(0, 0, 0, 0.5);
          cursor: col-resize;
          user-select: none;
          touch-action: none;
        }

        .resizer.isResizing {
          background: blue;
          opacity: 1;
        }

        @media (hover: hover) {
          .resizer {
            opacity: 0;
          }

          *:hover > .resizer {
            opacity: 1;
          }
        }
      </style>
    `
  }
}
