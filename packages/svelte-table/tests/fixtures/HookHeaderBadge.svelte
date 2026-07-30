<script lang="ts">
  import { hook } from './hook-fixture'

  const header = hook.useHeaderContext<string>()
</script>

<span>header-component:{header.column.id}</span>
