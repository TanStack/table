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
      sorting: [],
      page: 0,
      pageSize: 10,
      expandedRows: {},
      resizing: [],
      filters: []
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
            showFilters
            // Controlled Props
            sorting={this.state.sorting}
            page={this.state.page}
            pageSize={this.state.pageSize}
            expandedRows={this.state.expandedRows}
            resizing={this.state.resizing}
            filters={this.state.filters}
            // Callbacks
            onSortingChange={sorting => this.setState({sorting})}
            onPageChange={page => this.setState({page})}
            onPageSizeChange={(pageSize, page) => this.setState({page, pageSize})}
            onExpandRow={(expandedRows) => this.setState({expandedRows})}
            onResize={resizing => this.setState({resizing})}
            onFiltersChange={filters => this.setState({filters})}
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
