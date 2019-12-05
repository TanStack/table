import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";
import _ from 'lodash'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

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
          columns={[
            {
              Header: "Name",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName",
                  PivotValue: ({ value }) =>
                    <span style={{ color: "darkred" }}>
                      {value}
                    </span>
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: d => d.lastName,
                  PivotValue: ({ value }) =>
                    <span style={{ color: "darkblue" }}>
                      {value}
                    </span>,
                  Footer: () =>
                    <div style={{ textAlign: "center" }}>
                      <strong>Pivot Column Footer</strong>
                    </div>
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age",
                  aggregate: vals => {
                    return _.round(_.mean(vals));
                  },
                  Aggregated: row =>
                    <span>
                      {row.value} (avg)
                    </span>
                },
                {
                  Header: "Visits",
                  accessor: "visits",
                  aggregate: vals => _.sum(vals),
                  filterable: false
                }
              ]
            },
            {
              pivot: true,
              Header: () =>
                <strong>Overridden Pivot Column Header Group</strong>
            },
            {
              expander: true
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          pivotBy={["firstName", "lastName"]}
          defaultSorted={[
            { id: "firstName", desc: false },
            { id: "lastName", desc: true }
          ]}
          collapseOnSortingChange={false}
          filterable
          ExpanderComponent={({ isExpanded, ...rest }) =>
            isExpanded ? <span> &#10136; </span> : <span> &#10137; </span>}
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
                  columns={[
                    {
                      Header: "Name",
                      columns: [
                        {
                          Header: "First Name",
                          accessor: "firstName"
                        },
                        {
                          Header: "Last Name",
                          id: "lastName"
                        }
                      ]
                    },
                    {
                      Header: "Info",
                      columns: [
                        {
                          Header: "Age",
                          accessor: "age"
                        },
                        {
                          Header: "Visits",
                          accessor: "visits"
                        }
                      ]
                    }
                  ]}
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
