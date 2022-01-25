import React from "react";
import styled from "styled-components";
import { createColumns, useTable } from "@tanstack/react-table";

import makeData from "../utils/makeData";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

type Row = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

function App() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  return show ? <Inner /> : null;
}

function Inner() {
  const rerender = React.useReducer(() => ({}), {})[1];
  const columns = React.useMemo(
    () =>
      createColumns<Row>([
        {
          Header: "Name",
          accessor: (d) => d.age,
          Cell: (props) => props.value,
          columns: [
            {
              Header: "First Name",
              id: "firstName",
              accessor: (d) => d.firstName,
            },
            {
              Header: "Last Name",
              accessor: (d) => d.lastName,
            },
          ],
        },
        {
          Header: "Info",
          columns: [
            {
              Header: "Age",
              accessor: (d) => d.age,
            },
            {
              Header: "Visits",
              accessor: (d) => d.visits,
            },
            {
              Header: "Status",
              accessor: (d) => d.status,
            },
            {
              Header: "Profile Progress",
              accessor: (d) => d.progress,
            },
          ],
        },
      ]),
    []
  );

  const data = React.useMemo(() => makeData(1000), []);

  const instance = useTable({
    data,
    columns,
    debug: true,
  });

  React.useEffect(() => {
    // @ts-ignore
    window.instance = instance;
  });

  return (
    <Styles>
      <table {...instance.getTableProps({})}>
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((header) => (
                <th {...header.getHeaderProps()}>{header.id}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...instance.getTableBodyProps()}>
          {instance.getRows().map((row) => {
            return (
              <tr {...row.getRowProps()}>
                {row.getVisibleCells().map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.value}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={() => rerender()}>Force Rerender</button>
    </Styles>
  );
}

export default App;
