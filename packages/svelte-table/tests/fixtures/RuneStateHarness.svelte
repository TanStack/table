<script lang="ts">
  import { stockFeatures } from '@tanstack/table-core'
  import { createTable } from '../../src/createTable.svelte'
  import type { RowSelectionState, TableState } from '@tanstack/table-core'

  interface Props {
    selectedRowCaptor?: (selected: boolean) => void
    selectionCaptor?: (selection: RowSelectionState) => void
    stateCaptor?: (state: TableState<typeof stockFeatures>) => void
  }

  let { selectedRowCaptor, selectionCaptor, stateCaptor }: Props = $props()

  const table = createTable({
    data: [{ id: '1' }, { id: '2' }],
    columns: [{ id: 'id', accessorKey: 'id' }],
    features: stockFeatures,
    getRowId: (row) => row.id,
  })

  const selectedRow = $derived(Boolean(table.atoms.rowSelection.get()['1']))
  const selection = $derived(table.atoms.rowSelection.get())
  const state = $derived(table.store.get())

  $effect(() => {
    selectedRowCaptor?.(selectedRow)
  })

  $effect(() => {
    selectionCaptor?.(selection)
  })

  $effect(() => {
    stateCaptor?.(state)
  })
</script>

<output aria-label="Selected first row">{String(selectedRow)}</output>
<output aria-label="Whole row selection">{JSON.stringify(selection)}</output>
<output aria-label="Whole table state">{JSON.stringify(state)}</output>

<button onclick={() => table.setRowSelection({ 1: true })}>
  Select first row
</button>
<button onclick={() => table.setRowSelection({ 1: true, 2: true })}>
  Select second row too
</button>
<button onclick={() => table.setPageSize(20)}>Set unrelated page size</button>
<button onclick={() => table.setRowSelection(selection)}>
  Publish same selection
</button>
