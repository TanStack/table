<!--
  Progress bar cell.
  Uses useCellContext to access the cell instance.
-->
<script lang="ts">
  import { useCellContext } from '../hooks/table'

  const cell = useCellContext<number>()
</script>

<div class="progress-bar">
  <div class="progress-bar-fill" style="width: {cell.getValue()}%"></div>
</div>
