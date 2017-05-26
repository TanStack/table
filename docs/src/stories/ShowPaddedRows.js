/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../../../lib/index'

class Story extends React.PureComponent {
  constructor (props) {
    super(props)

    const data = _.map(_.range(7), d => {
      return {
        firstName: namor.generate({ words: 1, numbers: 0 }),
        lastName: namor.generate({ words: 1, numbers: 0 }),
        age: Math.floor(Math.random() * 30)
      }
    })

    this.state = {
      tableOptions: {
        showPaddedRows: true
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

    console.log(this.state.tableOptions)

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
            {...this.state.tableOptions}
            className='-striped -highlight'
            data={this.state.data}
            columns={columns}
            defaultPageSize={15}
            pageSizeOptions={[5, 15, 30, 50]}
          />
        </div>
      </div>
    )
  }

  setTableOption (event)
  {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      tableOptions : {
        ...this.state.tableOptions,
        [name] : value
      }
    })
  }
}

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw!./ShowPaddedRows')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
