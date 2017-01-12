<div align="center">
  <a href="https://github.com/tannerlinsley/react-table"><img src="https://github.com/tannerlinsley/react-table/raw/master/media/Banner.png" alt="React Table Logo" style="width:450px;"/></a>
  <br />
  <br />

</div>

# React Table
`react-table` is a **lightweight, fast and extendable datagrid** built for React

[![Build Status](https://travis-ci.org/tannerlinsley/react-table.svg?branch=master)](https://travis-ci.org/tannerlinsley/react-table) [![npm](https://img.shields.io/npm/dm/react-table.svg)](https://npmjs.com/packag/react-table) [![react-table on Slack](https://img.shields.io/badge/slack-react--table-blue.svg)](https://react-table-slack.herokuapp.com/) [![GitHub stars](https://img.shields.io/github/stars/tannerlinsley/react-table.svg?style=social&label=Star)](https://github.com/tannerlinsley/react-table) [![Twitter Follow](https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow)](https://twitter.com/tannerlinsley)

## Features

- Lightweight at 4kb (and just 2kb more for styles)
- Fully customizable JSX and callbacks for everything
- Supports both Client-side & Server-side pagination and sorting
- Minimal design & easily themeable
- <a href="https://medium.com/@tannerlinsley/why-i-wrote-react-table-and-the-problems-it-has-solved-for-nozzle-others-445c4e93d4a8#.axza4ixba" target="\_blank">"Why I wrote React Table and the problems it has solved for Nozzle.io</a> by Tanner Linsley

## <a href="http://react-table.zabapps.com/?selectedKind=2.%20Demos&selectedStory=Client-side%20Data&full=0&down=1&left=1&panelRight=0&downPanel=kadirahq%2Fstorybook-addon-actions%2Factions-panel" target="\_blank">Demo</a>

## Table of Contents
- [Installation](#installation)
- [Example](#example)
- [Data](#data)
- [Props](#props)
- [Columns](#columns)
- [Styles](#styles)
- [Header Groups](#header-groups)
- [Sub Tables & Components](#sub-tables-components)
- [Server-side Data](#server-side-data)
- [Fully Controlled Component](#fully-controlled-component)
- [Multi-sort](#multi-sort)
- [Component Overrides](#component-overrides)

## Installation
```bash
$ npm install react-table
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

## Data
Simply pass the `data` prop anything that resembles an array or object. Client-side sorting and pagination are built in, and your table will update gracefully as you change any props. [Server-side data](#server-side-data) is also supported!


## Props
These are all of the available props (and their default values) for the main `<ReactTable />` component.
```javascript
{
  // General
  loading: false, // Whether to show the loading overlay or not
  defaultPageSize: 20, // The default page size (this can be changed by the user if `showPageSizeOptions` is enabled)
  minRows: 0, // Ensure this many rows are always rendered, regardless of rows on page
  showPagination: true, // Shows or hides the pagination component
  showPageJump: true, // Shows or hides the pagination number input
  showPageSizeOptions: true, // Enables the user to change the page size
  pageSizeOptions: [5, 10, 20, 25, 50, 100], // The available page size options
  expanderColumnWidth: 30, // default columnWidth for the expander column

  // Callbacks
  onChange: (state, instance) => null, // Anytime the internal state of the table changes, this will fire
  onTrClick: (row, event) => null,  // Handler for row click events

  // Text
  previousText: 'Previous',
  nextText: 'Next',
  pageText: 'Page',
  ofText: 'of',
  rowsText: 'rows',

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

  // Controlled Props (see Using as a Fully Controlled Component below)
  page: undefined,
  pageSize: undefined,
  sorting: undefined,
  visibleSubComponents: undefined,
  // Controlled Callbacks
  onExpand: undefined,
  onPageChange: undefined,
  onPageSizeChange: undefined,
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

Or just define them on the component per-instance

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
  sort: 'asc' or 'desc', // used to determine the column sorting on init
  show: true, // can be used to hide a column
  minWidth: 100 // A minimum width for this column. If there is room, columns will flex to fill available space

  // Cell Options
  className: '', // Set the classname of the `td` element of the column
  style: {}, // Set the style of the `td` element of the column
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

  // Header Groups only
  columns: [...] // See Header Groups section below

}]
```

## Styles
React-table is built to be dropped into existing applications or styled from the ground up, but if you'd like a decent starting point, you can optionally include our default theme `react-table.css`.  We think it looks great, honestly :)

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

## Sub Tables & Components
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

For a detailed example, take a peek at our [async table mockup](https://github.com/tannerlinsley/react-table/blob/master/example/src/screens/async.js)

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
  visibleSubComponents={[1,4,5]} // The row indexes on the current page that should appear expanded

  // Callbacks
  onPageChange={(pageIndex) => {...}} // Called when the page index is changed by the user
  onPageSizeChange={(pageSize, pageIndex) => {...}} // Called when the pageSize is changed by the user. The resolve page is also sent to maintain approximate position in the data
  onSortingChange={(column, shiftKey) => {...}} // Called when a sortable column header is clicked with the column itself and if the shiftkey was held.
  onExpand={(index, event) => {...}} // Called when an expander is clicked. Use this to manage `visibleSubComponents`
/>
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

If you choose to change the core components React-Table uses to render, you must make sure your replacement components consume and utilize all of the supplied and inherited props that are needed for that component to function properly. We would suggest investigating [the source](https://github.com/tannerlinsley/react-table/blob/master/src/index.js) for the component you wish to replace.


## Contributing
To suggest a feature, create an issue if it does not already exist.
If you would like to help develop a suggested feature follow these steps:

- Fork this repo
- `npm install`
- `npm run watch`
- Implement your changes to files in the `src/` directory
- Submit PR for review

If you would like to preview your changes, you can link and utilize the example like so:

- `npm link`
- `cd example`
- `npm install`
- `npm link react-table`
- `npm run watch`
- Make changes to the example in `src/screens/index.js` if needed
- View changes at `localhost:8000`

## Used By

<a href='https://nozzle.io'>
  <img src='https://nozzle.io/img/logo-blue.png' alt='Nozzle Logo' style='width:300px;'/>
</a>
