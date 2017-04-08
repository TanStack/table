import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

export default () => {
  const data = _.map(_.range(5553), d => {
    const statusChance = Math.random()
    return {
      firstName: namor.generate({ words: 1, numLen: 0 }),
      lastName: namor.generate({ words: 1, numLen: 0 }),
      progress: Math.floor(Math.random() * 100),
      status: statusChance > 0.66 ? 'relationship'
        : statusChance > 0.33 ? 'complicated'
        : 'single'
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
      header: 'Profile Progress',
      accessor: 'progress',
      render: row => (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#dadada',
            borderRadius: '2px'
          }}
        >
          <div
            style={{
              width: `${row.value}%`,
              height: '100%',
              backgroundColor: row.value > 66 ? '#85cc00'
                : row.value > 33 ? '#ffbf00'
                : '#ff2e00',
              borderRadius: '2px',
              transition: 'all .2s ease-out'
            }}
          />
        </div>
      )
    }, {
      header: 'Status',
      accessor: 'status',
      render: row => (
        <span>
          <span style={{
            color: row.value === 'relationship' ? '#ff2e00'
              : row.value === 'complicated' ? '#ffbf00'
              : '#57d500',
            transition: 'all .3s ease'
          }}>
            &#x25cf;
          </span> {
            row.value === 'relationship' ? 'In a relationship'
            : row.value === 'complicated' ? `It's complicated`
            : 'Single'
          }
        </span>
      )
    }]
  }]

  return (
    <div>
      <div className='table-wrap'>
        <ReactTable
          className='-striped -highlight'
          data={data}
          columns={columns}
          defaultPageSize={10}
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
import ReactTable from 'react-table'

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
    header: 'Profile Progress',
    accessor: 'progress',
    render: row => (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#dadada',
          borderRadius: '2px'
        }}
      >
        <div
          style={{
            width: \`$\{row.value}%\`,
            height: '100%',
            backgroundColor: row.value > 66 ? '#85cc00'
              : row.value > 33 ? '#ffbf00'
              : '#ff2e00',
            borderRadius: '2px',
            transition: 'all .2s ease-out'
          }}
        />
      </div>
    )
  }, {
    header: 'Status',
    accessor: 'status',
    render: row => (
      <span>
        <span style={{
          color: row.value === 'relationship' ? '#ff2e00'
            : row.value === 'complicated' ? '#ffbf00'
            : '#57d500',
          transition: 'all .3s ease'
        }}>
          &#x25cf;
        </span> {
          row.value === 'relationship' ? 'In a relationship'
          : row.value === 'complicated' ? \`It's complicated\`
          : 'Single'
        }
      </span>
    )
  }]
}]

return (
  <ReactTable
    className='-striped -highlight'
    data={data}
    columns={columns}
    defaultPageSize={10}
  />
)
  `
}
