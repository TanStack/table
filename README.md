![react-table](https://github.com/tannerlinsley/react-table/raw/master/media/Banner.png)

# react-table
A fast, lightweight, opinionated table and datagrid built on React

[![Build Status](https://travis-ci.org/tannerlinsley/react-table.svg?branch=master)](https://travis-ci.org/tannerlinsley/react-table)
[![react-table on Slack](https://img.shields.io/badge/slack-react--table-blue.svg)](https://react-table-slack.herokuapp.com/)

## Features

- Lightweight at 4kb (and just 2kb more for styles)
- Fully customizable JSX and callbacks for everything
- Supports both Client-side & Server-side pagination and sorting
- Minimal design & easily themeable
- ["Why I wrote React Table and the problems it has solved for Nozzle.io"](https://medium.com/@tannerlinsley/why-i-wrote-react-table-and-the-problems-it-has-solved-for-nozzle-others-445c4e93d4a8#.axza4ixba) by Tanner Linsley

## [Demo](http://react-table.zabapps.com)

## Table of Contents
- [Installation](#nstallation)
- [Example](#example)
- [Data](#data)
- [Default Props](#default-props)
- [Columns](#columns)
- [Styles](#styles)
- [Header Groups](#header-groups)
- [Server-side Data](#server-side-data)
- [Multi-sort](#multi-sort)
- [Component Overrides](#component-overrides)

<a name="installation"></a>
## Installation
```bash
$ npm install react-table
```

<a name="example"></a>
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
  render: props => <span className='number'>props.value</span> // Custom cell components!
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

<a name="data"></a>
## Data
Simply pass the `data` prop anything that resembles an array or object. Client-side filtering and pagination is built in, and your table will update gracefully as you change any props. [Server-side data](#server-side-data) is also supported!


<a name="default-props"></a>
## Default Props
These are the default props for the main react component `<ReactTable />`
```javascript
{
  // General
  loading: false, // Whether to show the loading overlay or not
  pageSize: 20, // The default page size (this can be changed by the user if `showPageSizeOptions` is enabled)
  minRows: 0, // Ensure this many rows are always rendered, regardless of rows on page
  showPagination: true, // Shows or hides the pagination component
  showPageSizeOptions: true, // Enables the user to change the page size
  pageSizeOptions: [5, 10, 20, 25, 50, 100], // The available page size options

  // Callbacks
  onChange: (state, instance) => null, // Anytime the internal state of the table changes, this will fire

  // Text
  previousText: 'Previous',
  nextText: 'Next'

  // Classes
  className: '-striped -highlight', // The most top level className for the component
  tableClassName: '', // ClassName for the `table` element
  theadClassName: '', // ClassName for the `thead` element
  tbodyClassName: '', // ClassName for the `tbody` element
  trClassName: '', // ClassName for all `tr` elements
  trClassCallback: row => null, // A call back to dynamically add classes (via the classnames module) to a row element
  paginationClassName: '' // ClassName for `pagination` element
  // Styles
  style: {}, // Main style object for the component
  tableStyle: {}, // style object for the `table` component
  theadStyle: {}, // style object for the `thead` component
  tbodyStyle: {}, // style object for the `tbody` component
  trStyle: {}, // style object for the `tr` component
  trStyleCallback: row => {}, // A call back to dynamically add styles to a row element
  thStyle: {}, // style object for the `th` component
  tdStyle: {}, // style object for the `td` component
  paginationStyle: {}, // style object for the `paginination` component
}
```

You can easily override the core defaults like so:

```javascript
import { ReactTableDefaults } from 'react-table'

Object.assign(ReactTableDefaults, {
  pageSize: 10,
  minRows: 3,
  // etc...
})
```

Or just define them on the component per-instance

```javascript
<ReactTable
  pageSize={10}
  minRows={3}
  // etc...
  />
```

<a name="columns"></a>
## Columns
`<ReactTable/>` requires a `columns` prop, which is an array of objects with the following properties

```javascript
[{
  // General
  accessor: 'propertyName' or Accessor eg. (row) => row.propertyName,
  id: 'myProperty', // Conditional - A unique ID is required if the accessor is not a string or if you would like to override the column name used in server-side calls
  sortable: true,
  sort: 'asc' or 'desc', // used to determine the column sorting on init
  show: true, // can be used to hide a column
  minWidth: Number // Allows the column to flex above this minimum amount

  // Cell Options
  className: '', // Set the classname of the `td` element of the column
  style: {}, // Set the style of the `td` element of the column
  innerClassName: '', // Set the classname of the `.-td-inner` element of the column
  innerStyle: {}, // Set the style of the `.-td-inner` element of the column
  render: JSX eg. ({value, rowValues, row, index, viewIndex}) => <span>{value}</span>, // Provide a JSX element or stateless function to render whatever you want as the column's cell with access to the entire row
    // value == the accessed value of the column
    // rowValues == an object of all of the accessed values for the row
    // row == the original row of data supplied to the table
    // index == the original index of the data supplied to the table
    // viewIndex == the index of the row in the current page

  // Header & HeaderGroup Options
  header: 'Header Name' or JSX eg. ({data, column}) => <div>Header Name</div>,
  headerClassName: '', // Set the classname of the `th` element of the column
  headerStyle: {}, // Set the style of the `th` element of the column
  headerInnerClassName: '', // Set the classname of the `.-th-inner` element of the column
  headerInnerStyle: {}, // Set the style of the `.th-inner` element of the column

  // Header Groups only
  columns: [...] // See Header Groups section below

}]
```

<a name="styles"></a>
## Styles
React-table is built to be dropped into existing applications or styled from the ground up, but if you'd like a decent starting point, you can optionally include our default theme `react-table.css`.  We think it looks great, honestly :)

<a name="header-groups"></a>
## Header Groups
To group columns with another header column, just nest your columns in a header column like so:
```javascript
const columns = [{
  header: 'Favorites',
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

<a name="server-side-data"></a>
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

For a detailed example, take a peek at our [async table mockup](https://github.com/tannerlinsley/react-table/blob/master/example/src/screens/async.js)

<a name="multi-sort"></a>
## Multi-Sort
When clicking on a column header, hold shift to multi-sort! You can toggle `ascending` `descending` and `none` for multi-sort columns. Clicking on a header without holding shift will clear the multi-sort and replace it with the single sort of that column. It's quite handy!

<a name="component-overrides"></a>
## Component Overrides
Though we wouldn't suggest it, `react-table` has the ability to change the core componentry it used to render it's table. You can do so by assigning a react component to it's corresponding global prop, or on a one-off basis like so:
```javascript
// Change the global default
import { ReactTableDefaults } from 'react-table'
Object.assign(ReactTableDefaults, {
  tableComponent: Component,
  theadComponent: Component,
  tbodyComponent: Component,
  trComponent: Component,
  thComponent: Component,
  tdComponent: Component,
  paginationComponent: Component,
  previousComponent: Component,
  nextComponent: Component,
  loadingComponent: Component
})

// Or change per instance
<ReactTable
  tableComponent={Component},
  theadComponent={Component},
  // etc...
  />
```

If you choose to change the core components React-Table uses to render, you must make sure your components support and utilized all of the neeeded features for that component to work properly. For a broad reference on how to do this, investigate [the source](https://github.com/tannerlinsley/react-table/blob/master/src/index.js) for the component you wish to replace.


## Contributing
To suggest a feature, create an issue if it does not already exist.
If you would like to help develop a suggested feature follow these steps:

- Fork this repo
- `npm install`
- `npm watch`
- Implement your changes to files in the `src/` directory
- Submit PR for review

If you would like to preview your changes, you can link and utilize the example like so:

- `npm link`
- `cd example`
- `npm install`
- `npm link react-table`
- `npm watch`
- Make changes to the example in `src/screens/index.js` if needed
- View changes at `localhost:8000`

## Used By

<a href='https://nozzle.io'>
  <img src='https://nozzle.io/img/logo-blue.png' alt='Nozzle Logo' style='width:300px;'/>
</a>
