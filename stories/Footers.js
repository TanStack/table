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
      footer: (
        <span><strong>Popular:</strong> {
          _.first(
            _.reduce(
              _.map(
                _.groupBy(
                  data, d => d.firstName
                )
              ),
              (a, b) => a.length > b.length ? a : b
            )
          ).firstName}
        </span>
      )
    }, {
      header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName,
      footer: (
        <span><strong>Longest:</strong> {
          _.reduce(
            _.map(
              _.groupBy(
                data, d => d.lastName
              ),
              (d, key) => key
            ),
            (a, b) => a.length > b.length ? a : b
          )}
        </span>
      )
    }]
  }, {
    header: 'Info',
    columns: [{
      header: 'Age',
      accessor: 'age',
      footer: <span><strong>Average:</strong> {_.round(_.mean(_.map(data, d => d.age)))}</span>
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

// Display your table!
return (
  <ReactTable
    data={data}
    columns={columns}
    defaultPageSize={10}
  />
)
  `
}
