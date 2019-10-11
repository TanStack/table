import React, { FC, useEffect, useRef } from 'react'
import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
  Column,
  CellProps,
  UseSortByColumnProps,
  TableInstance,
  UseFiltersColumnProps,
  ColumnInstance,
  useBlockLayout,
  useResizeColumns,
  UseResizeColumnsHeaderProps
} from 'react-table'
import styled from 'styled-components'
import makeData from './makeData'

type Data = object

type Props = {
  columns: Column<Data>[]
  data: Data[]
}

interface TableColumn<D extends object = {}>
  extends ColumnInstance<D>,
    UseSortByColumnProps<D>,
    UseResizeColumnsHeaderProps<D>,
    UseFiltersColumnProps<D> {}

const Rigth = styled.div`
  text-align: right;
`

const OrderIndicator = styled.span<{ isSorted?: boolean; isSortedDesc?: boolean }>`
  position: absolute;
  right: 0;
  left: 0;
  height: 2px;
  background: black;
  ${({ isSorted, isSortedDesc }) => (isSorted ? (isSortedDesc ? { top: 0 } : { bottom: 0 }) : { display: 'none' })}
`

const TableWrap = styled.div`
  display: inline-block;
  border-spacing: 0;
  border: 1px solid black;
`

const TableHead = styled.div``
const TableBody = styled.div``
const TableRow = styled.div``

const TableCell = styled.div`
  position: relative;
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  :last-child {
    border-right: 0;
  }
`
const Resizer = styled.div`
  display: inline-block;
  width: 5px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(50%);
  z-index: 1;
`

const Input = styled.input`
  width: calc(100% - 0.5rem);
`

const useStopPropagationOnClick = <T extends any>(ref: T) => {
  useEffect(() => {
    if (ref.current !== null) {
      ref.current.addEventListener('click', (e: MouseEvent) => e.stopPropagation())
    }
  }, [])
}

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter }
}: {
  column: TableColumn<Data>
}) => {
  const count = preFilteredRows.length
  const inputRef = useRef<HTMLInputElement>(null)
  useStopPropagationOnClick(inputRef)
  return (
    <Input
      ref={inputRef}
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const ResizerComponent: FC = props => {
  const ref = useRef<HTMLDivElement>(null)
  useStopPropagationOnClick(ref)
  return <Resizer {...props} ref={ref} />
}

const defaultColumn = {
  minWidth: 20,
  width: 150,
  maxWidth: 500,
  Filter: DefaultColumnFilter
}

const Table: FC<Props> = ({ columns, data }) => {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Data>(
    {
      columns,
      defaultColumn,
      data
    },
    useFilters,
    useSortBy,
    useBlockLayout,
    useResizeColumns
  )
  // Render the UI for your table
  return (
    <TableWrap {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(c => {
              const column = (c as unknown) as TableColumn<Data>
              return (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <OrderIndicator {...column} />

                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                  <ResizerComponent {...column.getResizerProps()} />
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </TableWrap>
  )
}

const data = makeData(20)

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName'
          },
          {
            Header: 'Last Name',
            accessor: 'lastName'
          }
        ]
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            Cell: ({ cell: { value } }: CellProps<object>) => <Rigth>{value}</Rigth>
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            Cell: ({ cell: { value } }: CellProps<object>) => <Rigth>{value}</Rigth>
          },
          {
            Header: 'Status',
            accessor: 'status'
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            Cell: ({ cell: { value } }: CellProps<object>) => <Rigth>{value}</Rigth>
          }
        ]
      }
    ],
    []
  )

  return <Table columns={columns} data={data} />
}

export default App
