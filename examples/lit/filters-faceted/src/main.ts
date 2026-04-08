import { customElement, property } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type {
  CellData,
  Column,
  ColumnDef,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/lit-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  rowSortingFeature,
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

const data = makeData(5_000)

@customElement('faceted-filter')
class FacetedFilter extends LitElement {
  @property({ attribute: false })
  column!: Column<typeof _features, Person>

  @property({ attribute: false })
  table!: Table<typeof _features, Person>

  private _debounceTimer: ReturnType<typeof setTimeout> | undefined

  private _debouncedSetFilterValue(value: unknown) {
    clearTimeout(this._debounceTimer)
    this._debounceTimer = setTimeout(() => {
      this.column.setFilterValue(value)
    }, 500)
  }

  render() {
    const firstValue = this.table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(this.column.id)

    const columnFilterValue = this.column.getFilterValue()

    if (typeof firstValue === 'number') {
      const minMaxValues = this.column.getFacetedMinMaxValues()
      return html`
        <div style="display: flex; gap: 2px">
          <input
            type="number"
            min=${Number(minMaxValues?.[0] ?? '')}
            max=${Number(minMaxValues?.[1] ?? '')}
            .value=${String(
              (columnFilterValue as [number, number] | undefined)?.[0] ?? '',
            )}
            @input=${(e: InputEvent) => {
              const val = (e.target as HTMLInputElement).value
              this._debouncedSetFilterValue((old: [number, number]) => [
                val ? Number(val) : undefined,
                old?.[1],
              ])
            }}
            placeholder=${`Min ${minMaxValues?.[0] !== undefined ? `(${minMaxValues[0]})` : ''}`}
            style="width: 96px; border: 1px solid gray; border-radius: 4px; padding: 2px"
          />
          <input
            type="number"
            min=${Number(minMaxValues?.[0] ?? '')}
            max=${Number(minMaxValues?.[1] ?? '')}
            .value=${String(
              (columnFilterValue as [number, number] | undefined)?.[1] ?? '',
            )}
            @input=${(e: InputEvent) => {
              const val = (e.target as HTMLInputElement).value
              this._debouncedSetFilterValue((old: [number, number]) => [
                old?.[0],
                val ? Number(val) : undefined,
              ])
            }}
            placeholder=${`Max ${minMaxValues?.[1] !== undefined ? `(${minMaxValues[1]})` : ''}`}
            style="width: 96px; border: 1px solid gray; border-radius: 4px; padding: 2px"
          />
        </div>
      `
    }

    const sortedUniqueValues = Array.from(
      this.column.getFacetedUniqueValues().keys(),
    ).sort()

    return html`
      <div>
        <datalist id=${this.column.id + 'list'}>
          ${sortedUniqueValues
            .slice(0, 5000)
            .map((value: string) => html`<option value=${value}></option>`)}
        </datalist>
        <input
          type="text"
          .value=${(columnFilterValue ?? '') as string}
          @input=${(e: InputEvent) => {
            const val = (e.target as HTMLInputElement).value
            this._debouncedSetFilterValue(val)
          }}
          placeholder=${`Search... (${this.column.getFacetedUniqueValues().size})`}
          style="width: 144px; border: 1px solid gray; border-radius: 4px; padding: 2px"
          list=${this.column.id + 'list'}
        />
      </div>
    `
  }
}

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  private _globalFilterDebounce: ReturnType<typeof setTimeout> | undefined
  private _globalFilterValue = ''

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          facetedRowModel: createFacetedRowModel(),
          facetedMinMaxValues: createFacetedMinMaxValues(),
          facetedUniqueValues: createFacetedUniqueValues(),
          filteredRowModel: createFilteredRowModel(filterFns),
          sortedRowModel: createSortedRowModel(sortFns),
        },
        data,
        columns,
        globalFilterFn: 'includesString',
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
      },
      (state) => ({
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
      }),
    )

    return html`
      <div class="p-2">
        <input
          style="padding: 8px; font-size: 16px; border: 1px solid gray; border-radius: 4px"
          .value=${(table.state.globalFilter ?? '') as string}
          @input=${(e: InputEvent) => {
            const value = (e.target as HTMLInputElement).value
            clearTimeout(this._globalFilterDebounce)
            this._globalFilterDebounce = setTimeout(() => {
              table.setGlobalFilter(value)
            }, 500)
          }}
          placeholder="Search all columns..."
        />
        <div class="h-2"></div>
        <table>
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) => html`
                <tr>
                  ${headerGroup.headers.map(
                    (header) => html`
                      <th colspan=${header.colSpan}>
                        ${header.isPlaceholder
                          ? null
                          : html`
                              ${FlexRender({ header })}
                              ${header.column.getCanFilter()
                                ? html`<div>
                                    <faceted-filter
                                      .column=${header.column}
                                      .table=${table}
                                    ></faceted-filter>
                                  </div>`
                                : null}
                            `}
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
        <div>${table.getRowModel().rows.length} Rows</div>
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
