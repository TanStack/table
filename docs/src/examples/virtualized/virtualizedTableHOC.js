import React from "react";
import { ReactTableDefaults } from "../../../../lib/index";
import { List, AutoSizer } from "react-virtualized";
import _ from "../../../../lib/utils";

const TbodyComponent = props => {
  const { rows, children: makePageRow, ...restProps } = props;
  const rowRenderer = ({ key, index, style }) => {
    const rowInfo = rows[index];

    return (
      <div key={key} style={style}>
        {makePageRow(rowInfo.row, rowInfo.index, rowInfo.path)}
      </div>
    );
  };

  return (
    <ReactTableDefaults.TbodyComponent {...restProps}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={rows.length}
            rowHeight={30}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </ReactTableDefaults.TbodyComponent>
  );
};

export default Component => {
  return class RTVirtualizedTable extends React.Component {
    getTbodyProps = state => {
      const { expanded, pageRows } = state;
      const flattenPageRows = (rows, path = []) =>
        rows
          .map((row, i) => {
            const subRows = row._subRows ? row._subRows : [];
            const nestingPath = [...path, i];
            const isExpanded = _.get(expanded, nestingPath);
            const nestedRows = isExpanded
              ? flattenPageRows(subRows, [...path, i])
              : [];
            return [
              {
                row,
                index: i,
                path
              },
              ...nestedRows
            ];
          })
          .reduce((result, chunk) => result.concat(chunk), []);

      return {
        rows: flattenPageRows(pageRows)
      };
    };

    render() {
      return (
        <Component
          getTbodyProps={this.getTbodyProps}
          TbodyComponent={TbodyComponent}
          // Low level customization prop
          functionalRowRendering={true}
          {...this.props}
        />
      );
    }
  };
};
