<script lang="ts">
  import { createPaginatedRowModel, stockFeatures } from '@tanstack/table-core'
  import { createTable } from '../../src/createTable.svelte'
  import { createTableState } from '../../src/createTableState.svelte'
  import type { ColumnDef, PaginationState } from '@tanstack/table-core'

  type Data = { id: string; title: string }

  const features = {
    ...stockFeatures,
    paginatedRowModel: createPaginatedRowModel(),
  }
  const columns: Array<ColumnDef<typeof features, Data>> = [
    { id: 'id', accessorKey: 'id' },
    { id: 'title', accessorKey: 'title' },
  ]
  const data = Array.from({ length: 10 }, (_, index) => ({
    id: String(index),
    title: `Title ${index}`,
  }))
  const [pagination, setPagination] = createTableState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const table = createTable({
    data,
    columns,
    features,
    getRowId: (row) => row.id,
    state: {
      get pagination() {
        return pagination()
      },
    },
    onPaginationChange: setPagination,
  })
</script>

<output aria-label="Paginated row ids"
  >{table
    .getRowModel()
    .rows.map((row) => row.id)
    .join(',')}</output
>
<button onclick={() => table.setPageSize(3)}>Show three rows</button>
