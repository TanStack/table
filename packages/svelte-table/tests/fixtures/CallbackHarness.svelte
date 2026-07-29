<script lang="ts">
  import { untrack } from 'svelte'
  import { stockFeatures } from '@tanstack/table-core'
  import { createTable } from '../../src/createTable.svelte'
  import type { OnChangeFn, RowSelectionState } from '@tanstack/table-core'

  type Data = { id: string }

  interface Props {
    firstHandler: OnChangeFn<RowSelectionState>
    secondHandler: OnChangeFn<RowSelectionState>
  }

  let { firstHandler, secondHandler }: Props = $props()
  let currentHandler = $state<OnChangeFn<RowSelectionState>>(
    untrack(() => firstHandler),
  )
  const table = createTable({
    data: [{ id: '1' }],
    columns: [{ id: 'id', accessorKey: 'id' }],
    features: stockFeatures,
    getRowId: (row: Data) => row.id,
    get onRowSelectionChange() {
      return currentHandler
    },
  })
</script>

<button onclick={() => (currentHandler = secondHandler)}>
  Use second selection handler
</button>
<button onclick={() => table.toggleAllRowsSelected(true)}>
  Toggle all rows selected
</button>
