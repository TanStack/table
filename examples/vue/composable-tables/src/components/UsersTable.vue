<script setup lang="ts">
import { ref } from 'vue'
import { createAppColumnHelper, useAppTable } from '../hooks/table'
import { makeData, type Person } from '../makeData'

const columnHelper = createAppColumnHelper<Person>()

const data = ref(makeData(100))

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.TextCell,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.TextCell,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.NumberCell,
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.NumberCell,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.StatusCell,
  }),
  columnHelper.accessor('progress', {
    header: 'Progress',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.ProgressCell,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ cell }) => cell.RowActionsCell,
  }),
])

function refreshData() {
  data.value = makeData(100)
}

const table = useAppTable({
  debugTable: true,
  columns,
  data,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },
})

// Typed selector — avoids implicit 'any' for `state` in the template
function tableSelector(state: ReturnType<typeof table.store.get>) {
  return {
    sorting: state.sorting,
    columnFilters: state.columnFilters,
  }
}
</script>

<template>
  <component :is="table.AppTable" :selector="tableSelector" v-slot="{ state }">
    <section class="table-container">
      <component
        :is="table.TableToolbar"
        title="Users Table"
        :onRefresh="refreshData"
      />

      <table class="table-element">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <component
              :is="table.AppHeader"
              v-for="header in headerGroup.headers"
              :key="header.id"
              :header="header"
              v-slot="{ header: appHeader }"
            >
              <th
                :colspan="appHeader.colSpan"
                :class="{ 'sortable-header': appHeader.column.getCanSort() }"
                @click="appHeader.column.getToggleSortingHandler()?.($event)"
              >
                <template v-if="!appHeader.isPlaceholder">
                  <component :is="appHeader.FlexRender" />
                  <component :is="appHeader.SortIndicator" />
                  <component :is="appHeader.ColumnFilter" />
                  <span v-if="state.sorting.length > 1" class="sort-indicator">
                    {{
                      state.sorting.findIndex(
                        (sort: { id: string }) =>
                          sort.id === appHeader.column.id,
                      ) + 1 || ''
                    }}
                  </span>
                </template>
              </th>
            </component>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <component
              :is="table.AppCell"
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              :cell="cell"
              v-slot="{ cell: appCell }"
            >
              <td>
                <component :is="appCell.FlexRender" />
              </td>
            </component>
          </tr>
        </tbody>
        <tfoot>
          <tr
            v-for="footerGroup in table.getFooterGroups()"
            :key="footerGroup.id"
          >
            <component
              :is="table.AppFooter"
              v-for="header in footerGroup.headers"
              :key="header.id"
              :header="header"
              v-slot="{ header: appFooter }"
            >
              <td :colspan="appFooter.colSpan">
                <template v-if="!appFooter.isPlaceholder">
                  <component
                    :is="
                      ['age', 'visits', 'progress'].includes(
                        appFooter.column.id,
                      )
                        ? appFooter.FooterSum
                        : appFooter.FooterColumnId
                    "
                  />
                </template>
              </td>
            </component>
          </tr>
        </tfoot>
      </table>

      <component :is="table.PaginationControls" />
      <component :is="table.RowCount" />
    </section>
  </component>
</template>
