import React, { useState } from "react";
import {
  Column,
  createColumns,
  HeaderGroup,
  ReactTable,
  useTable,
} from "@tanstack/react-table";

import makeData from "../utils/makeData";

type Row = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

function shuffle(arr) {
  arr = [...arr];
  const shuffled = [];
  while (arr.length) {
    const rand = Math.floor(Math.random() * arr.length);
    shuffled.push(arr.splice(rand, 1)[0]);
  }
  return shuffled;
}

function App() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  return show ? <Inner /> : null;
}

function Inner() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = React.useMemo(
    () =>
      createColumns<Row, {}>([
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
              filterType: "betweenNumberRange",
            },
            {
              Header: "Visits",
              accessor: (d) => d.visits,
              filterType: "betweenNumberRange",
            },
            {
              Header: "Status",
              accessor: (d) => d.status,
            },
            {
              Header: "Profile Progress",
              accessor: (d) => d.progress,
              filterType: "betweenNumberRange",
            },
          ],
        },
      ]),
    []
  );

  const [data, refreshData] = React.useReducer(
    () => makeData(100000),
    undefined,
    () => makeData(100000)
  );

  const instance = useTable({
    data,
    columns,
    debug: true,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  React.useEffect(() => {
    // @ts-ignore
    window.instance = instance;
  });

  return (
    <div className="p-2">
      <div>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 font-lg shadow border border-block"
        />
      </div>
      <div className="h-2" />
      <table {...instance.getTableProps({})}>
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((header) => {
                return (
                  <th {...header.getHeaderProps()}>
                    <div>{header.id}</div>
                    {header.column.getCanColumnFilter() ? (
                      <div>
                        <Filter column={header.column} instance={instance} />
                      </div>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...instance.getTableBodyProps()}>
          {instance
            .getRows()
            .slice(0, 10)
            .map((row) => {
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
      <div>{instance.getRows().length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(columnFilters, null, 2)}</pre>
    </div>
  );
}

function Filter({
  column,
  instance,
}: {
  column: Column<any, any, any>;
  instance: ReactTable<any, any, any>;
}) {
  const firstValue =
    instance.getPreColumnFilteredFlatRows()[0].values[column.id];

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        min={Number(column.getPreFilteredMinMaxValues()[0])}
        max={Number(column.getPreFilteredMinMaxValues()[1])}
        value={(column.getColumnFilterValue()?.[0] ?? "") as string}
        onChange={(e) =>
          column.setColumnFilterValue((old) => [e.target.value, old?.[1]])
        }
        placeholder={`Min (${column.getPreFilteredMinMaxValues()[0]})`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        min={Number(column.getPreFilteredMinMaxValues()[0])}
        max={Number(column.getPreFilteredMinMaxValues()[1])}
        value={(column.getColumnFilterValue()?.[1] ?? "") as string}
        onChange={(e) =>
          column.setColumnFilterValue((old) => [old?.[0], e.target.value])
        }
        placeholder={`Max (${column.getPreFilteredMinMaxValues()[1]})`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getColumnFilterValue() ?? "") as string}
      onChange={(e) => column.setColumnFilterValue(e.target.value)}
      placeholder={`Search... (${column.getPreFilteredUniqueValues().size})`}
      className="w-36 border shadow rounded"
    />
  );
}

export default App;
