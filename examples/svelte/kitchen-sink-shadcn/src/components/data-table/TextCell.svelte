<script lang="ts">
  import { useCellContext } from '@/hooks/table.svelte'

  const cell = useCellContext<string>()
</script>

{String(cell.getValue())}
