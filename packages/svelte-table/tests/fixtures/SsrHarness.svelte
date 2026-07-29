<script lang="ts">
  import { stockFeatures } from '@tanstack/table-core'
  import { createTable } from '../../src/createTable.svelte'
  import FlexRender from '../../src/FlexRender.svelte'
  import type { ColumnDef } from '@tanstack/table-core'

  type Data = { id: string; name: string }

  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    {
      id: 'name',
      accessorKey: 'name',
      cell: ({ getValue }) => `cell:${getValue()}`,
    },
  ]
  const table = createTable({
    data: [{ id: '1', name: 'Ada' }],
    columns,
    features: stockFeatures,
    getRowId: (row) => row.id,
    initialState: {
      rowSelection: { 1: true },
    },
  })
  const cell = table.getRowModel().rows[0]!.getAllCells()[0]!
  const aggregatedCell = {
    column: {
      columnDef: {
        cell: (context: { value: string }) => `cell:${context.value}`,
        aggregatedCell: (context: { value: string }) =>
          `aggregate:${context.value}`,
      },
    },
    getContext: () => ({ value: 'Ada' }),
    getIsAggregated: () => true,
  }
  const placeholderCell = {
    column: {
      columnDef: {
        cell: () => 'should-not-render',
      },
    },
    getContext: () => ({ value: 'Ada' }),
    getIsPlaceholder: () => true,
  }
</script>

<output aria-label="Server selected rows"
  >{JSON.stringify(table.state.rowSelection)}</output
>
<output aria-label="Server cell"><FlexRender {cell} /></output>
<output aria-label="Server aggregate"
  ><FlexRender cell={aggregatedCell as any} /></output
>
<output aria-label="Server placeholder"
  ><FlexRender cell={placeholderCell as any} /></output
>
