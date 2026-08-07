<script lang="ts">
  import { useCellContext } from '@/hooks/table.svelte'

  const cell = useCellContext<string | undefined>()
</script>

{String(cell.getValue() ?? '')}
