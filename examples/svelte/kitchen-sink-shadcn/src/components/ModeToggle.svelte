<script lang="ts">
  import Moon from '@lucide/svelte/icons/moon'
  import Sun from '@lucide/svelte/icons/sun'
  import { Button } from '@/lib/components/ui/button'
  import * as DropdownMenu from '@/lib/components/ui/dropdown-menu'
  import { setTheme } from '@/lib/theme.svelte'
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="icon" class="relative">
        <Sun
          class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setTheme('light')}>
      Light
    </DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setTheme('dark')}>
      Dark
    </DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setTheme('system')}>
      System
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
