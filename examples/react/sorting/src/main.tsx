import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type { SortFn } from '@tanstack/react-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

// custom sorting logic for one of our enum columns
const sortStatusFn: SortFn<any, any> = (rowA, rowB, _columnId) => {
  const statusA = rowA.original.status
  const statusB = rowB.original.status
  const statusOrder = ['single', 'complicated', 'relationship']
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
}

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          // this column will sort in ascending order by default since it is a string column
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          sortUndefined: 'last', // force undefined values to the end
          sortDescFirst: false, // first sort order will be ascending (nullable values can mess up auto detection of sort order)
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          // this column will sort in descending order by default since it is a number column
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          sortUndefined: 'last', // force undefined values to the end
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          sortFn: sortStatusFn, // use our custom sorting function for this enum column
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          // enableSorting: false, //disable sorting for this column
        }),
        columnHelper.accessor('rank', {
          header: 'Rank',
          invertSorting: true, // invert the sorting order (golf score-like where smaller is better)
        }),
        columnHelper.accessor('createdAt', {
          header: 'Created At',
          // sortFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
        }),
      ]),
    [],
  )

  const [data, setData] = React.useState(() => makeData(1_000))
  const refreshData = () => setData(() => makeData(100_000)) // stress test with 100k rows

  const table = useTable(
    {
      _features,
      _rowModels: {
        sortedRowModel: createSortedRowModel(sortFns), // client-side sorting
      },
      columns,
      data,
      debugTable: true,
      // no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
      // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
      // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
      // enableSorting: false, // - default on/true
      // enableSortingRemoval: false, //Don't allow - default on/true
      // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
      // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
    },
    // (state) => state, // uncomment to subscribe to the entire table state (this is how v8 used to work by default)
  )

  return (
    <table.Subscribe selector={(state) => ({ sorting: state.sorting })}>
      {(_state) => (
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
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                            title={
                              header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === 'asc'
                                  ? 'Sort ascending'
                                  : header.column.getNextSortingOrder() ===
                                      'desc'
                                    ? 'Sort descending'
                                    : 'Clear sort'
                                : undefined
                            }
                          >
                            <table.FlexRender header={header} />
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, 10)
                .map((row) => {
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
            </tbody>
          </table>
          <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
          <div>
            <button onClick={() => rerender()}>Force Rerender</button>
          </div>
          <div>
            <button onClick={() => refreshData()}>Refresh Data</button>
          </div>
          <table.Subscribe selector={(state) => state}>
            {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
          </table.Subscribe>
        </div>
      )}
    </table.Subscribe>
  )
}

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
)
