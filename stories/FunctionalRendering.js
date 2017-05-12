import React from 'react'
import _ from 'lodash'
import namor from 'namor'
import JSONTree from 'react-json-tree'

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

class Story extends React.Component {
  render () {
    const data = _.map(_.range(5553), d => {
      return {
        firstName: namor.generate({ words: 1, numLen: 0 }),
        lastName: namor.generate({ words: 1, numLen: 0 }),
        age: Math.floor(Math.random() * 30)
      }
    })

    const columns = [{
      Header: 'Name',
      columns: [{
        Header: 'First Name',
        accessor: 'firstName',
        Footer: 'Footer'
      }, {
        Header: 'Last Name',
        id: 'lastName',
        accessor: d => d.lastName,
        Footer: 'Footer'
      }]
    }, {
      Header: 'Info',
      columns: [{
        Header: 'Age',
        accessor: 'age',
        Footer: 'Footer'
      }]
    }]

    return (
      <div>
        <strong>Functional rendering</strong> simply means that you have all of the building blocks to render your own React Table however you'd like.

        <br />
        <br />
        <br />
        <br />

        <strong>Decorating the standard table output</strong>
        <br />
        <br />

        <div className='table-wrap'>
          <ReactTable
            data={data}
            columns={columns}
          >
            {(state, makeTable, instance) => {
              return (
                <div style={{
                  background: '#ffcf00',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  padding: '5px'
                }}>
                  <pre><code>state.allVisibleColumns === {JSON.stringify(state.allVisibleColumns, null, 4)}</code></pre>
                  {makeTable()}
                </div>
              )
            }}
          </ReactTable>
        </div>

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
      </div>
    )
  }
}

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw-loader!./FunctionalRendering')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
