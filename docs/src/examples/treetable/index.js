import React from "react";

import ReactTable from "../../../../lib/index";
import "../../../../react-table.css";

import treeTableHOC from "../../../../lib/hoc/treeTable";

async function getData() {
  const result = await (await fetch("/au_500_tree.json")).json();
  return result;
}

function getColumns(data, pivotBy) {
  const columns = [];
  const sample = data[0];
  for (let key in sample) {
    columns.push({
      accessor: key,
      Header: key
    });
  }
  return columns;
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
      const pivotBy = ["state", "post", "city"];
      const columns = getColumns(data, pivotBy);
      // console.log('cwm cols:',columns);
      this.setState({ data, columns, pivotBy });
    });
  }
  showState = () => {
    console.log("state:", this.reactTable.getResolvedState());
  };
  render() {
    const { data, columns, pivotBy } = this.state;
    const extraProps = {
      data,
      columns,
      pivotBy
    };
    const TreeTable = treeTableHOC(ReactTable);
    return (
      <div style={{ padding: "10px" }}>
        <h1>react-table - Tree Table</h1>
        {data ? (
          <TreeTable
            ref={r => (this.reactTable = r)}
            className="-striped -highlight"
            defaultPageSize={5}
            {...extraProps}
          />
        ) : null}
      </div>
    );
  }
}

export default ComponentTest;
