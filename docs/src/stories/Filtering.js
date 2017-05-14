/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'

import ReactTable from '../../../lib/index'

class Story extends React.PureComponent {
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
        filterable: true,
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
        accessor: 'firstName',
        filterMethod: (filter, row) => (row[filter.id].startsWith(filter.value) && row[filter.id].endsWith(filter.value))
      }, {
        Header: 'Last Name',
        id: 'lastName',
        accessor: d => d.lastName,
        filterMethod: (filter, row) => (row[filter.id].includes(filter.value))
      }]
    }, {
      Header: 'Info',
      columns: [{
        Header: 'Age',
        accessor: 'age'
      }, {
        Header: 'Over 21',
        accessor: 'age',
        id: 'over',
        Cell: ({value}) => (value >= 21 ? 'Yes' : 'No'),
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          if (filter.value === 'true') {
            return row[filter.id] >= 21
          }
          return row[filter.id] < 21
        },
        Filter: ({filter, onChange}) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{width: '100%'}}
            value={filter ? filter.value : 'all'}
          >
            <option value='all' />
            <option value='true'>Can Drink</option>
            <option value='false'>Can't Drink</option>
          </select>
        )
      }
      ]
    }]

    return (
      <div>
        <div>
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
        <div className='table-wrap'>
          <ReactTable
            className='-striped -highlight'
            data={this.state.data}
            columns={columns}
            defaultPageSize={10}
            defaultFilterMethod={(filter, row) => (String(row[filter.id]) === filter.value)}
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
        <div>
          <h1>Custom Filters In This Example</h1>
          <p>The default filter for all columns of a table if it is not specified in the configuration is set to match
          on values that start with the filter text. Example: age.startsWith("2").</p>
          <p>This example overrides the default filter behavior by setting
            the <strong>defaultFilterMethod</strong> table option to match on values that are exactly equal to the
          filter text. Example: age == "23")</p>
          <p>Each column can also be customized with the column <strong>filterMethod</strong> option:</p>
          <p>In this example the firstName column filters on the value starting with and ending with the filter
          value.</p>
          <p>In this example the lastName column filters on the value including the filter value anywhere in its
          text.</p>
          <p>To completely override the filter that is shown, you can set the <strong>Filter</strong> column
            option. Using this option you can specify the JSX that is shown. The option is passed
            an <strong>onChange</strong> method that must be called with the value that you wan't to
            pass to the <strong>filterMethod</strong> option whenever the filter has changed.</p>
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
const source = require('!raw!./Filtering')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
