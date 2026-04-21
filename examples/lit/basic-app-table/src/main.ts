import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  createTableHook,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'

// This example uses the new `createTableHook` method to create a re-usable table hook factory instead of independently using the standalone `TableController` and `createColumnHelper` method. You can choose to use either way.

// 1. Define what the shape of your data will be for each row
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 2. Create some dummy data with a stable reference (this could be an API response stored in @state or similar)
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
  {
    firstName: 'kevin',
    lastName: 'vandy',
    age: 28,
    visits: 100,
    status: 'Single',
    progress: 70,
  },
]

// 3. New in V9! Tell the table which features and row models we want to use. In this case, we want sorting.
const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({
    rowSortingFeature,
  }),
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
  },
  debugTable: true,
})

// 4. Create a helper object to help define our columns
const columnHelper = createAppColumnHelper<Person>()

// 5. Define the columns for your table with a stable reference (in this case, defined statically outside of a Lit component)
const columns = columnHelper.columns([
  // accessorKey method (most common for simple use-cases)
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  // accessorFn used (alternative) along with a custom id
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => html`<i>${info.getValue()}</i>`,
    header: () => html`<span>Last Name</span>`,
    footer: (info) => info.column.id,
  }),
  // accessorFn used to transform the data
  columnHelper.accessor((row) => Number(row.age), {
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => html`<span>Visits</span>`,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
])

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private data = [...defaultData]

  // 6. Store data with a reactive reference
  // (in Lit, we use @state() for reactive properties)

  // 7. Create the table instance with the required columns and data.
  //    Features and row models are already defined in the createTableHook call above
  //    NOTE: Capture `this` as `host` because inside the getter, `this` refers
  //    to the options object (not the LitElement), which would cause infinite recursion.
  private appTable = (() => {
    const host = this
    return useAppTable(
      this,
      {
        debugTable: true,
        columns,
        get data() {
          return host.data
        },
      },
      (state) => ({ sorting: state.sorting }),
    )
  })()

  private rerender() {
    this.data = this.data.slice().sort((a: Person, b: Person) => a.age - b.age)
  }

  // 8. Render your table markup from the table instance APIs
  protected render(): unknown {
    const table = this.appTable.table()

    return html`
      <div class="p-2">
        <table>
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) => html`
                <tr>
                  ${headerGroup.headers.map((header) =>
                    table.AppHeader(
                      header,
                      (h) => html`
                        <th colspan=${h.colSpan}>
                          ${h.isPlaceholder
                            ? null
                            : html`<div
                                title=${h.column.getCanSort()
                                  ? h.column.getNextSortingOrder() === 'asc'
                                    ? 'Sort ascending'
                                    : h.column.getNextSortingOrder() === 'desc'
                                      ? 'Sort descending'
                                      : 'Clear sort'
                                  : ''}
                                @click=${h.column.getToggleSortingHandler()}
                                style="cursor: ${h.column.getCanSort()
                                  ? 'pointer'
                                  : 'not-allowed'}"
                              >
                                ${h.FlexRender()}
                                ${{ asc: ' \u{1F53C}', desc: ' \u{1F53D}' }[
                                  h.column.getIsSorted() as string
                                ] ?? null}
                              </div>`}
                        </th>
                      `,
                    ),
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
                    .map((cell) =>
                      table.AppCell(
                        cell,
                        (c) => html` <td>${c.FlexRender()}</td> `,
                      ),
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
                  ${footerGroup.headers.map((header) =>
                    table.AppFooter(
                      header,
                      (h) => html`
                        <th>${h.isPlaceholder ? null : h.FlexRender()}</th>
                      `,
                    ),
                  )}
                </tr>
              `,
            )}
          </tfoot>
        </table>
        <div class="h-4"></div>
        <button @click=${() => this.rerender()} class="border p-2">
          Rerender (sort by age)
        </button>
        <pre>${JSON.stringify(table.state, null, 2)}</pre>
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
