<!--
  Status badge cell for status column.
  Uses useCellContext to access the cell instance.
-->
<script lang="ts">
  import { useCellContext } from '../hooks/table'

  const cell = useCellContext<'relationship' | 'complicated' | 'single'>()
</script>

<span class="status-badge {cell.getValue()}">{cell.getValue()}</span>
