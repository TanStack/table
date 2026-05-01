import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  FlexRender,
  columnSizingFeature,
  createTableHook,
} from '@tanstack/react-table'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { makeData } from './makeData'
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import type { CSSProperties } from 'react'
import type { Person } from './makeData'
import type { Row } from '@tanstack/react-table'
import './index.css'

const { appFeatures, useAppTable, createAppColumnHelper } = createTableHook({
  _features: { columnSizingFeature },
  _rowModels: {},
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

const columnHelper = createAppColumnHelper<Person>()

// Cell Component
const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button {...attributes} {...listeners}>
      🟰
    </button>
  )
}

// Row Component
const DraggableRow = ({ row }: { row: Row<typeof appFeatures, Person> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.userId,
  })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  }
  return (
    // connect row ref to dnd-kit, apply important styles
    <tr ref={setNodeRef} style={style}>
      {row.getAllCells().map((cell) => (
        <td key={cell.id} style={{ width: cell.column.getSize() }}>
          <FlexRender cell={cell} />
        </td>
      ))}
    </tr>
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
          cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
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

  const dataIds = React.useMemo<Array<UniqueIdentifier>>(
    () => data.map(({ userId }) => userId),
    [data],
  )

  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const table = useAppTable(
    {
      debugTable: true,
      columns,
      data,
      getRowId: (row) => row.userId, // required because row indexes will change
    },
    (state) => state,
  )

  // reorder rows after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex) // this is just a splice util
      })
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  return (
    // NOTE: This provider creates div elements, so don't nest inside of <table> elements
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
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
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </tbody>
        </table>
        <table.Subscribe selector={(state) => state}>
          {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
        </table.Subscribe>
      </div>
    </DndContext>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
