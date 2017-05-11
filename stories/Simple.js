import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../src/index'

class Story extends React.Component {
  render () {
    const data = _.map(_.range(5553), d => {
      return {
        firstName: namor.generate({ words: 1, numLen: 0 }),
        lastName: namor.generate({ words: 1, numLen: 0 }),
        age: Math.floor(Math.random() * 30),
        children: _.map(_.range(10), d => {
          return {
            firstName: namor.generate({ words: 1, numLen: 0 }),
            lastName: namor.generate({ words: 1, numLen: 0 }),
            age: Math.floor(Math.random() * 30)
          }
        })
      }
    })

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
            data={data}
            columns={columns}
            defaultPageSize={10}
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <br />
          <em>Tip: Hold shift when sorting to multi-sort!</em>
        </div>
      </div>
    )
  }
}

const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw-loader!./Simple')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
