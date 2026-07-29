<script lang="ts">
  import { untrack } from 'svelte'
  import { hook } from './hook-fixture'
  import type { AppSvelteTable } from '../../src/createTableHook.svelte'
  import type { HookData } from './hook-fixture'

  interface Props {
    tableCaptor?: (table: AppSvelteTable<any, any, any, any, any, any>) => void
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
  const updatedColumns = columnHelper.columns([
    columnHelper.accessor('title', {
      id: 'updated-title',
      header: ({ column }) => `updated-header:${column.id}`,
      cell: ({ getValue }) => `updated-cell:${getValue()}`,
      footer: ({ column }) => `updated-footer:${column.id}`,
    }),
  ])
  let data = $state<Array<HookData>>([{ id: '1', title: 'First' }])
  let columns = $state(initialColumns)
  const table = hook.createAppTable({
    get data() {
      return data
    },
    get columns() {
      return columns
    },
    enableRowSelection: true,
  })
  const row = $derived(table.getRowModel().rows[0]!)
  const cell = $derived(row.getAllCells()[0]!)
  const header = $derived(table.getHeaderGroups()[0]!.headers[0]!)
  const footer = $derived(table.getFooterGroups()[0]!.headers[0]!)

  untrack(() => tableCaptor?.(table))

  function replaceRowAndColumn() {
    data = [{ id: '1', title: 'Second' }]
    columns = updatedColumns
  }
</script>

<table.AppTable>
  <table.TableBadge />
  <output aria-label="Hook row can be selected"
    >{String(row.getCanSelect())}</output
  >

  <table.AppCell {cell}>
    {#snippet children(value)}
      <value.CellBadge />
      <output aria-label="Hook cell"><value.FlexRender /></output>
    {/snippet}
  </table.AppCell>

  <table.AppHeader {header}>
    {#snippet children(value)}
      <value.HeaderBadge />
      <output aria-label="Hook header"><value.FlexRender /></output>
    {/snippet}
  </table.AppHeader>

  <table.AppFooter header={footer}>
    {#snippet children(value)}
      <output aria-label="Hook footer"><value.FlexRender /></output>
    {/snippet}
  </table.AppFooter>

  <button onclick={replaceRowAndColumn}>Replace hook row and column</button>
</table.AppTable>
