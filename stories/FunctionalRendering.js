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
      accessor: 'firstName',
      footer: 'Footer'
    }, {
      header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName,
      footer: 'Footer'
    }]
  }, {
    header: 'Info',
    columns: [{
      header: 'Age',
      accessor: 'age',
      footer: 'Footer'
    }]
  }]

  return (
    <div>
      <strong>Functional rendering</strong> simply means that you have all of the building blocks to render your own React Table however you'd like.
      <br />
      <br />
      Whether it's <strong>completely custom</strong>, or even just <strong>rearranging the order of the table's elements</strong>, this is how you can do it.

      <br />
      <br />
      <br />
      <br />

      <strong>Pagination at the top using partials:</strong>
      <br />
      <br />

      <div className='table-wrap'>
        <ReactTable
          data={data}
          columns={columns}
        >
          {(state, {
            Root,
            Table,
            HeaderGroups,
            Headers,
            Rows,
            Footers,
            Pagination,
            NoData,
            Loading
          }, instance) => {
            return (
              <Root>
                <Pagination />
                <Table>
                  <HeaderGroups />
                  <Headers />
                  <Rows />
                  <Footers />
                </Table>
                <NoData />
                <Loading />
              </Root>
            )
          }}
        </ReactTable>
      </div>

      <CodeHighlight>{() => `
import ReactTable from 'react-table'

return (
  <ReactTable
    data={data}
    columns={columns}
  >
    {(state, {
      Root,
      Table,
      HeaderGroups,
      Headers,
      Rows,
      Footers,
      Pagination,
      NoData,
      Loading
    }, instance) => {
      return (
        <Root>
          <Pagination />
          <Table>
            <HeaderGroups />
            <Headers />
            <Rows />
            <Footers />
          </Table>
          <NoData />
          <Loading />
        </Root>
      )
    }}
  </ReactTable>
)
      `}</CodeHighlight>

      <br />
      <br />

      <strong>Wrapping the standard table output</strong>
      <br />
      <br />

      <div className='table-wrap'>
        <ReactTable
          data={data}
          columns={columns}
        >
          {(state, Table, instance) => {
            return (
              <div style={{
                background: '#ffcf00',
                borderRadius: '5px',
                overflow: 'hidden',
                padding: '5px'
              }}>
                <pre><code>state.allVisibleColumns === {JSON.stringify(state.allVisibleColumns, null, 4)}</code></pre>
                <Table />
              </div>
            )
          }}
        </ReactTable>
      </div>

      <CodeHighlight>{() => `
import ReactTable from 'react-table'

return (
  <ReactTable
    data={data}
    columns={columns}
  >
    {(state, Table, instance) => {
      return (
        <div style={{
          background: '#ffcf00',
          borderRadius: '5px',
          overflow: 'hidden',
          padding: '5px'
        }}>
          <pre><code>state.allVisibleColumns === {JSON.stringify(state.allVisibleColumns, null, 4)}</code></pre>
          <Table />
        </div>
      )
    }}
  </ReactTable>
)
      `}</CodeHighlight>

      <br />
      <br />

      <strong>Need more control? This is the entire table state and component instance at your disposal!</strong>
      <br />
      <br />

      <div className='table-wrap'>
        <ReactTable
          className='-striped -highlight'
          data={data}
          columns={columns}
          defaultPageSize={10}
        >
          {(state, StandardTable, instance) => {
            return (
              <div>
                <JSONTree
                  data={Object.assign({}, state, {children: 'function () {...}'})}
                  theme={JSONtheme}
                  invertTheme
                />
              </div>
            )
          }}
        </ReactTable>
      </div>
      <br />
      <CodeHighlight>{() => `
import ReactTable from 'react-table'

return (
  <ReactTable
    className='-striped -highlight'
    data={data}
    columns={columns}
    defaultPageSize={10}
  >
    {(state, StandardTable, instance) => {
      return (
        <div>
          <JSONTree
            data={Object.assign({}, state, {children: 'function () {...}'})}
            theme={JSONtheme}
            invertTheme
          />
        </div>
      )
    }}
  </ReactTable>
)
      `}</CodeHighlight>
    </div>
  )
}
