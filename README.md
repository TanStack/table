# react-table
A fast, lightweight, opinionated table and datagrid built on React

[![Chart.js on Slack](https://img.shields.io/badge/slack-Chart.js-blue.svg)](https://react-table-slack.herokuapp.com/)

## Features

- Lightweight at 3kb (and just 2kb more for styles)
- No composition needed
- Uses customizable JSX and callbacks for everything
- Client-side pagination and sorting
- Server-side support
- Minimal Design & easy to theme

Why you may **not** want to use `react-table`:
- No support for infinite scrolling. We chose to avoid the complex problems that come with it, and instead provide reliable and predictable pagination.

## Installation
```bash
$ npm install react-table
```

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
  data=[{...}]
  columns={[]}
/>
```

## Client-side Data
To use client-side data, simply pass the `data` prop an array. Client-side filtering and pagination is built in, and your table will update gracefully if you change any props.

## Server-side Data
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
When clicking on a column header, hold shift to multi-sort! You can toggle `aascending` `descending` and `none` for multi-sort columns. Clicking on a header without holding shift will clear the multi-sort and replace it with the single sort of that column. It's quite handy!

## Default Props
```javascript
{
  className: '-striped -highlight',
  pageSize: 20,
  minRows: 0,
  data: [],
  previousComponent: <button {...props} className='-btn'>{props.children}</button>,
  nextComponent: <button {...props} className='-btn'>{props.children}</button>,
  previousText: 'Previous',
  nextText: 'Next',
  loadingComponent: <span>Loading...</span>,
  column: { // default properties for every column's model
    sortable: true,
    show: true
  }
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

Or just define them on the component

```javascript
<ReactTable
  pageSize={10}
  minRows={3}
  // etc...
})
```

## Column Props

```javascript
[{
  // Required
  header: 'Header Name' or JSX eg. ({data, column}) => <div>Header Name</div>,
  accessor: 'propertyName' or Accessor eg. (row) => row.propertyName,

  // Optional
  id: 'myProperty', // A unique ID is needed if the accessor is not a string or if you would like to override the column name used in server-side calls
  render: JSX eg. ({row, value, index}) => <span>{value}</span>, // Provide a JSX element or stateless function to render whatever you want as the column's cell with access to the entire row
  sortable: true,
  sort: 'asc' or 'desc',
  show: true,
  width: Number, // Locks the column width to this amount
  minWidth: Number // Allows the column to flex above this minimum amount
}]
```
