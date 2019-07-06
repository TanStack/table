import { useMemo, useRef } from "react";
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
    columns: columnsProps,
    hooks: { headers: headerHooks },
    state: [{ resizedColumns }, setState]
  } = props;
  const currentlyResizingInfo = useRef(undefined);

  const getColumnIndexByAccessor = accessor => {
    const foundColumn = columnsProps.find(c => c.id === accessor);
    return foundColumn ? columnsProps.indexOf(foundColumn) : null;
  };

  const applyResizedColumns = useMemo(() => {
    const updatedColumns = [...columns];
    Object.keys(resizedColumns).forEach(
      index => (updatedColumns[index].width = resizedColumns[index])
    );
  
    return updatedColumns;
  }, [resizedColumns]);

  const addResizer = (columns, api) => {
    columns.forEach(column => {
      column.getResizerProps = ({ ...overrides }) => ({
        ...((column.resizable === true || column.resizable === undefined) && {
          onMouseDown: e => onDragStart(e, column),

          ...overrides
        })
      });
    });

    return columns;
  };

  headerHooks.push(addResizer);

  const resizeColumn = e => {
    e.stopPropagation();
    const { clientX: currentPosition } = e;
    const { initialPosition, columns } = currentlyResizingInfo.current;

    const updatedCols = [];

    columns.forEach(col => {
      const { index, initialWidth } = col;
      const {
        width: currentWidth,
        minWidth: minWidthProp,
        maxWidth
      } = columnsProps[index];

      const positionXDelta =
        (currentPosition - initialPosition) / columns.length;

      let updatedWidth =
        initialWidth + positionXDelta > 0 ? initialWidth + positionXDelta : 0;
      const minWidth = minWidthProp || 20;


      if (updatedWidth < minWidth) {
        updatedWidth = minWidth;
      }

      if (maxWidth && updatedWidth > maxWidth) {
        updatedWidth = maxWidth;
      }

      if (currentWidth !== updatedWidth)
        updatedCols.push({ index, updatedWidth });
    });

    if (updatedCols.length > 0) {
      setState(old => {
        let newResizedColumns = { ...old.resizedColumns };

        updatedCols.forEach(
          col => (newResizedColumns[col.index] = col.updatedWidth)
        );

        return {
          ...old,
          resizedColumns: newResizedColumns
        };
      }, actions.resizeColumn);
    }
  };

  const onDragStart = (e, column, index) => {
    e.preventDefault();

    // checks for child columns, if so flatten to get the bottom level columns or push current column
    const columns = column.columns
      ? flattenBy(column.columns, "columns")
      : [column];

    currentlyResizingInfo.current = {
      initialPosition: e.clientX,
      columns: columns
        .filter(col => col.resizable || col.resizable === undefined)
        .map(col => {
          return {
            index: getColumnIndexByAccessor(col.id),
            initialWidth: col.width || 0
          };
        })
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
    ...props,
    columns: applyResizedColumns
  };
};
