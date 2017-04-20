import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

export default () => {
  const data = _.map(_.range(5553), d => {
    return {
      firstName: namor.generate({words: 1, numLen: 0}),
      lastName: namor.generate({words: 1, numLen: 0}),
      age: Math.floor(Math.random() * 30)
    }
  })

  const columns = [{
    header: 'Name',
    columns: [{
      header: 'First Name',
      accessor: 'firstName',
      footer: () => <div style={{textAlign: 'center'}}>First Name</div>
    }, {
      header: 'Last Name',
      accessor: 'lastName',
      footer: () => <div style={{textAlign: 'center'}}>Last Name</div>
    }]
  }, {
    header: 'Info',
    columns: [{
      header: 'Age',
      accessor: 'age',
      footer: () => <div style={{textAlign: 'center'}}>Age</div>
    }]
  }, {
    header: 'Expand',
    columns: [{
      expander: true,
      header: () => (<strong>More</strong>),
      width: 65,
      render: ({isExpanded, ...rest}) => (
        <div>
          {isExpanded ? <span>&#x2299;</span> : <span>&#x2295;</span>}
        </div>
      ),
      style: {cursor: 'pointer', fontSize: 25, padding: '0', textAlign: 'center', userSelect: 'none'},
      footer: () => <span>&hearts;</span>
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
          SubComponent={() => <span>Hello</span>}
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

// Create some column definitions
const columns = [{
  header: 'Name',
  columns: [{
    header: 'First Name',
    accessor: 'firstName',
    footer: () => <div style={{textAlign: 'center'}}>First Name</div>
  }, {
    header: 'Last Name',
    accessor: 'lastName',
    footer: () => <div style={{textAlign: 'center'}}>Last Name</div>
  }]
}, {
  header: 'Info',
  columns: [{
    header: 'Age',
    accessor: 'age',
    footer: () => <div style={{textAlign: 'center'}}>Age</div>
  }]
}, {
  header: 'Expand',
  columns: [{
    expander: true,
    header: () => (<strong>More</strong>),
    width: 65,
    render: ({isExpanded, ...rest}) => (
      <div>
        {isExpanded ? <span>&#x2299;</span> : <span>&#x2295;</span>}
      </div>
    ),
    style: {cursor: 'pointer', fontSize: 25, padding: '0', textAlign: 'center', userSelect: 'none'},
    footer: () => <span>&hearts;</span>
  }]
}]

return (
  <ReactTable
    className='-striped -highlight'
    data={data}
    columns={columns}
    defaultPageSize={10}
    SubComponent={() => <span>Hello</span>}
  />
)
  `
}
