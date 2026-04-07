<!--
  Number cell with locale formatting.
  Uses useCellContext to access the cell instance.
-->
<script lang="ts">
  import { useCellContext } from '../hooks/table'

  const cell = useCellContext<number>()
</script>

<span>{cell.getValue().toLocaleString()}</span>
