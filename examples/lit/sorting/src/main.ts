import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { Person, makeData } from './makeData'
import type { ColumnDef, SortFn } from '@tanstack/lit-table'

const _features = tableFeatures({
  rowSortingFeature,
})

const sortStatusFn: SortFn<any, any> = (rowA, rowB, _columnId) => {
  const statusA = rowA.original.status
  const statusB = rowB.original.status
  const statusOrder = ['single', 'complicated', 'relationship']
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
}

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
    // this column will sort in ascending order by default since it is a string column
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => html`<span>Last Name</span>`,
    sortUndefined: 'last', // force undefined values to the end
    sortDescFirst: false, // first sort order will be ascending (nullable values can mess up auto detection of sort order)
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    // this column will sort in descending order by default since it is a number column
  },
  {
    accessorKey: 'visits',
    header: () => html`<span>Visits</span>`,
    sortUndefined: 'last', // force undefined values to the end
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortFn: sortStatusFn, // use our custom sorting function for this enum column
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    // enableSorting: false, //disable sorting for this column
  },
  {
    accessorKey: 'rank',
    header: 'Rank',
    invertSorting: true, // invert the sorting order (golf score-like where smaller is better)
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    // sortFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
  },
]

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          sortedRowModel: createSortedRowModel(sortFns),
        },
        columns,
        data: this._data,
      },
      (state) => ({ sorting: state.sorting }),
    )

    return html`
      <div>
        <button
          @click=${() => {
            this._data = makeData(1_000)
          }}
        >
          Regenerate Data
        </button>
        <button
          @click=${() => {
            this._data = makeData(100_000)
          }}
        >
          Stress Test (100k rows)
        </button>
      </div>
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
                        : html`<div
                            title=${header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined}
                            @click="${header.column.getToggleSortingHandler()}"
                            style="cursor: ${header.column.getCanSort()
                              ? 'pointer'
                              : 'not-allowed'}"
                          >
                            ${FlexRender({ header })}
                            ${{ asc: ' 🔼', desc: ' 🔽' }[
                              header.column.getIsSorted() as string
                            ] ?? null}
                          </div>`}
                    </th>
                  `,
                )}
              </tr>
            `,
          )}
        </thead>
        <tbody>
          ${table
            .getRowModel()
            .rows.slice(0, 10)
            .map(
              (row) => html`
                <tr>
                  ${row
                    .getAllCells()
                    .map((cell) => html` <td>${FlexRender({ cell })}</td> `)}
                </tr>
              `,
            )}
        </tbody>
      </table>
      <pre>${JSON.stringify(table.state.sorting, null, 2)}</pre>
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
