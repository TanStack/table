import React from 'react'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

export default () => {
  const columns = [{
    Header: 'Name',
    columns: [{
      Header: 'First Name',
      accessor: 'firstName'
    }, {
      Header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName
    }]
  }, {
    Header: 'Info',
    columns: [{
      Header: 'Age',
      accessor: 'age'
    }]
  }]

  return (
    <div>
      <div className='table-wrap'>
        <ReactTable
          className='-striped -highlight'
          data={[]}
          noDataText='Oh Noes!'
          // noDataText={() => 'Oh Noes!'} // Supports functions
          // noDataText={() => <span>Oh Noes!</span>} // Supports JSX / React Components
          columns={columns}
          defaultPageSize={10}
        />
      </div>
      <div style={{textAlign: 'center'}}>
        <br />
        <em>Tip: Hold shift when sorting to multi-sort!</em>
      </div>
      <CodeHighlight>{() => getCode()}</CodeHighlight>
    </div>
  )
}

function getCode () {
  return `
import ReactTable from 'react-table'

// Create some column definitions
const columns = [{
  Header: 'Name',
  columns: [{
    Header: 'First Name',
    accessor: 'firstName'
  }, {
    Header: 'Last Name',
    id: 'lastName',
    accessor: d => d.lastName
  }]
}, {
  Header: 'Info',
  columns: [{
    Header: 'Age',
    accessor: 'age'
  }]
}]

// Display your table!
return (
  <ReactTable
    data={[]}
    noDataText='Oh Noes!'
    // noDataText={() => 'Oh Noes!'} // Supports functions
    // noDataText={() => <span>Oh Noes!</span>} // Supports JSX / React Components
    columns={columns}
    defaultPageSize={10}
  />
)
  `
}
