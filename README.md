<div style="text-align:center;">
  <a href="https://github.com/react-tools/react-table" target="\_parent"><img src="https://github.com/react-tools/media/raw/master/logo-react-table.png" alt="React Table Logo" style="width:450px;"/></a>
</div>

# React Table
`react-table` is a **lightweight, fast and extendable datagrid** built for React

<a href="https://travis-ci.org/react-tools/react-table" target="\_parent">
  <img alt="" src="https://travis-ci.org/react-tools/react-table.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-table.svg" />
</a>
<a href="https://react-chat-signup.herokuapp.com/" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/slack-react--chat-blue.svg" />
</a>
<a href="https://github.com/react-tools/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/react-tools/react-table.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>
<a href="https://cash.me/$tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/%24-Donate-brightgreen.svg" />
</a>

<br />
<br />

[![Sponsor](https://app.codesponsor.io/embed/zpmS8V9r31sBSCeVzP7Wm6Sr/react-tools/react-table.svg)](https://app.codesponsor.io/link/zpmS8V9r31sBSCeVzP7Wm6Sr/react-tools/react-table)

## Features
- Lightweight at 11kb (and just 2kb more for styles)
- Fully customizable (JSX, templates, state, styles, callbacks)
- Client-side & Server-side pagination
- Multi-sort
- Filters
- Pivoting & Aggregation
- Minimal design & easily themeable
- Fully controllable via optional props and callbacks
- <a href="https://medium.com/@tannerlinsley/why-i-wrote-react-table-and-the-problems-it-has-solved-for-nozzle-others-445c4e93d4a8#.axza4ixba" target="\_parent">"Why I wrote React Table and the problems it has solved for Nozzle.io"</a> by Tanner Linsley

## [Demos and examples](http://react-table.js.org/#/story/simple-table)

## Versions
- This documentation is for version 6 of react-table.
- [View the Changelog](https://github.com/react-tools/react-table/blob/master/CHANGELOG.md)
- Previous versions:
  - [5.x.x Readme](https://github.com/react-tools/react-table/blob/ad7d31cd3978eb45da7c6194dbab93c1e9a8594d/README.md)

## Table of Contents
- [Installation](#installation)
- [Example](#example)
- [Data](#data)
- [Props](#props)
- [Columns](#columns)
- [Column Header Groups](#column-header-groups)
- [Custom Cell and Header and Footer Rendering](#custom-cell-header-and-footer-rendering)
- [Styles](#styles)
- [Custom Props](#custom-props)
- [Pivoting and Aggregation](#pivoting-and-aggregation)
- [Sub Tables and Sub Components](#sub-tables-and-sub-components)
- [Server-side Data](#server-side-data)
- [Fully Controlled Component](#fully-controlled-component)
- [Functional Rendering](#functional-rendering)
- [Multi-Sort](#multi-sort)
- [Filtering](#filtering)
- [Component Overrides](#component-overrides)
- [Contributing](#contributing)
- [Scripts](#scripts)
- [Used By](#used-by)


## Installation
1. Install React Table as a dependency
```bash
# Yarn
$ yarn add react-table

# NPM
$ npm install react-table
```
2. Import the `react-table` module
```javascript
// ES6
import ReactTable from 'react-table'
// ES5
var ReactTable = require('react-table').default
```
3. Import styles by including `react-table.css`
```javascript
// JS (Webpack)
import 'react-table/react-table.css'
// Old-school
<link rel="stylesheet" href="node_modules/react-table/react-table.css">
```
##### CDN
```html
  <!-- CSS -->
  <link rel="stylesheet" href="https://unpkg.com/react-table@latest/react-table.css">

  <!-- JS -->
  <script src="https://unpkg.com/react-table@latest/react-table.js"></script>

  <script>
    var ReactTable = window.ReactTable.default
  </script>
```


## Example
```javascript
import ReactTable from 'react-table'

render() {
  const data = [{
    name: 'Tanner Linsley',
    age: 26,
    friend: {
      name: 'Jason Maurer',
      age: 23,
    }
  },{
    ...
  }]

  const columns = [{
    Header: 'Name',
    accessor: 'name' // String-based value accessors!
  }, {
    Header: 'Age',
    accessor: 'age',
    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }, {
    id: 'friendName', // Required because our accessor is not a string
    Header: 'Friend Name',
    accessor: d => d.friend.name // Custom value accessors!
  }, {
    Header: props => <span>Friend Age</span>, // Custom header components!
    accessor: 'friend.age'
  }]

  <ReactTable
    data={data}
    columns={columns}
  />
}
```

## Data
Simply pass the `data` prop anything that resembles an array or object. Client-side sorting and pagination are built in, and your table will update gracefully as you change any props. [Server-side data](#server-side-data) is also supported!


## Props
These are all of the available props (and their default values) for the main `<ReactTable />` component.
```javascript
{
  // General
  data: [],
  loading: false,
  showPagination: true,
  showPaginationTop: false,
  showPaginationBottom: true
  showPageSizeOptions: true,
  pageSizeOptions: [5, 10, 20, 25, 50, 100],
  defaultPageSize: 20,
  minRows: undefined,
  showPageJump: true,
  collapseOnSortingChange: true,
  collapseOnPageChange: true,
  collapseOnDataChange: true,
  freezeWhenExpanded: false,
  sortable: true,
  multiSort: true,
  resizable: true,
  filterable: false,
  defaultSortDesc: false,
  defaultSorted: [],
  defaultFiltered: [],
  defaultResized: [],
  defaultExpanded: {},
  defaultFilterMethod: (filter, row, column) => {
    const id = filter.pivotId || filter.id
    return row[id] !== undefined ? String(row[id]).startsWith(filter.value) : true
  },
  defaultSortMethod: (a, b, desc) => {
    // force null and undefined to the bottom
    a = (a === null || a === undefined) ? -Infinity : a
    b = (b === null || b === undefined) ? -Infinity : b
    // force any string values to lowercase
    a = a === 'string' ? a.toLowerCase() : a
    b = b === 'string' ? b.toLowerCase() : b
    // Return either 1 or -1 to indicate a sort priority
    if (a > b) {
      return 1
    }
    if (a < b) {
      return -1
    }
    // returning 0, undefined or any falsey value will use subsequent sorts or the index as a tiebreaker
    return 0
  },
  PadRowComponent: () => <span>&nbsp;</span>, // the content rendered inside of a padding row

  // Controlled State Overrides (see Fully Controlled Component section)
  page: undefined,
  pageSize: undefined,
  sorted: [],
  filtered: [],
  resized: [],
  expanded: {},

  // Controlled State Callbacks
  onPageChange: undefined,
  onPageSizeChange: undefined,
  onSortedChange: undefined,
  onFilteredChange: undefined,
  onResizedChange: undefined,
  onExpandedChange: undefined,

  // Pivoting
  pivotBy: undefined,

  // Key Constants
  pivotValKey: '_pivotVal',
  pivotIDKey: '_pivotID',
  subRowsKey: '_subRows',
  aggregatedKey: '_aggregated',
  nestingLevelKey: '_nestingLevel',
  originalKey: '_original',
  indexKey: '_index',
  groupedByPivotKey: '_groupedByPivot',

  // Server-side callbacks
  onFetchData: () => null,

  // Classes
  className: '',
  style: {},

  // Component decorators
  getProps: () => ({}),
  getTableProps: () => ({}),
  getTheadGroupProps: () => ({}),
  getTheadGroupTrProps: () => ({}),
  getTheadGroupThProps: () => ({}),
  getTheadProps: () => ({}),
  getTheadTrProps: () => ({}),
  getTheadThProps: () => ({}),
  getTheadFilterProps: () => ({}),
  getTheadFilterTrProps: () => ({}),
  getTheadFilterThProps: () => ({}),
  getTbodyProps: () => ({}),
  getTrGroupProps: () => ({}),
  getTrProps: () => ({}),
  getThProps: () => ({}),
  getTdProps: () => ({}),
  getTfootProps: () => ({}),
  getTfootTrProps: () => ({}),
  getTfootThProps: () => ({}),
  getPaginationProps: () => ({}),
  getLoadingProps: () => ({}),
  getNoDataProps: () => ({}),
  getResizerProps: () => ({}),

  // Global Column Defaults
  column: {
    // Renderers
    Cell: undefined,
    Header: undefined,
    Footer: undefined,
    Aggregated: undefined,
    Pivot: undefined,
    PivotValue: undefined,
    Expander: undefined,
    Filter: undefined,
    // Standard options
    sortable: undefined, // use table default
    resizable: undefined, // use table default
    filterable: undefined, // use table default
    show: true,
    minWidth: 100,
    // Cells only
    className: '',
    style: {},
    getProps: () => ({}),
    // Headers only
    headerClassName: '',
    headerStyle: {},
    getHeaderProps: () => ({})
    // Footers only
    footerClassName: '',
    footerStyle: {},
    getFooterProps: () => ({}),
    filterAll: false,
    filterMethod: undefined,
    sortMethod: undefined,
    defaultSortDesc: undefined,
  },

  // Global Expander Column Defaults
  expanderDefaults: {
    sortable: false,
    resizable: false,
    filterable: false,
    width: 35
  },

  // Global Pivot Column Defaults
  pivotDefaults: {},

  // Text
  previousText: 'Previous',
  nextText: 'Next',
  loadingText: 'Loading...',
  noDataText: 'No rows found',
  pageText: 'Page',
  ofText: 'of',
  rowsText: 'rows',
}
```

You can easily override the core defaults like so:

```javascript
import { ReactTableDefaults } from 'react-table'

Object.assign(ReactTableDefaults, {
  defaultPageSize: 10,
  minRows: 3,
  // etc...
})
```

Or just define them as props

```javascript
<ReactTable
  defaultPageSize={10}
  minRows={3}
  // etc...
/>
```

## Columns
`<ReactTable />` requires a `columns` prop, which is an array of objects containing the following properties

```javascript
[{
  // Renderers - For more information, see "Renderers" section below
  Cell: JSX | String | Function // Used to render a standard cell, defaults to the accessed value
  Header: JSX | String | Function // Used to render the header of a column or column group
  Footer: JSX | String | Function // Used to render the footer of a column
  Filter: JSX | cellInfo => ( // Used to render the filter UI of a filter-enabled column
    <select onChange={event => onFiltersChange(event.target.value)} value={filter ? filter.value : ''}></select>
    // The value passed to onFiltersChange will be the value passed to filter.value of the filterMethod
  )
  Aggregated: JSX | String | Function // Used to render aggregated cells. Defaults to a comma separated list of values.
  Pivot: JSX | String | Function | cellInfo => ( // Used to render a pivoted cell
    <span>
      <Expander /><PivotValue /> // By default, will utilize the the PivotValue and Expander components at run time
    </span>
  ),
  PivotValue: JSX | String | Function // Used to render the value inside of a Pivot cell
  Expander: JSX | String | Function // Used to render the expander in both Pivot and Expander cells

  // General
  accessor: 'propertyName', // or Accessor eg. (row) => row.propertyName (see "Accessors" section for more details)
  id: 'myProperty', // Conditional - A unique ID is required if the accessor is not a string or if you would like to override the column name used in server-side calls
  sortable: boolean, // Overrides the table option
  resizable: boolean, // Overrides the table option
  filterable: boolean, // Overrides the table option
  show: true, // can be used to hide a column
  width: undefined, // A hardcoded width for the column. This overrides both min and max width options
  minWidth: 100, // A minimum width for this column. If there is extra room, column will flex to fill available space (up to the max-width, if set)
  maxWidth: undefined, // A maximum width for this column.

  // Special
  pivot: false,
  // Turns this column into a special column for specifying pivot position in your column definitions.
  // The `pivotDefaults` options will be applied on top of this column's options.
  // It will also let you specify rendering of the header (and header group if this special column is placed in the `columns` option of another column)
  expander: false,
  // Turns this column into a special column for specifying expander position and options in your column definitions.
  // The `expanderDefaults` options will be applied on top of this column's options.
  // It will also let you specify rendering of the header (and header group if this special column is placed in the `columns` option of another column) and
  // the rendering of the expander itself via the `Expander` property

  // Cell Options
  className: '', // Set the classname of the `td` element of the column
  style: {}, // Set the style of the `td` element of the column
  // Header & HeaderGroup Options
  headerClassName: '', // Set the classname of the `th` element of the column
  headerStyle: {}, // Set the style of the `th` element of the column
  getHeaderProps: (state, rowInfo, column, instance) => ({}), // a function that returns props to decorate the `th` element of the column

  // Header Groups only
  columns: [...], // See Header Groups section below

  // Footer
  footerClassName: '', // Set the classname of the `td` element of the column's footer
  footerStyle: {}, // Set the style of the `td` element of the column's footer
  getFooterProps: (state, rowInfo, column, instance) => ({}), // A function that returns props to decorate the `td` element of the column's footer

  // Filtering
  filterMethod: (filter, row || rows, column) => {return true}, // A function returning a boolean that specifies the filtering logic for the column
    // 'filter' == an object specifying which filter is being applied. Format: {id: [the filter column's id], value: [the value the user typed in the filter field], pivotId: [if filtering on a pivot column, the pivotId will be set to the pivot column's id and the `id` field will be set to the top level pivoting column]}
    // 'row' || 'rows' == the row (or rows, if filterAll is set to true) of data supplied to the table
    // 'column' == the column that the filter is on
  filterAll: false
}]
```

## Renderers
React Table supports very flexible renderers for just about everything:
- `Cell` - Renders a standard cell
- `Header` - Renders a column header or column group header
- `Footer` - Renders a column footer
- `Filter` - Renders a column's filter UI
- `Aggregated` - Renders an aggregated cell
- `Pivot` - Renders a pivoted cell (by default, will utilize `Expander` and `PivotValue` renderers)
- `PivotValue` - Renders the value inside a `Pivot` renderer
- `Expander` - Renders the Expander used in both the default `Pivot` renderer and any expander-designated column

Any of these renderers can be one of the following:
- A React Class
- JSX or any rendered react component
- Stateless functional component
- Function that returns any primitive

All of these formats receive the following props:
```javascript
{
  // Row-level props
  row: Object, // the materialized row of data
  original: , // the original row of data
  index: '', // the index of the row in the original arra
  viewIndex: '', // the index of the row relative to the current view
  level: '', // the nesting level of this row
  nestingPath: '', // the nesting path of this row
  aggregated: '', // true if this row's values were aggregated
  groupedByPivot: '', // true if this row was produced by a pivot
  subRows: '', // any sub rows defined by the `subRowKey` prop

  // Cells-level props
  isExpanded: '', // true if this row is expanded
  value: '', // the materialized value of this cell
  resized: '', // the resize information for this cell's column
  show: '', // true if the column is visible
  width: '', // the resolved width of this cell
  maxWidth: '', // the resolved maxWidth of this cell
  tdProps: '', // the resolved tdProps from `getTdProps` for this cell
  columnProps: '', // the resolved column props from 'getProps' for this cell's column
  classes: '', // the resolved array of classes for this cell
  styles: '' // the resolved styles for this cell
}
```

## Accessors
Accessors are functions that return the value to populate the row's value for the column.
This lets the render function not have to worry about accessing the correct data, the value is automatically populated in it's props.

If a `string` or `array` is passed the default accessor is used.
The default accessor will parse the input into an array and recursively flatten it.
Any values that contain a dot (`.`) will be split.
Any values that contain bracket (`[]`) will be split.
This array is then used as the path to the value to return.

("$" is the placeholder value that would be returned by the default accessor)

| value        | path            | data                   |
|--------------|-----------------|------------------------|
| "a"          | ["a"]           | {"a": $}               |
| "a.b"        | ["a", "b"]      | {"a": {"b": $}}        |
| "a[0]"       | ["a", "0"]      | {"a": [$]}             |
| ["a.b", "c"] | ["a", "b", "c"] | {"a": {"b": {"c": $}}} |

*NOTE*
If your data has a field/key with a dot (`.`) you will need to supply a custom accessor.


## Column Header Groups
To group columns with another header column, just nest your columns in a header column. Header columns utilize the same header properties as regular columns.
```javascript
const columns = [{
  Header: 'Favorites',
  headerClassName: 'my-favorites-column-header-group'
  columns: [{
    Header: 'Color',
    accessor: 'favorites.color'
  }, {
    Header: 'Food',
    accessor: 'favorites.food'
  }, {
    Header: 'Actor',
    accessor: 'favorites.actor'
  }]
}]
```

## Custom Cell, Header and Footer Rendering
You can use any react component or JSX to display content in column headers, cells and footers. Any component you use will be passed the following props (if available):
- `row` - Original row from your data
- `row` - The post-accessed values from the original row
- `index` - The index of the row
- `viewIndex` - the index of the row relative to the current page
- `level` - The nesting depth (zero-indexed)
- `nestingPath` - The nesting path of the row
- `aggregated` - A boolean stating if the row is an aggregation row
- `subRows` - An array of any expandable sub-rows contained in this row

```javascript
// This column uses a stateless component to produce a different colored bar depending on the value
// You can also use stateful components or any other function that returns JSX
const columns = [{
  Header: () => <span><i className='fa-tasks' /> Progress</span>,
  accessor: 'progress',
  Cell: row => (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#dadada',
        borderRadius: '2px'
      }}
    >
      <div
        style={{
          width: `${row.value}%`,
          height: '100%',
          backgroundColor: row.value > 66 ? '#85cc00'
            : row.value > 33 ? '#ffbf00'
            : '#ff2e00',
          borderRadius: '2px',
          transition: 'all .2s ease-out'
        }}
      />
    </div>
  )
}]
```

## Styles
- React-table ships with a minimal and clean stylesheet to get you on your feet quickly.
- The stylesheet is located at `react-table/react-table.css`.
- There are countless ways to import a stylesheet. If you have questions on how to do so, consult the documentation of your build system.

#### Classes
- Adding a `-striped` className to ReactTable will slightly color odd numbered rows for legibility
- Adding a `-highlight` className to ReactTable will highlight any row as you hover over it

#### CSS
We think the default styles looks great! But, if you prefer a more custom look, all of the included styles are easily overridable. Every single component contains a unique class that makes it super easy to customize. Just go for it!

#### JS Styles
Every single react-table element and `get[ComponentName]Props` callback supports `classname` and `style` props.

## Custom Props

#### Built-in Components
Every single built-in component's props can be dynamically extended using any one of these prop-callbacks:
```javascript
<ReactTable
  getProps={fn}
  getTableProps={fn}
  getTheadGroupProps={fn}
  getTheadGroupTrProps={fn}
  getTheadGroupThProps={fn}
  getTheadProps={fn}
  getTheadTrProps={fn}
  getTheadThProps={fn}
  getTbodyProps={fn}
  getTrGroupProps={fn}
  getTrProps={fn}
  getThProps={fn}
  getTdProps={fn}
  getPaginationProps={fn}
  getLoadingProps={fn}
  getNoDataProps={fn}
  getResizerProps={fn}
/>
```

If used, **a callback prop must return an valid object**, even if it's an empty one.

These callbacks are executed with each render of the element with four parameters:
 1. Table State
 2. RowInfo (undefined if not applicable)
 3. Column (undefined if not applicable)
 4. React Table Instance

This makes it extremely easy to add, say... a row click callback!
```javascript
// When any Td element is clicked, we'll log out some information
<ReactTable
  getTdProps={(state, rowInfo, column, instance) => {
    return {
      onClick: (e, handleOriginal) => {
        console.log('A Td Element was clicked!')
        console.log('it produced this event:', e)
        console.log('It was in this column:', column)
        console.log('It was in this row:', rowInfo)
        console.log('It was in this table instance:', instance)

        // IMPORTANT! React-Table uses onClick internally to trigger
        // events like expanding SubComponents and pivots.
        // By default a custom 'onClick' handler will override this functionality.
        // If you want to fire the original onClick handler, call the
        // 'handleOriginal' function.
        if (handleOriginal) {
          handleOriginal()
        }
      }
    }
  }}
/>
```

You can use these callbacks for dynamic styling as well!
```javascript
// Any Tr element will be green if its (row.age > 20)
<ReactTable
  getTrProps={(state, rowInfo, column) => {
    return {
      style: {
        background: rowInfo.row.age > 20 ? 'green' : 'red'
      }
    }
  }}
/>
```

#### Column Components
Just as core components can have dynamic props, columns and column headers can too!

You can utilize either of these prop callbacks on columns:
```javascript
const columns = [{
  getHeaderProps: () => (...),
  getProps: () => (...)
}]
```

In a similar fashion these can be used to dynamically style just about anything!
```javascript
// This columns cells will be red if (row.name === Santa Clause)
const columns = [{
  getProps: (state, rowInfo, column) => {
    return {
      style: {
        background: rowInfo.row.name === 'Santa Clause' ? 'red' : null
      }
    }
  }
}]
```

## Pivoting and Aggregation
Pivoting the table will group records together based on their accessed values and allow the rows in that group to be expanded underneath it.
To pivot, pass an array of `columnID`'s to `pivotBy`. Remember, a column's `id` is either the one that you assign it (when using a custom accessors) or its `accessor` string.
```javascript
<ReactTable
  ...
  pivotBy={['lastName', 'age']}
/>
```

Naturally when grouping rows together, you may want to aggregate the rows inside it into the grouped column. No aggregation is done by default, however, it is very simple to aggregate any pivoted columns:
```javascript
// In this example, we use lodash to sum and average the values, but you can use whatever you want to aggregate.
const columns = [{
  Header: 'Age',
  accessor: 'age',
  aggregate: (values, rows) => _.round(_.mean(values)),
  Aggregated: row => {
    // You can even render the cell differently if it's an aggregated cell
    return <span>row.value (avg)</span>
  }
}, {
  Header: 'Visits',
  accessor: 'visits',
  aggregate: (values, rows) => _.sum(values)
}]
```

Pivoted columns can be sorted just like regular columns including holding down the `<shift>` button to multi-sort.

## Sub Tables and Sub Components
By adding a `SubComponent` props, you can easily add an expansion level to all root-level rows:
```javascript
<ReactTable
  data={data}
  columns={columns}
  defaultPageSize={10}
  SubComponent={(row) => {
    return (
      <div>
        You can put any component you want here, even another React Table! You even have access to the row-level data if you need!  Spark-charts, drill-throughs, infographics... the possibilities are endless!
      </div>
    )
  }}
/>
```


## Server-side Data
If you want to handle pagination, sorting, and filtering on the server, `react-table` makes it easy on you.

1. Feed React Table `data` from somewhere dynamic. eg. `state`, a redux store, etc...
1. Add `manual` as a prop. This informs React Table that you'll be handling sorting and pagination server-side
1. Subscribe to the `onFetchData` prop. This function is called at `compomentDidMount` and any time sorting, pagination or filterting is changed in the table
1. In the `onFetchData` callback, request your data using the provided information in the params of the function (current state and instance)
1. Update your data with the rows to be displayed
1. Optionally set how many pages there are total

```javascript
<ReactTable
  ...
  data={this.state.data} // should default to []
  pages={this.state.pages} // should default to -1 (which means we don't know how many pages we have)
  loading={this.state.loading}
  manual // informs React Table that you'll be handling sorting and pagination server-side
  onFetchData={(state, instance) => {
    // show the loading overlay
    this.setState({loading: true})
    // fetch your data
    Axios.post('mysite.com/data', {
      page: state.page,
      pageSize: state.pageSize,
      sorted: state.sorted,
      filtered: state.filtered
    })
      .then((res) => {
        // Update react-table
        this.setState({
          data: res.data.rows,
          pages: res.data.pages,
          loading: false
        })
      })
  }}
/>
```

For a detailed example, take a peek at our <a href="https://github.com/react-tools/react-table/blob/master/stories/ServerSide.js" target="\_parent">async table mockup</a>

## Fully Controlled Component
React Table by default works fantastically out of the box, but you can achieve even more control and customization if you choose to maintain the state yourself. It is very easy to do, even if you only want to manage *parts* of the state.

Here are the props and their corresponding callbacks that control the state of the a table:
```javascript
<ReactTable
  // Props
  page={0} // the index of the page you wish to display
  pageSize={20} // the number of rows per page to be displayed
  sorted={[{ // the sorting model for the table
      id: 'lastName',
      desc: true
    }, {
      id: 'firstName',
      desc: true
  }]}
  expanded={{ // The nested row indexes on the current page that should appear expanded
    1: true,
    4: true,
    5: {
      2: true,
      3: true
    }
  }}
  filtered={[{ // the current filters model
    id: 'lastName',
    value: 'linsley'
  }]}
  resized={[{ // the current resized column model
    "id": "lastName",
    "value": 446.25
  }]}

  // Callbacks
  onPageChange={(pageIndex) => {...}} // Called when the page index is changed by the user
  onPageSizeChange={(pageSize, pageIndex) => {...}} // Called when the pageSize is changed by the user. The resolve page is also sent to maintain approximate position in the data
  onSortedChange={(newSorted, column, shiftKey) => {...}} // Called when a sortable column header is clicked with the column itself and if the shiftkey was held. If the column is a pivoted column, `column` will be an array of columns
  onExpandedChange={(newExpanded, index, event) => {...}} // Called when an expander is clicked. Use this to manage `expanded`
  onFilteredChange={(column, value) => {...}} // Called when a user enters a value into a filter input field or the value passed to the onFiltersChange handler by the Filter option.
  onResizedChange={(newResized, event) => {...}} // Called when a user clicks on a resizing component (the right edge of a column header)
/>
```

## Functional Rendering
Possibly one of the coolest features of React-Table is its ability to expose internal components and state for custom render logic. The easiest way to do this is to pass a function as the child of `<ReactTable />`.

The function you pass will be called with the following items:
- Fully-resolved state of the table
- A function that returns the standard table component
- The instance of the component

You can then return any JSX or react you want! This turns out to be perfect for:
- Accessing the internal state of the table without a `ref`
- Decorating the table or extending it with your own UI
- Building your own custom display logic

Accessing internal state and wrapping with more UI:
```javascript
<ReactTable
  data={data}
  columns={columns}
>
  {(state, makeTable, instance) => {
    return (
      <div style={{
        background: '#ffcf00',
        borderRadius: '5px',
        overflow: 'hidden',
        padding: '5px'
      }}>
        <pre><code>state.allVisibleColumns === {JSON.stringify(state.allVisibleColumns, null, 4)}</code></pre>
        {makeTable()}
      </div>
    )
  }}
</ReactTable>
```

The possibilities are endless!

## Sorting
Sorting comes built in with React-Table.
- Click a column header to sort by its accessor.
- Click it again to reverse the sort.
- Set `defaultSortDesc` property to `true` to make the first sort direction default to descending.
- Override a specific column's default sort direction by using the same `defaultSortDesc` property on a column, set to `true`

## Multi-Sort
When clicking on a column header, hold shift to multi-sort! You can toggle `ascending` `descending` and `none` for multi-sort columns. Clicking on a header without holding shift will clear the multi-sort and replace it with the single sort of that column. It's quite handy!

You can set the `multiSort` prop to `false` to disable this feature (which may be useful for server-side sorting when you are not
going to sort multiple columns).

## Custom Sorting Algorithm
To override the default sorting algorithm for the whole table use the `defaultSortMethod` prop.

To override the sorting algorithm for a single column, use the `sortMethod` column property.

Supply a function that implements the native javascript [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) interface. This is React Table's default sorting algorithm:
- `a` the first value to compare
- `b` the second value to compare
- `desc` true if sort is descending, false if ascending
```javascript
defaultSortMethod = (a, b, desc) => {
  // force null and undefined to the bottom
  a = (a === null || a === undefined) ? -Infinity : a
  b = (b === null || b === undefined) ? -Infinity : b
  // force any string values to lowercase
  a = typeof a === 'string' ? a.toLowerCase() : a
  b = typeof b === 'string' ? b.toLowerCase() : b
  // Return either 1 or -1 to indicate a sort priority
  if (a > b) {
    return 1
  }
  if (a < b) {
    return -1
  }
  // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
  return 0
}
```

## Filtering
Filtering can be enabled by setting the `filterable` option on the table.

If you don't want particular column to be filtered you can set the `filterable={false}` option on the column.

By default the table tries to filter by checking if the row's value starts with the filter text. The default method for filtering the table can be set with the table's `defaultFilterMethod` option.

If you want to override a particular column's filtering method, you can set the `filterMethod` option on a column.

By default, `filterMethod` is passed a single row of data at a time, and you are responsible for returning `true` or `false`, indicating whether it should be shown.

Alternatively, you can set `filterAll` to `true`, and `filterMethod` will be passed the entire array of rows to be filtered, and you will then be responsible for returning the new filtered array. This is extremely handy when you need to utilize a utility like fuzzy matching that requires the entire array of items.

To completely override the filter that is shown, you can set the `Filter` column option. Using this option you can specify the JSX that is shown. The option is passed an `onChange` method which must be called with the the value that you want to pass to the `filterMethod` option whenever the filter has changed.

See <a href="http://react-table.js.org/#/story/custom-filtering" target="\_parent">Custom Filtering</a> demo for examples.

## Component Overrides
Though we confidently stand by the markup and architecture behind it, `react-table` does offer the ability to change the core componentry it uses to render everything. You can extend or override these internal components by passing a react component to it's corresponding prop on either the global props or on a one-off basis like so:
```javascript
// Change the global default
import { ReactTableDefaults } from 'react-table'
Object.assign(ReactTableDefaults, {
  TableComponent: component,
  TheadComponent: component,
  TbodyComponent: component,
  TrGroupComponent: component,
  TrComponent: component,
  ThComponent: component,
  TdComponent: component,
  TfootComponent: component,
  ExpanderComponent: component,
  AggregatedComponent: component,
  PivotValueComponent: component,
  PivotComponent: component,
  FilterComponent: component,
  PaginationComponent: component,
  PreviousComponent: undefined,
  NextComponent: undefined,
  LoadingComponent: component,
  NoDataComponent: component,
  ResizerComponent: component
})

// Or change per instance
<ReactTable
  TableComponent={Component},
  TheadComponent={Component},
  // etc...
  />
```

If you choose to change the core components React-Table uses to render, you must make sure your replacement components consume and utilize all of the supplied and inherited props that are needed for that component to function properly. We would suggest investigating <a href="https://github.com/react-tools/react-table/blob/master/src/index.js" target="\_parent">the source</a> for the component you wish to replace.


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

#### Scripts

- `$ yarn run watch` Watches files and builds via babel
- `$ yarn run docs` Runs the storybook server
- `$ yarn run test` Runs the test suite

## Used By

<a href='https://nozzle.io' target="\_parent">
  <img src='https://nozzle.io/img/logo-blue.png' alt='Nozzle Logo' style='width:300px;'/>
</a>
