import { render } from 'preact'
import { useMemo, useState } from 'preact/hooks'
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
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'rowNumber',
          header: '#',
          cell: ({ row }) => row.getDisplayIndex() + 1,
        }),
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
        columnHelper.accessor('email', {
          header: 'Email',
          sortFn: 'alphanumeric',
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
  const stressTest = () => setData(() => makeData(1_000_000))

  // optionally, manage sorting state in your own state management (although preact state causes more re-renders here than necessary)
  const [sorting, setSorting] = useState<SortingState>([])

  console.log('sorting', sorting)

  const table = useTable(
    {
      features,
      columns,
      data,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      // initialState: { sorting: [{ id: 'firstName', desc: false }] }, // set the initial sort once
      // atoms: { sorting: sortingAtom }, // preferred: own sorting state with an external atom
      // enableSorting: false, // disable sorting for every column; default true
      // sortDescFirst: true, // start every sort cycle with descending order; inferred by column data by default
      // enableSortingRemoval: false, // keep a sorted column sorted when toggling; default true
      // enableMultiSort: false, // disable Shift-click multi-sorting; default true
      // enableMultiRemove: false, // prevent a multi-sort toggle from removing a sorted column; default true
      // isMultiSortEvent: () => true, // make every sort interaction a multi-sort; default requires Shift
      // maxMultiSortColCount: 3, // limit multi-sorting to three columns; default Infinity
      // manualSorting: true, // pass data that is already sorted, for example from a server
      // autoResetPageIndex: false, // with pagination, keep the current page when sorting changes; default true
      debugTable: true,
    },
    (state) => state, // default selector
  )

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
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
        <div></div>
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
