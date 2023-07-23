<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import {
  useQuery,
} from '@tanstack/vue-query';
import {
  computed,
  type Ref,
  ref,
} from "vue";
import {makeData} from './makeData'

const pageSizes = [10, 20, 30, 40, 50];

function useQueryList(req: Ref<{ page, pageSize }>) {
  return useQuery({
    keepPreviousData: true,
    queryKey: ['data', 'list', req],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const total = 1000;
      let count = req.value.pageSize;
      if ((req.value.page * req.value.pageSize) > total) {
        count = (total - (req.value.page * req.value.pageSize));
      }
      if (count < 0) {
        count = 0;
      }
      return {
        body: makeData(count),
        total,
      };
    }
  });
}

const page = ref(1);
const pageSize = ref(10);

const {
  isLoading,
  isFetching,
  data,
} = useQueryList(computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
})));

const columns = ref([
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: info => info.getValue(),
  },
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    header: () => 'Last Name',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
  {
    accessorKey: 'visits',
    header: () => 'Visits',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    cell: ({getValue}) => Math.round(getValue<number>() * 100) / 100 + '%',
  },
])

const table = useVueTable({
  get data() {
    return data?.value?.body || [];
  },
  get columns() {
    return columns.value
  },
  getCoreRowModel: getCoreRowModel(),
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
});

function handleGoToPage(e) {
  page.value = e.target.value ? Number(e.target.value) : 1;
}

function handlePageSizeChange(e) {
  pageSize.value = Number(e.target.value);
}

const maxPage = computed(() => Math.ceil((data?.value?.total || 0) / pageSize.value));

const getCanPreviousPage = computed(() => page.value > 1);
const getCanNextPage = computed(() => page.value < maxPage.value);
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
        <td v-for="cell in row.getVisibleCells()" :key="cell.id">
          <FlexRender
            v-if="!cell.getIsPlaceholder()"
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
          @click="page = 0"
          :disabled="!getCanPreviousPage"
        >
          «
        </button>
        <button
          class="border rounded p-1"
          @click="page--"
          :disabled="!getCanPreviousPage"
        >
          ‹
        </button>
        <button
          class="border rounded p-1"
          @click="page++"
          :disabled="!getCanNextPage"
        >
          ›
        </button>
        <button
          class="border rounded p-1"
          @click="page = maxPage"
          :disabled="!getCanNextPage"
        >
          »
        </button>
        <span class="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {{ page }} of
            {{ maxPage }}
          </strong>
        </span>
        <span class="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            :value="page"
            @change="handleGoToPage"
            min="1"
            :max="maxPage"
            class="border p-1 rounded w-16"
          />
        </span>
        <select
          :value="pageSize"
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
    <pre>isLoading = {{ isLoading }}</pre>
    <pre>isFetching = {{ isFetching }}</pre>
    <pre>page = {{ page }}</pre>
    <pre>pageSize = {{ pageSize }}</pre>
    <pre>data.body = {{ data?.body?.length }}</pre>
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
