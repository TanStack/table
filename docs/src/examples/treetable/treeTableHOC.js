import React from "react";

export default Component => {
  const wrapper = componentProps => {
    const TrComponent = props => {
      const { ri, ...rest } = props;
      if (ri && ri.groupedByPivot) {
        const cell = props.children[ri.level];

        cell.props.style.flex = "unset";
        cell.props.style.width = "100%";
        cell.props.style.maxWidth = "unset";
        cell.props.style.paddingLeft = `${componentProps.treeTableIndent *
          ri.level}px`;
        cell.props.style.backgroundColor = "#DDD";
        cell.props.style.borderBottom = "1px solid rgba(128,128,128,0.2)";

        return <div {...rest}>{cell}</div>;
      }
      return <Component.defaultProps.TrComponent {...rest} />;
    };

    const getTrProps = (state, ri, ci, instance) => {
      return { ri };
    };

    const { columns, ...rest } = componentProps;
    const extra = {
      columns: columns.map(col => {
        let column = col;
        if (rest.pivotBy && rest.pivotBy.includes(col.accessor)) {
          column = {
            accessor: col.accessor,
            width: `${componentProps.treeTableIndent}px`,
            show: false,
            Header: ""
          };
        }
        return column;
      }),
      TrComponent,
      getTrProps
    };

    return <Component {...rest} {...extra} />;
  };
  wrapper.displayName = "RTTreeTable";
  wrapper.defaultProps = {
    treeTableRowBackground: "#EEE",
    treeTableIndent: 10
  };
  return wrapper;
};
