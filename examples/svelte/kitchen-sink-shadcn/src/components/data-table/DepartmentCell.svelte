<script lang="ts">
  import Code from '@lucide/svelte/icons/code'
  import CreditCard from '@lucide/svelte/icons/credit-card'
  import Megaphone from '@lucide/svelte/icons/megaphone'
  import ShoppingCart from '@lucide/svelte/icons/shopping-cart'
  import Users from '@lucide/svelte/icons/users'
  import type { Component } from 'svelte'
  import type { Person } from '@/lib/make-data'
  import { useCellContext } from '@/hooks/table.svelte'
  import { Badge } from '@/lib/components/ui/badge'
  import { toSentenceCase } from '@/lib/utils'

  const cell = useCellContext<Person['department'] | undefined>()
  const department = $derived(cell.getValue())

  const icons: Record<Person['department'], Component> = {
    engineering: Code,
    marketing: Megaphone,
    sales: ShoppingCart,
    hr: Users,
    finance: CreditCard,
  }
</script>

{#if department}
  {@const Icon = icons[department]}
  <Badge
    variant="outline"
    class="gap-1 w-fit [&>svg]:size-3.5 px-3 py-1 [&>svg]:shrink-0 rounded-full"
  >
    <Icon />
    <span class="truncate">{toSentenceCase(department)}</span>
  </Badge>
{/if}
