import React, { Fragment } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createColumnHelper,
  createExpandedRowModel,
  rowExpandingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type {
  ColumnDef,
  Row,
  RowData,
  TableFeatures,
} from '@tanstack/react-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  rowExpandingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: 'pointer' }}
        >
          {row.getIsExpanded() ? '👇' : '👉'}
        </button>
      ) : (
        '🔵'
      )
    },
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: ({ row, getValue }) => (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        {getValue<string>()}
      </div>
    ),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  }),
])

type TableProps<TFeatures extends TableFeatures, TData extends RowData> = {
  data: Array<TData>
  columns: Array<ColumnDef<TFeatures, TData>>
  renderSubComponent: (props: {
    row: Row<TFeatures, TData>
  }) => React.ReactElement
  getRowCanExpand: (row: Row<TFeatures, TData>) => boolean
}

function Table({
  columns,
  data,
  getRowCanExpand,
  renderSubComponent,
}: TableProps<typeof _features, Person>): React.JSX.Element {
  const table = useTable({
    debugTable: true,
    _features,
    _rowModels: {
      expandedRowModel: createExpandedRowModel(),
    },
    columns,
    data,
    getRowCanExpand,
  })

  return (
    <table.Subscribe selector={(state) => state}>
      {() => (
        <div className="p-2">
          <div className="h-2" />
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div>
                            <table.FlexRender header={header} />
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Fragment key={row.id}>
                    <tr>
                      {/* first row is a normal row */}
                      {row.getAllCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            <table.FlexRender cell={cell} />
                          </td>
                        )
                      })}
                    </tr>
                    {row.getIsExpanded() && (
                      <tr>
                        {/* 2nd row is a custom 1 cell row */}
                        <td colSpan={row.getAllCells().length}>
                          {renderSubComponent({ row })}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
          <div className="h-2" />
          <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
        </div>
      )}
    </table.Subscribe>
  )
}

const renderSubComponent = ({
  row,
}: {
  row: Row<typeof _features, Person>
}) => {
  return (
    <pre style={{ fontSize: '10px' }}>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre>
  )
}

function App() {
  const [data, setData] = React.useState(() => makeData(10))
  const refreshData = () => setData(makeData(10))
  const stressTest = () => setData(makeData(1_000))

  return (
    <div className="p-2">
      <div>
        <button onClick={() => refreshData()} className="border p-2">
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} className="border p-2">
          Stress Test (1k rows)
        </button>
      </div>
      <Table
        columns={columns}
        data={data}
        getRowCanExpand={() => true}
        renderSubComponent={renderSubComponent}
      />
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
