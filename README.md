<div align="center">
  <a href="https://github.com/tannerlinsley/react-table" target="\_parent"><img src="https://github.com/tannerlinsley/react-table/raw/master/media/Banner.png" alt="React Table Logo" style="width:450px;"/></a>
  <br />
  <br />

</div>

# React Table
`react-table` is a **lightweight, fast and extendable datagrid** built for React


<a href="https://travis-ci.org/tannerlinsley/react-table" target="\_parent">
  <img alt="" src="https://travis-ci.org/tannerlinsley/react-table.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-table.svg" />
</a>
<a href="https://react-chat-signup.herokuapp.com/" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/slack-react--chat-blue.svg" />
</a>
<a href="https://github.com/tannerlinsley/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/tannerlinsley/react-table.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

## Features

- Lightweight at 7kb (and just 2kb more for styles)
- Fully customizable JSX templating
- Supports both Client-side & Server-side pagination and multi-sorting
- Column Pivoting & Aggregation
- Minimal design & easily themeable
- Fully controllable via optional props and callbacks
- <a href="https://medium.com/@tannerlinsley/why-i-wrote-react-table-and-the-problems-it-has-solved-for-nozzle-others-445c4e93d4a8#.axza4ixba" target="\_parent">"Why I wrote React Table and the problems it has solved for Nozzle.io</a> by Tanner Linsley

## <a href="http://react-table.js.org/?selectedKind=2.%20Demos&selectedStory=Client-side%20Data&full=0&down=0&left=1&panelRight=0&downPanel=kadirahq%2Fstorybook-addon-actions%2Factions-panel" target="\_parent">Demo</a>

