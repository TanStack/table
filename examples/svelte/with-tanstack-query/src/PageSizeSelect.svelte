<script lang="ts">
  let {
    pageSize,
    onPageSizeChange,
  }: {
    pageSize: number
    onPageSizeChange: (pageSize: number) => void
  } = $props()
</script>

<select
  aria-label="Rows per page"
  value={pageSize}
  onchange={(event) => onPageSizeChange(Number(event.currentTarget.value))}
>
  {#each [10, 20, 30, 40, 50] as size}
    <option value={size}>Show {size}</option>
  {/each}
  <option value={Infinity}>Show All</option>
</select>
