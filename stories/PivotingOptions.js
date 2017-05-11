import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../src/index'

class Story extends React.Component {
  render () {
    const data = _.map(_.range(1000), d => {
      return {
        firstName: namor.generate({words: 1, numLen: 0}),
        lastName: namor.generate({words: 1, numLen: 0}),
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100)
      }
    })

    const columns = [{
      Header: 'Name',
      columns: [{
        Header: 'First Name',
        accessor: 'firstName',
        PivotValue: ({value}) => <span style={{color: 'darkred'}}>{value}</span>
      }, {
        Header: 'Last Name',
        id: 'lastName',
        accessor: d => d.lastName,
        PivotValue: ({value}) => <span style={{color: 'darkblue'}}>{value}</span>,
        Footer: () => <div style={{textAlign: 'center'}}><strong>Pivot Column Footer</strong></div>
      }]
    }, {
      Header: 'Info',
      columns: [{
        Header: 'Age',
        accessor: 'age',
        aggregate: vals => {
          return _.round(_.mean(vals))
        },
        Aggregated: row => <span>{row.value} (avg)</span>
      }, {
        Header: 'Visits',
        accessor: 'visits',
        aggregate: vals => _.sum(vals),
        filterable: false
      }]
    }, {
      pivot: true,
      Header: () => <strong>Overridden Pivot Column Header Group</strong>
    }, {
      expander: true
    }]

    const subtableColumns = [{
      Header: 'Name',
      columns: [{
        Header: 'First Name',
        accessor: 'firstName'
      }, {
        Header: 'Last Name',
        id: 'lastName'
      }]
    }, {
      Header: 'Info',
      columns: [{
        Header: 'Age',
        accessor: 'age'
      }, {
        Header: 'Visits',
        accessor: 'visits'
      }]
    }]

    return (
      <div>
        <div className='table-wrap'>
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={10}
            className='-striped -highlight'
            pivotBy={['firstName', 'lastName']}
            defaultSorted={[{id: 'firstName', desc: false}, {id: 'lastName', desc: true}]}
            collapseOnSortingChange={false}
            filterable
            ExpanderComponent={({isExpanded, ...rest}) => (
              isExpanded ? <span> &#10136; </span> : <span> &#10137; </span>
            )}
            SubComponent={(row) => {
              return (
                <div style={{padding: '20px'}}>
                  <em>You can put any component you want here, even another React Table!</em>
                  <br />
                  <br />
                  <ReactTable
                    data={data}
                    columns={subtableColumns}
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
}

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw-loader!./PivotingOptions')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
