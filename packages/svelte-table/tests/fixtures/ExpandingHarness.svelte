<script lang="ts">
  import { createExpandedRowModel, stockFeatures } from '@tanstack/table-core'
  import { createTable } from '../../src/createTable.svelte'
  import { createTableState } from '../../src/createTableState.svelte'
  import type { ColumnDef, ExpandedState } from '@tanstack/table-core'

  type Data = { id: string }

  const features = {
    ...stockFeatures,
    expandedRowModel: createExpandedRowModel(),
  }
  const columns: Array<ColumnDef<typeof features, Data>> = [
    { id: 'id', accessorKey: 'id' },
  ]
  const data = [{ id: '1' }, { id: '2' }]
  const [expanded, setExpanded] = createTableState<ExpandedState>({})
  const table = createTable({
    data,
    columns,
    features,
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
    state: {
      get expanded() {
        return expanded()
      },
    },
    onExpandedChange: setExpanded,
  })
</script>

<output aria-label="Expanded row ids"
  >{table
    .getRowModel()
    .rows.filter((row) => row.getIsExpanded())
    .map((row) => row.id)
    .join(',')}</output
>
<button onclick={() => table.getRow('1').toggleExpanded()}>
  Expand first row
</button>
