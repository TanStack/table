<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  SortingState,
  createColumnHelper,
  getSortedRowModel,
} from '@tanstack/vue-table'
import { h, ref, watch } from 'vue'
import { makeData, Person } from './makeData'

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.group({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),

      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => h('span', 'Last Name'),
        footer: props => props.column.id,
      }),
    ],
  }),

  columnHelper.group({
    header: 'Info',
    footer: props => props.column.id,

    columns: [
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),

      columnHelper.group({
        header: 'More Info',
        columns: [
          columnHelper.accessor('visits', {
            header: () => h('span', 'Visits'),
            footer: props => props.column.id,
          }),

          columnHelper.accessor('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),

          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),

      columnHelper.accessor('createdAt', {
        header: 'Created At',
      }),
    ],
  }),
]

const data = ref(makeData(10000))

const rerender = () => {
  data.value = makeData(10000)
}

const sorting = ref<SortingState>([])

const enableMultiSort = ref<boolean>(true)
const isClickToSort = ref<boolean>(false)
const handleEnableMultiSort = (e) => {
  enableMultiSort.value = e.target.checked

  if (!e.target.checked) {
    isClickToSort.value = false
  }
}
const handleClickToSort = (e) => {
  isClickToSort.value = e.target.checked
}

const table = ref(createTable())
function createTable() {
  return useVueTable({
    get data() {
      return data.value
    },
    columns,
    state: {
      get sorting() {
        return sorting.value
      },
    },
    enableMultiSort: enableMultiSort.value,
    ...(isClickToSort.value ? {isMultiSortEvent: () => true} : undefined),
    onSortingChange: updaterOrValue => {
      sorting.value =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(sorting.value)
          : updaterOrValue
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })
}
watch([enableMultiSort, isClickToSort], () => {
  console.log(enableMultiSort.value)
  table.value = createTable()
})
</script>

<template>
  <div class="p-2">
    <div className="flex items-center">
      <label className="mr-2">enableMultiSort: </label>
      <input type="checkbox" :checked="enableMultiSort" @change="handleEnableMultiSort"/>
      <template v-if="enableMultiSort">
        <span className="ml-2 text-red-500">Press `Shift` key and clicks a
new column.</span>
      </template>
    </div>
    <template v-if="enableMultiSort">
      <div className="flex items-center">
        <label className="mr-2">Click to multi-sort: </label>
        <input type="checkbox" :checked="isClickToSort" @change="handleClickToSort"/>
      </div>
    </template>
    <table>
      <thead>
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :colSpan="header.colSpan"
            :class="
              header.column.getCanSort() ? 'cursor-pointer select-none' : ''
            "
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <template v-if="!header.isPlaceholder">
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />

              {{
                { asc: ' 🔼', desc: ' 🔽' }[
                  header.column.getIsSorted() as string
                ]
              }}
            </template>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in table.getRowModel().rows.slice(0, 10)" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr
          v-for="footerGroup in table.getFooterGroups()"
          :key="footerGroup.id"
        >
          <th
            v-for="header in footerGroup.headers"
            :key="header.id"
            :colSpan="header.colSpan"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.footer"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </tfoot>
    </table>

    <div class="h-4"></div>

    <div>{{ table.getRowModel().rows.length }} Rows</div>

    <button @click="rerender" class="border p-2">Rerender</button>

    <pre>{{ JSON.stringify(sorting, null, 2) }}</pre>
  </div>
</template>

<style>
html {
  font-family: sans-serif;
  font-size: 14px;
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
</style>
