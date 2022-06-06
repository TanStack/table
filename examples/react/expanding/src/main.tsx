import React, { HTMLAttributes, HTMLProps } from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import {
  createTable,
  Column,
  TableInstance,
  ExpandedState,
  useTableInstance,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table'
import { makeData, Person } from './makeData'

let table = createTable().setRowType<Person>()

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo(
    () => [
      table.createGroup({
        header: 'Name',
        footer: props => props.column.id,
        columns: [
          table.createDataColumn('firstName', {
            header: ({ instance }) => (
              <>
                <IndeterminateCheckbox
                  {...{
                    checked: instance.getIsAllRowsSelected(),
                    indeterminate: instance.getIsSomeRowsSelected(),
                    onChange: instance.getToggleAllRowsSelectedHandler(),
                  }}
                />{' '}
                <button
                  {...{
                    onClick: instance.getToggleAllRowsExpandedHandler(),
                  }}
                >
                  {instance.getIsAllRowsExpanded() ? '👇' : '👉'}
                </button>{' '}
                First Name
              </>
            ),
            cell: ({ row, getValue }) => (
              <div
                style={{
                  // Since rows are flattened by default,
                  // we can use the row.depth property
                  // and paddingLeft to visually indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                }}
              >
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />{' '}
                {row.getCanExpand() ? (
                  <button
                    {...{
                      onClick: row.getToggleExpandedHandler(),
                      style: { cursor: 'pointer' },
                    }}
                  >
                    {row.getIsExpanded() ? '👇' : '👉'}
                  </button>
                ) : (
                  '🔵'
                )}{' '}
                {getValue()}
              </div>
            ),
            footer: props => props.column.id,
          }),
          table.createDataColumn(row => row.lastName, {
            id: 'lastName',
            cell: info => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: props => props.column.id,
          }),
        ],
      }),
      table.createGroup({
        header: 'Info',
        footer: props => props.column.id,
        columns: [
          table.createDataColumn('age', {
            header: () => 'Age',
            footer: props => props.column.id,
          }),
          table.createGroup({
            header: 'More Info',
            columns: [
              table.createDataColumn('visits', {
                header: () => <span>Visits</span>,
                footer: props => props.column.id,
              }),
              table.createDataColumn('status', {
                header: 'Status',
                footer: props => props.column.id,
              }),
              table.createDataColumn('progress', {
                header: 'Profile Progress',
                footer: props => props.column.id,
              }),
            ],
          }),
        ],
      }),
    ],
    []
  )

  const [data, setData] = React.useState(() => makeData(100, 5, 3))
  const refreshData = () => setData(() => makeData(100, 5, 3))

  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  })

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {instance.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {header.renderHeader()}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter
                              column={header.column}
                              instance={instance}
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return <td key={cell.id}>{cell.renderCell()}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => instance.setPageIndex(0)}
          disabled={!instance.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => instance.previousPage()}
          disabled={!instance.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => instance.nextPage()}
          disabled={!instance.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
          disabled={!instance.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {instance.getState().pagination.pageIndex + 1} of{' '}
            {instance.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={instance.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              instance.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={instance.getState().pagination.pageSize}
          onChange={e => {
            instance.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{instance.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(expanded, null, 2)}</pre>
    </div>
  )
}

function Filter({
  column,
  instance,
}: {
  column: Column<any>
  instance: TableInstance<any>
}) {
  const firstValue = instance
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
