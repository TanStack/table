import React from 'react'
import matchSorter from 'match-sorter'

import {
  useTable,
  withColumnFilters,
  withGlobalFilter,
  withGrouping,
  withSorting,
  withExpanding,
  withPagination,
  withSelection,
} from 'react-table'

import makeData from './makeData'

import { BasicTable, withBasicTable } from './BasicTable'

// Define a custom filterType function!
const filterGreaterThan = (rows, ids, filterValue) => {
  return rows.filter(row => {
    return ids.some(id => {
      const rowValue = row.values[id]
      return rowValue >= filterValue
    })
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

const filterFuzzy = (rows, ids, filterValue) => {
  return matchSorter(rows, filterValue, {
    keys: ids.map(id => row => row.values[id]),
  })
}
// Let the table remove the filter if the string is empty
filterFuzzy.autoRemove = val => !val

function roundedMedian(leafValues) {
  let min = leafValues[0] || 0
  let max = leafValues[0] || 0

  leafValues.forEach(value => {
    min = Math.min(min, value)
    max = Math.max(max, value)
  })

  return Math.round((min + max) / 2)
}

function App() {
  const [enableExpanderColumn, setEnableExpanderColumn] = React.useState(false)
  const [debug, setDebug] = React.useState(false)

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
            aggregate: 'count',
            Aggregated: ({ value }) => `${value} Names`,
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            filterType: 'fuzzy',
            aggregate: 'uniqueCount',
            Aggregated: ({ value }) => `${value} Unique Names`,
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            filterUi: 'range',
            filterType: 'equals',
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            enableMinMaxValues: true,
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            filterUi: 'minMax',
            filterType: 'between',
            aggregate: 'sum',
            Aggregated: ({ value }) => `${value} (total)`,
            enableMinMaxValues: true,
          },
          {
            Header: 'Status',
            accessor: 'status',
            filterUi: 'select',
            filterType: 'includes',
            enableUniqueValues: true,
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            filterUi: 'range',
            filterType: 'greaterThan',
            aggregate: roundedMedian,
            Aggregated: ({ value }) => `${value} (med)`,
            enableMinMaxValues: true,
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(100000), [])

  const instance = useTable({
    debug,
    data,
    columns,
    filterTypes: {
      fuzzy: filterFuzzy,
      greaterThan: filterGreaterThan,
    },
    enableFacetedFilters: true,
    enableExpanderColumn,
    plugins: [
      withColumnFilters,
      withGlobalFilter,
      withGrouping,
      withSorting,
      withExpanding,
      withPagination,
      withSelection,
      withBasicTable,
    ],
  })

  const { getSelectedFlatRows, state } = instance

  React.useEffect(() => {
    window.getInstance = () => console.log(instance)
    window.getState = () => console.log(state)
    window.getSelectedFlatRows = () => console.log(getSelectedFlatRows())
  })

  return (
    <div>
      <h1>React Table</h1>
      <div>
        <h3>Options</h3>
        <div>
          <label>
            <input
              type="checkbox"
              value={debug}
              onChange={e => setDebug(e.target.checked)}
            />{' '}
            Enable Debug Logs
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value={enableExpanderColumn}
              onChange={e => setEnableExpanderColumn(e.target.checked)}
            />{' '}
            Enable Expander Column
          </label>
        </div>
      </div>
      <BasicTable instance={instance} />
      <br />
      <h3>Console Commands</h3>
      <ul>
        <li>
          <pre>window.getInstance()</pre> - Dump the table instance.
        </li>
        <li>
          <pre>window.getState()</pre> - Dump the state of the table.
        </li>
        <li>
          <pre>window.getSelectedFlatRows()</pre> - Get a flat array of rows
          that are currently selected
        </li>
      </ul>
    </div>
  )
}

export default App
