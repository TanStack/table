/** @jsxImportSource octane */
import { createAtom } from '@tanstack/octane-store'
import {
  Subscribe,
  createTableHook,
  createTableHookContexts,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'
import { Subscribe as SidecarSubscribe } from '../../src/Subscribe.tsrx'
import { createTableHook as sidecarCreateTableHook } from '../../src/createTableHook.tsrx'
import { useTable as sidecarUseTable } from '../../src/useTable.tsrx'
import type {
  ColumnDef,
  RowSelectionState,
  TableState,
} from '@tanstack/octane-table'

// @ts-expect-error Octane intentionally has no legacy adapter subpath.
type LegacyAdapter = typeof import('@tanstack/octane-table/legacy')

type Row = { id: string; label: string }
const features = tableFeatures({ rowSelectionFeature })
const columns: Array<ColumnDef<typeof features, Row>> = [
  { accessorKey: 'label' },
]
const externalSelection = createAtom<RowSelectionState>({})

function RegisteredCell({ prefix }: { prefix: string }) {
  return <span>{prefix}</span>
}

const contexts = createTableHookContexts<typeof features, Row>()
const app = createTableHook({
  features,
  ...contexts,
  cellComponents: { RegisteredCell },
})

const helper = app.createAppColumnHelper<Row>()
helper.accessor('label', {
  cell: ({ cell }) => <cell.RegisteredCell prefix="value" />,
})

export function PublicTypeFixture() {
  const table = useTable(
    {
      features,
      columns,
      data: [{ id: '1', label: 'One' }],
      atoms: { rowSelection: externalSelection },
    },
    (state) => ({
      selected: state.rowSelection,
    }),
  )

  const selected: RowSelectionState = table.state.selected
  const fullState: TableState<typeof features> = table.store.get()
  void selected
  void fullState

  return (
    <div>
      <Subscribe
        source={externalSelection}
        children={(selection) => {
          const typed: RowSelectionState = selection
          return <span>{String(Object.keys(typed).length)}</span>
        }}
      />
      <Subscribe
        source={externalSelection}
        selector={(selection) => Boolean(selection['1'])}
        children={(selectedValue) => {
          const typed: boolean = selectedValue
          return <span>{String(typed)}</span>
        }}
      />
    </div>
  )
}

const invalidSubscribe = (
  // @ts-expect-error Identity subscriptions pass RowSelectionState to children.
  <Subscribe
    source={externalSelection}
    children={(value: number) => <span>{String(value)}</span>}
  />
)

const checkedUseTable: typeof useTable = sidecarUseTable
const checkedSubscribe: typeof Subscribe = SidecarSubscribe
const checkedFactory: typeof createTableHook = sidecarCreateTableHook
void checkedUseTable
void checkedSubscribe
void checkedFactory
void invalidSubscribe
void (null as LegacyAdapter | null)
