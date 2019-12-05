import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";
import JSONTree from 'react-json-tree'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const JSONtheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}

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
        <strong>Functional rendering</strong> simply means that you have access
        to the entire internal state of your table before you render the markup.
        This allows you to use the table state to build even more sophisticated
        UI for your table.
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
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        >
          {(state, makeTable, instance) => {
              return (
                <div>
                  <JSONTree
                    data={Object.assign({}, state, {children: 'function () {...}'})}
                    theme={JSONtheme}
                    invertTheme
                  />
                  {makeTable()}
                </div>
              )
            }}
        </ReactTable>
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
