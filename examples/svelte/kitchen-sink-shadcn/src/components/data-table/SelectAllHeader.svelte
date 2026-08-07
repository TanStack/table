<!-- Select-all checkbox. The svelte Checkbox takes `indeterminate` as its own
  boolean prop rather than react's tri-state 'indeterminate' string. -->
<script lang="ts">
  import { useTableContext } from '@/hooks/table.svelte'
  import { Checkbox } from '@/lib/components/ui/checkbox'

  const table = useTableContext()
</script>

<Checkbox
  checked={table.getIsAllPageRowsSelected()}
  indeterminate={table.getIsSomePageRowsSelected() &&
    !table.getIsAllPageRowsSelected()}
  onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
  aria-label="Select all"
  class="translate-y-0.5"
/>
