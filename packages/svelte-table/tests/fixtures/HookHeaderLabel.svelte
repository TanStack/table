<script lang="ts">
  import { hook } from './hook-fixture'

  const header = hook.useHeaderContext<string>()
</script>

<span
  >header-label:{(header.column.columnDef.meta as { label: string })
    .label}</span
>
