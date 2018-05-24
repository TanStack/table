import React from "react";

import ReactTable from "../../../lib/index";
import "../../../react-table.css";

const data = [
  { one: "1.1", two: "1.2" },
  { one: "2.1", two: "2.2" },
  { one: "3.1", two: "3.2" },
  { one: "4.1", two: "4.2" }
];

const columns = [
  { accessor: "one", Header: "One" },
  { accessor: "two", Header: "Two" }
];

export default class Story extends React.Component {
  render() {
    return (
      <div>
        Test
        <ReactTable data={data} columns={columns} />
      </div>
    );
  }
}
