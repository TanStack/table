import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";

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
                  Header: "First Name (Sorted by Length, A-Z)",
                  accessor: "firstName",
                  sortMethod: (a, b) => {
                    if (a.length === b.length) {
                      return a > b ? 1 : -1;
                    }
                    return a.length > b.length ? 1 : -1;
                  }
                },
                {
                  Header: "Last Name (Sorted in reverse, A-Z)",
                  id: "lastName",
                  accessor: d => d.lastName,
                  sortMethod: (a, b) => {
                    if (a === b) {
                      return 0;
                    }
                    const aReverse = a.split("").reverse().join("");
                    const bReverse = b.split("").reverse().join("");
                    return aReverse > bReverse ? 1 : -1;
                  }
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age"
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
