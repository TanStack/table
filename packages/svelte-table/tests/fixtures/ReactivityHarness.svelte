<script lang="ts">
  import { untrack } from 'svelte'
  import { createPaginatedRowModel, stockFeatures } from '@tanstack/table-core'
  import { createTable } from '../../src/createTable.svelte'
  import type { Atom } from '@tanstack/svelte-store'
  import type { ColumnDef, RowSelectionState } from '@tanstack/table-core'

  type Data = { id: string; title: string }

  type Snapshot = {
    canSelect: boolean
    columnIds: Array<string>
    rowIds: Array<string>
    values: Array<unknown>
  }

  interface Props {
    externalRowSelection?: Atom<RowSelectionState>
    selectionCaptor?: (selection: RowSelectionState) => void
    snapshotCaptor?: (snapshot: Snapshot) => void
  }

  let { externalRowSelection, selectionCaptor, snapshotCaptor }: Props =
    $props()
  const externalSelectionAtom = untrack(() => externalRowSelection)

  const features = {
    ...stockFeatures,
    paginatedRowModel: createPaginatedRowModel(),
  }
  const idColumn: ColumnDef<typeof features, Data> = {
    id: 'id',
    accessorKey: 'id',
  }
  const titleColumn: ColumnDef<typeof features, Data> = {
    id: 'title',
    accessorKey: 'title',
  }

  let data = $state<Array<Data>>([
    { id: '1', title: 'One' },
    { id: '2', title: 'Two' },
  ])
  let columns = $state<Array<ColumnDef<typeof features, Data>>>([idColumn])
  let enableRowSelection = $state(true)
  let controlledState = $state<{ rowSelection?: RowSelectionState }>({
    rowSelection: { 1: true },
  })
  const table = createTable({
    get data() {
      return data
    },
    get columns() {
      return columns
    },
    features,
    getRowId: (row) => row.id,
    get enableRowSelection() {
      return enableRowSelection
    },
    get state() {
      return controlledState
    },
    atoms: externalSelectionAtom
      ? { rowSelection: externalSelectionAtom }
      : undefined,
  })
  const selection = $derived(table.atoms.rowSelection.get())

  $effect(() => {
    selectionCaptor?.(selection)
  })

  $effect(() => {
    const row = table.getRowModel().rows[0]
    snapshotCaptor?.({
      canSelect: row?.getCanSelect() ?? false,
      columnIds: table.getAllLeafColumns().map((column) => column.id),
      rowIds: table.getRowModel().rows.map((currentRow) => currentRow.id),
      values: row?.getAllCells().map((cell) => cell.getValue()) ?? [],
    })
  })

  function controlBothRows() {
    controlledState = { rowSelection: { 1: true, 2: true } }
  }

  function rapidOptionUpdate() {
    data = [{ id: '3', title: 'Intermediate' }]
    columns = [idColumn, titleColumn]
    enableRowSelection = false
    data = [{ id: '4', title: 'Final' }]
    columns = [titleColumn]
  }
</script>

<output aria-label="Selected rows">{JSON.stringify(selection)}</output>
<output aria-label="Row ids"
  >{table
    .getRowModel()
    .rows.map((row) => row.id)
    .join(',')}</output
>
<output aria-label="Column ids"
  >{table
    .getAllLeafColumns()
    .map((column) => column.id)
    .join(',')}</output
>
<output aria-label="First row values"
  >{table
    .getRowModel()
    .rows[0]?.getAllCells()
    .map((cell) => cell.getValue())
    .join(',') ?? ''}</output
>
<output aria-label="First row can be selected"
  >{String(table.getRowModel().rows[0]?.getCanSelect() ?? false)}</output
>

<button onclick={() => table.setRowSelection({ 2: true })}>
  Select second row
</button>
<button onclick={controlBothRows}>Control both rows</button>
<button onclick={rapidOptionUpdate}>Publish rapid option updates</button>
