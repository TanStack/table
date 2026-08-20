<script lang="ts">
  import { useTableContext } from './table'

  const table = useTableContext()
  const pagination = $derived(table.atoms.pagination.get())
</script>

<div class="spacer-sm"></div>
<div class="controls">
  <button
    type="button"
    class="demo-button demo-button-sm"
    onclick={() => table.firstPage()}
    disabled={!table.getCanPreviousPage()}
  >
    {'<<'}
  </button>
  <button
    type="button"
    class="demo-button demo-button-sm"
    onclick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    {'<'}
  </button>
  <button
    type="button"
    class="demo-button demo-button-sm"
    onclick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    {'>'}
  </button>
  <button
    type="button"
    class="demo-button demo-button-sm"
    onclick={() => table.lastPage()}
    disabled={!table.getCanLastPage()}
  >
    {'>>'}
  </button>
  <span class="inline-controls">
    <div>Page</div>
    <strong>
      {(pagination.pageIndex + 1).toLocaleString()} of {table
        .getPageCount()
        .toLocaleString()}
    </strong>
  </span>
  <span class="inline-controls">
    | Go to page:
    <input
      type="number"
      min="1"
      max={table.getPageCount()}
      value={pagination.pageIndex + 1}
      oninput={(event) => {
        const page = event.currentTarget.value
          ? Number(event.currentTarget.value) - 1
          : 0
        table.setPageIndex(page)
      }}
      class="page-size-input"
    />
  </span>
  <select
    value={pagination.pageSize}
    onchange={(event) => {
      table.setPageSize(Number(event.currentTarget.value))
    }}
  >
    {#each [10, 20, 30, 40, 50] as pageSize}
      <option value={pageSize}>Show {pageSize}</option>
    {/each}
  </select>
</div>
