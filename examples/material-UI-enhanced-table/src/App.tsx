import React from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "./components/EnhancedTable";
import makeData from "./makeData";

const App = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName"
      },
      {
        Header: "Last Name",
        accessor: "lastName"
      },
      {
        Header: "Age",
        accessor: "age"
      },
      {
        Header: "Visits",
        accessor: "visits"
      },
      {
        Header: "Status",
        accessor: "status"
      },
      {
        Header: "Profile Progress",
        accessor: "progress"
      }
    ],
    []
  );

  const [data] = React.useState(React.useMemo(() => makeData(20), []));
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  const fetchData = React.useCallback(({ sortBy, globalFilter, filters }) => {
    setSkipPageReset(true);
    console.log(filters, "===");
    //fake data for now, call reducer action here..
    setTimeout(() => {
      // setData(makeData(20));
      setSkipPageReset(false);
    }, 1000);
  }, []);

  return (
    <div>
      <CssBaseline />
      <EnhancedTable
        columns={columns}
        data={data}
        fetchData={fetchData}
        skipPageReset={skipPageReset}
      />
    </div>
  );
};

export default App;
