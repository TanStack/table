/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../../../lib/index'

class Story extends React.PureComponent {
  render () {
    const data = _.map(_.range(5553), d => {
      return {
        firstName: namor.generate({ words: 1, numbers: 0 }),
        lastName: namor.generate({ words: 1, numbers: 0 }),
        age: Math.floor(Math.random() * 30)
      }
    })

    const columns = [{
      Header: 'Name',
      columns: [{
        Header: 'First Name',
        accessor: 'firstName',
        Footer: (
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
        Header: 'Last Name',
        id: 'lastName',
        accessor: d => d.lastName,
        Footer: (
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
      Header: 'Info',
      columns: [{
        Header: 'Age',
        accessor: 'age',
        Footer: <span><strong>Average:</strong> {_.round(_.mean(_.map(data, d => d.age)))}</span>
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

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw!./Footers')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
