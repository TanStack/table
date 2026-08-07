<script lang="ts">
  import MoreHorizontal from '@lucide/svelte/icons/ellipsis'
  import type { Person } from '@/lib/make-data'
  import { useCellContext } from '@/hooks/table.svelte'
  import { Button } from '@/lib/components/ui/button'
  import * as DropdownMenu from '@/lib/components/ui/dropdown-menu'

  const cell = useCellContext()
  const person = $derived(cell.row.original as Person)
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Label>Actions</DropdownMenu.Label>
    <DropdownMenu.Item
      onclick={() => navigator.clipboard.writeText(person.id)}
    >
      Copy ID
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>View details</DropdownMenu.Item>
    <DropdownMenu.Item>View profile</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
