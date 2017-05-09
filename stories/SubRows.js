import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

export default () => {
  const data = _.map(_.range(5553), d => {
    const children = _.map(_.range(10), d => {
      const grandChildren = _.map(_.range(10), d => {
        return {
          age: Math.floor(Math.random() * 30)
        }
      })
      return {
        firstName: namor.generate({ words: 1, numLen: 0 }),
        age: (ages => {
          return Math.round(ages.reduce((p, c) => p + c, 0) / ages.length)
        })(grandChildren.map(d => d.age)),
        aggregated: true,
        children: grandChildren
      }
    })
    return {
      lastName: namor.generate({ words: 1, numLen: 0 }),
      firstName: children.map(d => d.firstName).join(', '),
      age: (ages => {
        return Math.round(ages.reduce((p, c) => p + c, 0) / ages.length)
      })(children.map(d => d.age)),
      aggregated: true,
      children
    }
  })

  const columns = [{
    expander: true
  }, {
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
          data={data}
          columns={columns}
          defaultPageSize={10}
          subRowsKey='children'
          aggregatedKey='aggregated'
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
    className='-striped -highlight'
    data={data}
    columns={columns}
    defaultPageSize={10}
  />
)
  `
}
