<script lang="ts">
  import { useTableContext } from './table'

  const table = useTableContext()
</script>

<div>
  Showing {table.getRowModel().rows.length.toLocaleString()} of {table
    .getRowCount()
    .toLocaleString()} Rows
</div>
