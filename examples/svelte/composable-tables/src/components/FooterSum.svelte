<!--
  Footer showing a summary/aggregation for numeric columns.
  Uses useHeaderContext to access the header instance.
-->
<script lang="ts">
  import { useHeaderContext } from '../hooks/table'

  const header = useHeaderContext()
  const table = header.getContext().table
  const rows = table.getFilteredRowModel().rows

  // Calculate sum for numeric columns
  const sum = rows.reduce((acc, row) => {
    const value = row.getValue(header.column.id)
    return acc + (typeof value === 'number' ? value : 0)
  }, 0)
</script>

<span class="footer-sum">{sum > 0 ? sum.toLocaleString() : '—'}</span>
