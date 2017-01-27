import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

export default () => {
  const data = _.map(_.range(5553), d => {
    return {
      firstName: namor.generate({ words: 1, numLen: 0 }),
      lastName: namor.generate({ words: 1, numLen: 0 }),
      age: Math.floor(Math.random() * 30)
    }
  })

  const columns = [{
    header: 'Name',
    columns: [{
      header: 'First Name',
      accessor: 'firstName',
      render: row => {
        return <span>{row.aggregated ? '...' : row.value}</span>
      }
    }, {
      header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName
    }]
  }, {
    expander: true
  }, {
    header: 'Info',
    columns: [{
      header: 'Age',
      accessor: 'age',
      aggregate: vals => _.round(_.mean(vals)),
      render: row => {
        return <span>{row.aggregated ? `${row.value} (avg)` : row.value}</span>
      }
    }]
  }]

  return (
    <div>
      <div className='table-wrap'>
        <ReactTable
          className='-striped -highlight'
          data={data}
          columns={columns}
          defaultPageSize={10}
          SubComponent={() => <span>Hello</span>}
          pivotBy={['lastName']}
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
  header: 'Name',
  columns: [{
    header: 'First Name',
    accessor: 'firstName',
    render: row => {
      return <span>{row.aggregated ? '...' : row.value}</span>
    }
  }, {
    header: 'Last Name',
    id: 'lastName',
    accessor: d => d.lastName
  }]
}, {
  expander: true
}, {
  header: 'Info',
  columns: [{
    header: 'Age',
    accessor: 'age',
    aggregate: vals => _.round(_.mean(vals)),
    render: row => {
      return <span>{row.aggregated ? \`$\{row.value} (avg)\` : row.value}</span>
    }
  }]
}]

return (
  <ReactTable
    className='-striped -highlight'
    data={data}
    columns={columns}
    defaultPageSize={10}
    SubComponent={() => <span>Hello</span>}
    pivotBy={['lastName']}
  />
)
  `
}
