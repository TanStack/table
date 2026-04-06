<script setup lang="ts">
import { ref } from 'vue'
import { createAppColumnHelper, useAppTable } from '../hooks/table'
import { makeProductData, type Product } from '../makeData'

const columnHelper = createAppColumnHelper<Product>()

const data = ref(makeProductData(60))

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Product',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.TextCell,
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.CategoryCell,
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.PriceCell,
  }),
  columnHelper.accessor('stock', {
    header: 'In Stock',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.NumberCell,
  }),
  columnHelper.accessor('rating', {
    header: 'Rating',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.ProgressCell,
  }),
])

function refreshData() {
  data.value = makeProductData(60)
}

const table = useAppTable({
  columns,
  data,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 8,
    },
  },
})
</script>

<template>
  <component :is="table.AppTable">
    <section class="table-container">
      <component
        :is="table.TableToolbar"
        title="Products Table"
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
                      ['price', 'stock', 'rating'].includes(appFooter.column.id)
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
