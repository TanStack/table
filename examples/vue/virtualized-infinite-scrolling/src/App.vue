<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  FlexRender,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/vue-query'
import { createAtom, useSelector } from '@tanstack/vue-store'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { fetchData } from './makeData'
import type { ComponentPublicInstance } from 'vue'
import type { Person, PersonApiResponse } from './makeData'

const fetchSize = 50
const isDev = import.meta.env.DEV

const _features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'ID',
    size: 60,
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    size: 50,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    size: 50,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    size: 80,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => info.getValue<Date>().toLocaleString(),
    size: 200,
  }),
])

const sortingAtom = createAtom<Array<any>>([])
const sorting = useSelector(sortingAtom, (state) => state)

const tableContainerRef = ref<HTMLDivElement | null>(null)

const query = useInfiniteQuery<PersonApiResponse>(() => ({
  queryKey: ['people', sorting.value],
  queryFn: async ({ pageParam = 0 }) => {
    const start = (pageParam as number) * fetchSize
    return fetchData(start, fetchSize, sorting.value)
  },
  initialPageParam: 0,
  getNextPageParam: (
    _lastGroup: PersonApiResponse,
    groups: Array<PersonApiResponse>,
  ) => groups.length,
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
}))

const flatData = computed<Array<Person>>(
  () => query.data.value?.pages.flatMap((page) => page.data) ?? [],
)

const totalDBRowCount = computed(
  () => query.data.value?.pages[0]?.meta?.totalRowCount ?? 0,
)

const totalFetched = computed(() => flatData.value.length)

function fetchMoreOnBottomReached(containerRefElement?: HTMLDivElement | null) {
  if (!containerRefElement) {
    return
  }

  const { scrollHeight, scrollTop, clientHeight } = containerRefElement

  if (
    scrollHeight - scrollTop - clientHeight < 500 &&
    !query.isFetching.value &&
    totalFetched.value < totalDBRowCount.value
  ) {
    void query.fetchNextPage()
  }
}

onMounted(() => {
  fetchMoreOnBottomReached(tableContainerRef.value)
})

const table = useTable({
  _features,
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
  },
  get data() {
    return flatData.value
  },
  columns,
  atoms: {
    sorting: sortingAtom,
  },
  manualSorting: true,
  debugTable: true,
})

const rows = computed(() => table.getRowModel().rows)

const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: rows.value.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.value,
    measureElement:
      typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
        ? (element: Element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })),
)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())

function measureRowElement(element: Element | ComponentPublicInstance | null) {
  if (!element || !(element instanceof Element)) {
    return
  }

  rowVirtualizer.value.measureElement(element)
}
</script>

<template>
  <div class="app">
    <p v-if="isDev">
      <strong>Notice:</strong> You are currently running Vue in development
      mode. Virtualized rendering performance will be slightly degraded until
      this application is built for production.
    </p>

    ({{ totalFetched.toLocaleString() }} of
    {{ totalDBRowCount.toLocaleString() }} rows fetched)

    <div
      ref="tableContainerRef"
      class="container"
      @scroll="fetchMoreOnBottomReached($event.currentTarget as HTMLDivElement)"
      :style="{
        overflow: 'auto',
        position: 'relative',
        height: '600px',
      }"
    >
      <table :style="{ display: 'grid' }">
        <thead
          :style="{
            display: 'grid',
            position: 'sticky',
            top: '0px',
            zIndex: 1,
          }"
        >
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            :style="{ display: 'flex', width: '100%' }"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :style="{
                display: 'flex',
                width: `${header.getSize()}px`,
              }"
            >
              <div
                :class="{
                  'cursor-pointer select-none': header.column.getCanSort(),
                }"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <FlexRender :header="header" />
                <span v-if="header.column.getIsSorted() === 'asc'"> 🔼</span>
                <span v-else-if="header.column.getIsSorted() === 'desc'">
                  🔽
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody
          :style="{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }"
        >
          <tr
            v-for="virtualRow in virtualRows"
            :key="rows[virtualRow.index]?.id"
            :data-index="virtualRow.index"
            :ref="measureRowElement"
            :style="{
              display: 'flex',
              position: 'absolute',
              transform: `translateY(${virtualRow.start}px)`,
              width: '100%',
            }"
          >
            <td
              v-for="cell in rows[virtualRow.index]?.getAllCells() ?? []"
              :key="cell.id"
              :style="{
                display: 'flex',
                width: `${cell.column.getSize()}px`,
              }"
            >
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="query.isFetching.value">Fetching More...</div>
  </div>
</template>
