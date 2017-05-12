import React from 'react'

import ReactTable from '../src/index'

class Story extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.renderEditable = this.renderEditable.bind(this)

    this.state = {
      data: [
        { firstName: 'Lucy', lastName: 'Marks' },
        { firstName: 'Bejamin', lastName: 'Pike' }
      ]
    }

    this.columns = [
      {
        Header: 'First Name',
        accessor: 'firstName',
        Cell: this.renderEditable
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
        Cell: this.renderEditable
      },
      {
        Header: 'Full Name',
        id: 'full',
        accessor: d => d.firstName + ' ' + d.lastName
      }
    ]
  }

  renderEditable (cellInfo) {
    return (<div style={{ backgroundColor: '#fafafa' }} contentEditable suppressContentEditableWarning onBlur={(e) => {
      const data = [...this.state.data]
      data[cellInfo.index][cellInfo.column.id] = e.target.textContent
      this.setState({data: data})
    }}>{this.state.data[cellInfo.index][cellInfo.column.id]}</div>)
  }

  render () {
    return (
      <div className='table-wrap' style={{marginBottom: '20px'}}>
        <p>First two columns are editable just by clicking into them using the <code>contentEditable</code> attribute. Last column (Full Name) is computed from the first two.</p>
        <ReactTable
          data={this.state.data}
          columns={this.columns}
          defaultPageSize={2}
          showPageSizeOptions={false}
          showPagination={false}
        />
      </div>
    )
  }
}

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw-loader!./EditableTable')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
