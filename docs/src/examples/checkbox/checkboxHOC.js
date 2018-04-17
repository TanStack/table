import React from "react";

export default Component => {
  const wrapper = class RTCheckboxTable extends React.Component {
    // we only need a Component so we can get the 'ref' - pure components can't get a 'ref'

    rowSelector = row => {
      if (!row || !row.hasOwnProperty(this.props.keyField)) return null;
      const checked = this.props.isSelected(row[this.props.keyField]);
      return (
        <input
          type="checkbox"
          checked={checked}
          onClick={e => {
            const { shiftKey } = e;
            e.stopPropagation();
            this.props.toggleSelection(row[this.props.keyField], shiftKey, row);
          }}
          onChange={() => {}}
          value=""
        />
      );
    };

    headSelector = row => {
      const checked = this.props.selectAll;
      return (
        <input
          type="checkbox"
          checked={checked}
          onClick={e => {
            e.stopPropagation();
            this.props.toggleAll();
          }}
          onChange={() => {}}
          value=""
        />
      );
    };

    // this is so we can expose the underlying ReactTable to get at the sortedData for selectAll
    getWrappedInstance = () => this.wrappedInstance;

    render() {
      const {
        columns: originalCols,
        isSelected,
        toggleSelection,
        toggleAll,
        keyField,
        selectAll,
        ...rest
      } = this.props;
      const { rowSelector, headSelector } = this;
      const select = {
        id: "_selector",
        accessor: () => "x", // this value is not important
        Header: headSelector,
        Cell: ci => {
          return rowSelector(ci.original);
        },
        width: 30,
        filterable: false,
        sortable: false,
        resizable: false,
        style: { textAlign: "center" }
      };
      const columns = [select, ...originalCols];
      const extra = {
        columns
      };
      return (
        <Component {...rest} {...extra} ref={r => (this.wrappedInstance = r)} />
      );
    }
  };

  wrapper.displayName = "RTCheckboxTable";
  wrapper.defaultProps = {
    keyField: "_id",
    isSelected: key => {
      console.log("No isSelected handler provided:", { key });
    },
    selectAll: false,
    toggleSelection: (key, shift, row) => {
      console.log("No toggleSelection handler provided:", { key, shift, row });
    },
    toggleAll: () => {
      console.log("No toggleAll handler provided.");
    }
  };

  return wrapper;
};
