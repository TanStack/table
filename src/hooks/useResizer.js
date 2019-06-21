import { useEffect, useRef } from "react";
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
  )
};

export const useResizer = props => {
  PropTypes.checkPropTypes(propTypes, props, "property", "useResizer");

  const {
    columns,
    hooks: { headers: headerHooks },
    state: [{ resizedColumns }, setState],
    getResizerProps
  } = props;
  const currentlyResizingInfo = useRef(undefined);

  useEffect(() => {
    if (resizedColumns) {
      Object.keys(resizedColumns).forEach(index => (columns[index].width = resizedColumns[index]));
    }
  }, [resizedColumns]);

  const addResizer = (columns, api) => {
    let bottomLevelColumnCount = 0;

    columns.forEach(column => {
      if (!column.columns) {
        const index = bottomLevelColumnCount;

        column.isBottomLevel = true;

        column.resizable = column.resizable !== undefined ? column.resizable : true;

        column.getResizerProps = () => ({
          ...(column.resizable && {
            onMouseDown: e => onDragStart(e, column, index),

            // prop overrides
            ...(getResizerProps && getResizerProps)
          })
        });

        bottomLevelColumnCount++;
      }
    });

    return columns;
  };

  headerHooks.push(addResizer);

  const resizeColumn = e => {
    const { clientX: currentPosition } = e;
    const { index, initialPosition, initialWidth } = currentlyResizingInfo.current;
    const positionXDelta = currentPosition - initialPosition;
    const minWidth = columns[index].minWidth || 10;
    const maxWidth = columns[index].maxWidth || null;

    let updatedWidth = initialWidth + positionXDelta > 0 ? initialWidth + positionXDelta : 0;

    if (updatedWidth < minWidth) {
      updatedWidth = minWidth;
    }

    if (maxWidth && updatedWidth > maxWidth) {
      updatedWidth = maxWidth;
    }

    setState(old => {
      let newResizedColumns = { ...old.resizedColumns };

      newResizedColumns[index] = updatedWidth;

      return {
        ...old,
        resizedColumns: newResizedColumns
      };
    }, actions.resizeColumn);
  };

  const onDragStart = (e, column, index) => {
    e.preventDefault();


    currentlyResizingInfo.current = {
      index,
      initialWidth: column.width || 0,
      initialPosition: e.clientX
    };

    document.addEventListener("mousemove", resizeColumn);
    document.addEventListener("mouseup", onDragEnd);
    document.body.style.cursor = "col-resize";
  };

  const onDragEnd = () => {
    currentlyResizingInfo.current = null;
    document.removeEventListener("mousemove", resizeColumn);
    document.removeEventListener("mouseup", onDragEnd);
    document.body.style.cursor = "";
  };

  return {
    ...props
  };
};
