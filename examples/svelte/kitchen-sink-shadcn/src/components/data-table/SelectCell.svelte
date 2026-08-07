<!-- Row-selection checkbox cell. Svelte tracks the state read natively — no
  Subscribe boundary is needed like in the react example. -->
<script lang="ts">
  import { useCellContext } from '@/hooks/table.svelte'
  import { Checkbox } from '@/lib/components/ui/checkbox'

  const cell = useCellContext()
  const row = $derived(cell.row)
</script>

<Checkbox
  checked={row.getIsSelected()}
  onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
  aria-label="Select row"
  class="translate-y-0.5"
/>
