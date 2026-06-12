import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  untracked,
} from '@angular/core'
import { NgStyle } from '@angular/common'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
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
  injectTable,
  metaHelper,
  sortFns,
  stockFeatures,
  tableFeatures,
} from '@tanstack/angular-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { DebouncedInput } from './debounced-input/debounced-input'
import { makeData } from './makeData'
import { TableFilter } from './table-filter/table-filter'
import { TableResizableCells } from './resizable-cell/resizable-cell'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'
import type {
  Cell,
  Column,
  ColumnDef,
  FilterFn,
  Header,
  Row,
  SortFn,
  TableFeatures,
} from '@tanstack/angular-table'

// allows us to define custom properties for our columns
interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

type KitchenSinkFeatures = TableFeatures & {
  filterMeta: FuzzyFilterMeta
}

const fuzzyFilter: FilterFn<KitchenSinkFeatures, any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<KitchenSinkFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

const sortStatusFn: SortFn<KitchenSinkFeatures, Person> = (rowA, rowB) => {
  const statusOrder = ['single', 'complicated', 'relationship']
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  )
}

export const features = tableFeatures({
  ...stockFeatures,
  columnMeta: metaHelper<MyColumnMeta>(),
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort, sortStatus: sortStatusFn },
  aggregationFns,
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

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
      sortFn: 'sortStatus',
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FlexRender,
    NgStyle,
    DebouncedInput,
    TableFilter,
    TableResizableCells,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal(makeData(1_000))

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    getSubRows: (row) => row.subRows,
    globalFilterFn: 'fuzzy',
    columnResizeMode: 'onChange',
    defaultColumn: { minSize: 200, maxSize: 800 },
    initialState: {
      columnOrder: columns.map((column) => column.id!),
      columnPinning: { left: ['select'], right: [] },
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    keepPinnedRows: true,
    enableRowSelection: true,
    debugTable: true,
  }))

  readonly columnSizeVars = computed(() => {
    void this.table.atoms.columnSizing.get()
    void this.table.atoms.columnResizing.get()
    const headers = untracked(() => this.table.getFlatHeaders())
    const colSizes: Record<string, number> = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  })

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  pageIndex() {
    return this.table.atoms.pagination.get().pageIndex
  }

  pageSize() {
    return this.table.atoms.pagination.get().pageSize
  }

  refreshData = () => this.data.set(makeData(1_000))
  nestedData = () => this.data.set(makeData(100, 5, 3))
  stress10k = () => this.data.set(makeData(10_000))
  stress100k = () => this.data.set(makeData(100_000))

  shuffleColumns() {
    this.table.setColumnOrder(
      faker.helpers.shuffle(this.table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  onGlobalFilterChange(event: Event) {
    this.table.setGlobalFilter((event.target as HTMLInputElement).value)
  }

  onPageInputChange(event: Event): void {
    const page = (event.target as HTMLInputElement).value
      ? Number((event.target as HTMLInputElement).value) - 1
      : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: Event) {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value))
  }

  getCommonPinningStyles(column: Column<typeof features, Person>) {
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
      opacity: isPinned ? 0.97 : 1,
      position: isPinned ? 'sticky' : 'relative',
      zIndex: isPinned ? 1 : 0,
    }
  }

  headerStyles(header: Header<typeof features, Person, unknown>) {
    return {
      ...this.getCommonPinningStyles(header.column),
      whiteSpace: 'nowrap',
    }
  }

  cellStyles(cell: Cell<typeof features, Person, unknown>) {
    return this.getCommonPinningStyles(cell.column)
  }

  cellClass(cell: Cell<typeof features, Person, unknown>) {
    const groupingActive = this.table.atoms.grouping.get().length > 0
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

  pinnedRowStyles(row: Row<typeof features, Person>) {
    const bottomRows = this.table.getBottomRows()
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
      zIndex: 1,
    }
  }
}
