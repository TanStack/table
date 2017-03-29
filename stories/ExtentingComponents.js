import React from 'react'
import _ from 'lodash'
import namor from 'namor'
import classnames from 'classnames'

import CodeHighlight from './components/codeHighlight'
import ReactTable from '../src/index'

export default () => {
  const data = _.map(_.range(5553), d => {
    return {
      firstName: namor.generate({ words: 1, numLen: 0 }),
      lastName: namor.generate({ words: 1, numLen: 0 }),
      age: Math.floor(Math.random() * 30)
    }
  })

  const myTdComponent = (allProps) => {
    const {
      children,
      className,
      mainProps,
      ...rest
    } = allProps;
    const {
      row
    } = mainProps.rowInfo;
    const {
      id: colId
    } = mainProps.column;

    const myClassname = 'rt-td';
    return (
      <div
        className={classnames(myClassname, className)}
        {...rest}
      >
        {
          colId === 'age' && row.age > mainProps.maxAge ? (
            <div
              style={{ backgroundColor: 'red' }}
            >{children}</div>
          ) : children
        }
      </div>
    );
  }

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
          maxAge={25}
          TdComponent={myTdComponent}
        />
      </div>
      <div>
        <br/>
        You can extend any sub component that creates the table (i.e.: TableComponent, TheadComponent, TbodyComponent, ...)
        All components receive specific properties, plus the main component state, included within the "mainProps" key.
      </div>
      <CodeHighlight>{() => getCode()}</CodeHighlight>
    </div>
  )
}

function getCode () {
  return `
import ReactTable from 'react-table'

const myTdComponent = (allProps) => {
  const {
    children,
    className,
    mainProps,
    ...rest
  } = allProps;
  const {
    row
  } = mainProps.rowInfo;
  const {
    id: colId
  } = mainProps.column;

  const myClassname = 'rt-td';
  return (
    <div
      className={classnames(myClassname, className)}
      {...rest}
    >
      {
        colId === 'age' && row.age > mainProps.maxAge ? (
          <div
            style={{ backgroundColor: 'red' }}
          >{children}</div>
        ) : children
      }
    </div>
  );
}

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
    data={data}
    columns={columns}
    defaultPageSize={10}
    maxAge={25}
    TdComponent={myTdComponent}
  />
)
  `
}
