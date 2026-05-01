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
            this._data = makeData(500_000)
          }}
        >
          Stress Test (500k rows)
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

        /* Demo layout helpers for the plain example UI. */
        .demo-root {
          padding: 0.5rem;
        }
        .spacer-xs {
          height: 0.25rem;
        }
        .spacer-sm {
          height: 0.5rem;
        }
        .spacer-md {
          height: 1rem;
        }
        .controls,
        .button-row,
        .inline-controls,
        .pin-actions,
        .filter-row,
        .form-actions {
          display: flex;
          align-items: center;
        }
        .button-row {
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .controls {
          gap: 0.5rem;
        }
        .inline-controls,
        .pin-actions {
          gap: 0.25rem;
        }
        .pin-actions {
          justify-content: center;
        }
        .filter-row {
          gap: 0.5rem;
        }
        .form-actions {
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .split-tables {
          display: flex;
          gap: 1rem;
        }
        .table-row-group {
          display: flex;
        }
        .split-gap {
          gap: 1rem;
        }
        .vertical-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }
        .column-toggle-panel {
          display: inline-block;
          border: 1px solid #000;
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
        }
        .column-toggle-panel-header {
          border-bottom: 1px solid #000;
          padding: 0 0.25rem;
        }
        .column-toggle-row,
        .selection-cell {
          padding: 0 0.25rem;
        }
        .selection-cell {
          display: block;
        }
        .demo-button,
        .pin-button,
        .compact-input,
        .filter-input,
        .filter-select,
        .page-size-input,
        .text-input,
        .number-input,
        .wide-action-button,
        .primary-action,
        .secondary-action,
        .success-action {
          border: 1px solid currentColor;
          border-radius: 0.25rem;
        }
        .demo-button {
          padding: 0.5rem;
        }
        .demo-button-sm {
          padding: 0.25rem;
        }
        .demo-button-spaced {
          margin-bottom: 0.5rem;
        }
        .pin-button {
          padding: 0 0.5rem;
        }
        .outlined-table {
          border: 2px solid #000;
        }
        .outlined-control {
          border-color: #000;
        }
        .nowrap {
          white-space: nowrap;
        }
        .demo-note {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        .section-title {
          font-size: 1.25rem;
        }
        .scroll-container {
          overflow-x: auto;
        }
        .page-size-input {
          width: 4rem;
          padding: 0.25rem;
        }
        .number-input {
          width: 5rem;
          padding: 0 0.25rem;
        }
        .filter-input,
        .filter-select {
          width: 6rem;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
        }
        .filter-select {
          width: 9rem;
        }
        .text-input {
          width: 100%;
          padding: 0 0.25rem;
        }
        .compact-input {
          padding: 0 0.25rem;
        }
        .wide-action-button {
          width: 16rem;
        }
        .summary-panel {
          border: 1px solid currentColor;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
          padding: 0.5rem;
        }
        .sortable-header,
        .sortable {
          cursor: pointer;
          user-select: none;
        }
        .primary-action,
        .success-action,
        .secondary-action {
          color: #fff;
        }
        .primary-action {
          background: #3b82f6;
        }
        .success-action {
          background: #22c55e;
        }
        .secondary-action {
          background: #6b7280;
        }
        .submit-button:disabled {
          opacity: 0.5;
        }
        .error-text {
          color: #ef4444;
          font-size: 0.75rem;
        }
        .success-text {
          color: #16a34a;
        }
        .warning-text {
          color: #ca8a04;
        }
        .muted-text {
          color: #9ca3af;
        }
        .label-offset {
          margin-left: 0.5rem;
        }
        .cell-padding {
          padding: 0.25rem;
        }
        .table-spacer {
          margin-bottom: 0.5rem;
        }
        .centered-button-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }
      </style>
    `
  }
}
