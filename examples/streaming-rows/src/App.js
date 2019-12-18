import React from 'react'
import styled from 'styled-components'
import { useTable, useBlockLayout, useRowSelect } from 'react-table'

const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

let sourceGridData = []
const updateRateMS = 16

function Table({ columns }) {
  // Use the state and functions returned from useTable to build your UI

  const [data, setData] = React.useState([])
  const timerRunning = React.useRef()

  if (!timerRunning.current) {
    timerRunning.current = true
    setInterval(() => {
      sourceGridData.push(makeRow(sourceGridData.length))
      let newData = [...sourceGridData]

      setData(newData)
    }, updateRateMS)
  }

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    toggleAllRowsSelected,
    prepareRow,
    state,
  } = useTable(
    {
      autoResetSelectedRows: false,
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
    useRowSelect
  )

  // Render the UI for your table
  return (
    <>
      <div {...getTableProps()} className="table">
        <div className="thead">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          {rows.slice(0, 10).map(row => {
            prepareRow(row)
            return (
              <div
                {...row.getRowProps({
                  style: {
                    backgroundColor: row.isSelected ? 'green' : '',
                  },
                  onClick: e => {
                    toggleAllRowsSelected(false)
                    row.toggleRowSelected()
                  },
                })}
                className="tr"
              >
                {row.cells.map(cell => {
                  return (
                    <div {...cell.getCellProps()} className="td">
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </>
  )
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'age',
        accessor: 'age',
      },
      {
        Header: 'gender',
        accessor: 'gender',
      },
      {
        Header: 'height',
        accessor: 'height',
      },
      {
        Header: 'color',
        accessor: 'col',
      },
      {
        Header: 'dob',
        accessor: 'dob',
      },
    ],
    []
  )

  return (
    <Styles>
      <Table columns={columns} />
    </Styles>
  )
}

function makeRow(id) {
  let r = Math.floor(Math.random() * 3) + 1
  if (r === 0) {
    return {
      Id: id,
      name: 'Billy Bob',
      age: 12,
      gender: 'male',
      height: 95,
      col: 'red',
      dob: '14/05/2010',
    }
  } else if (r === 1) {
    return {
      Id: id,
      name: 'Jenny Jane',
      age: 42,
      gender: 'female',
      height: 142,
      col: 'blue',
      dob: '30/07/1954',
    }
  } else if (r === 2) {
    return {
      Id: id,
      name: 'Steve McAlistaire',
      age: 35,
      gender: 'male',
      height: 176,
      col: 'green',
      dob: '04/11/1982',
    }
  } else if (r === 3) {
    return {
      Id: id,
      name: 'Jeff Joe',
      age: 35,
      gender: 'male',
      height: 176,
      col: 'green',
      dob: '04/11/1982',
    }
  }
}
export default App
