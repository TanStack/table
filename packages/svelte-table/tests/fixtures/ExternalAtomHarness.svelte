<script lang="ts">
  import { untrack } from 'svelte'
  import { createTable, stockFeatures } from '../../src'
  import type { Atom, RowSelectionState } from '../../src'

  interface Props {
    rowSelectionAtom: Atom<RowSelectionState>
  }

  let { rowSelectionAtom }: Props = $props()
  const externalSelectionAtom = untrack(() => rowSelectionAtom)

  const table = createTable({
    data: [{ id: '1' }, { id: '2' }],
    columns: [{ id: 'id', accessorKey: 'id' }],
    features: stockFeatures,
    getRowId: (row) => row.id,
    atoms: {
      rowSelection: externalSelectionAtom,
    },
  })

  const selection = $derived(table.atoms.rowSelection.get())
  const storeSelection = $derived(table.store.get().rowSelection)
</script>

<output aria-label="Foreign atom selection">{JSON.stringify(selection)}</output>
<output aria-label="Foreign store selection">
  {JSON.stringify(storeSelection)}
</output>
