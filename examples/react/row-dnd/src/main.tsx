import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  FlexRender,
  columnSizingFeature,
  createTableHook,
} from '@tanstack/react-table'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from '@dnd-kit/helpers'
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { makeData } from './makeData'
import type { CSSProperties } from 'react'
import type { Person } from './makeData'
import type { Row } from '@tanstack/react-table'
import './index.css'

const { appFeatures, useAppTable, createAppColumnHelper } = createTableHook({
  features: { columnSizingFeature },
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

const columnHelper = createAppColumnHelper<Person>()

// Lets the drag handle (rendered inside a cell) reach the row's handleRef
const RowHandleContext = React.createContext<
  ((element: Element | null) => void) | undefined
>(undefined)

// Cell Component
const RowDragHandleCell = () => {
  const handleRef = React.useContext(RowHandleContext)
  return (
    // Alternatively, you could make the whole row the handle by using ref only
    <button ref={handleRef}>🟰</button>
  )
}

// Row Component
const DraggableRow = ({
  row,
  index,
}: {
  row: Row<typeof appFeatures, Person>
  index: number
}) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: row.original.userId,
    index,
  })

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
  }
  return (
    // connect row ref to dnd-kit
    <RowHandleContext.Provider value={handleRef}>
      <tr ref={ref} style={style}>
        {row.getAllCells().map((cell) => (
          <td key={cell.id} style={{ width: cell.column.getSize() }}>
            <FlexRender cell={cell} />
          </td>
        ))}
      </tr>
    </RowHandleContext.Provider>
  )
}

// Table Component
function App() {
  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        // Create a dedicated drag handle column. Alternatively, you could just set up dnd events on the rows themselves.
        columnHelper.display({
          id: 'drag-handle',
          header: 'Move',
          cell: () => <RowDragHandleCell />,
          size: 60,
        }),
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          id: 'firstName',
        }),
        columnHelper.accessor((row) => row.lastName, {
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          id: 'lastName',
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          id: 'age',
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          id: 'visits',
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          id: 'status',
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          id: 'progress',
        }),
      ]),
    [],
  )
  const [data, setData] = React.useState(() => makeData(20))

  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const table = useAppTable(
    {
      debugTable: true,
      columns,
      data,
      getRowId: (row) => row.userId, // required because row indexes will change
    },
    (state) => state, // default selector
  )

  return (
    <DragDropProvider
      modifiers={[RestrictToVerticalAxis]}
      onDragEnd={(event) => {
        if (event.canceled) return // dropped with Escape, so do nothing
        // reorder rows after drag & drop
        setData((prevData) => move(prevData, event))
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
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <DraggableRow key={row.id} row={row} index={index} />
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