## Table of Contents
- [Installation](#installation)
- [Example](#example)
- [Data](#data)
- [Props](#props)
- [Columns](#columns)
- [Column Header Groups](#column-header-groups)
- [Custom Cell & Header Rendering](#custom-cell--and-header-rendering)
- [Styles](#styles)
- [Custom Props](#custom-props)
- [Pivoting & Aggregation](#pivoting--aggregation)
- [Sub Tables & Sub Components](#sub-tables--sub-components)
- [Server-side Data](#server-side-data)
- [Fully Controlled Component](#fully-controlled-component)
- [Functional Rendering](#functional-rendering)
- [Multi-Sort](#multi-sort)
- [Component Overrides](#component-overrides)
- [Contributing](#contributing)
- [Scripts](#scripts)
- [Used By](#used-by)


## Installation
1. Install React Table as a dependency
```bash
$ npm install react-table
# or
$ yarn add react-table
```
2. Import the `react-table` module
```javascript
// ES6
import ReactTable from 'react-table'
// ES5
var ReactTable = require('react-table').default
```
3. Import styles by including `react-table.css` anywhere on the page
```javascript
// JS (Webpack)
import 'react-table/react-table.css'
// html
<link rel="stylesheet" href="node_modules/react-table/react-table.css">
```


## Example
```javascript
import ReactTable from 'react-table'

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
  header: 'Name',
  accessor: 'name' // String-based value accessors !
}, {
  header: 'Age',
  accessor: 'age',
  render: props => <span className='number'>{props.value}</span> // Custom cell components!
}, {
  header: 'Friend Name',
  accessor: d => d.friend.name // Custom value accessors!
}, {
  header: props => <span>Friend Age</span>, // Custom header components!
  accessor: 'friend.age'
}]

<ReactTable
  data={data}
  columns={columns}
/>
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
  showPageSizeOptions: true,
  pageSizeOptions: [5, 10, 20, 25, 50, 100],
  defaultPageSize: 20,
  showPageJump: true,
  expanderColumnWidth: 35,
  collapseOnSortingChange: false,
  collapseOnPageChange: true,
  freezeWhenExpanded: false,
  defaultSorting: [],

  // Controlled State Overrides (see Fully Controlled Component section)
  page: undefined,
  pageSize: undefined,
  sorting: undefined

  // Controlled State Callbacks
  onExpandSubComponent: undefined,
  onPageChange: undefined,
  onPageSizeChange: undefined,
  onSortingChange: undefined,

  // Pivoting
  pivotBy: undefined,
  pivotColumnWidth: 200,
  pivotValKey: '_pivotVal',
  pivotIDKey: '_pivotID',
  subRowsKey: '_subRows',

  // Pivoting State Overrides (see Fully Controlled Component section)
  expandedRows: {},

  // Pivoting State Callbacks
  onExpandRow: undefined,

  // General Callbacks
  onChange: () => null,

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
  getTbodyProps: () => ({}),
  getTrGroupProps: () => ({}),
  getTrProps: () => ({}),
  getThProps: () => ({}),
  getTdProps: () => ({}),
  getPaginationProps: () => ({}),
  getLoadingProps: () => ({}),
  getNoDataProps: () => ({}),

  // Global Column Defaults
  column: {
    sortable: true,
    show: true,
    minWidth: 100,
    // Cells only
    render: undefined,
    className: '',
    style: {},
    getProps: () => ({}),
    // Headers only
    header: undefined,
    headerClassName: '',
    headerStyle: {},
    getHeaderProps: () => ({})
  },

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
`<ReactTable/>` requires a `columns` prop, which is an array of objects containing the following properties

```javascript
[{
  // General
  accessor: 'propertyName' or Accessor eg. (row) => row.propertyName,
  id: 'myProperty', // Conditional - A unique ID is required if the accessor is not a string or if you would like to override the column name used in server-side calls
  sortable: true,
  show: true, // can be used to hide a column
  width: undefined, // A hardcoded width for the column. This overrides both min and max width options
  minWidth: 100 // A minimum width for this column. If there is extra room, column will flex to fill available space (up to the max-width, if set)
  maxWidth: undefined // A maximum width for this column.

  // Special
  expander: false // This option will override all data-related options and designates the column to be used
  // for pivoting and sub-component expansion

  // Cell Options
  className: '', // Set the classname of the `td` element of the column
  style: {}, // Set the style of the `td` element of the column
  render: JSX eg. (rowInfo: {value, rowValues, row, index, viewIndex}) => <span>{value}</span>, // Provide a JSX element or stateless function to render whatever you want as the column's cell with access to the entire row
    // value == the accessed value of the column
    // rowValues == an object of all of the accessed values for the row
    // row == the original row of data supplied to the table
    // index == the original index of the data supplied to the table
    // viewIndex == the index of the row in the current page

  // Header & HeaderGroup Options
  header: 'Header Name' or JSX eg. ({data, column}) => <div>Header Name</div>,
  headerClassName: '', // Set the classname of the `th` element of the column
  headerStyle: {}, // Set the style of the `th` element of the column

  // Header Groups only
  columns: [...] // See Header Groups section below

}]
```

## Column Header Groups
To group columns with another header column, just nest your columns in a header column.  Header columns utilize the same header properties as regular columns.
```javascript
const columns = [{
  header: 'Favorites',
  headerClassName: 'my-favorites-column-header-group'
  columns: [{
    header: 'Color',
    accessor: 'favorites.color'
  }, {
    header: 'Food',
    accessor: 'favorites.food'
  } {
    header: 'Actor',
    accessor: 'favorites.actor'
  }]
}]
```

## Custom Cell & Header Rendering
You can use any react component or JSX to display column headers or cells. Any component you use will be passed the following props:
- `row` - Original row from your data
- `rowValues` - The post-accessed values from the original row
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
  header: () => <span><i className='fa-tasks' /> Progress</span>,
  accessor: 'progress',
  render: row => (
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
React-table ships with a minimal and clean stylesheet to get you on your feet quickly. It's located at `react-table/react-table.css`.

#### Built-in Styles
- Adding a `-striped` className to ReactTable will slightly color odd numbered rows for legibility
- Adding a `-highlight` className to ReactTable will highlight any row as you hover over it

#### CSS Styles
We think the default styles looks great! But, if you prefer a more custom look, all of the included styles are easily overridable. Every single component contains a unique class that makes it super easy to customize. Just go for it!

#### JS Styles
Every single react-table element and `get[ComponentName]Props` callback support classes (powered by `classname` and js styles.

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
/>
```

These callbacks are executed with each render of the element with three parameters:
1. Table State
1. RowInfo (undefined if not applicable)
1. Column (undefined if not applicable)
1. React Table Instance

This makes it extremely easy to add, say... a row click callback!
```javascript
// When any Td element is clicked, we'll log out some information
<ReactTable
  getTdProps={(state, rowInfo, column, instance) => {
    return {
      onClick: e => {
        console.log('A Td Element was clicked!')
        console.log('it produced this event:', e)
        console.log('It was in this column:', column)
        console.log('It was in this row:', rowInfo)
        console.log('It was in this table instance:', instance)
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
        background: rowInfo.age > 20 ? 'green' : 'red'
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
        background: rowInfo.name === 'Santa Clause' ? 'red' : null
      }
    }
  }
}]
```

## Pivoting & Aggregation
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
  header: 'Age',
  accessor: 'age',
  aggregate: (values, rows) => _.round(_.mean(values)),
  render: row => {
    // You can even render the cell differently if it's an aggregated cell
    return <span>{row.aggregated ? `${row.value} (avg)` : row.value}</span>
  }
}, {
  header: 'Visits',
  accessor: 'visits',
  aggregate: (values, rows) => _.sum(values)
}]
```

Pivoted columns can be sorted just like regular columns, but not independently of each other.  For instance, if you click to sort the pivot column in ascending order, it will sort by each pivot recursively in ascending order together.

## Sub Tables & Sub Components
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
If you want to handle pagination, and sorting on the server, `react-table` makes it easy on you.

1. Feed React Table `data` from somewhere dynamic. eg. `state`, a redux store, etc...
1. Add `manual` as a prop. This informs React Table that you'll be handling sorting and pagination server-side
1. Subscribe to the `onChange` prop. This function is called at `compomentDidMount` and any time sorting or pagination is changed by the user
1. In the `onChange` callback, request your data using the provided information in the params of the function (state and instance)
1. Update your data with the rows to be displayed
1. Optionally set how many pages there are total

```javascript
<ReactTable
  ...
  data={this.state.data} // should default to []
  pages={this.state.pages} // should default to -1 (which means we don't know how many pages we have)
  loading={this.state.loading}
  manual // informs React Table that you'll be handling sorting and pagination server-side
  onChange={(state, instance) => {
    // show the loading overlay
    this.setState({loading: true})
    // fetch your data
    Axios.post('mysite.com/data', {
      page: state.page,
      pageSize: state.pageSize,
      sorting: state.sorting
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

For a detailed example, take a peek at our <a href="https://github.com/tannerlinsley/react-table/blob/master/stories/ServerSide.js" target="\_parent">async table mockup</a>

## Fully Controlled Component
React Table by default works fantastically out of the box, but you can achieve even more control and customization if you choose to maintain the state yourself. It is very easy to do, even if you only want to manage *parts* of the state.

Here are the props and their corresponding callbacks that control the state of the a table:
```javascript
<ReactTable
  // Props
  page={0} // the index of the page you wish to display
  pageSize={20} // the number of rows per page to be displayed
  sorting={[{
      id: 'lastName',
      asc: true
    }, {
      id: 'firstName',
      asc: true
  }]} // the sorting model for the table
  expandedRows={{
    1: true,
    4: true,
    5: {
      2: true,
      3: true
    }
  }} // The nested row indexes on the current page that should appear expanded

  // Callbacks
  onPageChange={(pageIndex) => {...}} // Called when the page index is changed by the user
  onPageSizeChange={(pageSize, pageIndex) => {...}} // Called when the pageSize is changed by the user. The resolve page is also sent to maintain approximate position in the data
  onSortingChange={(column, shiftKey) => {...}} // Called when a sortable column header is clicked with the column itself and if the shiftkey was held. If the column is a pivoted column, `column` will be an array of columns
  onExpandRow={(index, event) => {...}} // Called when an expander is clicked. Use this to manage `expandedRows`
/>
```

## Functional Rendering
Possibly one of the coolest features of React-Table is its ability to expose internal state for custom render logic. The easiest way to do this is to optionally pass a function as a child of `<ReactTable />`.

The function you pass will be called with the following items:
- Fully-resolved state of the table
- The standard table generator
- The instance of the component

You can then return any JSX or react you want! This turns out to be perfect for:
- Accessing the internal state of the table before rendering the table
- Decorating the table with more UI
- Building your own 100% custom display logic, while utilizing the state and methods of the table component

Example:
```javascript
<ReactTable
  columns={columns}
  data={data}
  ...
>
  {(state, makeTable, instance) => {
    // Now you have full access to the state of the table!
    state.decoratedColumns === [...] // all of the columns (with id's and meta)
    state.visibleColumns === [...] // all of the columns (with id's and meta)
    state.visibleColumns === [...] // all of the columns (with id's and meta)
    // etc.

    // `makeTable` is a function that returns the standard table markup
    return makeTable()

    // So add some decoration!
    return (
      <div>
        <customPivotBySelect />
        <customColumnHideShow />
        <customAnything />
        {makeTable()}
      </div>
    )

    // The possibilities are endless!!!

  }}
</ReactTable>
```

## Multi-Sort
When clicking on a column header, hold shift to multi-sort! You can toggle `ascending` `descending` and `none` for multi-sort columns. Clicking on a header without holding shift will clear the multi-sort and replace it with the single sort of that column. It's quite handy!

## Component Overrides
Though we confidently stand by the markup and architecture behind it, `react-table` does offer the ability to change the core componentry it uses to render everything. You can extend or override these internal components by passing a react component to it's corresponding prop on either the global props or on a one-off basis like so:
```javascript
// Change the global default
import { ReactTableDefaults } from 'react-table'
Object.assign(ReactTableDefaults, {
  TableComponent: Component,
  TheadComponent: Component,
  TbodyComponent: Component,
  TrGroupComponent: Component,
  TrComponent: Component,
  ThComponent: Component,
  TdComponent: Component,
  PaginationComponent: Component,
  PreviousComponent: Component,
  NextComponent: Component,
  LoadingComponent: Component,
  ExpanderComponent: Component
})

// Or change per instance
<ReactTable
  TableComponent={Component},
  TheadComponent={Component},
  // etc...
  />
```

If you choose to change the core components React-Table uses to render, you must make sure your replacement components consume and utilize all of the supplied and inherited props that are needed for that component to function properly. We would suggest investigating <a href="https://github.com/tannerlinsley/react-table/blob/master/src/index.js" target="\_parent">the source</a> for the component you wish to replace.


## Contributing
To suggest a feature, create an issue if it does not already exist.
If you would like to help develop a suggested feature follow these steps:

- Fork this repo
- `$ yarn`
- `$ yarn run storybook`
- Implement your changes to files in the `src/` directory
- View changes as you code via our <a href="https://github.com/storybooks/react-storybook" target="\_parent">React Storybook</a> `localhost:8000`
- Make changes to stories in `/stories`, or create a new one if needed
- Submit PR for review

#### Scripts

- `$ yarn run storybook` Runs the storybook server
- `$ yarn run test` Runs the test suite
- `$ yarn run prepublish` Builds the distributable bundle
- `$ yarn run docs` Builds the website/docs from the storybook for github pages

## Used By

<a href='https://nozzle.io' target="\_parent">
  <img src='https://nozzle.io/img/logo-blue.png' alt='Nozzle Logo' style='width:300px;'/>
</a>
