import { Component } from 'jumpsuit'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from 'components/codeHighlight'
import ReactTable from '../../../lib/index.js'

export default Component({
  render () {
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

    return (
      <div>
        <div className='table-wrap'>
          <ReactTable
            data={data}
            columns={columns}
            pageSize={10}
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <br />
          <em>Tip: Hold shift when sorting to multi-sort!</em>
        </div>
        <CodeHighlight>{getCode()}</CodeHighlight>
      </div>
    )
  }
})

function getCode () {
  return `
import ReactTable from 'react-table'

// To help us mock some data
import namor from 'namor'
import _ from 'lodash'

export default () => {

  // Mock some data
  const data = _.map(_.range(5553), d => {
    return {
      firstName: namor.generate({ words: 1, numLen: 0 }),
      lastName: namor.generate({ words: 1, numLen: 0 }),
      age: Math.floor(Math.random() * 30)
    }
  })

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
      pageSize={10}
    />
  )
})
  `
}
