import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

export default () => {
  const data = _.map(_.range(1000), d => {
    return {
      firstName: namor.generate({words: 1, numLen: 0}),
      lastName: namor.generate({words: 1, numLen: 0}),
      age: Math.floor(Math.random() * 30),
      visits: Math.floor(Math.random() * 100)
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
      accessor: 'age',
      aggregate: vals => {
        return _.round(_.mean(vals))
      },
      render: row => {
        return <span>{row.aggregated ? `${row.value} (avg)` : row.value}</span>
      }
    }, {
      header: 'Visits',
      accessor: 'visits',
      aggregate: vals => _.sum(vals),
      hideFilter: true
    }]
  }, {
    header: () => <strong>Overriden Pivot Column Header Group</strong>,
    expander: true,
    minWidth: 200,
    pivotRender: ({value}) => <span style={{color: 'darkred'}}>{value}</span>,
    footer: () => <div style={{textAlign: 'center'}}><strong>Overriden Pivot Column Footer</strong></div>
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
          defaultSorting={[{id: 'firstName', desc: false}, {id: 'lastName', desc: true}]}
          collapseOnSortingChange={false}
          showFilters={true}
          ExpanderComponent={({isExpanded, ...rest}) => (
            isExpanded ? <span> &#10136; </span> : <span> &#10137; </span>
          )}
          PivotValueComponent={ ({subRows, value}) => (
            <span><span style={{color: 'darkred'}}>{value}</span> {subRows && `(${subRows.length} Last Names)`}</span>
          )}
          SubComponent={(row) => {
            return (
              <div style={{padding: '20px'}}>
                <em>You can put any component you want here, even another React Table!</em>
                <br />
                <br />
                <ReactTable
                  data={data}
                  columns={columns.filter(x => !x.expander)}
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
      <CodeHighlight>{() => getCode()}</CodeHighlight>
    </div>
  )
}

function getCode () {
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
      accessor: 'age',
      aggregate: vals => {
        return _.round(_.mean(vals))
      },
      render: row => {
        return <span>{row.aggregated ? \`\${row.value} (avg)\` : row.value}</span>
      }
    }, {
      header: 'Visits',
      accessor: 'visits',
      aggregate: vals => _.sum(vals),
      hideFilter: true
    }]
  }, {
    header: () => <strong>Overriden Pivot Column Header Group</strong>,
    expander: true,
    minWidth: 200,
    pivotRender: ({value}) => <span style={{color: 'darkred'}}>{value}</span>,
    footer: () => <div style={{textAlign: 'center'}}><strong>Overriden Pivot Column Footer</strong></div>
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
          defaultSorting={[{id: 'firstName', desc: false}, {id: 'lastName', desc: true}]}
          collapseOnSortingChange={false}
          showFilters={true}
          ExpanderComponent={({isExpanded, ...rest}) => (
            isExpanded ? <span> &#10136; </span> : <span> &#10137; </span>
          )}
          PivotValueComponent={ ({subRows, value}) => (
            <span><span style={{color: 'darkred'}}>{value}</span> {subRows && \`(\${subRows.length} Last Names)\`}</span>
          )}
          SubComponent={(row) => {
            return (
              <div style={{padding: '20px'}}>
                <em>You can put any component you want here, even another React Table!</em>
                <br />
                <br />
                <ReactTable
                  data={data}
                  columns={columns.filter(x => !x.expander)}
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
      <CodeHighlight>{() => getCode()}</CodeHighlight>
    </div>
  )
  `
}
