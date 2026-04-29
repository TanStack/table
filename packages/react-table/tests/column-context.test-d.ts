import { globalFilteringFeature, tableFeatures, useTable } from '../src'
import type { ColumnDef } from '../src'

const _features = tableFeatures({ globalFilteringFeature })

type Person = {
  id: string
  name: string
}

const data: Person[] = [{ id: '1', name: 'Ada' }]

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'name',
    header: ({ table }) =>
      table.Subscribe({
        selector: (state) => ({ globalFilter: state.globalFilter }),
        children: null,
      }),
    cell: ({ table }) =>
      table.Subscribe({
        selector: (state) => ({ globalFilter: state.globalFilter }),
        children: null,
      }),
  },
]

function TestTable() {
  const table = useTable({
    _features,
    data,
    columns,
    state: { globalFilter: '' },
  })

  return table.Subscribe({
    selector: (state) => ({ globalFilter: state.globalFilter }),
    children: null,
  })
}

void TestTable
