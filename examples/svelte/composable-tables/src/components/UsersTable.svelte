<!--
  Users Table Component - uses createAppTable and composable components.
-->
<script lang="ts">
  import { FlexRender, renderComponent } from '@tanstack/svelte-table'
  import { createAppColumnHelper, createAppTable } from '../hooks/table'
  import { makeData } from '../makeData'
  import type { Person } from '../makeData'

  // Create column helper with TFeatures already bound - only need TData!
  const personColumnHelper = createAppColumnHelper<Person>()

  // Data state
  let data = $state(makeData(1_000))

  // Refresh data callback
  function refreshData() {
    data = makeData(1_000)
  }
  function stressTest() {
    data = makeData(100_000)
  }

  // Define columns using the column helper
  // NOTE: You must use `createAppColumnHelper` instead of `createColumnHelper`
  // when using pre-bound components like cell.TextCell
  const columns = personColumnHelper.columns([
    personColumnHelper.accessor('firstName', {
      header: 'First Name',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.TextCell),
    }),
    personColumnHelper.accessor('lastName', {
      header: 'Last Name',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.TextCell),
    }),
    personColumnHelper.accessor('age', {
      header: 'Age',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.NumberCell),
    }),
    personColumnHelper.accessor('visits', {
      header: 'Visits',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.NumberCell),
    }),
    personColumnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.StatusCell),
    }),
    personColumnHelper.accessor('progress', {
      header: 'Progress',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.ProgressCell),
    }),
    personColumnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ cell }) => renderComponent(cell.RowActionsCell),
    }),
  ])

  // Create the table - _features and _rowModels are already configured!
  const table = createAppTable({
    columns,
    get data() {
      return data
    },
    debugTable: true,
  })

  // Reactive derived values from table state.
  // Reading table.store.state creates a $state dependency (via the notifier)
  // that triggers re-renders when any table state changes.
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
    <!-- Table toolbar using pre-bound component -->
    <table.TableToolbar title="Users Table" onRefresh={refreshData
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
                      {#if footer.column.id === 'age' || footer.column.id === 'visits' || footer.column.id === 'progress'}
                        <footer.FooterSum />
                        {#if columnFilters.some((cf) => cf.id === footer.column.id)}
                          <span class="filtered-indicator"> (filtered)</span>
                        {/if}
                      {:else if footer.column.id === 'actions'}
                        <!-- no footer for actions -->
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

    <!-- Pagination using pre-bound component -->
    <table.PaginationControls />

    <!-- Row count using pre-bound component -->
    <table.RowCount />
  </div>
</table.AppTable>
