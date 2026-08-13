<script lang="ts">
  import { useCellContext } from '@/hooks/table.svelte'
  import { formatDate } from '@/lib/utils'

  const cell = useCellContext<string>()
</script>

{formatDate(cell.getValue())}
