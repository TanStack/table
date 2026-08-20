<script lang="ts">
  import { hook } from './hook-fixture'

  const cell = hook.useCellContext<string>()
</script>

<span>cell-component:{cell.getValue()}</span>
