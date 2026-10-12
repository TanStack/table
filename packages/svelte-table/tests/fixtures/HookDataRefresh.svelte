<script lang="ts">
  import HookHeaderLabel from './HookHeaderLabel.svelte'
  import { hook } from './hook-fixture'
  import type { HookData } from './hook-fixture'

  const columnHelper = hook.createAppColumnHelper<HookData>()
  function titleColumns(label: string) {
    return columnHelper.columns([
      columnHelper.accessor('title', { header: 'Title', meta: { label } }),
    ])
  }

  let data = $state<Array<HookData>>([{ id: '1', title: 'First' }])
  let columns = $state(titleColumns('Before'))
  const table = hook.createAppTable({
    get data() {
      return data
    },
    get columns() {
      return columns
    },
  })
</script>

<button onclick={() => (data = [{ id: '1', title: 'Second' }])}>
  Replace data
</button>
<button onclick={() => (columns = titleColumns('After'))}>
  Replace columns
</button>

{#each table.getHeaderGroups()[0]!.headers as header (header.id)}
  <table.AppHeader {header}>
    <HookHeaderLabel />
  </table.AppHeader>
{/each}

{#each table.getRowModel().rows as row (row.id)}
  {#each row.getAllCells() as cell (cell.id)}
    <table.AppCell {cell}>
      {#snippet children(value)}
        <output aria-label="Snippet cell">{value.getValue()}</output>
        <value.CellBadge />
      {/snippet}
    </table.AppCell>
  {/each}
{/each}
