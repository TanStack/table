import React from "react";

import ReactTable from "../../../../lib/index";
import "../../../../react-table.css";

import disablePaginationHOC from "./disablePaginationHOC"
import virtualizedTableHOC from "./virtualizedTableHOC"

async function getData() {
  const result = await (await fetch("/au_500_tree.json")).json();
  return result;
}

function getColumns() {
  return [
    {
      accessor: "post",
      Header: "Post"
    },
    {
      accessor: "city",
      Header: "City"
    },
    {
      accessor: "first_name",
      Header: "First Name"
    },
    {
      accessor: "last_name",
      Header: "Last Name"
    }
  ];
}

export class ComponentTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      columns: null,
      pivotBy: null // ["firstName", "lastName"],
    };
  }
  componentDidMount() {
    getData().then(data => {
      // console.log('cwm data:',data);
      const pivotBy = ["post", "city"];
      const columns = getColumns(data, pivotBy);
      // console.log('cwm cols:',columns);
      this.setState({ data, columns, pivotBy });
    });
  }
  render() {
    const { data, columns, pivotBy } = this.state;
    const extraProps = {
      data,
      columns,
      pivotBy
    };
    const VirtualizedTable = virtualizedTableHOC(
      disablePaginationHOC(ReactTable)
    );
    return (
      <div style={{ padding: "10px" }}>
        <h1>react-table - Virtualized Table</h1>
        {data ? (
          <VirtualizedTable
            ref={r => (this.reactTable = r)}
            className="-striped -highlight"
            {...extraProps}
            style={{ height: '400px' }}
          />
        ) : null}
      </div>
    );
  }
}

export default ComponentTest;
