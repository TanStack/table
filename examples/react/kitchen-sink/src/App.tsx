import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GroupingState,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import { makeData } from './makeData'

import styled from '@emotion/styled'
import { useSkipper } from './hooks'
import {
  columns,
  defaultColumn,
  fuzzyFilter,
  getTableMeta,
} from './tableModels'
import DebouncedInput from './components/DebouncedInput'
import Filter from './components/Filter'
import ActionButtons from './components/ActionButtons'
import { getGroupedRowModel } from '@tanstack/react-table/build/cjs/react-table/src'
import faker from '@faker-js/faker'
import TablePins from './components/TablePins'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }

    td {
      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

export const App = () => {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [data, setData] = React.useState(makeData(1000))
  const refreshData = () => setData(makeData(1000))

  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [columnPinning, setColumnPinning] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    autoResetPageIndex,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onColumnPinningChange: setColumnPinning,
    // Provide our updateData function to our table meta
    meta: getTableMeta(setData, skipAutoResetPageIndex),
    state: {
      grouping,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnPinning,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map(d => d.id))
    )
  }

  return (
    <Styles>
      <div className="p-2 grid grid-cols-4 gap-4">
        <div className="p-2">
          Search:
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            className="mx-1 p-2 font-lg shadow border border-block"
            placeholder="Search all columns..."
          />
        </div>
        <div className="p-2 inline-block border border-black shadow rounded">
          <div className="px-1 border-b border-black">
            <label>
              <input
                type="checkbox"
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
                className="mr-1"
              />
              Toggle All
            </label>
          </div>
          {table.getAllLeafColumns().map(column => {
            return (
              <div key={column.id} className="px-1">
                <label>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="mr-1"
                  />
                  {column.id}
                </label>
              </div>
            )
          })}
        </div>
        <div className="p-2">
          <button onClick={randomizeColumns} className="border rounded p-1">
            Shuffle Columns
          </button>
        </div>
      </div>
      <div className={`flex ${isSplit ? 'gap-4' : ''}`}>
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    className="relative"
                    key={header.id}
                    style={{
                      width: header.getSize(),
                    }}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div>
                          {header.column.getCanGroup() ? (
                            // If the header can be grouped, let's add a toggle
                            <button
                              onClick={header.column.getToggleGroupingHandler()}
                              style={{
                                cursor: 'pointer',
                              }}
                            >
                              {header.column.getIsGrouped()
                                ? `🛑(${header.column.getGroupedIndex()})`
                                : `👊`}
                            </button>
                          ) : null}{' '}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}{' '}
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }
                          >
                            {{
                              asc: '🔼',
                              desc: '🔽',
                            }[header.column.getIsSorted() as string] ?? '📶'}
                          </button>
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </>
                    )}
                    <div
                      className="absolute right-0 top-0 h-full w-1 bg-blue-300 select-none touch-none hover:bg-blue-500 cursor-col-resize"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                    />
                    {!header.isPlaceholder && header.column.getCanPin() && (
                      <TablePins
                        isPinned={header.column.getIsPinned()}
                        pin={header.column.pin}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
      <div className="p-2" />
      <ActionButtons
        hasNextPage={table.getCanNextPage()}
        hasPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        pageCount={table.getPageCount()}
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        previousPage={table.previousPage}
        refreshData={refreshData}
        rerender={rerender}
        setPageIndex={table.setPageIndex}
        setPageSize={table.setPageSize}
        totalRows={table.getPrePaginationRowModel().rows.length}
      />
      <div className="p-2" />
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
    </Styles>
  )
}

export default App
