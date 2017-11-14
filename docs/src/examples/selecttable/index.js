
import React from 'react';
import shortid from 'shortid';

import ReactTable from '../../../../lib/index'
import '../../../../react-table.css'

import selectTableHOC from '../../../../lib/hoc/selectTable'

const SelectTable = selectTableHOC(ReactTable);

async function getData()
{
  const result = await ( await fetch('/au_500_tree.json') ).json();
  // we are adding a unique ID to the data for tracking the selected records
  return result.map((item)=>{
    const _id = shortid.generate();
    return {
      _id,
      ...item,
    }
  });
}

function getColumns(data)
{
  const columns = [];
  const sample = data[0];
  for(let key in sample)
  {
    if(key==='_id') continue;
    columns.push({
      accessor: key,
      Header: key,
    })
  }
  return columns;
}

export class ComponentTest extends React.Component {
  constructor(props) {
    super(props);
    this.state =
    {
      data: null,
      columns: null,
      selection: [],
      selectAll: false,
      selectType: 'radio',
    };
  }
  componentDidMount()
  {
    getData().then((data)=>{
      const columns = getColumns(data);
      this.setState({ data, columns });
    });
  }
  toggleSelection = (key,shift,row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    if (this.state.selectType === 'radio') {
      let selection = [];
      if (selection.indexOf(key)<0) selection.push(key);
      this.setState({selection});
    } else {
      let selection = [
        ...this.state.selection
      ];
      const keyIndex = selection.indexOf(key);
      // check to see if the key exists
      if(keyIndex>=0) {
        // it does exist so we will remove it using destructing
        selection = [
          ...selection.slice(0,keyIndex),
          ...selection.slice(keyIndex+1)
        ]
      } else {
        // it does not exist so add it
        selection.push(key);
      }
      // update the state
      this.setState({selection});
    }
  }
  toggleAll = () => {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?
      
      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).
      
      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).
      
      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'. 
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selectAll = this.state.selectAll?false:true;
    const selection = [];
    if(selectAll)
    {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach((item)=>{
        selection.push(item._original._id);
      })
    }
    this.setState({selectAll,selection})
  }
  isSelected = (key) => {
    /*
      Instead of passing our external selection state we provide an 'isSelected'
      callback and detect the selection state ourselves. This allows any implementation
      for selection (either an array, object keys, or even a Javascript Set object).
    */
    return this.state.selection.includes(key);
  }
  logSelection = () => {
    console.log('selection:',this.state.selection);
  }
  toggleType = () => {
    this.setState({ selectType: this.state.selectType === 'radio' ? 'checkbox' : 'radio', selection: [], selectAll: false, });
  }
  render(){
    const { toggleSelection, toggleAll, isSelected, logSelection, toggleType, } = this;
    const { data, columns, selectAll, selectType } = this.state;
    const extraProps = 
    {
      selectAll,
      isSelected,
      toggleAll,
      toggleSelection,
      selectType,
    }
    return (
      <div style={{ padding: '10px'}}>
        <h1>react-table - Checkbox Table</h1>
        <button onClick={toggleType}>Select Type: <strong>{selectType}</strong></button>
        <button onClick={logSelection}>Log Selection to Console</button>
        {` (${this.state.selection.length}) selected`}
        {
          data?
          <SelectTable
            data={data}
            columns={columns}
            ref={(r)=>this.checkboxTable = r}
            className="-striped -highlight"
            {...extraProps}
          />
          :null
        }
      </div>
    );
  }
}

// export default treeTableHOC(ComponentTest);
export default ComponentTest;
