<!--
  Row actions cell - actions for the current row.
  Uses useCellContext to access the cell instance.
-->
<script lang="ts">
  import { useCellContext } from '../hooks/table'

  const cell = useCellContext()
</script>

<div class="row-actions">
  <button
    onclick={() => alert(`View: ${cell.row.original.firstName} ${cell.row.original.lastName}`)}
    title="View"
  >
    👁️
  </button>
  <button
    onclick={() => alert(`Edit: ${cell.row.original.firstName} ${cell.row.original.lastName}`)}
    title="Edit"
  >
    ✏️
  </button>
  <button
    onclick={() => alert(`Delete: ${cell.row.original.firstName} ${cell.row.original.lastName}`)}
    title="Delete"
  >
    🗑️
  </button>
</div>
