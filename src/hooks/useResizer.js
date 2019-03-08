import React from "react";
import PropTypes from "prop-types";

import { addActions, actions } from "../actions";
import { defaultState } from "./useTableState";

defaultState.resizedColumns = {};

addActions({
  resizeColumn: "__resizeColumn__"
});

const propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.number
    })
  ),
  onResizedChange: PropTypes.func
};

export const useResizer = props => {
  PropTypes.checkPropTypes(propTypes, props, "property", "useResizer");

  const {
    columns,
    hooks: { headers: headerHooks },
    state: [{ resizedColumns }, setState],
    onResizedChange
  } = props;

  const resizeColumn = (e, intialPosition, initialWidth, columnIndex) => {
    const { clientX: currentPosition } = e;
    const positionXDelta = currentPosition - intialPosition;
    let updatedWidth = initialWidth + positionXDelta > 0 ? initialWidth + positionXDelta : 0;

    if (columns[columnIndex].minWidth && updatedWidth < columns[columnIndex].minWidth) {
      updatedWidth = columns[columnIndex].minWidth;
    }

    if (columns[columnIndex].maxWidth && updatedWidth > columns[columnIndex].maxWidth) {
      updatedWidth = columns[columnIndex].maxWidth;
    }

    if (updatedWidth !== initialWidth) {
      setState(old => {
        let { resizedColumns } = old;

        resizedColumns[columnIndex] = updatedWidth;
        columns[columnIndex].width = updatedWidth;

        if (onResizedChange) {
          onResizedChange(resizedColumns, e);
        }

        return {
          ...old,
          resizedColumns
        };
      }, actions.resizeColumn);
    }
  };

  const getResizer = (columns, api) => {
    let bottomLevelColumnCount = 0;

    columns.forEach(column => {
      // if column is not a group (bottom level), add a resizer
      if (!column.columns) {
        const index = bottomLevelColumnCount;

        column.resizer = () => (
          <span
            style={{
              width: "15px",
              height: "100%",
              display: "block",
              position: "absolute",
              top: "0px",
              right: "-5px",
              cursor: "col-resize"
            }}
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();

              const initialWidth = column.width || 0;
              const initialPosition = e.clientX;

              // necessary for persisting the handler instance
              const resizeColumnHandler = e => resizeColumn(e, initialPosition, initialWidth, index);

              const onMouseUp = () => {
                window.removeEventListener("mousemove", resizeColumnHandler);

                // once completed, unsubscribe self
                window.removeEventListener("mouseup", onMouseUp);
              };

              window.addEventListener("mousemove", resizeColumnHandler);
              window.addEventListener("mouseup", onMouseUp);
            }}
          />
        );

        bottomLevelColumnCount++;
      }
    });

    return columns;
  };

  headerHooks.push(getResizer);

  return {
    ...props
  };
};
