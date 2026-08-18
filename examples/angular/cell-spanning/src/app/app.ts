import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  TanStackTable,
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  injectTable,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData, makeSummaryData } from './makeData'
import type { Cell } from '@tanstack/angular-table'
import type { Shift, SummaryRow } from './makeData'

const features = tableFeatures({
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
})

const columnHelper = createColumnHelper<typeof features, Shift>()

const columns = columnHelper.columns([
  columnHelper.accessor('region', {
    header: 'Region',
    sortFn: 'alphanumeric',
    // Adjacent rows that share a region merge into one vertically spanning
    // cell. Spans always derive from the rows that are actually rendered, so
    // sorting, filtering, and paging just change which rows are adjacent.
    spanRows: true,
  }),
  columnHelper.accessor('team', {
    header: 'Team',
    sortFn: 'alphanumeric',
    spanRows: true,
  }),
  columnHelper.accessor('shift', {
    header: 'Shift',
    sortFn: 'alphanumeric',
    // The predicate form: shifts only merge while the table is sorted by the
    // shift column, so the predicate itself is visibly reactive.
    spanRows: ({ column, value, anchorValue }) =>
      column.getIsSorted() !== false && value === anchorValue,
  }),
  columnHelper.accessor('employee', {
    header: 'Employee',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('hours', {
    header: 'Hours',
    sortFn: 'basic',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
])

const summaryFeatures = tableFeatures({
  cellSpanningFeature,
  columnVisibilityFeature,
})

const summaryColumnHelper = createColumnHelper<
  typeof summaryFeatures,
  SummaryRow
>()

const summaryColumns = summaryColumnHelper.columns([
  summaryColumnHelper.accessor('label', {
    header: 'Shift',
    // Subtotal rows render one label cell covering every column but the
    // total. `Infinity` clamps to the rest of the cell's pinned region.
    spanColumns: ({ row }) => (row.original.kind === 'subtotal' ? Infinity : 1),
  }),
  summaryColumnHelper.accessor('region', {
    header: 'Region',
  }),
  summaryColumnHelper.accessor('hours', {
    header: 'Hours',
  }),
])

@Component({
  selector: 'app-root',
  imports: [FlexRender, TanStackTable],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal(makeData())
  readonly summaryData = signal(makeSummaryData())
  readonly spanningEnabled = signal(true)

  readonly pageSizes = [10, 12, 36]
  readonly toggleableColumnIds = ['team', 'shift']

  readonly table = injectTable<typeof features, Shift>(() => ({
    debugTable: true,
    features,
    columns,
    data: this.data(),
    enableCellSpanning: this.spanningEnabled(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 12 },
    },
  }))

  readonly summaryTable = injectTable<typeof summaryFeatures, SummaryRow>(
    () => ({
      debugTable: true,
      features: summaryFeatures,
      columns: summaryColumns,
      data: this.summaryData(),
    }),
  )

  refreshData = () => this.data.set(makeData())

  setSpanningEnabled(event: Event) {
    this.spanningEnabled.set((event.target as HTMLInputElement).checked)
  }

  columnHeader(columnId: string) {
    return String(this.table.getColumn(columnId)!.columnDef.header)
  }

  statusFilter() {
    return (
      (this.table.getColumn('status')!.getFilterValue() as
        string | undefined) ?? ''
    )
  }

  setStatusFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    this.table.getColumn('status')!.setFilterValue(value || undefined)
  }

  employeeFilter() {
    return (
      (this.table.getColumn('employee')!.getFilterValue() as
        string | undefined) ?? ''
    )
  }

  setEmployeeFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.table.getColumn('employee')!.setFilterValue(value || undefined)
  }

  setPageSize(event: Event) {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value))
  }

  pagination() {
    return this.table.store.get().pagination
  }

  sortIndicator(sorted: string | false) {
    return sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''
  }

  /**
   * Selection styling for the spanning table. A merged cell is always entirely
   * selected or entirely unselected: the selection bounds expand to enclose any
   * merge they touch, so the tint and the outline land on the rendered anchor.
   */
  getCellClassName(cell: Cell<typeof features, Shift>): string {
    const base =
      cell.getRowSpan() > 1 ? 'cell-selectable span-cell' : 'cell-selectable'

    if (!cell.getIsSelected()) {
      return cell.getIsFocused() ? `${base} cell-focused` : base
    }

    const edges = cell.getSelectionEdges()

    return [
      base,
      'cell-selected',
      cell.getIsFocused() && 'cell-focused',
      edges.top && 'cell-edge-top',
      edges.right && 'cell-edge-right',
      edges.bottom && 'cell-edge-bottom',
      edges.left && 'cell-edge-left',
    ]
      .filter(Boolean)
      .join(' ')
  }

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }
}
