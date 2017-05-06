import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

class MyTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.renderEditable = this.renderEditable.bind(this);

    this.state = {
      data: [
        { firstName: 'Lucy', lastName: 'Marks' },
        { firstName: 'Bejamin', lastName: 'Pike' }
      ]
    };

    this.columns = [
      {
        header: 'First Name',
        accessor: 'firstName',
        render: this.renderEditable
      },
      {
        header: 'Last Name',
        accessor: 'lastName',
        render: this.renderEditable
      },
      {
        header: 'Full Name',
        id: 'full',
        accessor: d => d.firstName + ' ' + d.lastName
      }
    ];
  }

  renderEditable(cellInfo) {
    return (<div style={{ backgroundColor: '#fafafa' }} contentEditable suppressContentEditableWarning onBlur={(e) => {
      const data = [...this.state.data];
      data[cellInfo.index][cellInfo.column.id] = e.target.textContent;
      this.setState({data: data});
    }}>{this.state.data[cellInfo.index][cellInfo.column.id]}</div>);
  }

  render() {
    return (<ReactTable
      data={this.state.data}
      columns={this.columns}
      defaultPageSize={2}
      showPageSizeOptions={false}
      showPagination={false}
    />);
  }
}

function getCode() {
  return `
class MyTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.renderEditable = this.renderEditable.bind(this);

    this.state = {
      data: [
        { firstName: 'Lucy', lastName: 'Marks' },
        { firstName: 'Bejamin', lastName: 'Pike' }
      ]
    };

    this.columns = [
      {
        header: 'First Name',
        accessor: 'firstName',
        render: this.renderEditable
      },
      {
        header: 'Last Name',
        accessor: 'lastName',
        render: this.renderEditable
      },
      {
        header: 'Full Name',
        id: 'full',
        accessor: d => d.firstName + ' ' + d.lastName
      }
    ];
  }

  renderEditable(cellInfo) {
    return (<div style={{ backgroundColor: '#fafafa' }} contentEditable suppressContentEditableWarning onBlur={(e) => {
      const data = [...this.state.data];
      data[cellInfo.index][cellInfo.column.id] = e.target.textContent;
      this.setState({data: data});
    }}>{this.state.data[cellInfo.index][cellInfo.column.id]}</div>);
  }

  render() {
    return (<ReactTable
      data={this.state.data}
      columns={this.columns}
      defaultPageSize={2}
      showPageSizeOptions={false}
      showPagination={false}
    />);
  }
}
`
}

export default () => {

  return (
    <div>
      <p>First two columns are editable just by clicking into them using the <code>contentEditable</code> attribute. Last column (Full Name) is computed from the first two.</p>
      <div className='table-wrap' style={{marginBottom: '20px'}}>
        <MyTable />
      </div>

      <CodeHighlight>{() => getCode()}</CodeHighlight>
    </div>
  )
}