import React from 'react'
import _ from 'lodash'
import namor from 'namor'
import JSONTree from 'react-json-tree'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

const JSONtheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}

export default () => {
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

  return (
    <div>
      <div className='table-wrap'>
        <ReactTable
          className='-striped -highlight'
          data={data}
          columns={columns}
          defaultPageSize={10}
        >
          {(state, makeTable, instance) => {
            console.log(state)
            return (
              <div>
                Look! This is the entire table state and component instance at your disposal!
                <JSONTree
                  data={Object.assign({}, state, {children: 'function () {...}'})}
                  theme={JSONtheme}
                  invertTheme
                />
                <br />
                <br />
                {makeTable()}
              </div>
            )
          }}
        </ReactTable>
      </div>
      <br />
      <CodeHighlight>{() => getCode()}</CodeHighlight>
    </div>
  )
}

function getCode () {
  return `
import ReactTable from 'react-table'

// Create some column definitions
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

// Display your table!
return (
  <ReactTable
    className='-striped -highlight'
    data={data}
    columns={columns}
    defaultPageSize={10}
  >
    {(state, makeTable, instance) => {
      console.log(state)
      return (
        <div>
          Look! This is the entire table state and component instance at your disposal!
          <JSONTree
            data={Object.assign({}, state, {children: 'function () {...}'})}
            theme={JSONtheme}
            invertTheme
          />
          <br />
          <br />
          {makeTable()}
        </div>
      )
    }}
  </ReactTable>
)
  `
}
