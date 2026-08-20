import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { FlexRender, TableController, tableFeatures } from '@tanstack/lit-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/lit-table'
import type { Person } from './makeData'

const features = tableFeatures({})

// A traditional header group setup: every leaf column sits under a top-level
// group, so the tree is even (2 header rows) and no placeholder headers are
// created.
const basicColumns: Array<ColumnDef<typeof features, Person>> = [
  {
    header: 'Name',
    columns: [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        footer: 'First Name',
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        header: 'Last Name',
        footer: 'Last Name',
      },
    ],
  },
  {
    header: 'Stats',
    columns: [
      { accessorKey: 'age', header: 'Age', footer: 'Age' },
      { accessorKey: 'visits', header: 'Visits', footer: 'Visits' },
    ],
  },
  {
    header: 'Profile',
    columns: [
      { accessorKey: 'status', header: 'Status', footer: 'Status' },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: 'Profile Progress',
      },
    ],
  },
]

// Groups nested inside groups, with every leaf column at the same depth. The
// tree stays even, so there are three header rows and still no placeholders,
// and each group's colSpan is the sum of its descendants.
const nestedColumns: Array<ColumnDef<typeof features, Person>> = [
  {
    header: 'Person',
    columns: [
      {
        header: 'Name',
        columns: [
          { accessorKey: 'firstName', header: 'First Name' },
          {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            header: 'Last Name',
          },
        ],
      },
      {
        header: 'Demographics',
        columns: [{ accessorKey: 'age', header: 'Age' }],
      },
    ],
  },
  {
    header: 'Activity',
    columns: [
      {
        header: 'Engagement',
        columns: [
          { accessorKey: 'visits', header: 'Visits' },
          { accessorKey: 'status', header: 'Status' },
        ],
      },
      {
        header: 'Progress',
        columns: [{ accessorKey: 'progress', header: 'Profile Progress' }],
      },
    ],
  },
]

// An uneven column tree: `fullName` and `progress` are top-level leaf columns
// while their siblings nest two and three levels deep. The placeholder at the
// top of each column's placeholder chain carries the chain's full
// `header.rowSpan`, and the headers it covers report a rowSpan of 0 so the
// renderer can skip them.
const unevenColumns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorFn: (row) =>
      [row.firstName, row.lastName].filter(Boolean).join(' '),
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Info',
    columns: [
      { accessorKey: 'age', header: () => 'Age' },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => html`<span>Visits</span>`,
          },
          { accessorKey: 'status', header: 'Status' },
        ],
      },
    ],
  },
  { accessorKey: 'progress', header: 'Profile Progress' },
]

const defaultColumns: Array<ColumnDef<typeof features, Person>> = [
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
  private _data: Array<Person> = makeData(5)

  private tableController = new TableController<typeof features, Person>(this)
  private basicTableController = new TableController<typeof features, Person>(
    this,
  )
  private nestedTableController = new TableController<typeof features, Person>(
    this,
  )
  private unevenTableController = new TableController<typeof features, Person>(
    this,
  )

  protected render() {
    const table = this.tableController.table(
      {
        features,
        columns: defaultColumns,
        data: this._data,
      },
      () => ({}),
    )
    const basicTable = this.basicTableController.table(
      {
        features,
        columns: basicColumns,
        data: this._data,
      },
      () => ({}),
    )
    const nestedTable = this.nestedTableController.table(
      {
        features,
        columns: nestedColumns,
        data: this._data,
      },
      () => ({}),
    )
    const unevenTable = this.unevenTableController.table(
      {
        features,
        columns: unevenColumns,
        data: this._data,
      },
      () => ({}),
    )

    const renderBody = (bodyTable: typeof table) => html`
      <tbody>
        ${repeat(
          bodyTable.getRowModel().rows,
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
    `

    return html`
      <div class="demo-root">
        <div>
          <button
            @click=${() => {
              this._data = makeData(5)
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
        <div class="spacer-md"></div>
        <!-- The panels wrap into a grid whenever the viewport is wide enough. -->
        <div class="example-grid">
          <section class="example-panel">
            <h2 class="section-title">Basic Header Groups</h2>
            <table>
              <thead>
                ${repeat(
                  basicTable.getHeaderGroups(),
                  (headerGroup) => headerGroup.id,
                  (headerGroup) => html`
                    <tr>
                      ${repeat(
                        headerGroup.headers,
                        (header) => header.id,
                        (header) => html`
                          <th colspan="${header.colSpan}">
                            ${FlexRender({ header })}
                          </th>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </thead>
              ${renderBody(basicTable)}
              <tfoot>
                ${repeat(
                  basicTable
                    .getFooterGroups()
                    // Only the leaf columns declare footers, so skip the group
                    // row instead of rendering a blank one.
                    .filter((footerGroup) =>
                      footerGroup.headers.some(
                        (header) =>
                          !header.isPlaceholder &&
                          header.column.columnDef.footer,
                      ),
                    ),
                  (footerGroup) => footerGroup.id,
                  (footerGroup) => html`
                    <tr>
                      ${repeat(
                        footerGroup.headers,
                        (header) => header.id,
                        (header) => html`
                          <th colspan="${header.colSpan}">
                            ${
                              header.isPlaceholder
                                ? null
                                : FlexRender({ footer: header })
                            }
                          </th>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </tfoot>
            </table>
          </section>

          <section class="example-panel">
            <h2 class="section-title">Nested Header Groups</h2>
            <table>
              <thead>
                ${repeat(
                  nestedTable.getHeaderGroups(),
                  (headerGroup) => headerGroup.id,
                  (headerGroup) => html`
                    <tr>
                      ${repeat(
                        headerGroup.headers,
                        (header) => header.id,
                        (header) => html`
                          <th colspan="${header.colSpan}">
                            ${FlexRender({ header })}
                          </th>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </thead>
              ${renderBody(nestedTable)}
            </table>
          </section>

          <section class="example-panel">
            <h2 class="section-title">Placeholder Headers</h2>
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
                          <th colspan="${header.colSpan}">
                            ${
                              header.isPlaceholder
                                ? null
                                : FlexRender({ header })
                            }
                          </th>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </thead>
              ${renderBody(table)}
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
                          <th colspan="${header.colSpan}">
                            ${
                              header.isPlaceholder
                                ? null
                                : FlexRender({ footer: header })
                            }
                          </th>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </tfoot>
            </table>
          </section>

          <section class="example-panel">
            <h2 class="section-title">Header Row Spanning</h2>
            <table>
              <thead>
                ${repeat(
                  unevenTable.getHeaderGroups(),
                  (headerGroup) => headerGroup.id,
                  (headerGroup) => html`
                    <tr>
                      ${repeat(
                        headerGroup.headers.filter(
                          (header) => header.rowSpan !== 0,
                        ),
                        (header) => header.id,
                        (header) => html`
                          <th
                            colspan="${header.colSpan}"
                            rowspan="${header.rowSpan}"
                          >
                            ${FlexRender({ header })}
                          </th>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </thead>
              ${renderBody(unevenTable)}
            </table>
          </section>
        </div>
      </div>
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
        /* Lays the header group examples side by side when the viewport
           allows it. */
        .example-grid {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 1rem 1.5rem;
        }
        .example-panel {
          flex: 0 1 auto;
        }
      </style>
    `
  }
}
