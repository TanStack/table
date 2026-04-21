<script setup lang="ts">
import { createTableHook } from '@tanstack/vue-table'
import { h, ref } from 'vue'

// This example uses the new `createTableHook` method to create a re-usable table hook factory instead of independently using the standalone `useTable` hook and `createColumnHelper` method. You can choose to use either way.

// 1. Define what the shape of your data will be for each row
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 2. Create some dummy data with a stable reference (this could be an API response stored in ref or similar)
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

// 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: {},
  _rowModels: {}, // client-side row models. `Core` row model is now included by default, but you can still override it here
  debugTable: true,
})

// 4. Create a helper object to help define our columns
const columnHelper = createAppColumnHelper<Person>()

// 5. Define the columns for your table with a stable reference (in this case, defined statically outside of a vue component)
const columns = columnHelper.columns([
  // accessorKey method (most common for simple use-cases)
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  // accessorFn used (alternative) along with a custom id
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => h('i', info.getValue()),
    header: () => h('span', 'Last Name'),
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
    header: () => h('span', 'Visits'),
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

// 6. Store data with a stable reference
const data = ref([...defaultData])

function rerender() {
  data.value = [...data.value].sort((a, b) => a.age - b.age)
}

// 7. Create the table instance with the required columns and data.
// Features and row models are already defined in the createTableHook call above
const table = useAppTable({
  debugTable: true,
  columns,
  data,
  // add additional table options here or in the createTableHook call above
})
</script>

<template>
  <!-- 8. Render your table markup from the table instance APIs -->
  <div class="p-2">
    <table>
      <thead>
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <th v-for="header in headerGroup.headers" :key="header.id">
            <component :is="table.FlexRender" :header="header" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getAllCells()" :key="cell.id">
            <component :is="table.FlexRender" :cell="cell" />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr
          v-for="footerGroup in table.getFooterGroups()"
          :key="footerGroup.id"
        >
          <th v-for="header in footerGroup.headers" :key="header.id">
            <component :is="table.FlexRender" :footer="header" />
          </th>
        </tr>
      </tfoot>
    </table>
    <div class="h-4" />
    <button @click="rerender" class="border p-2">Rerender (sort by age)</button>
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
