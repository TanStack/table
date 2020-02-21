import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";
import _ from "lodash";

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
                  Footer: (
                    <span>
                      <strong>Popular:</strong>{" "}
                      {
                        _.first(
                          _.reduce(
                            _.map(_.groupBy(data, d => d.firstName)),
                            (a, b) => (a.length > b.length ? a : b)
                          )
                        ).firstName
                      }
                    </span>
                  )
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: d => d.lastName,
                  Footer: (
                    <span>
                      <strong>Longest:</strong>{" "}
                      {_.reduce(
                        _.map(
                          _.groupBy(data, d => d.lastName),
                          (d, key) => key
                        ),
                        (a, b) => (a.length > b.length ? a : b)
                      )}
                    </span>
                  )
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age",
                  Footer: (
                    <span>
                      <strong>Average:</strong>{" "}
                      {_.round(_.mean(_.map(data, d => d.age)))}
                    </span>
                  )
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
