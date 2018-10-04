import React from 'react';

export default Component => {

  class RTDisabledPaginationTable extends React.Component {
    static defaultProps = {
      onExpandedChange: () => undefined,
    };

    state = {
      rowCount: 0,
    };

    cachedRowCount = 0;

    onExpandedChange = (...args) => {
      this.forceUpdate();
      this.props.onExpandedChange(...args);
    };

    renderContent = (state, makeTable) => {
      this.cachedRowCount = this.getRowCount(state.resolvedData, state.expanded);
      return makeTable();
    };

    getRowCount(resolvedData, expanded) {
      if (!expanded) {
        return 0;
      }

      return resolvedData.length + Object.keys(expanded)
        .filter(index => resolvedData[index]._subRows)
        .map(index => this.getRowCount(resolvedData[index]._subRows, expanded[index]))
        .reduce((sum, count) => sum + count, 0);
    }

    setRowCount(rowCount) {
      if (this.state.rowCount !== rowCount) {
        this.setState({
          rowCount,
        });
      }
    }

    componentDidUpdate() {
      this.setRowCount(this.cachedRowCount);
    }

    componentDidMount() {
      this.setRowCount(this.cachedRowCount);
    }

    render() {
      return (
        <Component
          showPagination={false}
          pageSize={this.state.rowCount}
          minRows={0}

          {...this.props}

          onExpandedChange={this.onExpandedChange}
        >
          {this.renderContent}
        </Component>
      );
    }
  }

  return RTDisabledPaginationTable;
};