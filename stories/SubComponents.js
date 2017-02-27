import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

class SubComponents extends React.Component {

  constructor(props) {
    super(props)

    const data = _.map(_.range(5553), d => {
      return {
        firstName: namor.generate({words: 1, numLen: 0}),
        lastName: namor.generate({words: 1, numLen: 0}),
        age: Math.floor(Math.random() * 30)
      }
    })

    this.state = {
      tableOptions: {
        loading: false,
        showPagination: true,
        showPageSizeOptions: true,
        showPageJump: true,
        collapseOnSortingChange: true,
        collapseOnPageChange: true,
        collapseOnDataChange: true,
        freezeWhenExpanded: false
      },
      data: data
    }

    this.setTableOption = this.setTableOption.bind(this);
  }

  render() {


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

    return (
      <div>
        <div style={{float: "left"}}>
          <h1>Table Options</h1>
          <table>
            <tbody>
            {
              Object.keys(this.state.tableOptions).map(optionKey => {
                const optionValue = this.state.tableOptions[optionKey];
                return (
                  <tr key={optionKey}>
                    <td>{optionKey}</td>
                    <td style={{paddingLeft: 10, paddingTop: 5}}>
                      <input type="checkbox"
                             name={optionKey}
                             checked={optionValue}
                             onChange={this.setTableOption}
                      />
                    </td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
        <div className='table-wrap' style={{paddingLeft: 240}}>
          <ReactTable
            className='-striped -highlight'
            data={this.state.data}
            columns={columns}
            defaultPageSize={10}
            {...this.state.tableOptions}
            SubComponent={(row) => {
              return (
                <div style={{padding: '20px'}}>
                  <em>You can put any component you want here, even another React Table!</em>
                  <br />
                  <br />
                  <ReactTable
                    data={this.state.data}
                    columns={columns}
                    defaultPageSize={3}
                    showPagination={false}
                    SubComponent={(row) => {
                      return (
                        <div style={{padding: '20px'}}>
                          <em>It even has access to the row data: </em>
                          <CodeHighlight>{() => JSON.stringify(row, null, 2)}</CodeHighlight>
                        </div>
                      )
                    }}
                  />
                </div>
              )
            }}
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <br />
          <em>Tip: Hold shift when sorting to multi-sort!</em>
        </div>
        <CodeHighlight>{() => this.getCode()}</CodeHighlight>
      </div>
    )
  }

  setTableOption(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      tableOptions: {
        ...this.state.tableOptions,
        [name]: value
      }
    })
  }

  getCode() {
    return `
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

export default (
  <ReactTable
    data={data}
    columns={columns}
    defaultPageSize={10}
    {...otherOptions}
    SubComponent={(row) => {
      return (
        <div style={{padding: '20px'}}>
          <em>You can put any component you want here, even another React Table!</em>
          <br />
          <br />
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={3}
            showPagination={false}
            SubComponent={(row) => {
              return (
                <div style={{padding: '20px'}}>
                  <em>It even has access to the row data: </em>
                  <CodeHighlight>{() => JSON.stringify(row, null, 2)}</CodeHighlight>
                </div>
              )
            }}
          />
        </div>
      )
    }}
  />
)
  `
  }
}

export default () => <SubComponents/>