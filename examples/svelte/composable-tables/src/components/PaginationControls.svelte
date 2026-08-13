<!--
  Pagination controls for the table.
  Uses useTableContext to access the table instance.
-->
<script lang="ts">
  import { useTableContext
  } from '../hooks/table'

  const table = useTableContext()
  const pagination = $derived(table.atoms.pagination.get())
</script>

<div class="pagination">
  <button
    onclick={() => table.firstPage()
    }
    disabled={!table.getCanPreviousPage()}
  >
    {'<<'}
  </button>
  <button
    onclick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    {'<'}
  </button>
  <button
    onclick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    {'>'}
  </button>
  <button
    onclick={() => table.lastPage()}
    disabled={!table.getCanLastPage()}
  >
    {'>>'}
  </button>
  <span>
    Page
    <strong>
      {(pagination.pageIndex + 1).toLocaleString()} of {table.getPageCount().toLocaleString()}
    </strong>
  </span>
  <span>
    | Go to page:
    <input
      type="number"
      min="1"
      max={table.getPageCount()}
      value={pagination.pageIndex + 1}
      onchange={(e) => {
        const page = e.currentTarget.value ? Number(e.currentTarget.value) - 1 : 0
        table.setPageIndex(page)
      }}
    />
  </span>
  <select
    value={pagination.pageSize}
    onchange={(e) => {
      table.setPageSize(Number(e.currentTarget.value))
    }}
  >
    {#each [10, 20, 30, 40, 50] as pageSize}
      <option value={pageSize}>Show {pageSize}</option>
    {/each}
  </select>
</div>
