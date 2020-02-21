import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const data = makeData()

const makeDefaultState = () => ({
  sorted: [],
  page: 0,
  pageSize: 10,
  expanded: {},
  resized: [],
  filtered: []
});

class App extends React.Component {
  constructor() {
    super();
    this.state = makeDefaultState();
    this.resetState = this.resetState.bind(this);
  }
  resetState() {
    this.setState(makeDefaultState());
  }
  render() {
    return (
      <div>
        <div>
          <button onClick={this.resetState}>Reset State</button>
        </div>
        <pre>
          <code>
            <strong>this.state ===</strong>{" "}
            {JSON.stringify(this.state, null, 2)}
          </code>
        </pre>
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
                  id: "lastName",
                  accessor: d => d.lastName,
                  width: 170
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
          pivotBy={["lastName"]}
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
          // Controlled props
          sorted={this.state.sorted}
          page={this.state.page}
          pageSize={this.state.pageSize}
          expanded={this.state.expanded}
          resized={this.state.resized}
          filtered={this.state.filtered}
          // Callbacks
          onSortedChange={sorted => this.setState({ sorted })}
          onPageChange={page => this.setState({ page })}
          onPageSizeChange={(pageSize, page) =>
            this.setState({ page, pageSize })}
          onExpandedChange={expanded => this.setState({ expanded })}
          onResizedChange={resized => this.setState({ resized })}
          onFilteredChange={filtered => this.setState({ filtered })}
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
