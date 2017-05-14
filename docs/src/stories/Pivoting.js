/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../../../lib/index'

class Story extends React.PureComponent {
  render () {
    const data = _.map(_.range(1000), d => {
      return {
        firstName: namor.generate({ words: 1, numLen: 0 }),
        lastName: namor.generate({ words: 1, numLen: 0 }),
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100)
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
        accessor: 'age',
        aggregate: vals => _.round(_.mean(vals)),
        Aggregated: row => {
          return <span>{row.value} (avg)</span>
        }
      }, {
        Header: 'Visits',
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
            className='-striped -highlight'
            defaultPageSize={10}
            pivotBy={['firstName', 'lastName']}
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

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw!./Pivoting')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
