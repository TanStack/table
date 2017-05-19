/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../../../lib/index'

class Story extends React.PureComponent {
  render () {
    const data = _.map(_.range(5553), d => {
      const children = _.map(_.range(10), d => {
        const grandChildren = _.map(_.range(10), d => {
          return {
            age: Math.floor(Math.random() * 30)
          }
        })
        return {
          firstName: namor.generate({ words: 1, numbers: 0 }),
          age: Math.floor(Math.random() * 30),
          children: grandChildren
        }
      })
      return {
        lastName: namor.generate({ words: 1, numbers: 0 }),
        firstName: children.map(d => d.firstName),
        age: Math.floor(Math.random() * 30),
        children
      }
    })

    const columns = [{
      Header: 'Name',
      columns: [{
        Header: 'First Name',
        accessor: 'firstName',
        expander: true
      }, {
        Header: 'Last Name',
        accessor: 'lastName'
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
const source = require('!raw!./SubRows')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
