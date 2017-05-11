import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../src/index'

class Story extends React.Component {
  constructor (props) {
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
        freezeWhenExpanded: false,
        filterable: false,
        sortable: true,
        resizable: true
      },
      data: data
    }

    this.setTableOption = this.setTableOption.bind(this)
  }
  render () {
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

    return (
      <div>
        <div style={{float: 'left'}}>
          <h1>Table Options</h1>
          <table>
            <tbody>
              {
                Object.keys(this.state.tableOptions).map(optionKey => {
                  const optionValue = this.state.tableOptions[optionKey]
                  return (
                    <tr key={optionKey}>
                      <td>{optionKey}</td>
                      <td style={{paddingLeft: 10, paddingTop: 5}}>
                        <input type='checkbox'
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
      </div>
    )
  }

  setTableOption (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      tableOptions: {
        ...this.state.tableOptions,
        [name]: value
      }
    })
  }
}

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw-loader!./SubComponents')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
