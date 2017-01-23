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
      maxWidth: 200
    }, {
      header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName,
      maxWidth: 400
    }]
  }, {
    header: 'Info',
    columns: [{
      header: 'Age',
      accessor: 'age',
      maxWidth: 60
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

const columns = [{
  header: 'Name',
  columns: [{
    header: 'First Name',
    accessor: 'firstName',
    maxWidth: 200
  }, {
    header: 'Last Name',
    id: 'lastName',
    accessor: d => d.lastName,
    maxWidth: 400
  }]
}, {
  header: 'Info',
  columns: [{
    header: 'Age',
    accessor: 'age',
    maxWidth: 60
  }]
}]

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
