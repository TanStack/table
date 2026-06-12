<script setup lang="ts">
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'
import { computed, ref } from 'vue'
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
  metaHelper,
  sortFns,
  stockFeatures,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { makeData } from './makeData'
import type { CSSProperties } from 'vue'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'
import type {
  Cell,
  Column,
  FilterFn,
  Header,
  Row,
  SortFn,
  TableFeatures,
} from '@tanstack/vue-table'

interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

interface KitchenSinkFilterMeta {
  itemRank?: RankingInfo
}

type KitchenSinkFeatures = TableFeatures & { filterMeta: KitchenSinkFilterMeta }

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
      rowA.columnFiltersMeta[columnId].itemRank as RankingInfo,
      rowB.columnFiltersMeta[columnId].itemRank as RankingInfo,
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

const features = tableFeatures({
  ...stockFeatures,
  columnMeta: metaHelper<MyColumnMeta>(),
  filterMeta: metaHelper<KitchenSinkFilterMeta>(),
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort, status: sortStatusFn },
  aggregationFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = ref(
  columnHelper.columns([
    columnHelper.display({
      id: 'select',
      size: 80,
      minSize: 80,
      maxSize: 80,
      enableSorting: false,
      enableGrouping: false,
      enableHiding: false,
      enableResizing: false,
      header: ({ table }) =>
        table.getIsAllPageRowsSelected()
          ? 'all'
          : table.getIsSomePageRowsSelected()
            ? 'some'
            : 'none',
      cell: ({ row }) => (row.getIsPinned() === 'top' ? 'Pinned' : 'Pin'),
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
      sortFn: 'status',
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
  ]),
)

const data = ref(makeData(1_000))

const table = useTable({
  key: 'kitchen-sink', // needed for devtools
  features,
  data,
  get columns() {
    return columns.value
  },
  getSubRows: (row: Person) => row.subRows,
  globalFilterFn: 'fuzzy',
  columnResizeMode: 'onChange',
  defaultColumn: { minSize: 200, maxSize: 800 },
  initialState: {
    columnOrder: columns.value.map((c) => c.id!),
    columnPinning: { left: ['select'], right: [] },
    pagination: { pageIndex: 0, pageSize: 20 },
  },
  keepPinnedRows: true,
  debugTable: true,
})

useTanStackTableDevtools(table)

const columnSizeVars = computed(() => {
  void table.atoms.columnResizing.get()
  void table.atoms.columnSizing.get()
  const colSizes: Record<string, number> = {}
  for (const header of table.getFlatHeaders()) {
    colSizes[`--header-${header.id}-size`] = header.getSize()
    colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
  }
  return colSizes
})

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()

function debounceSet(key: string, setValue: () => void) {
  clearTimeout(debounceTimers.get(key))
  debounceTimers.set(
    key,
    setTimeout(() => {
      setValue()
      debounceTimers.delete(key)
    }, 300),
  )
}

function getCommonPinningStyles(
  column: Column<typeof features, Person>,
): CSSProperties {
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

function headerStyle(
  header: Header<typeof features, Person, unknown>,
): CSSProperties {
  return {
    ...getCommonPinningStyles(header.column),
    whiteSpace: 'nowrap',
    width: `calc(var(--header-${header.id}-size) * 1px)`,
  }
}

function cellStyle(cell: Cell<typeof features, Person, unknown>) {
  return {
    ...getCommonPinningStyles(cell.column),
    width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
  }
}

function cellClass(cell: Cell<typeof features, Person, unknown>) {
  const groupingActive = table.atoms.grouping.get().length > 0
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

function rowStyle(row: Row<typeof features, Person>): CSSProperties {
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
    zIndex: 1,
  }
}

function sortedUniqueValues(column: Column<typeof features, Person>) {
  if (column.columnDef.meta?.filterVariant === 'range') return []
  return Array.from(column.getFacetedUniqueValues().keys())
    .sort()
    .slice(0, 5000)
}

function updateRangeFilter(
  column: Column<typeof features, Person>,
  index: 0 | 1,
  value: string,
) {
  column.setFilterValue((old: [number, number] | undefined) => {
    return index === 0 ? [value, old?.[1]] : [old?.[0], value]
  })
}

function refreshData() {
  data.value = makeData(1_000)
}

function nestedData() {
  data.value = makeData(100, 5, 3)
}

function stress10k() {
  data.value = makeData(10_000)
}

function stress100k() {
  data.value = makeData(100_000)
}

function shuffleColumns() {
  table.setColumnOrder(
    faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
  )
}
</script>

<template>
  <div class="demo-root">
    <h1>Kitchen Sink - All Features</h1>
    <div class="toolbar">
      <div class="toolbar-row">
        <input
          class="global-filter-input"
          placeholder="Fuzzy search all columns..."
          :value="table.atoms.globalFilter.get() ?? ''"
          @input="
            (event) =>
              debounceSet('global', () =>
                table.setGlobalFilter((event.target as HTMLInputElement).value),
              )
          "
        />
      </div>
      <div class="toolbar-row">
        <button @click="refreshData" class="demo-button demo-button-sm">
          Flat 1k
        </button>
        <button @click="nestedData" class="demo-button demo-button-sm">
          Nested 100x5x3
        </button>
        <button @click="stress10k" class="demo-button demo-button-sm">
          Stress 10k (flat)
        </button>
        <button @click="stress100k" class="demo-button demo-button-sm">
          Stress 100k (flat)
        </button>
        <button @click="table.reset()" class="demo-button demo-button-sm">
          Reset Table
        </button>
        <button @click="shuffleColumns" class="demo-button demo-button-sm">
          Shuffle Columns
        </button>
        <span class="nowrap">
          {{ table.getSelectedRowModel().flatRows.length.toLocaleString() }} of
          {{ table.getCoreRowModel().flatRows.length.toLocaleString() }}
          selected
        </span>
      </div>
      <details class="column-toggle-panel">
        <summary class="column-toggle-panel-header">Column visibility</summary>
        <div class="column-toggle-row">
          <label>
            <input
              type="checkbox"
              :checked="table.getIsAllColumnsVisible()"
              @change="table.getToggleAllColumnsVisibilityHandler()?.($event)"
            />
            Toggle All
          </label>
        </div>
        <div
          v-for="column in table.getAllLeafColumns()"
          :key="column.id"
          class="column-toggle-row"
        >
          <label>
            <input
              type="checkbox"
              :checked="column.getIsVisible()"
              :disabled="!column.getCanHide()"
              @change="column.getToggleVisibilityHandler()?.($event)"
            />
            {{ column.id }}
          </label>
        </div>
      </details>
    </div>

    <div class="table-container">
      <table :style="{ ...columnSizeVars, width: table.getTotalSize() + 'px' }">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colspan="header.colSpan"
              :style="headerStyle(header)"
            >
              <template v-if="!header.isPlaceholder">
                <div class="header-row">
                  <div style="flex: 1; min-width: 0">
                    <div class="header-controls">
                      <span
                        v-if="header.column.getCanPin()"
                        class="pin-actions"
                      >
                        <button
                          v-if="header.column.getIsPinned() !== 'left'"
                          class="pin-button"
                          @click="header.column.pin('left')"
                        >
                          &lt;
                        </button>
                        <button
                          v-if="header.column.getIsPinned()"
                          class="pin-button"
                          @click="header.column.pin(false)"
                        >
                          x
                        </button>
                        <button
                          v-if="header.column.getIsPinned() !== 'right'"
                          class="pin-button"
                          @click="header.column.pin('right')"
                        >
                          &gt;
                        </button>
                      </span>
                      <button
                        v-if="header.column.getCanGroup()"
                        class="pin-button"
                        @click="header.column.getToggleGroupingHandler()?.()"
                      >
                        {{
                          header.column.getIsGrouped()
                            ? `Stop (${header.column.getGroupedIndex()})`
                            : 'Group'
                        }}
                      </button>
                    </div>
                    <template v-if="header.column.id === 'select'">
                      <input
                        type="checkbox"
                        :checked="table.getIsAllPageRowsSelected()"
                        :indeterminate="table.getIsSomePageRowsSelected()"
                        @change="
                          table.getToggleAllPageRowsSelectedHandler()?.($event)
                        "
                      />
                    </template>
                    <span
                      v-else-if="header.column.getCanSort()"
                      class="sortable-header"
                      @click="header.column.getToggleSortingHandler()?.($event)"
                    >
                      <FlexRender :header="header" />
                      {{
                        header.column.getIsSorted() === 'asc'
                          ? ' ▲'
                          : header.column.getIsSorted() === 'desc'
                            ? ' ▼'
                            : ''
                      }}
                    </span>
                    <FlexRender v-else :header="header" />
                    <div v-if="header.column.getCanFilter()">
                      <div
                        v-if="
                          header.column.columnDef.meta?.filterVariant ===
                          'range'
                        "
                        class="filter-row"
                      >
                        <input
                          type="number"
                          class="filter-input"
                          :min="
                            header.column.getFacetedMinMaxValues()?.[0] ?? ''
                          "
                          :max="
                            header.column.getFacetedMinMaxValues()?.[1] ?? ''
                          "
                          :value="
                            (
                              header.column.getFilterValue() as
                                | [number, number]
                                | undefined
                            )?.[0] ?? ''
                          "
                          :placeholder="`Min${header.column.getFacetedMinMaxValues()?.[0] !== undefined ? ` (${header.column.getFacetedMinMaxValues()?.[0]})` : ''}`"
                          @input="
                            (event) =>
                              debounceSet(header.column.id + '-min', () =>
                                updateRangeFilter(
                                  header.column,
                                  0,
                                  (event.target as HTMLInputElement).value,
                                ),
                              )
                          "
                        />
                        <input
                          type="number"
                          class="filter-input"
                          :min="
                            header.column.getFacetedMinMaxValues()?.[0] ?? ''
                          "
                          :max="
                            header.column.getFacetedMinMaxValues()?.[1] ?? ''
                          "
                          :value="
                            (
                              header.column.getFilterValue() as
                                | [number, number]
                                | undefined
                            )?.[1] ?? ''
                          "
                          :placeholder="`Max${header.column.getFacetedMinMaxValues()?.[1] !== undefined ? ` (${header.column.getFacetedMinMaxValues()?.[1]})` : ''}`"
                          @input="
                            (event) =>
                              debounceSet(header.column.id + '-max', () =>
                                updateRangeFilter(
                                  header.column,
                                  1,
                                  (event.target as HTMLInputElement).value,
                                ),
                              )
                          "
                        />
                      </div>
                      <select
                        v-else-if="
                          header.column.columnDef.meta?.filterVariant ===
                          'select'
                        "
                        class="filter-select"
                        :value="
                          (header.column.getFilterValue() ?? '').toString()
                        "
                        @change="
                          header.column.setFilterValue(
                            ($event.target as HTMLSelectElement).value,
                          )
                        "
                      >
                        <option value="">All</option>
                        <option
                          v-for="value in sortedUniqueValues(header.column)"
                          :key="String(value)"
                          :value="String(value)"
                        >
                          {{ String(value) }}
                        </option>
                      </select>
                      <template v-else>
                        <datalist :id="header.column.id + 'list'">
                          <option
                            v-for="value in sortedUniqueValues(header.column)"
                            :key="String(value)"
                            :value="String(value)"
                          />
                        </datalist>
                        <input
                          type="text"
                          class="filter-select"
                          :list="header.column.id + 'list'"
                          :value="
                            (header.column.getFilterValue() ?? '') as string
                          "
                          :placeholder="`Search (${header.column.getFacetedUniqueValues().size})`"
                          @input="
                            (event) =>
                              debounceSet(header.column.id, () =>
                                header.column.setFilterValue(
                                  (event.target as HTMLInputElement).value,
                                ),
                              )
                          "
                        />
                      </template>
                    </div>
                  </div>
                </div>
                <div
                  v-if="header.column.getCanResize()"
                  :class="`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`"
                  @dblclick="header.column.resetSize()"
                  @mousedown="header.getResizeHandler()($event)"
                  @touchstart="header.getResizeHandler()($event)"
                />
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getTopRows()"
            :key="row.id"
            class="pinned-row"
            :style="rowStyle(row)"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :style="cellStyle(cell)"
              :class="cellClass(cell)"
            >
              <FlexRender :cell="cell" />
            </td>
          </tr>
          <tr v-for="row in table.getCenterRows()" :key="row.id">
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :style="cellStyle(cell)"
              :class="cellClass(cell)"
            >
              <template v-if="cell.column.id === 'select'">
                <div class="column-toggle-row">
                  <input
                    type="checkbox"
                    :checked="cell.row.getIsSelected()"
                    :disabled="!cell.row.getCanSelect()"
                    :indeterminate="cell.row.getIsSomeSelected()"
                    @change="cell.row.getToggleSelectedHandler()?.($event)"
                  />
                  <button
                    class="pin-button"
                    @click="
                      cell.row.pin(
                        cell.row.getIsPinned() === 'top' ? false : 'top',
                      )
                    "
                  >
                    {{ cell.row.getIsPinned() === 'top' ? 'Pinned' : 'Pin' }}
                  </button>
                </div>
              </template>
              <template v-else-if="cell.column.id === 'firstName'">
                <div :style="{ paddingLeft: `${cell.row.depth * 1.5}rem` }">
                  <button
                    v-if="cell.row.getCanExpand()"
                    @click="cell.row.getToggleExpandedHandler()?.()"
                    style="cursor: pointer; margin-right: 0.25rem"
                  >
                    {{ cell.row.getIsExpanded() ? 'v' : '>' }}
                  </button>
                  <span v-else style="margin-right: 0.25rem">-</span>
                  <FlexRender :cell="cell" />
                </div>
              </template>
              <template v-else-if="cell.getIsGrouped()">
                <button
                  @click="cell.row.getToggleExpandedHandler()?.()"
                  :style="{
                    cursor: cell.row.getCanExpand() ? 'pointer' : 'normal',
                  }"
                >
                  {{ cell.row.getIsExpanded() ? 'v' : '>' }}
                  <FlexRender :cell="cell" />
                  ({{ cell.row.subRows.length.toLocaleString() }})
                </button>
              </template>
              <FlexRender v-else :cell="cell" />
            </td>
          </tr>
          <tr
            v-for="row in table.getBottomRows()"
            :key="row.id"
            class="pinned-row"
            :style="rowStyle(row)"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :style="cellStyle(cell)"
              :class="cellClass(cell)"
            >
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="spacer-sm" />
    <div class="controls">
      <button
        class="demo-button demo-button-sm"
        @click="table.setPageIndex(0)"
        :disabled="!table.getCanPreviousPage()"
      >
        &lt;&lt;
      </button>
      <button
        class="demo-button demo-button-sm"
        @click="table.previousPage()"
        :disabled="!table.getCanPreviousPage()"
      >
        &lt;
      </button>
      <button
        class="demo-button demo-button-sm"
        @click="table.nextPage()"
        :disabled="!table.getCanNextPage()"
      >
        &gt;
      </button>
      <button
        class="demo-button demo-button-sm"
        @click="table.setPageIndex(table.getPageCount() - 1)"
        :disabled="!table.getCanNextPage()"
      >
        &gt;&gt;
      </button>
      <span class="inline-controls">
        <div>Page</div>
        <strong>
          {{ (table.atoms.pagination.get().pageIndex + 1).toLocaleString() }} of
          {{ table.getPageCount().toLocaleString() }}
        </strong>
      </span>
      <span class="inline-controls">
        | Go to page:
        <input
          type="number"
          min="1"
          :max="table.getPageCount()"
          :value="table.atoms.pagination.get().pageIndex + 1"
          @input="
            table.setPageIndex(
              ($event.target as HTMLInputElement).value
                ? Number(($event.target as HTMLInputElement).value) - 1
                : 0,
            )
          "
          class="page-size-input"
        />
      </span>
      <select
        :value="table.atoms.pagination.get().pageSize"
        @change="
          table.setPageSize(Number(($event.target as HTMLSelectElement).value))
        "
      >
        <option
          v-for="pageSize in [10, 20, 30, 50, 100]"
          :key="pageSize"
          :value="pageSize"
        >
          Show {{ pageSize }}
        </option>
      </select>
    </div>
    <div class="spacer-sm" />
    <div class="nowrap">
      {{ table.getRowModel().rows.length.toLocaleString() }} rows on this page
      ({{ table.getFilteredRowModel().rows.length.toLocaleString() }} filtered
      of {{ table.getCoreRowModel().rows.length.toLocaleString() }} total)
    </div>
    <div class="spacer-md" />
    <details>
      <summary>Table state (live)</summary>
      <pre class="state-dump">{{
        JSON.stringify(table.store.get(), null, 2)
      }}</pre>
    </details>
  </div>
</template>
