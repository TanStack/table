import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

// const tableWorker = new Worker(new URL('./tableWorker', import.meta.url), {
//   type: 'module',
// })

// console.log(tableWorker)

// tableWorker.postMessage(['hello', { foo: 'world' }])

import {
  Column,
  createTable,
  TableInstance,
  useTableInstance,
  ColumnFiltersState,
  //
  getPaginationRowModel,
  getCoreRowModel,
} from '@tanstack/react-table'

import { makeData, Person } from './makeData'
import { TableWorker } from './tableWorker'

let table = createTable().setRowType<Person>()

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns = React.useMemo(
    () => [
      table.createGroup({
        header: 'Name',
        footer: props => props.column.id,
        columns: [
          table.createDataColumn('firstName', {
            cell: info => info.getValue(),
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

  const [data, setData] = React.useState(() => makeData(500000))
  const refreshData = () => setData(old => makeData(500000))

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: tableWorker.getFilteredRowModel(),
    // getFacetedRowModel: tableWorker.getFacetedRowModel(),
    // getFacetedUniqueValues: tableWorker.getFacetedUniqueValues(),
    // getFacetedMinMaxValues: tableWorker.getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
    // keepPreviousData: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <div className="p-2">
      <div>
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {instance.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        {header.renderHeader()}
                        {/* {header.column.getCanFilter() ? (
                          <div>
                            <Filter
                              column={header.column}
                              instance={instance}
                            />
                          </div>
                        ) : null} */}
                      </>
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
        <div>{instance.getCoreRowModel().rows.length} Rows</div>
        {/* {instance.getOverallProgress() < 1 ? (
          <>
            <div>
              -{' '}
              {
                {
                  coreRowModel: 'Loading Data',
                  filteredRowModel: 'Filtering',
                  facetedRowModel: 'Faceting',
                }[instance.getProgressStage()!]
              }
            </div>
            <div>
              <div className="w-48 bg-gray-300 rounded-sm">
                <div
                  className="h-2 bg-green-400 rounded-sm"
                  style={{
                    width: `${instance.getOverallProgress() * 100}%`,
                  }}
                />
              </div>
            </div>
          </>
        ) : null} */}
      </div>
      <div className="h-2" />
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(instance.getState(), null, 2)}</pre>
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

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <input
          type="number"
          // min={Number(column.getFacetedMinMaxValues()[0] ?? '')}
          // max={Number(column.getFacetedMinMaxValues()[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={e =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          // placeholder={`Min ${
          //   column.getFacetedMinMaxValues()[0]
          //     ? `(${column.getFacetedMinMaxValues()[0]})`
          //     : ''
          // }`}
          className="w-24 border shadow rounded"
        />
        <input
          type="number"
          // min={Number(column.getFacetedMinMaxValues()[0] ?? '')}
          // max={Number(column.getFacetedMinMaxValues()[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={e =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          // placeholder={`Max ${
          //   column.getFacetedMinMaxValues()[1]
          //     ? `(${column.getFacetedMinMaxValues()[1]})`
          //     : ''
          // }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
      {/* <div className="w-full bg-gray-300 rounded-sm">
        <div
          className="h-[2px] bg-green-400 rounded-sm"
          style={{
            width: `${
              instance.getState().facetProgress[`${column.id}_minMaxValues`]! *
              100
            }%`,
          }}
        />
      </div> */}
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.map(value => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={e => column.setFilterValue(e.target.value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
      {/* <div className="w-full bg-gray-300 rounded-sm">
        <div
          className="h-[2px] bg-green-400 rounded-sm"
          style={{
            width: `${
              instance.getState().facetProgress[`${column.id}_uniqueValues`]! *
              100
            }%`,
          }}
        />
      </div> */}
    </>
  )
}

const strictMode = false
const StrictWrapper = strictMode ? React.StrictMode : React.Fragment

ReactDOM.render(
  <StrictWrapper>
    <App />
  </StrictWrapper>,
  document.getElementById('root')
)
