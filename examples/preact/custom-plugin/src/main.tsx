import { useMemo, useState } from 'preact/hooks'
import { render } from 'preact'
import './index.css'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  functionalUpdate,
  makeStateUpdater,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type {
  Column,
  OnChangeFn,
  PreactTable,
  TableFeature,
  Updater,
} from '@tanstack/preact-table'
import type { Person } from './makeData'

// TypeScript setup for our new feature with all of the same type-safety as stock TanStack Table features

// define types for our new feature's custom state
export type DensityState = 'sm' | 'md' | 'lg'
export interface TableState_Density {
  density: DensityState
}

// define types for our new feature's table options
export interface TableOptions_Density {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// Define types for our new feature's table APIs
export interface Table_Density {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}

interface DensityPluginConstructors {
  Table: Table_Density
  TableOptions: TableOptions_Density
  TableState: TableState_Density
}

// Here is all of the actual javascript code for our new feature
export const densityPlugin: TableFeature<DensityPluginConstructors> = {
  // define the new feature's initial state
  getInitialState: (initialState) => {
    return {
      density: 'md',
      ...initialState, // must come last
    }
  },

  // define the new feature's default options
  getDefaultTableOptions: (table) => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    }
  },
  // if you need to add a default column definition...
  // getDefaultColumnDef: () => {},

  // define the new feature's table instance methods
  constructTableAPIs: (table) => {
    table.setDensity = (updater) => {
      const safeUpdater: Updater<DensityState> = (old) => {
        const newState = functionalUpdate(updater, old)
        return newState
      }
      return table.options.onDensityChange?.(safeUpdater)
    }
    table.toggleDensity = (value) => {
      table.setDensity?.((old) => {
        if (value) return value
        return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg' // cycle through the 3 options
      })
    }
  },

  // if you need to add row instance APIs...
  // constructRowAPIs: (row) => {},

  // if you need to add cell instance APIs...
  // constructCellAPIs: (cell) => {},

  // if you need to add column instance APIs...
  // constructColumnAPIs: (column) => {},

  // if you need to add header instance APIs...
  // constructHeaderAPIs: (header) => {},
}
// end of custom feature code

// app code
const _features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  densityPlugin, // pass in our plugin just like any other stock feature
})

const columnHelper = createColumnHelper<typeof _features, Person>()

function App() {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
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
      ]),
    [],
  )

  const [data, setData] = useState(() => makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(100_000))
  const [density, setDensity] = useState<DensityState>('md')

  const table = useTable({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(sortFns),
    },
    columns,
    data,
    debugTable: true,
    state: {
      density, // passing the density state to the table, TS is still happy :)
    },
    onDensityChange: setDensity, // using the new onDensityChange option, TS is still happy :)
  })

  return (
    <div className="p-2">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <div className="h-2" />
      <button
        onClick={() => table.toggleDensity()}
        className="border rounded p-1 bg-blue-500 text-white mb-2 w-64"
      >
        Toggle Density
      </button>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      // using our new feature
                      padding:
                        density === 'sm'
                          ? '4px'
                          : density === 'md'
                            ? '8px'
                            : '16px',
                      transition: 'padding 0.2s',
                    }}
                  >
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <table.FlexRender header={header} />
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div>
                        <Filter column={header.column} table={table} />
                      </div>
                    ) : null}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        // using our new feature
                        padding:
                          density === 'sm'
                            ? '4px'
                            : density === 'md'
                              ? '8px'
                              : '16px',
                        transition: 'padding 0.2s',
                      }}
                    >
                      <table.FlexRender cell={cell} />
                    </td>
                  )
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
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.store.state.pagination.pageIndex + 1}
            onChange={(e) => {
              const page = (e.target as HTMLInputElement).value
                ? Number((e.target as HTMLInputElement).value) - 1
                : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.store.state.pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number((e.target as HTMLInputElement).value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <table.Subscribe selector={(state) => state}>
        {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
      </table.Subscribe>
    </div>
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

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number] | undefined)?.[0]}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            (e.target as HTMLInputElement).value,
            old[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number] | undefined)?.[1]}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old[0],
            (e.target as HTMLInputElement).value,
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
      onChange={(e) =>
        column.setFilterValue((e.target as HTMLInputElement).value)
      }
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
