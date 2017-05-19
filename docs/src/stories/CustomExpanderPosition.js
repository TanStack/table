/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../../../lib/index'

class Story extends React.PureComponent {
  render () {
    const data = _.map(_.range(5553), d => {
      return {
        firstName: namor.generate({words: 1, numbers: 0}),
        lastName: namor.generate({words: 1, numbers: 0}),
        age: Math.floor(Math.random() * 30)
      }
    })

    const columns = [{
      Header: 'Name',
      columns: [{
        Header: 'First Name',
        accessor: 'firstName',
        Footer: () => <div style={{textAlign: 'center'}}>First Name</div>
      }, {
        Header: 'Last Name',
        accessor: 'lastName',
        Footer: () => <div style={{textAlign: 'center'}}>Last Name</div>
      }]
    }, {
      Header: 'Info',
      columns: [{
        Header: 'Age',
        accessor: 'age',
        Footer: () => <div style={{textAlign: 'center'}}>Age</div>
      }]
    }, {
      Header: 'Expand',
      columns: [{
        expander: true,
        Header: () => (<strong>More</strong>),
        width: 65,
        Expander: ({isExpanded, ...rest}) => (
          <div>
            {isExpanded ? <span>&#x2299;</span> : <span>&#x2295;</span>}
          </div>
        ),
        style: {cursor: 'pointer', fontSize: 25, padding: '0', textAlign: 'center', userSelect: 'none'},
        Footer: () => <span>&hearts;</span>
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
const source = require('!raw!./CustomExpanderPosition')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
