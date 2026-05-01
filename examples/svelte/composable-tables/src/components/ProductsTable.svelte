<!--
  Products Table Component - uses the same createAppTable hook and components as UsersTable,
  but with different data types and column configurations.
-->
<script lang="ts">
  import { FlexRender, renderComponent } from '@tanstack/svelte-table'
  import { createAppColumnHelper, createAppTable } from '../hooks/table'
  import { makeProductData } from '../makeData'
  import type { Product } from '../makeData'

  // Create column helper with TFeatures already bound - only need TData!
  const productColumnHelper = createAppColumnHelper<Product>()

  // Data state
  let data = $state(makeProductData(1_000))

  // Refresh data callback
  function refreshData() {
    data = makeProductData(1_000)
  }
  function stressTest() {
    data = makeProductData(100_000)
  }

  // Define columns using the column helper - different structure than Users table
  const columns = productColumnHelper.columns([
    productColumnHelper.accessor('name', {
      header: 'Product Name',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.TextCell, {}),
    }),
    productColumnHelper.accessor('category', {
      header: 'Category',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.CategoryCell, {}),
    }),
    productColumnHelper.accessor('price', {
      header: 'Price',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.PriceCell, {}),
    }),
    productColumnHelper.accessor('stock', {
      header: 'In Stock',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.NumberCell, {}),
    }),
    productColumnHelper.accessor('rating', {
      header: 'Rating',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.ProgressCell, {}),
    }),
  ])

  // Create the table using the same createAppTable hook
  const table = createAppTable({
    debugTable: true,
    columns,
    get data() {
      return data
    },
    getRowId: (row) => row.id,
  })

  // Reactive derived values from table state
  let sorting = $derived(table.store.state.sorting)
  let columnFilters = $derived(table.store.state.columnFilters)

  // IMPORTANT: Derive rows from table state so Svelte tracks the dependency.
  // We must read a $state value that changes on every table update.
  // JSON.stringify forces a deep read, ensuring Svelte sees the dependency.
  const rows = $derived.by(() => {
    JSON.stringify(table.store.state)
    return table.getRowModel().rows
  })
</script>

<table.AppTable>
  <div class="table-container">
    <div>
      <button onclick={() => refreshData()
      }>Regenerate Data</button>
      <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
    </div>
    <!-- Table toolbar using the same pre-bound component -->
    <table.TableToolbar title="Products Table" onRefresh={refreshData
    } />

    <!-- Table element -->
    <table>
      <thead>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)
        }
          <tr>
            {#each headerGroup.headers as h (h.id)}
              <table.AppHeader header={h
              }>
                {#snippet children(header)}
                  <th
                    colSpan={header.colSpan}
                    class={header.column.getCanSort() ? 'sortable-header' : ''}
                    onclick={header.column.getToggleSortingHandler()}
                  >
                    {#if !header.isPlaceholder}
                      <header.FlexRender
                        header={header}
                      />
                      <header.SortIndicator />
                      <header.ColumnFilter />
                      <!-- Show sort order number when multiple columns sorted -->
                      {#if sorting.length > 1 && sorting.findIndex((s) => s.id === header.column.id) > -1}
                        <span class="sort-order">
                          {sorting.findIndex((s) => s.id === header.column.id) + 1}
                        </span>
                      {/if}
                    {/if}
                  </th>
                {/snippet}
              </table.AppHeader>
            {/each
            }
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each rows as row (row.id)}
          <tr>
            {#each row.getAllCells() as c (c.id)}
              <table.AppCell cell={c
              }>
                {#snippet children(cell)}
                  <td>
                    <FlexRender cell={cell} />
                  </td>
                {/snippet}
              </table.AppCell>
            {/each
            }
          </tr>
        {/each}
      </tbody>
      <tfoot>
        {#each table.getFooterGroups() as footerGroup (footerGroup.id)}
          <tr>
            {#each footerGroup.headers as f (f.id)}
              <table.AppFooter header={f
              }>
                {#snippet children(footer)}
                  <td colSpan={footer.colSpan}>
                    {#if !footer.isPlaceholder}
                      {#if footer.column.id === 'price' || footer.column.id === 'stock' || footer.column.id === 'rating'}
                        <footer.FooterSum />
                        {#if columnFilters.some((cf) => cf.id === footer.column.id)}
                          <span class="filtered-indicator"> (filtered)</span>
                        {/if}
                      {:else}
                        <footer.FooterColumnId />
                        {#if columnFilters.some((cf) => cf.id === footer.column.id)}
                          <span class="filtered-indicator"> ✓</span>
                        {/if}
                      {/if}
                    {/if}
                  </td>
                {/snippet}
              </table.AppFooter>
            {/each
            }
          </tr>
        {/each}
      </tfoot>
    </table>

    <!-- Pagination using the same pre-bound component -->
    <table.PaginationControls />

    <!-- Row count using the same pre-bound component -->
    <table.RowCount />
  </div>
</table.AppTable>
