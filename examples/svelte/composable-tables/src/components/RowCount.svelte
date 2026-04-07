<!--
  Row count display.
  Uses useTableContext to access the table instance.
-->
<script lang="ts">
  import { useTableContext } from '../hooks/table'

  const table = useTableContext()
</script>

<div class="row-count">
  Showing {table.getRowModel().rows.length.toLocaleString()} of {table.getRowCount().toLocaleString()} rows
</div>
