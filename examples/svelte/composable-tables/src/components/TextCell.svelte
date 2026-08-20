<!--
  Generic text cell renderer.
  Uses useCellContext to access the cell instance.
-->
<script lang="ts">
  import { useCellContext } from '../hooks/table'

  const cell = useCellContext<string>()
</script>

<span>{cell.getValue()}</span>
