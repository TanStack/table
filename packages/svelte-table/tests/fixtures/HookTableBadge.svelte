<script lang="ts">
  import { hook } from './hook-fixture'
  import type { HookData } from './hook-fixture'

  const table = hook.useTableContext<HookData>()
</script>

<span>table-component:{table.getRowModel().rows[0]?.id}</span>
