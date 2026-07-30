<script lang="ts">
  import { untrack } from 'svelte'
  import { hook } from './hook-fixture'
  import type { AppSvelteTable } from '../../src/createTableHook.svelte'
  import type { HookData } from './hook-fixture'

  interface Props {
    tableCaptor?: (table: AppSvelteTable<any, any, any, any, any>) => void
  }

  let { tableCaptor }: Props = $props()

  const columnHelper = hook.createAppColumnHelper<HookData>()
  const initialColumns = columnHelper.columns([
    columnHelper.accessor('title', {
      header: ({ column }) => `header:${column.id}`,
      cell: ({ getValue }) => `cell:${getValue()}`,
      footer: ({ column }) => `footer:${column.id}`,
    }),
  ])
  const data: Array<HookData> = [{ id: '1', title: 'First' }]
  const table = hook.createAppTable({
    data,
    columns: initialColumns,
    enableRowSelection: true,
  })
  const row = $derived(table.getRowModel().rows[0]!)
  const cell = $derived(row.getAllCells()[0]!)
  const header = $derived(table.getHeaderGroups()[0]!.headers[0]!)
  const footer = $derived(table.getFooterGroups()[0]!.headers[0]!)

  untrack(() => tableCaptor?.(table))
</script>

<table.AppTable>
  <table.TableBadge />
  <output aria-label="Hook row can be selected"
    >{String(row.getCanSelect())}</output
  >

  <table.AppCell {cell}>
    {#snippet children(value)}
      <value.CellBadge />
      <output aria-label="Hook cell"><value.FlexRender cell={value} /></output>
    {/snippet}
  </table.AppCell>

  <table.AppHeader {header}>
    {#snippet children(value)}
      <value.HeaderBadge />
      <output aria-label="Hook header"
        ><value.FlexRender header={value} /></output
      >
    {/snippet}
  </table.AppHeader>

  <table.AppFooter header={footer}>
    {#snippet children(value)}
      <output aria-label="Hook footer"
        ><value.FlexRender footer={value} /></output
      >
    {/snippet}
  </table.AppFooter>
</table.AppTable>
