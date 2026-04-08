import { customElement, state } from 'lit/decorators.js'
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
import type {
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
} from '@tanstack/lit-table'

const _features = tableFeatures({
  columnResizingFeature,
  columnSizingFeature,
})

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Array<Person> = [
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
]

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
  private tableController = new TableController<typeof _features, Person>(this)

  @state()
  private columnResizeMode: ColumnResizeMode = 'onChange'

  @state()
  private columnResizeDirection: ColumnResizeDirection = 'ltr'

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {},
        columns,
        data: defaultData,
        columnResizeMode: this.columnResizeMode,
        columnResizeDirection: this.columnResizeDirection,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
      },
      (state) => ({
        columnSizing: state.columnSizing,
        columnResizing: state.columnResizing,
      }),
    )

    const resizerTransform = (
      header: ReturnType<
        typeof table.getHeaderGroups
      >[number]['headers'][number],
    ) => {
      if (this.columnResizeMode === 'onEnd' && header.column.getIsResizing()) {
        const delta = table.store.state.columnResizing.deltaOffset ?? 0
        const dir = this.columnResizeDirection === 'rtl' ? -1 : 1
        return `translateX(${dir * delta}px)`
      }
      return ''
    }

    return html`
      <div class="p-2">
        <select
          .value="${this.columnResizeMode}"
          @change="${(e: Event) => {
            this.columnResizeMode = (e.target as HTMLSelectElement)
              .value as ColumnResizeMode
          }}"
          class="border p-2 border-black rounded"
        >
          <option value="onEnd">Resize: "onEnd"</option>
          <option value="onChange">Resize: "onChange"</option>
        </select>
        <select
          .value="${this.columnResizeDirection}"
          @change="${(e: Event) => {
            this.columnResizeDirection = (e.target as HTMLSelectElement)
              .value as ColumnResizeDirection
          }}"
          class="border p-2 border-black rounded"
        >
          <option value="ltr">Resize Direction: "ltr"</option>
          <option value="rtl">Resize Direction: "rtl"</option>
        </select>
        <div style="${styleMap({ direction: this.columnResizeDirection })}">
          <div class="h-4"></div>
          <div class="text-xl">${'<table/>'}</div>
          <div class="overflow-x-auto">
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
                        (header) => html`
                          <th
                            colspan="${header.colSpan}"
                            style="${styleMap({
                              width: `${header.getSize()}px`,
                            })}"
                          >
                            ${header.isPlaceholder
                              ? null
                              : FlexRender({ header })}
                            <div
                              @dblclick="${() => header.column.resetSize()}"
                              @mousedown="${header.getResizeHandler()}"
                              @touchstart="${header.getResizeHandler()}"
                              class="resizer ${this
                                .columnResizeDirection} ${header.column.getIsResizing()
                                ? 'isResizing'
                                : ''}"
                              style="${styleMap({
                                transform: resizerTransform(header),
                              })}"
                            ></div>
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
                        (cell) => html`
                          <td
                            style="${styleMap({
                              width: `${cell.column.getSize()}px`,
                            })}"
                          >
                            ${FlexRender({ cell })}
                          </td>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </div>
          <div class="h-4"></div>
          <div class="text-xl">${'<div/> (relative)'}</div>
          <div class="overflow-x-auto">
            <div
              class="divTable"
              style="${styleMap({ width: `${table.getTotalSize()}px` })}"
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
                              width: `${header.getSize()}px`,
                            })}"
                          >
                            ${header.isPlaceholder
                              ? null
                              : FlexRender({ header })}
                            <div
                              @dblclick="${() => header.column.resetSize()}"
                              @mousedown="${header.getResizeHandler()}"
                              @touchstart="${header.getResizeHandler()}"
                              class="resizer ${this
                                .columnResizeDirection} ${header.column.getIsResizing()
                                ? 'isResizing'
                                : ''}"
                              style="${styleMap({
                                transform: resizerTransform(header),
                              })}"
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
                              width: `${cell.column.getSize()}px`,
                            })}"
                          >
                            ${FlexRender({ cell })}
                          </div>
                        `,
                      )}
                    </div>
                  `,
                )}
              </div>
            </div>
          </div>
          <div class="h-4"></div>
          <div class="text-xl">${'<div/> (absolute positioning)'}</div>
          <div class="overflow-x-auto">
            <div
              class="divTable"
              style="${styleMap({ width: `${table.getTotalSize()}px` })}"
            >
              <div class="thead">
                ${repeat(
                  table.getHeaderGroups(),
                  (headerGroup) => headerGroup.id,
                  (headerGroup) => html`
                    <div
                      class="tr"
                      style="${styleMap({ position: 'relative' })}"
                    >
                      ${repeat(
                        headerGroup.headers,
                        (header) => header.id,
                        (header) => html`
                          <div
                            class="th"
                            style="${styleMap({
                              position: 'absolute',
                              left: `${header.getStart()}px`,
                              width: `${header.getSize()}px`,
                            })}"
                          >
                            ${header.isPlaceholder
                              ? null
                              : FlexRender({ header })}
                            <div
                              @dblclick="${() => header.column.resetSize()}"
                              @mousedown="${header.getResizeHandler()}"
                              @touchstart="${header.getResizeHandler()}"
                              class="resizer ${this
                                .columnResizeDirection} ${header.column.getIsResizing()
                                ? 'isResizing'
                                : ''}"
                              style="${styleMap({
                                transform: resizerTransform(header),
                              })}"
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
                    <div
                      class="tr"
                      style="${styleMap({ position: 'relative' })}"
                    >
                      ${repeat(
                        row.getAllCells(),
                        (cell) => cell.id,
                        (cell) => html`
                          <div
                            class="td"
                            style="${styleMap({
                              position: 'absolute',
                              left: `${cell.column.getStart()}px`,
                              width: `${cell.column.getSize()}px`,
                            })}"
                          >
                            ${FlexRender({ cell })}
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
        <div class="h-4"></div>
        <pre>${JSON.stringify(table.state, null, 2)}</pre>
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
          height: 100%;
          width: 5px;
          background: rgba(0, 0, 0, 0.5);
          cursor: col-resize;
          user-select: none;
          touch-action: none;
        }

        .resizer.ltr {
          right: 0;
        }

        .resizer.rtl {
          left: 0;
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
