import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  FlexRender,
  columnOrderingFeature,
  columnSizingFeature,
  createTableHook,
} from '@tanstack/react-table'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from '@dnd-kit/helpers'
import { RestrictToHorizontalAxis } from '@dnd-kit/abstract/modifiers'
import { makeData } from './makeData'
import type { CSSProperties } from 'react'
import type { Person } from './makeData'
import type { Cell, Header } from '@tanstack/react-table'
import './index.css'

const { appFeatures, useAppTable, createAppColumnHelper } = createTableHook({
  features: { columnOrderingFeature, columnSizingFeature },
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

const columnHelper = createAppColumnHelper<Person>()

const DraggableTableHeader = ({
  header,
  index,
}: {
  header: Header<typeof appFeatures, Person, unknown>
  index: number
}) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: header.column.id,
    index,
  })

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
  }

  return (
    <th colSpan={header.colSpan} ref={ref} style={style}>
      {header.isPlaceholder ? null : <FlexRender header={header} />}
      <button ref={handleRef}>🟰</button>
    </th>
  )
}

const BodyCell = ({
  cell,
}: {
  cell: Cell<typeof appFeatures, Person, unknown>
}) => {
  return (
    <td style={{ position: 'relative', width: cell.column.getSize() }}>
      <FlexRender cell={cell} />
    </td>
  )
}

function App() {
  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          id: 'firstName',
          size: 150,
        }),
        columnHelper.accessor((row) => row.lastName, {
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          id: 'lastName',
          size: 150,
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          id: 'age',
          size: 120,
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          id: 'visits',
          size: 120,
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          id: 'status',
          size: 150,
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          id: 'progress',
          size: 180,
        }),
      ]),
    [],
  )

  const [data, setData] = React.useState(() => makeData(20))

  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const table = useAppTable(
    {
      columns,
      data,
      initialState: {
        columnOrder: columns.map((c) => c.id!),
      }, // establish the initial DnD column order once
      // atoms: { columnOrder: columnOrderAtom }, // preferred: own ordering state with an external atom
      // state: { columnOrder }, // classic controlled state; pair with onColumnOrderChange
      // onColumnOrderChange: setColumnOrder,
      debugTable: true,
    },
    (state) => state, // default selector
  )

  return (
    <DragDropProvider
      modifiers={[RestrictToHorizontalAxis]}
      onDragEnd={(event) => {
        if (event.canceled) return // dropped with Escape, so do nothing
        // reorder columns after drag & drop
        table.setColumnOrder((prevColumnOrder) => move(prevColumnOrder, event))
      }}
    >
      <div className="demo-root">
        <div className="spacer-md" />
        <div className="button-row">
          <button
            onClick={() => refreshData()}
            className="demo-button demo-button-sm"
          >
            Regenerate Data
          </button>
          <button
            onClick={() => stressTest()}
            className="demo-button demo-button-sm"
          >
            Stress Test (1k rows)
          </button>
        </div>
        <div className="spacer-md" />
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <DraggableTableHeader
                    key={header.id}
                    header={header}
                    index={index}
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => (
                  <BodyCell key={cell.id} cell={cell} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <pre data-testid="table-state">
          {JSON.stringify(table.state, null, 2)}
        </pre>
      </div>
    </DragDropProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
