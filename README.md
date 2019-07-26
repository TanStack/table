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
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
  ...
} from 'react-table'
```

# Examples

- [Basic](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/basic)
- [Sorting with `useSortBy`](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/sorting-with-useSortBy)
- [Filtering with `useFilters`](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/filtering-with-useFilters)

# Concepts

## React Table is a "headless" library

React Table is a headless utility, which means out of the box, it doesn't render or supply any actual UI elements. You are in charge of utilizing the state and callbacks of the hooks provided by this library to render your own table markup. [Read this article to understand why React Table is built this way.](https://medium.com/merrickchristensen/headless-user-interface-components-565b0c0f2e18). If you don't want to, then here's a quick rundown anyway:

- Separation of Concerns - Not that superficial kind you read about all the time. The real kind. React Table as a library honestly has no business being in charge of your UI. The look, feel, and overall experience of your table is what makes your app or product great. The less React Table gets in the way of that, the better!
- Maintenance - By removing the massive (and seemingly endless) API surface area required to support every UI use-case, React Table can remain small, easy-to-use and simple to update/maintain.
- Extensibility - UI presents countless edge cases for a library simply because it's a creative medium, and one where every developer does things differently. By not dictating UI concerns, React Table empowers the developer to design and extend the UI based on their unique use-case.

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

React Table uses React Hooks both internally and externally for 100% of its configuration and lifecycle management. Naturally, this is what allows React Table to be headless and lightweight while still having a concise and simple API.

React Table is essentially a compatible collection of **custom React hooks**:

- The primary React Table hook
  - [`useTable`](#usetable)
- Plugin Hooks
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
1. The instance is reduced through each plugin hook in the order they were called. Each hook receives the result of the previous hook, is able to manipulate the `instance`, use plugin points, use their own React hooks internally and eventually return a new `instance`. This happens until the last instance object is returned from the last hook.
1. Lastly, the plugin points that were registered and populated during hook reduction are run to produce the final instance object that is returned from `useTable`

This multi-stage process is the secret sauce that allows React Table plugin hooks to work together and compose nicely, while not stepping on each others toes.

### Plugin Hook Order & Consistency

The order and usage of plugin hooks must follow [The Laws of Hooks](TODO), just like any other custom hook. They must always be unconditionally called in the same order.

> **NOTE: In the event that you want to programmatically enable or disable plugin hooks, most of them provide options to disable their functionality, eg. `options.disableSorting`**

### Option Memoization

React Table relies on memoization to determine when state and side effects should update or be calculated. This means that every option you pass to `useTable` should be memoized either via `React.useMemo` (for objects) or `React.useCallback` (for functions).

# API

## `useTable`

- Required

`useTable` is the root hook for React Table. To use it, pass it with an options object with at least a `columns` and `rows` value, followed by any React Table compatible hooks you want to use.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `columns: Array<Column>`
  - Required
  - Must be **memoized**
  - The core columns configuration object for the entire table.
  - Supports nested `columns` arrays via the `column.children` key
- `data: Array<any>`
  - Required
  - Must be **memoized**
  - The data array that you want to display on the table.
- `state: TableStateTuple[stateObject, stateUpdater]`
  - Optional
  - Must be **memoized** table state tuple. See [`useTableState`](#usetablestate) for more information.
  - The state/updater pair for the table instance. You would want to override this if you plan on controlling or hoisting table state into your own code.
  - Defaults to using an internal `useTableState()` instance if not defined.
  - See [Controlling and Hoisting Table State](#controlling-and-hoisting-table-state)
- `defaultColumn: Object`
  - Optional
  - Defaults to `{}`
  - The default column object for every column passed to React Table.
  - Column-specific properties will override the properties in this object, eg. `{ ...defaultColumn, ...userColumn }`
  - This is particularly useful for adding global column properties. For instance, when using the `useFilters` plugin hook, add a default `Filter` renderer for every column, eg.`{ Filter: MyDefaultFilterComponent }`
- `useColumns: Function`
  - Optional
  - This hook overrides the internal `useColumns` hooks used by `useTable`. You probably never want to override this unless you are testing or developing new features for React Table
- `useRows: Function`
  - Optional
  - This hook overrides the internal `useRows` hooks used by `useTable`. You probably never want to override this unless you are testing or developing new features for React Table
- `debug: Bool`
  - Optional
  - A flag to turn on debug mode.
  - Defaults to `false`

### `column` Options

The following options are supported on any column object you can pass to `columns`.

- `accessor: String | Function`
  - **Required**
  - This string/function is used to build the data model for your column.
  - The data returned by an accessor should be **primitive** and sortable.
  - If a string is passed, the column's value will be looked up on the original row via that key, eg. If your column's accessor is `firstName` then its value would be read from `row['firstName']`. You can also specify deeply nested values with accessors like `info.hobbies` or even `address[0].street`
  - If a function is passed, the column's value will be looked up on the original row using this accessor function, eg. If your column's accessor is `row => row.firstName`, then its value would be determined by passing the row to this function and using the resulting value.
- `id: String`
  - **Required if `accessor` is a function**
  - This is the unique ID for the column. It is used by reference in things like sorting, grouping, filtering etc.
  - If a **string** accessor is used, it defaults as the column ID, but can be overridden if necessary.
- `columns: Array<Column>`
  - Optional
  - A nested array of columns.
  - If defined, the column will act as a header group. Columns can be recursively nested as much as needed.
- `show: Boolean | Function`
  - Optional
  - Defaults to `true`
  - If set to `false`, the column will be hidden.
  - If set to a `function`, it will be called with the current table instance and can then return `true` or `false`.
  - The data model for hidden columns is still calculated including sorting, filters, and grouping.
- `Header: String | Function | React.Component => JSX`
  - Optional
  - Defaults to `({ id }) => id`
  - Receives the table instance and column model as props
  - Must either be a **string or return valid JSX**
  - If a function/component is passed, it will be used for formatting the header value, eg. You can use a `Header` function to dynamically format the header using any table or column state.
- `Cell: Function | React.Component => JSX`
  - Optional
  - Defaults to `({ value }) => value`
  - Receives the table instance and cell model as props
  - Must return valid JSX
  - This function (or component) is primarily used for formatting the column value, eg. If your column accessor returns a date object, you can use a `Cell` function to format that date to a readable format.

### `Instance` Properties

The following properties are available on the table instance returned from `useTable`

- `headerGroups: Array<HeaderGroup>`
  - An array of normalized header groups, each containing a flattened array of final column objects for that row.
  - See [Header Group Properties](#header-group-properties) for more information
- `columns: Array<Column>`
  - A **flat** array of all final column objects computed from the original columns configuration option.
  - See [Column Properties](#column-properties) for more information
- `headers[] Array<Column>`
  - A **nested** array of final column objects, similar in structure to the original columns configuration option.
  - See [Column Properties](#column-properties) for more information
- `rows: Array<Row>`
  - An array of **materialized row objects** from theriginal `dat oa` array and `columns` passed into the table options
  - See [Row Properties](#row-properties) for more information
- `getTableProps: Function(?props)`
  - **Required**
  - This function is used to resolve any props needed for your table wrapper.
  - Custom props may be passed. **NOTE: Custom props will override built-in table props, so be careful!**
- `prepareRow: Function(Row)`
  - **Required**
  - This function is responsible for lazily preparing a row for rendering. Any row that you intend to render in your table needs to be passed to this function **before every render**.
  - **Why?** Since table data could potentially be very large, it can become very expensive to compute all of the necessary state for every row to be rendered regardless if it actually is rendered or not (for example if you are paginating or virtualizing the rows, you may only have a few rows visible at any given moment). This function allows only the rows you intend to display to be computed and prepped with the correct state.

### `HeaderGroup` Properties

Header Groups are The following additional properties are available on every `headerGroup` object returned by the table instance.

- `headers: Array<Column>`
  - **Required**
  - The columns in this header group.
- `getHeaderGroupProps: Function(?props)`
  - **Required**
  - This function is used to resolve any props needed for this header group's row.
  - You can use the `getHeaderGroupProps` hook to extend its functionality.
  - Custom props may be passed. **NOTE: Custom props will override built-in table props, so be careful!**

### `Column` Properties

The following properties are available on every `Column` object returned by the table instance.

- `id: String`
  - The resolved column ID from either the column's `accessor` or the column's hard-coded `id` property
- `visible: Boolean`
  - The resolved visible state for the column, derived from the column's `show` property
- `render: Function(type: String | Function | Component, ?props)`
  - This function is used to render content in context of a column.
  - If `type` is a string, will render using the `column[type]` renderer. React Table ships with default `Header` renderers. Other renderers like `Filter` are available via hooks like `useFilters`.
  - If a function or component is passed instead of a string, it will be be passed the table instance and column model as props and is expected to return any valid JSX.
- `getHeaderProps: Function(?props)`
  - **Required**
  - This function is used to resolve any props needed for this column's header cell.
  - You can use the `getHeaderProps` hook to extend its functionality.
  - Custom props may be passed. **NOTE: Custom props will override built-in table props, so be careful!**

### `Row` Properties

The following additional properties are available on every `row` object returned by the table instance.

- `cells: Array<Cell>`
  - An array of `Cell` objects containing properties and functions specific to the row and column it belongs to.
  - See [Cell Properties](#cell-properties) for more information
- `values: Object<columnID: any>`
  - A map of this row's **resolved** values by columnID, eg. `{ firstName: 'Tanner', lastName: 'Linsley' }`
- `getRowProps: Function(?props)`
  - **Required**
  - This function is used to resolve any props needed for this row.
  - You can use the `getRowProps` hook to extend its functionality.
  - Custom props may be passed. **NOTE: Custom props will override built-in table props, so be careful!**

### `Cell` Properties

The following additional properties are available on every `Cell` object returned in an array of `cells` on every row object.

- `column: Column`
  - The corresponding column object for this cell
- `row: Row`
  - The corresponding row object for this cell
- `value: any`
  - The **resolved** value for this cell.
  - By default, this value is displayed on the table via the default `Cell` renderer. To override the way a cell displays
- `getCellProps: Function(?props)`
  - **Required**
  - This function is used to resolve any props needed for this cell.
  - You can use the `getCellProps` hook to extend its functionality.
  - Custom props may be passed. **NOTE: Custom props will override built-in table props, so be careful!**
- `render: Function(type: String | Function | Component, ?props)`
  - This function is used to render content in context of a cell.
  - If `type` is a string, will render using the `column[type]` renderer. React Table ships with a default `Cell` renderer. Other renderers like `Aggregated` are available via hooks like `useFilters`.
  - If a function or component is passed instead of a string, it will be be passed the table instance and cell model as props and is expected to return any valid JSX.

### Example

```js
function App() {
  const columns = React.useMemo(
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

  return <MyTable columns={columns} data={data} />
}

function MyTable({ columns, data }) {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  return (
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
        {rows.map(
          (row, i) =>
            prepareRow(row) || (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
        )}
      </tbody>
    </table>
  )
}
```

## `useGroupBy`

- Plugin Hook
- Optional

`useGroupBy` is the hook that implements **row grouping and aggregation**.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `state[0].groupBy: Array<String>`
  - Must be **memoized**
  - An array of groupBy ID strings, controlling which columns are used to calculate row grouping and aggregation. This information is stored in state since the table is allowed to manipulate the groupBy through user interaction.
- `groupByFn: Function`
  - Must be **memoized**
  - Defaults to [`defaultGroupByFn`](TODO)
  - This function is responsible for grouping rows based on the `state.groupBy` keys provided. It's very rare you would need to customize this function.
- `manualGroupBy: Bool`
  - Enables groupBy detection and functionality, but does not automatically perform row grouping.
  - Turn this on if you wish to implement your own row grouping outside of the table (eg. server-side or manual row grouping/nesting)
- `disableGrouping: Bool`
  - Disables groupBy for the entire table.
- `aggregations: Object<aggregationKey: aggregationFn>`
  - Must be **memoized**
  - Allows overriding or adding additional aggregation functions for use when grouping/aggregating row values. If an aggregation key isn't found on this object, it will default to using the [built-in aggregation functions](TODO)

### `Instance` Properties

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
  useGroupBy
)
```

## `useFilters`

- Plugin Hook
- Optional

`useFilters` is the hook that implements **row filtering**.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `state[0].filters: Object<columnID: filterValue>`
  - Must be **memoized**
  - An object of columnID's and their corresponding filter values. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `defaultFilter: String | Function`
  - If a **function** is passed, it must be **memoized**
  - Defaults to [`text`](TODO)
  - The function (or resolved function from the string) will be used as the default/fallback filter method for every column that has filtering enabled.
    - If a `string` is passed, the function with that name located on the `filterTypes` option object will be used.
    - If a `function` is passed, it will be used.
  - For mor information on filter types, see [Filtering](TODO)
- `manualFilters: Bool`
  - Enables filter detection functionality, but does not automatically perform row filtering.
  - Turn this on if you wish to implement your own row filter outside of the table (eg. server-side or manual row grouping/nesting)
- `disableFilters: Bool`
  - Disables filtering for every column in the entire table.
- `filterTypes: Object<filterKey: filterType>`
  - Must be **memoized**
  - Allows overriding or adding additional filter types for columns to use. If a column's filter type isn't found on this object, it will default to using the [built-in filter types](TODO).
  - For mor information on filter types, see [Filtering](TODO)

### `Instance` Properties

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of **filtered** rows.
- `preFilteredRows: Array<Row>`
  - The array of rows **used right before filtering**.
  - Among many other use-cases, these rows are directly useful for building option lists in filters, since the resulting filtered `rows` do not contain every possible option.
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

// Override the default column filter to be our new `fuzzyText` filter type
const defaultColumn = React.useMemo(() => ({
  filter: 'fuzzyText'
}))

const { rows } = useTable(
  {
    // state[0].groupBy === ['firstName']
    state,
    manualFilters: false,
    disableFilters: false,
    // Pass our custom filter types
    filterTypes,
    defaultColumn
  },
  useFilters
)
```

## `useSortBy`

- Plugin Hook
- Optional

`useSortBy` is the hook that implements **row sorting**. It also support multi-sort (keyboard required).

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `state[0].sortBy: Array<Object<id: columnID, desc: Bool>>`
  - Must be **memoized**
  - An array of sorting objects. If there is more than one object in the array, multi-sorting will be enabled. Each sorting object should contain an `id` key with the corresponding column ID to sort by. An optional `desc` key may be set to true or false to indicated ascending or descending sorting for that column. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `defaultSortType: String | Function`
  - If a **function** is passed, it must be **memoized**
  - Defaults to [`alphanumeric`](TODO)
  - The function (or resolved function from the string) will be used as the default/fallback sort method for every column that has sorting enabled.
    - If a `string` is passed, the function with that name located on the `sortTypes` option object will be used.
    - If a `function` is passed, it will be used.
  - For mor information on sort types, see [Sorting](TODO)
- `manualSorting: Bool`
  - Enables sorting detection functionality, but does not automatically perform row sorting. Turn this on if you wish to implement your own sorting outside of the table (eg. server-side or manual row grouping/nesting)
- `disableSorting: Bool`
  - Disables sorting for every column in the entire table.
- `disableMultiSort: Bool`
  - Disables multi-sorting for the entire table.
- `defaultSortDesc: Bool`
  - If true, the first default direction for sorting will be descending. This may also be overridden at the column level.
- `disableSortRemove: Bool`
  - If true, the un-sorted state will not be available to columns once they have been sorted.
- `disableMultiRemove: Bool`
  - If true, the un-sorted state will not be available to multi-sorted columns.
- `orderByFn: Function`
  - Must be **memoizd**
  - Defaults to the built-in [default orderBy function](TODO)
  - This function is responsible for composing multiple sorting functions together for multi-sorting, and also handles both the directional sorting and stable-sorting tie breaking. Rarely would you want to override this function unless you have a very advanced use-case that requires it.
- `sortTypes: Object<sortKey: sortType>`
  - Must be **memoized**
  - Allows overriding or adding additional sort types for columns to use. If a column's sort type isn't found on this object, it will default to using the [built-in sort types](TODO).
  - For mor information on sort types, see [Sorting](TODO)

### Instance Variables

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of **sorted** rows.

### Example

```js
const state = useTableState({ sortBy: [{ id: 'firstName', desc: true }] })

const { rows } = useTable(
  {
    // state[0].sortBy === [{ id: 'firstName', desc: true }]
    state,
  },
  useSortBy
)
```

## `useExpanded`

- Plugin Hook
- Optional

`useExpanded` is the hook that implements **row expanding**. It is most often used with `useGroupBy` to expand grouped rows, but is not limited to that use-case. It supports expanding rows both via internal table state and also via a hard-coded key on the raw row model.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `state[0].expanded: Object<[pathIndex]: Boolean | ExpandedStateObject>`
  - Must be **memoized**
  - An nested object of expanded paths.
  - A `pathIndex` can be set as the key and its value set to `true` to expand that row's subRows into view. For example, if `{ '3': true }` was passed as the `expanded` state, the **4th row in the original data array** would be expanded.
  - For nested expansion, you may **use another object** instead of a Boolean to expand sub rows. For example, if `{ '3': { '5' : true }}` was passed as the `expanded` state, then the **6th subRow of the 4th row and the 4th row of the original data array** would be expanded.
  - This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `subRowsKey: String`
  - Required
  - Defaults to `subRows`
  - React Table will use this key when materializing the final row object. It also uses this key to infer sub-rows from the raw data.
  - See [Grouping and Aggregation](#grouping-and-aggregation) for more information
- `paginateSubRows: Bool`
  - Defaults to `true`
  - If set to `false`, expanded rows will not be paginated. Thus, any expanded subrows would potentially increase the size of any given page by the amount of total expanded subrows on the page.
- `manualExpandedKey: String`
  - Defaults to `expanded`
  - This string is used as the key to detect manual expanded state on any given row. For example, if a raw data row like `{ name: 'Tanner Linsley', friends: [...], expanded: true}` was detected, it would be forcibly expanded, regardless of state.

### Instance Variables

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of **sorted** rows.

### Example

```js
const state = useTableState({ expanded: { '3': true, '5': { '2': true } } })

const { rows } = useTable(
  {
    // state[0].sortBy === { '3': true, '5': { '2': true } }
    state,
  },
  useExpanded
)
```

## `usePagination`

- Plugin Hook
- Optional

`usePagination` is the hook that implements **row pagination**. It can be used for both client-side pagination or server-side pagination. For more information on pagination, see [Pagination](TODO)

> **NOTE** Some server-side pagination implementations do not use page index and instead use **token based pagination**! If that's the case, please use the `useTokenPagination` plugin instead.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `state[0].pageSize: Int`
  - **Required**
  - Defaults to `10`
  - Determines the amount of rows on any given page
- `state[0].pageIndex: Int`
  - **Required**
  - Defaults to `0`
  - The index of the page that should be displayed via the `page` instance value
- `pageCount: Int`
  - **Required if `manualPagination` is set to `true`**
  - If `manualPagination` is `true`, then this value used to determine the amount of pages available. This amount is then used to materialize the `pageOptions` and also compute the `canNextPage` values on the table instance.
- `manualPagination: Bool`
  - Enables pagination functionality, but does not automatically perform row pagination.
  - Turn this on if you wish to implement your own pagination outside of the table (eg. server-side pagination or any other manual pagination technique)
- `disablePageResetOnDataChange`
  - Defaults to `false`
  - Normally, any changes detected to `rows`, `state.filters`, `state.groupBy`, or `state.sortBy` will trigger the `pageIndex` to be reset to `0`
  - If set to `true`, the `pageIndex` will not be automatically set to `0` when these dependencies change.

### Instance Variables

The following values are provided to the table `instance`:

- `pages: Array<page>`
  - An array of every generated `page`, each containing its respective rows.
- `page: Array<row>`
  - An array of rows for the **current** page, determined by the current `pageIndex` value.
- `pageCount: Int`
  - If `manualPagination` is set to `false`, this is the total amount of pages available in the table based on the current `pageSize` value
  - if `manualPagination` is set to `true`, this is merely the same `pageCount` option that was passed in the table options.
- `pageOptions: Array<Int>`
  - An array of zero-based index integers corresponding to available pages in the table.
  - This can be useful for generating things like select interfaces for the user to select a page from a list, instead of manually paginating to the desired page.
- `canPreviousPage: Bool`
  - If there are pages and the current `pageIndex` is greater than `0`, this will be `true`
- `canNextPage:`
  - If there are pages and the current `pageIndex` is less than `pageCount`, this will be `true`
- `gotoPage: Function(pageIndex)`
  - This function, when called with a valid `pageIndex`, will set `pageIndex` to that value.
  - If the passed index is outside of the valid `pageIndex` range, then this function will do nothing.
- `previousPage: Function`
  - This function decreases `state.pageIndex` by one.
  - If there are no pages or `canPreviousPage` is false, this function will do nothing.
- `nextPage: Function`
  - This function increases `state.pageIndex` by one.
  - If there are no pages or `canNextPage` is false, this function will do nothing.
- `setPageSize: Function(pageSize)`
  - This function sets `state.pageSize` to the new value.
  - As a result of a pageSize change, a new `state.pageIndex` is also calculated. It is calculated via `Math.floor(currentTopRowIndex / newPageSize)`
- `pageIndex: Int`
  - This is the resolved `state.pageIndex` value.
- `pageSize: Int`
  - This is the resolved `state.pageSize` value.

### Example

```js
const state = useTableState({ pageSize: 20, pageIndex: 1 })

const { rows } = useTable(
  {
    // state[0] === { pageSize: 20, pageIndex: 1 }
    state,
  },
  usePagination
)
```

## `useTokenPagination`

- Plugin Hook
- Optional

`useTokenPagination` is the hook that **aids in implementing row pagination using tokens**. It is useful for server-side pagination implementations that use **tokens** instead of page index. For more information on pagination, see [Pagination](TODO)

> Documentation Coming Soon...

## `useTableState`

- Optional

`useTableState` is a hook that allows you to hoist the table state out of the table into your own code. You should use this hook if you need to:

- Know about the internal table state
- React to changes to the internal table state
- Manually control or override the internal table state

Some common use cases for this hook are:

- Reacting to `pageIndex` and `pageSize` changes for server-side pagination to fetch new data
- Disallowing specific states via a custom state reducer
- Enabling parent/unrelated components to manipulate the table state

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState: Object`
  - Optional
  - The initial state object for the table.
  - This object is **merged over the `defaultState` object** (eg. `{...defaultState, ...initialState}`) that React Table and its hooks use to register default state to produce the final initial state object passed to the resolved `useState` hook.
- `overrides: Object`
  - Optional
  - Must be **memoized**
  - This object is **merged over the current table state** (eg. `{...state, ...overrides}`) to produce the final state object that is then passed to the `useTable` options
- `options: Object`
  - `reducer: Function(oldState, newState) => finalState`
    - Optional
    - Inspired by Kent C. Dodd's [State Reducer Pattern](https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks)
    - With every `setState` call to a table state (even internally), this reducer is called and is allowed to modify the final state object for updating.
    - It is passed the `oldState`, the `newState`, and an action `type`.
  - `useState`
    - Optional
    - Defaults to `React.useState`
    - This function, if defined will be used as the state hook internally instead of the default `React.useState`. This can be useful for implementing custom state storage hooks like useLocalStorage, etc.

### Instance Variables

- `tableStateTuple: [tableState, setTableState]`
  - Similar in structure to the result of `React.useState`
  - **Memoized**. This tuple array will not change between renders unless state or `useTableState` options change.
  - `tableState: Object`
    - This is the final state object of the table, which is the product of the `initialState`, `overrides` and the `reducer` options (if applicable)
  - `setTableState: Function(updater, type) => void`
    - This function is used both internally by React Table, and optionally by you (the developer) to update the table state programmatically.
    - `updater: Function`
      - This function signature is **almost** (see next point) identical to the functional API exposed by `React.setState`. It is passed the previous state and is expected to return a new version of the state.
      - **NOTE: `updater` must be a function. Passing a replacement object is not supported as it is with React.useState**
    - `type: String`
      - The [action type](TODO) corresponding to what action being taken against the state.

### Example

```js
export default function MyTable({ manualPageIndex }) {
  // This is the initial state for our table
  const initialState = { pageSize: 10, pageIndex: 0 }

  // Here, we can override the pageIndex
  // regardless of the internal table state
  const overrides = React.useMemo(() => ({
    pageIndex: manualPageIndex,
  }))

  const state = useTableState(initialState, overrides)

  // You can use effects to observe changes to the state
  React.useEffect(() => {
    console.log('Page Size Changed!', initialState.pageSize)
  }, [initialState.pageSize])

  const { rows } = useTable({
    state,
  })
}
```

<!-- # Guides

## Client Side Pagination

To add client side pagination, use the `usePagination` hook:

```diff
// Import React
import React from 'react'

// Import React Table
import {
  useTable,
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

``` -->

<!-- # Setup

To begin using React Table you will need to start with a UI to render it. Below is a very basic component that should serve as a good starting point for most projects:

```js
// Import React
import React from 'react'

// Import React Table
import {
  useTable,
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
``` -->

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
