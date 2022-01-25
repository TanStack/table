import React from "react";
import ReactDOM from "react-dom";
import faker from "faker";

import "./index.css";

import {
  createTable,
  columnFilterRowsFn,
  globalFilterRowsFn,
} from "@tanstack/react-table";
import { ReactTableDevtools } from "@tanstack/react-table-devtools";
import { makeData, Person } from "./makeData";

let table = createTable().RowType<Person>();

const defaultColumns = table.createColumns([
  table.createGroup({
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      table.createColumn("firstName", {
        cell: (info) => info.value,
        footer: (props) => props.column.id,
      }),
      table.createColumn((row) => row.lastName, {
        id: "lastName",
        cell: (info) => info.value,
        header: <span>Last Name</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  table.createGroup({
    header: "Info",
    footer: (props) => props.column.id,
    columns: [
      table.createColumn("age", {
        header: () => "Age",
        footer: (props) => props.column.id,
      }),
      table.createGroup({
        header: "More Info",
        columns: [
          table.createColumn("visits", {
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          }),
          table.createColumn("status", {
            header: "Status",
            footer: (props) => props.column.id,
          }),
          table.createColumn("progress", {
            header: "Profile Progress",
            footer: (props) => props.column.id,
          }),
        ],
      }),
    ],
  }),
]);

function App() {
  const [data, setData] = React.useState(() => makeData(100000));
  const [columns] = React.useState(() => [...defaultColumns]);

  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const rerender = () => setData(() => makeData(100000));

  const instance = table.useTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    columnFilterRowsFn,
    globalFilterRowsFn,
    // debug: true,
  });

  return (
    <div className="p-2 relative">
      <div className="inline-block border border-black shadow rounded">
        <div className="px-1 border-b border-black">
          <label>
            <input {...instance.getToggleAllColumnsVisibilityProps()} /> Toggle
            All
          </label>
        </div>
        {instance.getAllLeafColumns().map((column) => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input {...column.getToggleVisibilityProps()} /> {column.id}
              </label>
            </div>
          );
        })}
      </div>
      <div className="h-4" />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => rerender()} className="border p-1">
          Regenerate
        </button>
      </div>
      <div className="h-4" />
      <div>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 text-lg border border-gray-200"
          placeholder="Global Search..."
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
                    {!header.isPlaceholder ? (
                      <>
                        <div>
                          {!header.isPlaceholder ? header.renderHeader() : null}
                        </div>
                        {header.column.getCanColumnFilter() ? (
                          <div>
                            <Filter
                              column={header.column}
                              instance={instance}
                            />
                          </div>
                        ) : null}
                      </>
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
      <ReactTableDevtools instance={instance} />
    </div>
  );
}

function Filter({
  column,
  instance,
}: {
  column: typeof table.types.column;
  instance: typeof table.types.instance;
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
          column.setColumnFilterValue((old) => [
            e.target.value ? Number(e.target.value) : undefined,
            old?.[1],
          ])
        }
        placeholder={`Min (${column.getPreFilteredMinMaxValues()[0]})`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        min={Number(column.getPreFilteredMinMaxValues()[0])}
        max={Number(column.getPreFilteredMinMaxValues()[1])}
        value={(column.getColumnFilterValue()?.[1] ?? null) as string}
        onChange={(e) =>
          column.setColumnFilterValue((old) => [
            old?.[0],
            e.target.value ? Number(e.target.value) : undefined,
          ])
        }
        placeholder={`Max (${column.getPreFilteredMinMaxValues()[1]})`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <>
      <datalist id={column.id}>
        {Array.from(column.getPreFilteredUniqueValues().entries()).map(
          ([value, _count]) => (
            <option key={value} value={value} />
          )
        )}
      </datalist>
      <input
        type="text"
        value={(column.getColumnFilterValue() ?? "") as string}
        onChange={(e) => column.setColumnFilterValue(e.target.value)}
        list={column.id}
        placeholder={`Search... (${column.getPreFilteredUniqueValues().size})`}
        className="w-36 border shadow rounded"
      />
    </>
  );
}

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
  document.getElementById("root")
);
