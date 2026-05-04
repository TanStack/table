import { useMemo, useReducer, useState } from 'preact/hooks'
import { render } from 'preact'
import {
  columnFilteringFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type {
  Column,
  ColumnDef,
  ExpandedState,
  PreactTable,
  Row,
  RowPinningState,
} from '@tanstack/preact-table'
import './index.css'

const _features = tableFeatures({
  rowPinningFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
})

function App() {
  const rerender = useReducer(() => ({}), {})[1]

  // table states
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: [],
    bottom: [],
  })
  const [expanded, setExpanded] = useState<ExpandedState>({})

  // demo states
  const [keepPinnedRows, setKeepPinnedRows] = useState(true)
  const [includeLeafRows, setIncludeLeafRows] = useState(true)
  const [includeParentRows, setIncludeParentRows] = useState(false)
  const [copyPinnedRows, setCopyPinnedRows] = useState(false)

  const columns = useMemo<Array<ColumnDef<typeof _features, Person>>>(
    () => [
      {
        id: 'pin',
        header: () => 'Pin',
        cell: ({ row }) =>
          row.getIsPinned() ? (
            <button
              onClick={() => row.pin(false, includeLeafRows, includeParentRows)}
            >
              ❌
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() =>
                  row.pin('top', includeLeafRows, includeParentRows)
                }
              >
                ⬆️
              </button>
              <button
                onClick={() =>
                  row.pin('bottom', includeLeafRows, includeParentRows)
                }
              >
                ⬇️
              </button>
            </div>
          ),
      },
      {
        accessorKey: 'firstName',
        header: ({ table }) => (
          <>
            <button onClick={table.getToggleAllRowsExpandedHandler()}>
              {table.getIsAllRowsExpanded() ? '👇' : '👉'}
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
            <>
              {row.getCanExpand() ? (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {row.getIsExpanded() ? '👇' : '👉'}
                </button>
              ) : (
                '🔵'
              )}{' '}
              {getValue()}
            </>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: 'age',
        header: () => 'Age',
        size: 50,
      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        size: 50,
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        size: 80,
      },
    ],
    [includeLeafRows, includeParentRows],
  )

  const [data, setData] = useState(() => makeData(1_000, 2, 2))
  const refreshData = () => setData(() => makeData(1_000, 2, 2))
  const stressTest = () => setData(() => makeData(200_000, 2, 2))

  const table = useTable(
    {
      debugTable: true,
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel(filterFns),
        expandedRowModel: createExpandedRowModel(),
        paginatedRowModel: createPaginatedRowModel(),
      },
      columns,
      data,
      initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
      state: {
        expanded,
        rowPinning,
      },
      onExpandedChange: setExpanded,
      onRowPinningChange: setRowPinning,
      getSubRows: (row) => row.subRows,
      keepPinnedRows,
      debugAll: true,
    },
    (state) => state, // subscribe to all re-renders
  )

  return (
    <div className="app">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (200k rows)</button>
      </div>
      <div className="demo-root container">
        <div className="spacer-sm" />
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <table.FlexRender header={header} />
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getTopRows().map((row) => (
              <PinnedRow key={row.id} row={row} table={table} />
            ))}
            {(copyPinnedRows
              ? table.getRowModel().rows
              : table.getCenterRows()
            ).map((row) => {
              return (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {table.getBottomRows().map((row) => (
              <PinnedRow key={row.id} row={row} table={table} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="spacer-sm" />
      <div className="controls">
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <div>Page</div>
          <strong>
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.store.state.pagination.pageIndex + 1}
            onChange={(e) => {
              const page = (e.target as HTMLInputElement).value
                ? Number((e.target as HTMLInputElement).value) - 1
                : 0
              table.setPageIndex(page)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={table.store.state.pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number((e.target as HTMLSelectElement).value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="spacer-sm" />
      <hr />
      <br />
      <div className="vertical-options">
        <div>
          <input
            type="checkbox"
            checked={keepPinnedRows}
            onChange={() => setKeepPinnedRows(!keepPinnedRows)}
          />
          <label className="label-offset">
            Keep/Persist Pinned Rows across Pagination and Filtering
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={includeLeafRows}
            onChange={() => setIncludeLeafRows(!includeLeafRows)}
          />
          <label className="label-offset">
            Include Leaf Rows When Pinning Parent
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={includeParentRows}
            onChange={() => setIncludeParentRows(!includeParentRows)}
          />
          <label className="label-offset">
            Include Parent Rows When Pinning Child
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={copyPinnedRows}
            onChange={() => setCopyPinnedRows(!copyPinnedRows)}
          />
          <label className="label-offset">
            Duplicate/Keep Pinned Rows in main table
          </label>
        </div>
      </div>
      <div>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => rerender(0)}
        >
          Force Rerender
        </button>
      </div>
      <div>{JSON.stringify(rowPinning, null, 2)}</div>
    </div>
  )
}

function PinnedRow({
  row,
  table,
}: {
  row: Row<typeof _features, Person>
  table: PreactTable<typeof _features, Person>
}) {
  return (
    <tr
      style={{
        backgroundColor: 'lightblue',
        position: 'sticky',
        top:
          row.getIsPinned() === 'top'
            ? `${row.getPinnedIndex() * 26 + 48}px`
            : undefined,
        bottom:
          row.getIsPinned() === 'bottom'
            ? `${
                (table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26
              }px`
            : undefined,
      }}
    >
      {row.getAllCells().map((cell) => {
        return (
          <td key={cell.id}>
            <table.FlexRender cell={cell} />
          </td>
        )
      })}
    </tr>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof _features, Person>
  table: PreactTable<typeof _features, Person>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === 'number' ? (
    <div className="filter-row">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        onInput={(e) =>
          column.setFilterValue((old: any) => [
            (e.target as HTMLInputElement).value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="filter-input"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        onInput={(e) =>
          column.setFilterValue((old: any) => [
            old?.[0],
            (e.target as HTMLInputElement).value,
          ])
        }
        placeholder={`Max`}
        className="filter-input"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onInput={(e) =>
        column.setFilterValue((e.target as HTMLInputElement).value)
      }
      placeholder={`Search...`}
      className="filter-select"
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
