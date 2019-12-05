import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";
import _ from "lodash";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const columns = [
  {
    Header: "Name",
    columns: [
      {
        Header: "First Name",
        accessor: "firstName"
      },
      {
        Header: "Last Name",
        id: "lastName",
        accessor: d => d.lastName
      }
    ]
  },
  {
    Header: "Info",
    columns: [
      {
        Header: "Age",
        accessor: "age",
        aggregate: vals => _.round(_.mean(vals)),
        Aggregated: row => {
          return (
            <span>
              {row.value} (avg)
            </span>
          );
        },
        filterMethod: (filter, row) =>
          filter.value === `${row[filter.id]} (avg)`
      },
      {
        Header: "Visits",
        accessor: "visits",
        aggregate: vals => _.sum(vals),
        filterable: false
      }
    ]
  }
];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData()
    };
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          pivotBy={["firstName", "lastName"]}
          filterable
          SubComponent={row => {
            return (
              <div style={{ padding: "20px" }}>
                <em>
                  You can put any component you want here, even another React
                  Table!
                </em>
                <br />
                <br />
                <ReactTable
                  data={data}
                  columns={columns}
                  defaultPageSize={3}
                  showPagination={false}
                  SubComponent={row => {
                    return (
                      <div style={{ padding: "20px" }}>Sub Component!</div>
                    );
                  }}
                />
              </div>
            );
          }}
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
