# React Table

Hooks for building **lightweight, fast and extendable datagrids** for React

<a href="https://travis-ci.org/tannerlinsley/react-table" target="\_parent">
  <img alt="" src="https://travis-ci.org/tannerlinsley/react-table.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-table.svg" />
</a>
<a href="https://spectrum.chat/react-table">
  <img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
</a>
<a href="https://github.com/tannerlinsley/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/tannerlinsley/react-table.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

<br />
<br />

## Features

- Lightweight
- Headless (100% customizable, Bring-your-own-UI)
- Client-side & Server-side pagination support
- Sorting (Multi and Stable)
- Filters
- Pivoting & Aggregation
- Fully controllable
- Extensible via hooks
- <a href="https://medium.com/@tannerlinsley/why-i-wrote-react-table-and-the-problems-it-has-solved-for-nozzle-others-445c4e93d4a8#.axza4ixba" target="\_parent">"Why I wrote React Table and the problems it has solved for Nozzle.io"</a> by Tanner Linsley

## Demos

[React Table v7 Sandbox](https://codesandbox.io/s/m5lxzzpz69)

## Versions

- This documentation is for version 7.
- [View the Changelog](https://github.com/tannerlinsley/react-table/blob/master/CHANGELOG.md)
- Previous versions:
  - [6.x.x Readme](https://github.com/tannerlinsley/react-table/tree/v6/)
  - [5.x.x Readme](https://github.com/tannerlinsley/react-table/blob/ad7d31cd3978eb45da7c6194dbab93c1e9a8594d/README.md)

## Sponsors

**React Table v7** is being built and maintained by me, @tannerlinsley and I am always in need of more Patreon support to keep this project afloat. If you would like to contribute to my Patreon goal for v7 and beyond, [visit my Patreon and help me out!](https://patreon.com/tannerlinsley).

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/platinum.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://tryretool.com/?utm_source=sponsor&utm_campaign=react_table" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/sponsor-retool.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/platinum-placeholder.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/gold.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://nozzle.io" target="_blank">
          <img width="300" src="https://nozzle.io/img/logo-blue.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://zappi.com/web" target="_blank">
          <img width="300" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/sponsor-zappi.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/gold-placeholder.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

# Documentation

- [Installation](#installation)
- [Concepts](#concepts)
- [Setup](#setup)
- [Contributing](#contributing)

# Installation

Install React Table as a dependency using `npm` or `yarn`

```bash
# NPM
$ npm install react-table

# Yarn
$ yarn add react-table
```

To import React Table:

```js
import {
  useTable,
  useColumns,
  useRows,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
  ...
} from 'react-table'
```

# Concepts

## React Table is a "headless" library

React Table is a headless utility, which means out of the box, it doesn't render or supply any actual UI elements. You are in charge of utilizing the state and callbacks of the hooks provided by this library to render your own table markup. [Read this article to understand why React Table is built this way.](https://medium.com/merrickchristensen/headless-user-interface-components-565b0c0f2e18). If you don't want to, then here's a quick rundown anyway:

- Separation of Concern - Not that superficial kind you read about all the time. The real kind. React Table as a library honestly has no business being in charge of your UI. The look, feel, and overall experience of your table is what makes your app or product great. The less React Table gets in the way of that, the better!
- Maintenance - By removing the massive (and seemingly endless) API surface area required to support every UI use-case, React Table can remain small, easy-to-use and simple to update/maintain.
- Extensibility - UI present countless edge cases for a library simply because it's a creative medium, and one where every developer does things differently. By drawing a line between

## The React Table API

At the heart of every React Table is a table `instance` object. This object contains everything needed to build a table and interact with it's state. This includes, but is not limited to:

- Columns
- Materialized Data
- Sorting
- Filtering
- Grouping
- Pagination
- Expanded State
- Any functionality provided by custom plugin hooks, too!

## Using Hooks for configuration, state and lifecycle

React Table uses React Hooks both internally and externally for 100% of it's configuration and lifecycle management. Naturally, this is what allows React Table to be headless and lightweight while still having a concise and simple API.

React Table is essentially a compatible collection of **custom React hooks**:

- The primary React Table hook
  - [`useTable`](#usetable)
- Plugin Hooks
  - Required Plugin Hooks
    - [`useColumns`](#useColumns)
    - [`useRows`](#useRows)
  - Core Plugin Hooks
    - [`useTableState`](#useTableState)
    - [`useGroupBy`](#useGroupBy)
    - [`useFilters`](#useFilters)
    - [`useSortBy`](#useSortBy)
    - [`useExpanded`](#useExpanded)
    - [`usePagination`](#usePagination)
    - [`useTokenPagination`](#useTokenPagination)
  - Layout Plugin Hooks
    - [`useFlexLayout`](#useFlexLayout)
    - [`useAbsoluteLayout`](#useAbsoluteLayout) (coming soon!)
- Custom Plugin Hooks
  - Get your custom plugin hook listed here!

### Hook Usage

`useTable` is the **primary** hook used to build a React Table. It serves as the starting point for **every option and every plugin hook** that React Table supports. The options passed into `useTable` are supplied to every plugin hook after it in the order they are supplied, eventually resulting a final `instance` object that you can use to build your table UI and interact with the table's state.

```js
const instance = useTable(
  {
    data: [...],
    columns: [...],
  },
  useColumns,
  useRows,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination
)
```

### The stages of a React Table

1. `useTable` is called. A table instance is created.
1. The `instance.state` is resolved from either a custom user state or an automatically generated one.
1. A collection of plugin points is created at `instance.hooks`. These plugin points don't run until after all of the plugins have run.
1. The instance is reduced through each plugin hook in the order they were called. Each hook receives the result of the previous hook, is able to manipulate the `instance`, use plugin points, use their own React hooks internally and eventually return a new one `instance`. This happens until the last instance object is returned from the last hook.
1. Lastly, the plugin points that were registered and populated during hook reduction are run to produce the final instance object that is returned from `useTable`

This multi-stage process is the secret sauce that allows React Table plugin hooks to work together and compose nicely, while not stepping on each others toes.

### Plugin Hook Order & Consistency

The order and usage of plugin hooks must follow [The Laws of Hooks](TODO), just like any other custom hook. They must always be unconditionally called in the same order.

**Note: In the event that you want to programmatically enable or disable plugin hooks, most of them provide options to disable their functionality, eg. `options.disableSorting`**

### Option Memoization

React Table relies on memoization to determine when state and side effects should update or be calculated. This means that every option you pass to `useTable` should be memoized either via `React.useMemo` (for objects) or `React.useCallback` (for functions).

# React Table Hooks API

## `useTable`

- Required

`useTable` is the root hook for React Table. To use it, call it with an options object, followed by any React Table compatible hooks you want to use.

### Options

- `state: [stateObject, stateUpdater]`
  - Must be **memoized**
  - The state/updater pair for the table instance. You would want to override this if you plan on controlling or hoisting table state into your own code.
  - Defaults to using an internal `useTableState()` instance if not defined.
  - See [Controlling and Hoisting Table State](#controlling-and-hoistin-table-state)
- `debug: Bool`
  - A flag to turn on debug mode.
  - Defaults to `false`

### Output

- `instance` - The instance object for the React Table

### Example

```js
const instance = useTable(
  {
    // Options
  },
  useColumns,
  useRows,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination
)
```

## `useColumns`

- Required

`useColumns` is the hook responsible for supporting columns in React Table. It's required for every React Table.

### Options

- `columns: Array<Column>`
  - Required
  - Must be **memoized**
  - The core columns configuration object for the entire table.

### Output

The following values are provided to the table `instance`:

- `columns: Array<Column>`
  - A flat array of all final column objects computed from the original columns configuration option.
- `headerGroups: Array<Array<Column>>`
  - An array of normalized header groups, each containing a flattened array of final column objects for that row.
- `headers[] Array<Column>`
  - An array of nested final column objects, similar in structure to the original columns configuration option.

### Example

```js
const myColumns = React.useMemo(
  () => [
    {
      Header: 'Name',
      columns: [
        {
          Header: 'First Name',
          accessor: 'firstName',
        },
        {
          Header: 'Last Name',
          accessor: 'lastName',
        },
      ],
    },
  ],
  []
)

const { columns, headerGroups, headers } = useTable(
  {
    columns: myColumns,
  },
  useColumns
)
```

## `useRows`

- Required

`useColumns` is the hook responsible for supporting columns in React Table. It's required for every React Table.

### Options

- `data: Array<any>`
  - Required
  - Must be **memoized**
  - The data array that you want to display on the table.
- `subRowsKey: String`
  - Required
  - Defaults to `subRows`
  - React Table will use this key when materializing the final row object. It also uses this key to infer sub-rows from the raw data.
  - See [Grouping and Aggregation](#grouping-and-aggregation) for more information

### Output

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of rows **materialized** from the original `data` array and `columns` passed into the table options

### Example

```js
const myColumns = React.useMemo(
  () => [
    {
      Header: 'Name',
      columns: [
        {
          Header: 'First Name',
          accessor: 'firstName',
        },
        {
          Header: 'Last Name',
          accessor: 'lastName',
        },
      ],
    },
  ],
  []
)

const data = [
  {
    firstName: 'Tanner',
    lastName: 'Linsley',
  },
  {
    firstName: 'Shawn',
    lastName: 'Wang',
  },
  {
    firstName: 'Kent C.',
    lastName: 'Dodds',
  },
  {
    firstName: 'Ryan',
    lastName: 'Florence',
  },
]

const { rows } = useTable(
  {
    columns: myColumns,
    data,
  },
  useColumns,
  useRows
)
```

## `useGroupBy`

- Optional

`useGroupBy` is the hook that implements **row grouping and aggregation**.

### Options

- `state[0].groupBy: Array<String>`
  - Must be **memoized**
  - An array of groupBy ID strings, controlling which columns are used to calculate row grouping and aggregation. This information is stored in state since the table is allowed to manipulate the groupBy through user interaction.
- `groupByFn: Function`
  - Must be **memoized**
  - Defaults to [`defaultGroupByFn`](TODO)
  - This function is responsible for grouping rows based on the `state.groupBy` keys provided. It's very rare you would need to customize this function.
- `manualGroupBy: Bool`
  - Enables groupBy detection and functionality, but does not automatically perform row grouping. Turn this on if you wish to implement your own row grouping outside of the table (eg. server-side or manual row grouping/nesting)
- `disableGrouping: Bool`
  - Disables groupBy for the entire table.
- `aggregations: Object<aggregationKey: aggregationFn>`
  - Must be **memoized**
  - Allows overriding or adding additional aggregation functions for use when grouping/aggregating row values. If an aggregation key isn't found on this object, it will default to using the [built-in aggregation functions](TODO)

### Output

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of **grouped and aggregated** rows.

### Example

```js
const state = useTableState({ groupBy: ['firstName'] })

const aggregations = React.useMemo(() => ({
  customSum: (values, rows) => values.reduce((sum, next) => sum + next, 0),
}))

const { rows } = useTable(
  {
    state, // state[0].groupBy === ['firstName']
    manualGroupBy: false,
    disableGrouping: false,
    aggregations,
  },
  useColumns,
  useRows,
  useGroupBy
)
```

## `useFilters`

- Optional

`useFilters` is the hook that implements **row filtering**.

### Options

- `state[0].filters: <Object<columnID: filterValue>`
  - Must be **memoized**
  - An object of columnID's and their corresponding filter values. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `defaultFilter: String | Function`
  - If a **function** is passed, it must be **memoized**
  - Defaults to [`text`](TODO)
  - The function (or resolved function from the string) will be used as the default/fallback filter method for every column that has filtering enabled.
    - If a `string` is passd functionality, but does not automatically perform row filtering. Turn this on if you wish to ied, the function with that name located on the `filterTypes` option object will be used.
    - If a `function` is passed, it will be used.
  - For mor information on filter functions, see [Filtering](TODO)
- `manualFilters: Bool`
  - Enables filter detection anmplement your own row filter outside of the table (eg. server-side or manual row grouping/nesting)
- `disableFilters: Bool`
  - Disables filtering for every column in the entire table.
- `filterTypes: Object<filterKey: filterType>`
  - Must be **memoized**
  - Allows overriding or adding additional filter types for columns to use. If a column's filter type isn't found on this object, it will default to using the [built-in filter types](TODO).
  - Read more about [Filter Types](TODO)

### Output

The following values are provided to the table `instance`:

setFilter,
setAllFilters,

- `rows: Array<Row>`
  - An array of **filtered** rows.
- `setFilter: Function(columnID, filterValue) => void`
  - An instance-level function used to update the filter value for a specific column.
- `setAllFilters: Function(filtersObject) => void`
  - An instance-level function used to update the values for **all** filters on the table, all at once.

### Example

```js
// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'

const state = useTableState({ filters: { firstName: 'tanner' } })

const filterTypes = React.useMemo(() => ({
  // Add a new fuzzyText filter type.
  fuzzyText: (rows, id, filterValue) => {
    return matchSorter(rows, filterValue, { keys: [row => row[id] })
  },
  // Or, override the default text filter to use
  // "startWith"
  text: (rows, id, filterValue) => {
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue !== undefined
        ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
        : true
    })
  }
}), [matchSorter])

const { rows } = useTable(
  {
    // state[0].groupBy === ['firstName']
    state,
    // Override the default filter to be our new `fuzzyText` filter type
    defaultFilter: 'fuzzyText',
    manualFilters: false,
    disableFilters: false,
    // Pass our custom filter types
    filterTypes,
  },
  useColumns,
  useRows,
  useFilters
)
```

# Guides

## Client Side Pagination

To add client side pagination, use the `usePagination` hook:

```diff
// Import React
import React from 'react'

// Import React Table
import {
  useTable,
  useColumns,
  useRows,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
+  usePagination,
} from 'react-table'

// Create a component to render your table
function MyTable(props) {
  // Use the useTable hook to create your table configuration
  const instance = useTable(
    props,
    useColumns,
    useRows,
    useGroupBy,
    useFilters,
    useSortBy,
    useExpanded,
+   usePagination,
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    rows,
    getRowProps,
    prepareRow,
+   pageOptions,
+   page,
+   state: [{ pageIndex, pageSize }],
+   gotoPage,
+   previousPage,
+   nextPage,
+   setPageSize,
+   canPreviousPage,
+   canNextPage,
  } = instance

  // Render the UI for your table
  return (
    <div>
      <table {...getTableProps()}>
        ...
      </table>
+     <div>
+       <button onClick={() => previousPage()} disabled={!canPreviousPage}>
+         Previous Page
+       </button>
+       <button onClick={() => nextPage()} disabled={!canNextPage}>
+         Next Page
+       </button>
+       <div>
+         Page{' '}
+         <em>
+           {pageIndex + 1} of {pageOptions.length}
+         </em>
+       </div>
+       <div>Go to page:</div>
+       <input
+         type="number"
+         defaultValue={pageIndex + 1 || 1}
+         onChange={e => {
+           const page = e.target.value ? Number(e.target.value) - 1 : 0
+           gotoPage(page)
+         }}
+       />
+       <select
+         value={pageSize}
+         onChange={e => {
+           setPageSize(Number(e.target.value))
+         }}
+       >
+         {pageSizeOptions.map(pageSize => (
+           <option key={pageSize} value={pageSize}>
+             Show {pageSize}
+           </option>
+         ))}
+       </select>
+     </div>
    </div>
  )
}
```

## Server Side Pagination

To implement server-side pagination, use the `useTableState` and `usePagination` hooks:

```diff

```

# Setup

To begin using React Table you will need to start with a UI to render it. Below is a very basic component that should serve as a good starting point for most projects:

```js
// Import React
import React from 'react'

// Import React Table
import {
  useTable,
  useColumns,
  useRows,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
} from 'react-table'

// Create a component to render your table
export default function MyTable(props) {
  // Use the useTable hook to create your table configuration
  const instance = useTable(
    props,
    useColumns,
    useRows,
    useGroupBy,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    rows,
    getRowProps,
    pageOptions,
    page,
    state: [{ pageIndex, pageSize }],
    gotoPage,
    prepareRow,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = instance

  // Render the UI for your table
  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getRowProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {page.map(
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
      <div>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous Page
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next Page
        </button>
        <div>
          Page{' '}
          <em>
            {pageIndex + 1} of {pageOptions.length}
          </em>
        </div>
        <div>Go to page:</div>
        <input
          type="number"
          defaultValue={pageIndex + 1 || 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            gotoPage(page)
          }}
        />
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {pageSizeOptions.map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
```

You can then use your table like so:

```js

import MyTable from './MyTable'

function MyApp () {
  const columns = React.useMemo(() => [{
    Header: "Name",
    columns: [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      }
    ]
  }], [])

  const data = [{
    firstName: 'Tanner',
    lastName: 'Linsley'
  }, {
    firstName: 'Shawn',
    lastName: 'Wang'
  }, {
    firstName: 'Kent C.',
    lastName: 'Dodds'
  }, {
    firstName: 'Ryan',
    lastName: 'Florence'
  }]

  return <MyTable columns={columns} data={data} />
```

## Contributing

To suggest a feature, create an issue if it does not already exist.
If you would like to help develop a suggested feature follow these steps:

- Fork this repo
- Install dependencies with `$ yarn`
- Auto-build files as you edit with `$ yarn run watch`
- Implement your changes to files in the `src/` directory
- Run the <a href="https://github.com/tannerlinsley/react-story">React Story</a> locally with `$ yarn run docs`
- View changes as you edit `docs/src`
- Submit PR for review

#### Package Utilities

- `$ yarn run watch` Watches files and builds via babel
- `$ yarn run docs` Runs the storybook server
- `$ yarn run test` Runs the test suite
