import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
  metaHelper,
  TableController,
  aggregationFns,
  createColumnHelper,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  sortFns,
  stockFeatures,
  tableFeatures,
} from '@tanstack/lit-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { makeData } from './makeData'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'
import type {
  Cell,
  Column,
  ColumnDef,
  FilterFn,
  Header,
  LitTable,
  Row,
  SortFn,
  TableFeatures,
} from '@tanstack/lit-table'

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

const fuzzyFilter: FilterFn<FuzzyFeatures, any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

const features = tableFeatures({
  ...stockFeatures,
  columnMeta: metaHelper<MyColumnMeta>(),
  filterMeta: metaHelper<FuzzyFilterMeta>(),
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  aggregationFns,
})

const sortStatusFn: SortFn<typeof features, Person> = (rowA, rowB) => {
  const statusOrder = ['single', 'complicated', 'relationship']
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  )
}

const columnHelper = createColumnHelper<typeof features, Person>()

const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns(
  [
    columnHelper.display({
      id: 'select',
      size: 80,
      minSize: 80,
      maxSize: 80,
      enableSorting: false,
      enableGrouping: false,
      enableHiding: false,
      enableResizing: false,
      header: '',
      cell: '',
    }),
    columnHelper.accessor('firstName', {
      id: 'firstName',
      size: 200,
      header: 'First Name',
      filterFn: 'fuzzy',
      sortFn: 'fuzzy',
      meta: { filterVariant: 'text' },
      getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      size: 180,
      header: 'Last Name',
      meta: { filterVariant: 'text' },
    }),
    columnHelper.accessor('age', {
      id: 'age',
      size: 200,
      header: 'Age',
      meta: { filterVariant: 'range' },
      aggregationFn: 'median',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100,
    }),
    columnHelper.accessor('visits', {
      id: 'visits',
      size: 200,
      header: 'Visits',
      meta: { filterVariant: 'range' },
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      size: 200,
      header: 'Status',
      sortFn: sortStatusFn,
      meta: { filterVariant: 'select' },
    }),
    columnHelper.accessor('progress', {
      id: 'progress',
      size: 200,
      header: 'Profile Progress',
      meta: { filterVariant: 'range' },
      aggregationFn: 'mean',
      cell: ({ getValue }) => `${Math.round(getValue<number>() * 100) / 100}%`,
      aggregatedCell: ({ getValue }) =>
        `${Math.round(getValue<number>() * 100) / 100}%`,
    }),
  ],
)

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000)

  private tableController = new TableController<typeof features, Person>(this)

  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()

  protected render() {
    const table = this.tableController.table(
      {
        features,
        columns,
        data: this._data,
        getSubRows: (row) => row.subRows,
        globalFilterFn: 'fuzzy',
        columnResizeMode: 'onChange',
        defaultColumn: { minSize: 200, maxSize: 800 },
        initialState: {
          columnOrder: columns.map((c) => c.id!),
          columnPinning: { left: ['select'], right: [] },
          pagination: { pageIndex: 0, pageSize: 20 },
        },
        keepPinnedRows: true,
        debugTable: true,
      },
      (state) => state,
    )

    return html`
      <div class="demo-root">
        <h1>Kitchen Sink - All Features</h1>
        <div class="toolbar">
          <div class="toolbar-row">
            <input
              class="global-filter-input"
              placeholder="Fuzzy search all columns..."
              .value=${String(table.state.globalFilter ?? '')}
              @input=${(event: InputEvent) =>
                this.debounceSet('global', () =>
                  table.setGlobalFilter(
                    (event.target as HTMLInputElement).value,
                  ),
                )}
            />
          </div>
          <div class="toolbar-row">
            <button
              class="demo-button demo-button-sm"
              @click=${() => (this._data = makeData(1_000))}
            >
              Flat 1k
            </button>
            <button
              class="demo-button demo-button-sm"
              @click=${() => (this._data = makeData(100, 5, 3))}
            >
              Nested 100x5x3
            </button>
            <button
              class="demo-button demo-button-sm"
              @click=${() => (this._data = makeData(10_000))}
            >
              Stress 10k (flat)
            </button>
            <button
              class="demo-button demo-button-sm"
              @click=${() => (this._data = makeData(100_000))}
            >
              Stress 100k (flat)
            </button>
            <button
              class="demo-button demo-button-sm"
              @click=${() => table.reset()}
            >
              Reset Table
            </button>
            <button
              class="demo-button demo-button-sm"
              @click=${() => this.shuffleColumns(table)}
            >
              Shuffle Columns
            </button>
            <span class="nowrap">
              ${table.getSelectedRowModel().flatRows.length.toLocaleString()} of
              ${table.getCoreRowModel().flatRows.length.toLocaleString()}
              selected
            </span>
          </div>
          <details class="column-toggle-panel">
            <summary class="column-toggle-panel-header">
              Column visibility
            </summary>
            <div class="column-toggle-row">
              <label>
                <input
                  type="checkbox"
                  ?checked=${table.getIsAllColumnsVisible()}
                  @change=${table.getToggleAllColumnsVisibilityHandler()}
                />
                Toggle All
              </label>
            </div>
            ${table.getAllLeafColumns().map(
              (column) => html`
                <div class="column-toggle-row">
                  <label>
                    <input
                      type="checkbox"
                      ?checked=${column.getIsVisible()}
                      ?disabled=${!column.getCanHide()}
                      @change=${column.getToggleVisibilityHandler()}
                    />
                    ${column.id}
                  </label>
                </div>
              `,
            )}
          </details>
        </div>

        <div class="table-container">
          <table style=${this.tableStyle(table)}>
            <thead>
              ${repeat(
                table.getHeaderGroups(),
                (headerGroup) => headerGroup.id,
                (headerGroup) => html`
                  <tr>
                    ${headerGroup.headers.map(
                      (header) => html`
                        <th
                          colspan=${header.colSpan}
                          style=${styleMap(this.headerStyle(header))}
                        >
                          ${header.isPlaceholder
                            ? null
                            : this.renderHeader(table, header)}
                        </th>
                      `,
                    )}
                  </tr>
                `,
              )}
            </thead>
            <tbody>
              ${table
                .getTopRows()
                .map((row) => this.renderPinnedRow(table, row))}
              ${table.getCenterRows().map(
                (row) => html`
                  <tr>
                    ${row
                      .getVisibleCells()
                      .map((cell) => this.renderCell(table, cell))}
                  </tr>
                `,
              )}
              ${table
                .getBottomRows()
                .map((row) => this.renderPinnedRow(table, row))}
            </tbody>
          </table>
        </div>
        <div class="spacer-sm"></div>
        <div class="controls">
          <button
            class="demo-button demo-button-sm"
            @click=${() => table.setPageIndex(0)}
            ?disabled=${!table.getCanPreviousPage()}
          >
            &lt;&lt;
          </button>
          <button
            class="demo-button demo-button-sm"
            @click=${() => table.previousPage()}
            ?disabled=${!table.getCanPreviousPage()}
          >
            &lt;
          </button>
          <button
            class="demo-button demo-button-sm"
            @click=${() => table.nextPage()}
            ?disabled=${!table.getCanNextPage()}
          >
            &gt;
          </button>
          <button
            class="demo-button demo-button-sm"
            @click=${() => table.setPageIndex(table.getPageCount() - 1)}
            ?disabled=${!table.getCanNextPage()}
          >
            &gt;&gt;
          </button>
          <span class="inline-controls">
            <div>Page</div>
            <strong>
              ${(table.state.pagination.pageIndex + 1).toLocaleString()} of
              ${table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span class="inline-controls">
            | Go to page:
            <input
              type="number"
              min="1"
              max=${table.getPageCount()}
              .value=${String(table.state.pagination.pageIndex + 1)}
              @input=${(event: InputEvent) => {
                const page = (event.target as HTMLInputElement).value
                  ? Number((event.target as HTMLInputElement).value) - 1
                  : 0
                table.setPageIndex(page)
              }}
              class="page-size-input"
            />
          </span>
          <select
            .value=${String(table.state.pagination.pageSize)}
            @change=${(event: Event) =>
              table.setPageSize(
                Number((event.target as HTMLSelectElement).value),
              )}
          >
            ${[10, 20, 30, 50, 100].map(
              (pageSize) =>
                html`<option value=${pageSize}>Show ${pageSize}</option>`,
            )}
          </select>
        </div>
        <div class="spacer-sm"></div>
        <div class="nowrap">
          ${table.getRowModel().rows.length.toLocaleString()} rows on this page
          (${table.getFilteredRowModel().rows.length.toLocaleString()} filtered
          of ${table.getCoreRowModel().rows.length.toLocaleString()} total)
        </div>
        <div class="spacer-md"></div>
        <details>
          <summary>Table state (live)</summary>
          <pre class="state-dump">${JSON.stringify(table.state, null, 2)}</pre>
        </details>
      </div>
      ${this.styles()}
    `
  }

  private renderHeader(
    table: LitTable<typeof features, Person>,
    header: Header<typeof features, Person, unknown>,
  ) {
    const column = header.column
    return html`
      <div class="header-row">
        <div style="flex: 1; min-width: 0">
          <div class="header-controls">
            ${column.getCanPin()
              ? html`
                  <span class="pin-actions">
                    ${column.getIsPinned() !== 'left'
                      ? html`<button
                          class="pin-button"
                          @click=${() => column.pin('left')}
                        >
                          &lt;
                        </button>`
                      : null}
                    ${column.getIsPinned()
                      ? html`<button
                          class="pin-button"
                          @click=${() => column.pin(false)}
                        >
                          x
                        </button>`
                      : null}
                    ${column.getIsPinned() !== 'right'
                      ? html`<button
                          class="pin-button"
                          @click=${() => column.pin('right')}
                        >
                          &gt;
                        </button>`
                      : null}
                  </span>
                `
              : null}
            ${column.getCanGroup()
              ? html`<button
                  class="pin-button"
                  @click=${column.getToggleGroupingHandler()}
                >
                  ${column.getIsGrouped()
                    ? `Stop (${column.getGroupedIndex()})`
                    : 'Group'}
                </button>`
              : null}
          </div>
          ${column.id === 'select'
            ? html`<input
                type="checkbox"
                ?checked=${table.getIsAllPageRowsSelected()}
                .indeterminate=${table.getIsSomePageRowsSelected()}
                @change=${table.getToggleAllPageRowsSelectedHandler()}
              />`
            : column.getCanSort()
              ? html`<span
                  class="sortable-header"
                  @click=${column.getToggleSortingHandler()}
                >
                  ${FlexRender({ header })}
                  ${column.getIsSorted() === 'asc'
                    ? ' ▲'
                    : column.getIsSorted() === 'desc'
                      ? ' ▼'
                      : ''}
                </span>`
              : FlexRender({ header })}
          ${column.getCanFilter() ? this.renderFilter(column) : null}
        </div>
      </div>
      ${column.getCanResize()
        ? html`<div
            @dblclick=${() => column.resetSize()}
            @mousedown=${header.getResizeHandler()}
            @touchstart=${header.getResizeHandler()}
            class="resizer ${column.getIsResizing() ? 'isResizing' : ''}"
          ></div>`
        : null}
    `
  }

  private renderFilter(column: Column<typeof features, Person>) {
    const filterVariant = column.columnDef.meta?.filterVariant
    const columnFilterValue = column.getFilterValue()
    const minMaxValues =
      filterVariant === 'range' ? column.getFacetedMinMaxValues() : undefined

    if (filterVariant === 'range') {
      return html`
        <div class="filter-row">
          <input
            type="number"
            class="filter-input"
            min=${Number(minMaxValues?.[0] ?? '')}
            max=${Number(minMaxValues?.[1] ?? '')}
            .value=${String(
              (columnFilterValue as [number, number] | undefined)?.[0] ?? '',
            )}
            placeholder=${`Min${minMaxValues?.[0] !== undefined ? ` (${minMaxValues[0]})` : ''}`}
            @input=${(event: InputEvent) =>
              this.debounceSet(`${column.id}-min`, () =>
                column.setFilterValue((old: [number, number] | undefined) => [
                  (event.target as HTMLInputElement).value,
                  old?.[1],
                ]),
              )}
          />
          <input
            type="number"
            class="filter-input"
            min=${Number(minMaxValues?.[0] ?? '')}
            max=${Number(minMaxValues?.[1] ?? '')}
            .value=${String(
              (columnFilterValue as [number, number] | undefined)?.[1] ?? '',
            )}
            placeholder=${`Max${minMaxValues?.[1] !== undefined ? ` (${minMaxValues[1]})` : ''}`}
            @input=${(event: InputEvent) =>
              this.debounceSet(`${column.id}-max`, () =>
                column.setFilterValue((old: [number, number] | undefined) => [
                  old?.[0],
                  (event.target as HTMLInputElement).value,
                ]),
              )}
          />
        </div>
      `
    }

    const sortedUniqueValues = Array.from(
      column.getFacetedUniqueValues().keys(),
    )
      .sort()
      .slice(0, 5000)

    if (filterVariant === 'select') {
      return html`
        <select
          class="filter-select"
          .value=${String(columnFilterValue ?? '')}
          @change=${(event: Event) =>
            column.setFilterValue((event.target as HTMLSelectElement).value)}
        >
          <option value="">All</option>
          ${sortedUniqueValues.map(
            (value) =>
              html`<option value=${String(value)}>${String(value)}</option>`,
          )}
        </select>
      `
    }

    return html`
      <datalist id=${column.id + 'list'}>
        ${sortedUniqueValues.map(
          (value) => html`<option value=${String(value)}></option>`,
        )}
      </datalist>
      <input
        type="text"
        class="filter-select"
        list=${column.id + 'list'}
        .value=${String(columnFilterValue ?? '')}
        placeholder=${`Search (${column.getFacetedUniqueValues().size})`}
        @input=${(event: InputEvent) =>
          this.debounceSet(column.id, () =>
            column.setFilterValue((event.target as HTMLInputElement).value),
          )}
      />
    `
  }

  private renderPinnedRow(
    table: LitTable<typeof features, Person>,
    row: Row<typeof features, Person>,
  ) {
    return html`
      <tr class="pinned-row" style=${styleMap(this.pinnedRowStyle(table, row))}>
        ${row.getVisibleCells().map((cell) => this.renderCell(table, cell))}
      </tr>
    `
  }

  private renderCell(
    table: LitTable<typeof features, Person>,
    cell: Cell<typeof features, Person, unknown>,
  ) {
    return html`
      <td
        style=${styleMap(this.cellStyle(cell))}
        class=${this.cellClass(table, cell) ?? ''}
      >
        ${cell.column.id === 'select'
          ? html`<div class="column-toggle-row">
              <input
                type="checkbox"
                ?checked=${cell.row.getIsSelected()}
                ?disabled=${!cell.row.getCanSelect()}
                .indeterminate=${cell.row.getIsSomeSelected()}
                @change=${cell.row.getToggleSelectedHandler()}
              />
              <button
                class="pin-button"
                @click=${() =>
                  cell.row.pin(
                    cell.row.getIsPinned() === 'top' ? false : 'top',
                  )}
              >
                ${cell.row.getIsPinned() === 'top' ? 'Pinned' : 'Pin'}
              </button>
            </div>`
          : cell.column.id === 'firstName'
            ? html`<div style="padding-left: ${cell.row.depth * 1.5}rem">
                ${cell.row.getCanExpand()
                  ? html`<button
                      @click=${cell.row.getToggleExpandedHandler()}
                      style="cursor: pointer; margin-right: 0.25rem"
                    >
                      ${cell.row.getIsExpanded() ? 'v' : '>'}
                    </button>`
                  : html`<span style="margin-right: 0.25rem">-</span>`}
                ${FlexRender({ cell })}
              </div>`
            : cell.getIsGrouped()
              ? html`<button
                  @click=${cell.row.getToggleExpandedHandler()}
                  style="cursor: ${cell.row.getCanExpand()
                    ? 'pointer'
                    : 'normal'}"
                >
                  ${cell.row.getIsExpanded() ? 'v' : '>'}
                  ${FlexRender({ cell })}
                  (${cell.row.subRows.length.toLocaleString()})
                </button>`
              : FlexRender({ cell })}
      </td>
    `
  }

  private debounceSet(key: string, setValue: () => void) {
    clearTimeout(this.debounceTimers.get(key))
    this.debounceTimers.set(
      key,
      setTimeout(() => {
        setValue()
        this.debounceTimers.delete(key)
      }, 300),
    )
  }

  private shuffleColumns(table: LitTable<typeof features, Person>) {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  private getCommonPinningStyle(column: Column<typeof features, Person>) {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right')

    return {
      boxShadow: isLastLeftPinnedColumn
        ? '-4px 0 4px -4px gray inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px gray inset'
          : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      opacity: isPinned ? '0.97' : '1',
      position: isPinned ? 'sticky' : 'relative',
      zIndex: isPinned ? '1' : '0',
    }
  }

  private headerStyle(header: Header<typeof features, Person, unknown>) {
    return {
      ...this.getCommonPinningStyle(header.column),
      whiteSpace: 'nowrap',
      width: `calc(var(--header-${header.id}-size) * 1px)`,
    }
  }

  private cellStyle(cell: Cell<typeof features, Person, unknown>) {
    return {
      ...this.getCommonPinningStyle(cell.column),
      width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
    }
  }

  private pinnedRowStyle(
    table: LitTable<typeof features, Person>,
    row: Row<typeof features, Person>,
  ) {
    const bottomRows = table.getBottomRows()
    return {
      position: 'sticky',
      top:
        row.getIsPinned() === 'top'
          ? `${row.getPinnedIndex() * 32 + 48}px`
          : undefined,
      bottom:
        row.getIsPinned() === 'bottom'
          ? `${(bottomRows.length - 1 - row.getPinnedIndex()) * 32}px`
          : undefined,
      zIndex: '1',
    }
  }

  private cellClass(
    table: LitTable<typeof features, Person>,
    cell: Cell<typeof features, Person, unknown>,
  ) {
    const groupingActive = table.state.grouping.length > 0
    const hasAggregation = !!cell.column.columnDef.aggregationFn
    return !groupingActive
      ? undefined
      : cell.getIsGrouped()
        ? 'cell-grouped'
        : hasAggregation && cell.getIsAggregated()
          ? 'cell-aggregated'
          : cell.getIsPlaceholder()
            ? 'cell-placeholder'
            : undefined
  }

  private tableStyle(table: LitTable<typeof features, Person>) {
    const styles = [`width: ${table.getTotalSize()}px`]
    for (const header of table.getFlatHeaders()) {
      styles.push(`--header-${header.id}-size: ${header.getSize()}`)
      styles.push(`--col-${header.column.id}-size: ${header.column.getSize()}`)
    }
    return styles.join('; ')
  }

  private styles() {
    return html`<style>
      * {
        box-sizing: border-box;
        font-family: sans-serif;
        font-size: 14px;
      }

      .table-container {
        overflow-x: auto;
        width: 100%;
        max-width: 1400px;
        border: 1px solid lightgray;
      }

      table {
        border-collapse: collapse;
        border-spacing: 0;
        table-layout: fixed;
      }

      th {
        background-color: #f3f4f6;
        border-bottom: 1px solid lightgray;
        border-right: 1px solid lightgray;
        font-weight: bold;
        padding: 2px 4px;
        position: relative;
        text-align: left;
        vertical-align: top;
      }

      td {
        background-color: white;
        border-bottom: 1px solid #eee;
        padding: 2px 4px;
        vertical-align: middle;
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
        z-index: 2;
      }

      .resizer.isResizing {
        background: blue;
      }

      .demo-root {
        padding: 0.5rem;
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
      .header-row,
      .header-controls,
      .toolbar-row {
        display: flex;
        align-items: center;
      }

      .header-row,
      .inline-controls,
      .pin-actions,
      .filter-row,
      .header-controls,
      .controls,
      .toolbar-row {
        gap: 0.5rem;
      }

      .toolbar {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
        border: 1px solid lightgray;
        margin-bottom: 0.5rem;
      }

      .toolbar-row {
        flex-wrap: wrap;
      }

      .column-toggle-panel {
        display: inline-block;
        border: 1px solid #000;
        border-radius: 0.25rem;
        box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
        padding: 0.25rem;
      }

      .column-toggle-panel-header {
        border-bottom: 1px solid #000;
        padding: 0 0.25rem;
        margin-bottom: 0.25rem;
      }

      .column-toggle-row {
        padding: 0 0.25rem;
      }

      .demo-button,
      .pin-button,
      .filter-input,
      .filter-select,
      .page-size-input,
      .global-filter-input {
        border: 1px solid currentColor;
        border-radius: 0.25rem;
      }

      .demo-button {
        padding: 0.5rem;
      }

      .demo-button-sm {
        padding: 0.25rem;
      }

      .pin-button {
        padding: 0 0.25rem;
        cursor: pointer;
        background: transparent;
        font-size: 0.875rem;
      }

      .nowrap {
        white-space: nowrap;
      }

      .page-size-input {
        width: 4rem;
        padding: 0.25rem;
      }

      .filter-input {
        width: 6rem;
      }

      .filter-select {
        width: 9rem;
      }

      .global-filter-input {
        padding: 0.5rem;
        width: 100%;
        max-width: 24rem;
      }

      .sortable-header {
        cursor: pointer;
        user-select: none;
      }

      .cell-grouped {
        background: #0aff0082;
      }

      .cell-aggregated {
        background: #ffa50078;
      }

      .cell-placeholder {
        background: #ff000042;
      }

      .state-dump {
        max-height: 24rem;
        overflow: auto;
      }
    </style>`
  }
}
