import { render } from 'preact'
import { useMemo, useReducer, useState } from 'preact/hooks'
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { SortFn, SortingState } from '@tanstack/preact-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()
// custom sorting logic for one of our enum columns
const sortStatusFn: SortFn<typeof features, Person> = (
  rowA,
  rowB,
  _columnId,
) => {
  const statusA = rowA.original.status
  const statusB = rowB.original.status
  const statusOrder = ['single', 'complicated', 'relationship']
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
}

function App() {
  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          sortUndefined: 'last',
          sortDescFirst: false,
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          sortUndefined: 'last',
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          sortFn: sortStatusFn,
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
        }),
        columnHelper.accessor('rank', {
          header: 'Rank',
          invertSorting: true,
        }),
        columnHelper.accessor('createdAt', {
          header: 'Created At',
        }),
      ]),
    [],
  )

  const [data, setData] = useState(() => makeData(1_000))
  const refreshData = () => setData(() => makeData(1_000))
  const stressTest = () => setData(() => makeData(500_000))

  // optionally, manage sorting state in your own state management (although preact state causes more re-renders here than necessary)
  const [sorting, setSorting] = useState<SortingState>([])

  console.log('sorting', sorting)

  const table = useTable(
    {
      features,
      columns,
      data,
      debugTable: true,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      // no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
      // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
      // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
      // enableSorting: false, // - default on/true
      // enableSortingRemoval: false, //Don't allow - default on/true
      // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
      // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
    },
    (state) => state, // default selector
  )

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (500k rows)</button>
      </div>
      <>
        <div className="spacer-sm" />
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
                            header.column.getCanSort() ? 'sortable-header' : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
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
          <button onClick={() => rerender(0)}>Force Rerender</button>
        </div>
        {/* Store mode: full state for debugging */}
        <pre>{JSON.stringify(table.state, null, 2)}</pre>
      </>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(
  <>
    <App />
  </>,
  rootElement,
)
