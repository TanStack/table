import React from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import { useTable } from 'react-table'

import makeData from './makeData'

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        padding: '1rem',
        '& table': {
          borderSpacing: 0,
          border: "1px solid black",
          '& td, th': {
            margin: 0,
            padding: '0.5rem',
            borderBottom: '1px solid black',
            borderRight: '1px solid black',
            '&:last-child': {
              borderRight: 0,
            },
          },
          '& tr': {
            '&:last-child': {
              '& td': {
                borderBottom: 0,
              }
            }
          }
        },
      },
    })
  );



function Table({ columns, data, classes }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })
  // Render the UI for your table
  return (
    <span className={classes.root}>
      <table {...getTableProps()} >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map(
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
    </span>
  )
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(20), [])
  const classes = useStyles();
  return (
      <Table columns={columns} data={data} classes={classes}/>
  )
}

export default App
