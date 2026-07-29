<script lang="ts">
  import { stockFeatures } from '@tanstack/table-core'
  import { createTable } from '../../src/createTable.svelte'
  import { subscribeTable } from '../../src/subscribe'
  import type { RowSelectionState } from '@tanstack/table-core'

  interface Props {
    selectedRowCaptor?: (selected: boolean) => void
    wholeSelectionCaptor?: (selection: RowSelectionState) => void
  }

  let { selectedRowCaptor, wholeSelectionCaptor }: Props = $props()
  const table = createTable(
    {
      data: [{ id: '1' }, { id: '2' }],
      columns: [{ id: 'id', accessorKey: 'id' }],
      features: stockFeatures,
      getRowId: (row) => row.id,
    },
    () => null,
  )
  const selectedRow = subscribeTable(table.atoms.rowSelection, (selection) =>
    Boolean(selection['1']),
  )
  const wholeSelection = subscribeTable(table.atoms.rowSelection)

  $effect(() => {
    selectedRowCaptor?.(selectedRow.current)
  })

  $effect(() => {
    wholeSelectionCaptor?.(wholeSelection.current)
  })
</script>

<output aria-label="Selected first row">{String(selectedRow.current)}</output>
<output aria-label="Whole row selection"
  >{JSON.stringify(wholeSelection.current)}</output
>

<button onclick={() => table.setRowSelection({ 1: true })}>
  Select first row
</button>
<button onclick={() => table.setRowSelection({ 1: true, 2: true })}>
  Select second row too
</button>
<button onclick={() => table.setPageSize(20)}>Set unrelated page size</button>
