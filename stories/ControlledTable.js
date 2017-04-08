import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

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

class ControlledTable extends React.Component {
  constructor() {
    super()
    this.sortChange = this.sortChange.bind(this)
    this.state = {
      sorting: [],
      page: 0,
      pageSize: 10
    }
  }

  sortChange(column, shift) {
    if(shift)
      alert('Shift click not implemented in this demo')
    var sort = {id: column.id}
    if(this.state.sorting.length && this.state.sorting[0].id == column.id)
      this.state.sorting[0].asc ? sort.desc = true : sort.asc = true
    else
      sort.asc = true
    this.setState({
      sorting: [sort]
    })
  }

  render() {
    return (
      <div>
        <div className='table-wrap'>
          <ReactTable
            className='-striped -highlight'
            data={data}
            columns={columns}
            sorting={this.state.sorting}
            onSortingChange={this.sortChange}
            page={this.state.page}
            onPageChange={page => this.setState({page})}
            pageSize={this.state.pageSize}
            onPageSizeChange={(pageSize, page) => this.setState({page, pageSize})}
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <br />
          <em>Tip: For simplicity, multi-sort is not implemented in this demo</em>
        </div>
        <CodeHighlight>{() => getCode()}</CodeHighlight>
      </div>
    )
  }
}

function getCode () {
  return `const data = _.map(_.range(5553), d => {
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

class ControlledTable extends React.Component {
  constructor() {
    super()
    this.sortChange = this.sortChange.bind(this)
    this.state = {
      sorting: [],
      page: 0,
      pageSize: 10
    }
  }

  sortChange(column, shift) {
    if(shift)
      alert('Shift click not implemented in this demo')
    var sort = {id: column.id}
    if(this.state.sorting.length && this.state.sorting[0].id == column.id)
      this.state.sorting[0].asc ? sort.desc = true : sort.asc = true
    else
      sort.asc = true
    this.setState({
      sorting: [sort]
    })
  }

  render() {
    return (
      <ReactTable
        className='-striped -highlight'
        data={data}
        columns={columns}
        sorting={this.state.sorting}
        onSortingChange={this.sortChange}
        page={this.state.page}
        onPageChange={page => this.setState({page})}
        pageSize={this.state.pageSize}
        onPageSizeChange={(pageSize, page) => this.setState({page, pageSize})}
      />
    )
  }
}`
}

export default () => <ControlledTable />