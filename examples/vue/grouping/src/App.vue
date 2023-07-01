<script setup lang="ts">
import {
  FlexRender,
  getExpandedRowModel,
  getGroupedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
  createColumnHelper,
} from "@tanstack/vue-table";
import {ref} from "vue";
import {makeData, type Person} from './makeData'

const INITIAL_PAGE_INDEX = 0;

const defaultData = makeData(100);
const columnHelper = createColumnHelper<Person>()
const goToPageNumber = ref(INITIAL_PAGE_INDEX + 1);
const pageSizes = [10, 20, 30, 40, 50];
const data = ref(defaultData)

const columns = ref([
  {
    header: 'Name',
    columns: [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: info => info.getValue(),
        /**
         * override the value used for row grouping
         * (otherwise, defaults to the value derived from accessorKey / accessorFn)
         */
        getGroupingValue: row => `${row.firstName} ${row.lastName}`,
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        header: () => 'Last Name',
        cell: info => info.getValue(),
      },
    ],
  },
  {
    header: 'Info',
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        aggregatedCell: ({getValue}) => Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'median',
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => 'Visits',
            aggregationFn: 'sum',
          },
          {
            accessorKey: 'status',
            header: 'Status',
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            cell: ({getValue}) => Math.round(getValue<number>() * 100) / 100 + '%',
            aggregationFn: 'mean',
            aggregatedCell: ({getValue}) => Math.round(getValue<number>() * 100) / 100 + '%',
          },
        ],
      },
    ],
  },
])

const rerender = () => (data.value = makeData(100000))
const grouping = ref([]);

const table = useVueTable({
  get data() {
    return data.value
  },
  get columns() {
    return columns.value
  },
  state: {
    get grouping() {
      return grouping.value;
    },
  },
  getExpandedRowModel: getExpandedRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  onGroupingChange: (attr) => grouping.value = attr(grouping.value),
  getPaginationRowModel: getPaginationRowModel(),
  getCoreRowModel: getCoreRowModel(),
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
});

function handleGoToPage(e) {
  const page = e.target.value ? Number(e.target.value) - 1 : 0;
  goToPageNumber.value = page + 1;
  table.setPageIndex(page);
}

function handlePageSizeChange(e) {
  table.setPageSize(Number(e.target.value));
}
</script>

<template>
  <div class="p-2">
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
        >
          <button
            v-if="header.column.getCanGroup()"
            @click="header.column.getToggleGroupingHandler()($event)"
            :style="{cursor: 'pointer'}"
          >
            {{
              header.column.getIsGrouped()
                ? `🛑(${header.column.getGroupedIndex()}) `
                : `👊 `
            }}
          </button>
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td
          v-for="cell in row.getVisibleCells()" :key="cell.id"
          :style="{
            background: cell.getIsGrouped()
              ? '#0aff0082'
              : cell.getIsAggregated()
              ? '#ffa50078'
              : cell.getIsPlaceholder()
              ? '#ff000042'
              : 'white'
          }">
          <button
            v-if="cell.getIsGrouped()"
            @click="row.getToggleExpandedHandler()($event)"
            :style="{cursor: row.getCanExpand() ? 'pointer' : 'normal'}"
          >
            {{ row.getIsExpanded() ? '👇' : '👉' }}
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
            ({{ row.subRows.length }})
          </button>
          <FlexRender
            v-else-if="cell.getIsAggregated()"
            :render="cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell"
            :props="cell.getContext()"
          />
          <FlexRender
            v-else-if="!cell.getIsPlaceholder()"
            :render="cell.column.columnDef.cell"
            :props="cell.getContext()"
          />
        </td>
      </tr>
      </tbody>
    </table>
    <div>
      <div class="flex items-center gap-2">
        <button
          class="border rounded p-1"
          @click="() => table.setPageIndex(0)"
          :disabled="!table.getCanPreviousPage()"
        >
          «
        </button>
        <button
          class="border rounded p-1"
          @click="() => table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
        >
          ‹
        </button>
        <button
          class="border rounded p-1"
          @click="() => table.nextPage()"
          :disabled="!table.getCanNextPage()"
        >
          ›
        </button>
        <button
          class="border rounded p-1"
          @click="() => table.setPageIndex(table.getPageCount() - 1)"
          :disabled="!table.getCanNextPage()"
        >
          »
        </button>
        <span class="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {{ table.getState().pagination.pageIndex + 1 }} of
            {{ table.getPageCount() }}
          </strong>
        </span>
        <span class="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            :value="goToPageNumber"
            @change="handleGoToPage"
            class="border p-1 rounded w-16"
          />
        </span>
        <select
          :value="table.getState().pagination.pageSize"
          @change="handlePageSizeChange"
        >
          <option
            :key="pageSize"
            :value="pageSize"
            v-for="pageSize in pageSizes"
          >
            Show {{ pageSize }}
          </option>
        </select>
      </div>
    </div>
    <div class="h-2"/>
    <button @click="rerender" class="border p-2">Rerender</button>
    <pre>{{ JSON.stringify(grouping, null, 2) }}</pre>
  </div>
</template>

<style>
html,
body {
  padding: 4px;
  margin: 0;

  font-family: Arial, Helvetica, sans-serif;
}

table {
  border: 1px solid lightgray;
  border-collapse: collapse;
}

tbody {
  border-bottom: 1px solid lightgray;
}

th,
td {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
}

th {
  padding: 8px;
}

tfoot {
  color: gray;
}

tfoot th {
  font-weight: normal;
}
</style>
