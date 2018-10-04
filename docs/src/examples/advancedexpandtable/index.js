import React from 'react';
import { render } from 'react-dom';
import { makeData, Logo, Tips } from './Utils';
import { advancedExpandTableHOC } from '../../../../lib/hoc/advancedExpandTable';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const columns = [
  {
    Header: 'First Name',
    accessor: 'firstName',
    Cell: props => {
      const {
        // react table props
        columnProps: { rest: { showRowSubComponent } },
        nestingPath
      } = props;
      return (
        <div>
          <button
            onClick={e => showRowSubComponent({ nestingPath: nestingPath }, e)}
          >
            SHOW SUBCOMPONENT {props.value}
          </button>
        </div>
      );
    }
  },
  {
    Header: 'Last Name',
    id: 'lastName',
    accessor: d => d.lastName
  },
  {
    Header: 'Info',
    columns: [
      {
        Header: 'Age',
        accessor: 'age',
        Cell: props => {
          const {
            // react table props
            columnProps: { rest: { toggleRowSubComponent } },
            nestingPath
          } = props;
          return (
            <div>
              <button
                onClick={e =>
                  toggleRowSubComponent({ nestingPath: nestingPath }, e)
                }
              >
                TOGGLE SUBCOMPONENT {props.value}
              </button>
            </div>
          );
        }
      },
      {
        Header: 'Status',
        accessor: 'status'
      }
    ]
  },
  {
    Header: 'Stats',
    columns: [
      {
        Header: 'Visits',
        accessor: 'visits'
      }
    ]
  }
];

const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: makeData()
    };
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        <AdvancedExpandReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          className='-striped -highlight'
          SubComponent={({ row, nestingPath, toggleRowSubComponent }) => {
            return (
              <div style={{ padding: '20px' }}>
                <button
                  onClick={e => toggleRowSubComponent({ nestingPath }, e)}
                >
                  CLOSE SUBCOMPONENT {row.firstName} {row.lastName}
                </button>
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

render(<App />, document.getElementById('root'));