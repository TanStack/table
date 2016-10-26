![react-table](https://github.com/tannerlinsley/react-table/raw/master/media/Banner.png)

# react-table
A fast, lightweight, opinionated table and datagrid built on React

[![Build Status](https://travis-ci.org/tannerlinsley/react-table.svg?branch=master)](https://travis-ci.org/tannerlinsley/react-table)
[![react-table on Slack](https://img.shields.io/badge/slack-react--table-blue.svg)](https://react-table-slack.herokuapp.com/)

## Features

- Lightweight at 3kb (and just 2kb more for styles)
- No composition needed
- Uses customizable JSX and callbacks for everything
- Client-side pagination and sorting
- Server-side data
- Minimal design & easily themeable

Why you may **not** want to use this component:
- No support for infinite scrolling yet. We chose to avoid the complex problems that come with it, and instead provide reliable and predictable pagination.

## [Demo](http://react-table.zabapps.com)

## Installation
```bash
$ npm install react-table
```

#### Styles
React-table is built to be dropped into existing applications or styled from the ground up, but if you'd like a decent starting point, you can optionally include our default theme `react-table.css`.  We think it looks great, honestly :)

## Quick Usage
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
  accessor: 'name',
}, {
  header: 'Age',
  accessor: 'age'
}, {
  header: 'Friend Name',
  accessor: d => d.friend.name
}, {
  header: 'Friend Age',
  accessor: 'friend.age'
}]

<ReactTable
  data=[data]
  columns={columns}
/>
```

## Data
Every React-Table instance requires you to set the `data` prop. To use client-side data, simply pass the `data` prop anything that resembles an array or object. Client-side filtering and pagination is built in, and your table will update gracefully if you change any props. [Server-side data](#server-side-data) is also supported.


## Default Props
These are the default props for the main react component `<ReactTable />`
```javascript
{
  // Classes
  className: '-striped -highlight', // The most top level className for the component
  tableClassName: '', // ClassName for the `table` element
  theadClassName: '', // ClassName for the `thead` element
  tbodyClassName: '', // ClassName for the `tbody` element
  trClassName: '', // ClassName for all `tr` elements
  paginationClassName: '' // ClassName for `pagination` element
  //
  pageSize: 20,
  minRows: 0, // Ensure this many rows are always rendered, regardless of rows on page
  // Global Column Defaults
  column: { // default properties for every column's model
    sortable: true,
    show: true
  },
  // Text
  previousText: 'Previous',
  nextText: 'Next'
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

## Column Definitions
Every React-Table instance requires a `columns` prop, which is an array of objects containing the following properties

```javascript
[{
  // Required
  header: 'Header Name' or JSX eg. ({data, column}) => <div>Header Name</div>,
  accessor: 'propertyName' or Accessor eg. (row) => row.propertyName,

  // A unique ID is required if the accessor is not a string or if you would like to override the column name used in server-side calls
  id: 'myProperty',

  // Optional
  className: '', // Set the classname of the `th/td` element of the column
  innerClassName: '', // Set the classname of the `.th-inner/.td-inner` element of the column
  columns: [...] // See Header Groups section below
  render: JSX eg. ({row, value, index, viewIndex}) => <span>{value}</span>, // Provide a JSX element or stateless function to render whatever you want as the column's cell with access to the entire row
  sortable: true,
  sort: 'asc' or 'desc',
  show: true,
  width: Number, // Locks the column width to this amount
  minWidth: Number // Allows the column to flex above this minimum amount
}]
```

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

## Server-side Data <a name="server-side-data"></a>
If you want to handle pagination, and sorting on the server, `react-table` makes it easy on you. Instead of passing the `data` prop an array, you provide a function instead.

This function will be called on mount, pagination events, and sorting events. It also provides you all of the parameters to help you query and format your data.

```javascript
<ReactTable
  data={(params, callback) => {

    // params will give you all the info you need to query and sort your data
    params == {
      page: 0, // The page index the user is requesting
      pageSize: 20, // The current pageSize
      pages: -1, // The amount of existing pages (-1 means there is no page data yet)
      sorting: [ // An array of column sort models (yes, you can multi-sort!)
        {
          id: 'columnID', // The columnID (usually the accessor string, but can be overridden for server-side or required if the column accessor is a function)
          ascending: true or false
        }
      ]
    }

    // Query your data however you'd like, then structure your response like so:
    const result = {
      rows: [...], // Your data for the current page/sorting model
      pages: 10 // optionally provide how many pages exist (this is only needed if you choose to display page numbers, and only the first time you make the call or if the page count changes)
    }

    // You can return a promise that resolve the result
    return Axios.post('/myDataEnpoint', params) // resolves to `result`

    // or use the manual callback whenever you please
    setTimeout(() => {
      callback(result)
    }, 5000)

    // That's it!

  }}
/>
```

## Multi-Sort
When clicking on a column header, hold shift to multi-sort! You can toggle `ascending` `descending` and `none` for multi-sort columns. Clicking on a header without holding shift will clear the multi-sort and replace it with the single sort of that column. It's quite handy!

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
