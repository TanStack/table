import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../lib/index'

export default () => {
  const data = _.map(_.range(10000), d => {
    return {
      firstName: namor.generate({ words: 1, numLen: 0 }),
      lastName: namor.generate({ words: 1, numLen: 0 }),
      age: Math.floor(Math.random() * 30),
      visits: Math.floor(Math.random() * 100)
    }
  })

  const columns = [{
    header: 'Name',
    columns: [{
      header: 'First Name',
      accessor: 'firstName'
    }, {
      header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName
    }]
  }, {
    header: 'Info',
    columns: [{
      header: 'Age',
      accessor: 'age',
      aggregate: vals => _.round(_.mean(vals)),
      render: row => {
        return <span>{row.aggregated ? `${row.value} (avg)` : row.value}</span>
      }
    }, {
      header: 'Visits',
      accessor: 'visits',
      aggregate: vals => _.sum(vals)
    }]
  }]

  return (
    <div>
      <div className='table-wrap'>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          pivotBy={['firstName', 'lastName']}
          // expandedRows={{
          //   2: true,
          //   3: {
          //     2: true
          //   }
          // }}
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
const columns = [{
  header: 'Name',
  columns: [{
    header: 'First Name',
    accessor: 'firstName'
  }, {
    header: 'Last Name',
    id: 'lastName',
    accessor: d => d.lastName
  }]
}, {
  header: 'Info',
  columns: [{
    header: 'Age',
    accessor: 'age'
  }]
}]

export default (
  <ReactTable
    data={data}
    columns={columns}
    defaultPageSize={10}
    SubComponent={(row) => {
      return (
        <div style={{padding: '20px'}}>
          <em>You can put any component you want here, even another React Table!</em>
          <br />
          <br />
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={3}
            showPagination={false}
            SubComponent={(row) => {
              return (
                <div style={{padding: '20px'}}>
                  <em>It even has access to the row data: </em>
                  <CodeHighlight>{() => JSON.stringify(row, null, 2)}</CodeHighlight>
                </div>
              )
            }}
          />
        </div>
      )
    }}
  />
)
  `
}
