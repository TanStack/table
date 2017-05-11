import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../src/index'

const data = _.map(_.range(5553), d => {
  return {
    firstName: namor.generate({ words: 1, numLen: 0 }),
    lastName: namor.generate({ words: 1, numLen: 0 }),
    age: Math.floor(Math.random() * 30)
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

class Story extends React.Component {
  constructor () {
    super()
    this.state = {
      sorted: [],
      page: 0,
      pageSize: 10,
      expanded: {},
      resized: [],
      filtered: []
    }
  }
  render () {
    return (
      <div>
        <div className='table-wrap'>
          <ReactTable
            className='-striped -highlight'
            data={data}
            columns={columns}
            pivotBy={['lastName']}
            filterable
            // Controlled Props
            sorted={this.state.sorted}
            page={this.state.page}
            pageSize={this.state.pageSize}
            expanded={this.state.expanded}
            resized={this.state.resized}
            filtered={this.state.filtered}
            // Callbacks
            onSortedChange={sorted => this.setState({sorted})}
            onPageChange={page => this.setState({page})}
            onPageSizeChange={(pageSize, page) => this.setState({page, pageSize})}
            onExpandedChange={expanded => this.setState({expanded})}
            onResizedChange={resized => this.setState({resized})}
            onFilteredChange={filtered => this.setState({filtered})}
          />
        </div>
        <br />
        <pre><code><strong>this.state ===</strong> {JSON.stringify(this.state, null, 2)}</code></pre>
        <br />
      </div>
    )
  }
}

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw-loader!./ControlledTable')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
