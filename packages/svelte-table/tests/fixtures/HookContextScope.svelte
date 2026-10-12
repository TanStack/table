<script lang="ts">
  import HookContextProbe from './HookContextProbe.svelte'
  import { hook } from './hook-fixture'
  import type { HookData } from './hook-fixture'

  const columnHelper = hook.createAppColumnHelper<HookData>()
  const table = hook.createAppTable({
    data: [{ id: '1', title: 'First' }],
    columns: columnHelper.columns([
      columnHelper.accessor('title', { header: 'Title', footer: 'Title' }),
    ]),
  })
  const cell = $derived(table.getRowModel().rows[0]!.getAllCells()[0]!)
  const header = $derived(table.getHeaderGroups()[0]!.headers[0]!)
  const footer = $derived(table.getFooterGroups()[0]!.headers[0]!)
</script>

<table.AppTable>
  <table.TableBadge />
</table.AppTable>

<table.AppCell {cell}>
  {#snippet children(value)}
    <value.CellBadge />
  {/snippet}
</table.AppCell>

<table.AppHeader {header}>
  {#snippet children(value)}
    <value.HeaderBadge />
  {/snippet}
</table.AppHeader>

<table.AppFooter header={footer}>
  {#snippet children(value)}
    <value.HeaderBadge />
  {/snippet}
</table.AppFooter>

<HookContextProbe />
