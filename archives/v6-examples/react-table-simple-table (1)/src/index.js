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
      data: makeData(),
      key: 0,
      columns: [
        {
          Header: "Name",
          columns: [
            {
              Header: "First Name",
              accessor: "firstName",
              show: true
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
              accessor: "age"
            },
            {
              Header: "Status",
              accessor: "status"
            }
          ]
        },
        {
          Header: "Stats",
          columns: [
            {
              Header: "Visits",
              accessor: "visits"
            }
          ]
        }
      ]
    };
  }

  chnageColumnsAndKey = () => {

    const { columns } = this.state;
    let updatedColumns = columns;

    // this style of update is technically considered a mutation
    updatedColumns[0].columns[0].show = false;

    this.setState(state => {
      // But, by returning a new array instead of utilizing the old one, we can skirt the issue.
      return { columns: [...updatedColumns], key: state.key + 1 };
    });
  };

  changeColumns = () => {
    const { columns } = this.state;
    let updatedColumns = columns;

    // this style of update is technically considered a mutation.
    updatedColumns[0].columns[0].show = false;

    this.setState(state => {
      // But, by returning a new array instead of utilizing the old one, we can skirt the issue.
      return { columns: [...updatedColumns] };
    });
  };

  render() {
    const { data, columns, key } = this.state;
    return (
      <div>
        <button onClick={this.changeColumns}>Hide firstname (broken)</button>
        <button onClick={this.chnageColumnsAndKey}>
          hide firstname (hacky fix)
        </button>
        <ReactTable
          key={key}
          data={data}
          columns={columns}
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
