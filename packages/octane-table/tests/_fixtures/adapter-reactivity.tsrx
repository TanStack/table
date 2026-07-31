import { createAtom } from '@tanstack/octane-store'
import {
  Subscribe,
  stockFeatures,
  useTable,
} from '@tanstack/octane-table'
import {
  Suspense,
  use,
  useState,
} from 'octane'
import type {
  ColumnDef,
  OctaneTable,
  PaginationState,
  RowSelectionState,
} from '@tanstack/octane-table'

type Data = { id: string; title: string }

const data: Array<Data> = [
  { id: '1', title: 'First' },
  { id: '2', title: 'Second' },
]
const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
  { id: 'id', accessorKey: 'id', header: 'Id' },
  { id: 'title', accessorKey: 'title', header: 'Title' },
]

type TableInstance = OctaneTable<typeof stockFeatures, Data, null>

export const phaseCapture: {
  table?: TableInstance
  rendering: boolean
  renders: number
  notifications: Array<{ duringRender: boolean; pageIndex: number }>
} = {
  rendering: false,
  renders: 0,
  notifications: [],
}

export function PhaseHarness() @{
  phaseCapture.rendering = true
  phaseCapture.renders++
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1,
  })
  const table = useTable(
    {
      features: stockFeatures,
      data,
      columns,
      state: { pagination },
      onPaginationChange: setPagination,
    },
    () => null,
  )
  phaseCapture.table = table
  phaseCapture.rendering = false

  <div>
    <output id="phase-page">{String(pagination.pageIndex)}</output>
    <table.Subscribe selector={(state) => state.pagination.pageIndex}>
      {(pageIndex: number) => <output id="phase-island">{String(pageIndex)}</output>}
    </table.Subscribe>
    <button id="phase-next" onClick={() => table.nextPage()}>Next</button>
  </div>
}

export const externalSelectionAtom = createAtom<RowSelectionState>({
  external: true,
})
export const externalCapture: { table?: TableInstance } = {}

export function ExternalAtomHarness() @{
  const table = useTable(
    {
      features: stockFeatures,
      data,
      columns,
      state: { rowSelection: { controlled: true } },
      atoms: { rowSelection: externalSelectionAtom },
    },
    () => null,
  )
  externalCapture.table = table

  <div>
    <table.Subscribe source={table.atoms.rowSelection}>
      {(selection: RowSelectionState) => <output id="external-selection">
        {JSON.stringify(selection)}
      </output>}
    </table.Subscribe>
    <button
      id="external-write"
      onClick={() => table.setRowSelection({ written: true })}
    >
      Write
    </button>
  </div>
}

export const sourceA = createAtom({ value: 'A0' })
export const sourceB = createAtom({ value: 'B0' })
export const sourceCapture = { renders: 0 }

export function SourceSwitchHarness() @{
  const [useB, setUseB] = useState(false)
  const source = useB ? sourceB : sourceA

  <div>
    <Subscribe source={source}>
      {(value: { value: string }) => {
        sourceCapture.renders++
        return <output id="source-value">{value.value}</output>
      }}
    </Subscribe>
    <button id="switch-source" onClick={() => setUseB(true)}>Switch</button>
  </div>
}

const never = new Promise<void>(() => {})
export const suspendedCapture: {
  table?: TableInstance
  setPagination?: (state: PaginationState) => void
} = {}

function SuspendingOwner() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1,
  })
  const table = useTable(
    {
      features: stockFeatures,
      data,
      columns,
      state: { pagination },
      onPaginationChange: setPagination,
    },
    () => null,
  )
  suspendedCapture.table = table
  suspendedCapture.setPagination = setPagination

  if (pagination.pageIndex === 1) use(never)

  return <output id="accepted-page">{String(pagination.pageIndex)}</output>
}

export function SuspenseHarness() @{
  <Suspense fallback={<output id="suspended">Suspended</output>}>
    <SuspendingOwner />
  </Suspense>
}

export const ownershipCapture: { table?: TableInstance } = {}

export function OwnershipHarness() @{
  const [controlled, setControlled] = useState(true)
  const pagination: PaginationState = { pageIndex: 2, pageSize: 1 }
  const table = useTable(
    {
      features: stockFeatures,
      data,
      columns,
      state: controlled ? { pagination } : {},
    },
    () => null,
  )
  ownershipCapture.table = table

  <div>
    <table.Subscribe selector={(state) => state.pagination.pageIndex}>
      {(pageIndex: number) => <output id="ownership-page">{String(pageIndex)}</output>}
    </table.Subscribe>
    <button id="release" onClick={() => setControlled(false)}>Release</button>
    <button id="set-internal" onClick={() => table.setPageIndex(4)}>Set internal</button>
    <button id="reacquire" onClick={() => setControlled(true)}>Reacquire</button>
  </div>
}
